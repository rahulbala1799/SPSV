import { prisma } from '@/lib/prisma'

/**
 * Synchronize questions from the Question model to QuestionBank for timed tests
 * This utility ensures that all questions from active chapters are available in the QuestionBank
 * 
 * @param chapterIds - Optional array of chapter IDs to sync. If not provided, syncs all active chapters
 * @returns Object containing sync statistics
 */
export async function syncQuestionsToQuestionBank(chapterIds?: string[]) {
  const startTime = Date.now()
  
  console.log('🔄 Starting QuestionBank synchronization...')
  
  try {
    // Build query for questions
    const whereClause: any = {
      chapter: {
        isActive: true
      }
    }
    
    // If specific chapter IDs provided, filter by them
    if (chapterIds && chapterIds.length > 0) {
      whereClause.chapterId = { in: chapterIds }
    }
    
    // Get all questions from active chapters
    const questions = await prisma.question.findMany({
      where: whereClause,
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            category: true,
            isActive: true
          }
        }
      },
      orderBy: [
        { chapter: { chapterNumber: 'asc' } },
        { questionNumber: 'asc' }
      ]
    })

    console.log(`📚 Found ${questions.length} questions to sync`)

    let created = 0
    let updated = 0
    let skipped = 0
    let errors = 0

    for (const question of questions) {
      try {
        // Skip if chapter is not active
        if (!question.chapter.isActive) {
          skipped++
          continue
        }

        // Determine category mapping
        let timedCategory: 'INDUSTRY' | 'AREA_KNOWLEDGE' | null = null
        
        if (question.category === 'INDUSTRY_KNOWLEDGE') {
          timedCategory = 'INDUSTRY'
        } else if (question.category === 'AREA_KNOWLEDGE') {
          timedCategory = 'AREA_KNOWLEDGE'
        } else if (question.chapter.category === 'INDUSTRY_KNOWLEDGE') {
          timedCategory = 'INDUSTRY'
        } else if (question.chapter.category === 'AREA_KNOWLEDGE') {
          timedCategory = 'AREA_KNOWLEDGE'
        }

        if (!timedCategory) {
          console.log(`⚠️  Skipping question: No category found (Chapter: ${question.chapter.title})`)
          skipped++
          continue
        }

        // Parse options from JSON
        const options = question.options as Array<{ id: string; text: string }>
        
        if (!Array.isArray(options) || options.length < 4) {
          console.log(`⚠️  Skipping question: Invalid options format`)
          skipped++
          continue
        }

        // Extract options
        const optionA = options.find(opt => opt.id === 'A')?.text || options[0]?.text || ''
        const optionB = options.find(opt => opt.id === 'B')?.text || options[1]?.text || ''
        const optionC = options.find(opt => opt.id === 'C')?.text || options[2]?.text || ''
        const optionD = options.find(opt => opt.id === 'D')?.text || options[3]?.text || ''

        // Check if question already exists in QuestionBank (by question text and category)
        const existing = await prisma.questionBank.findFirst({
          where: {
            questionText: question.questionText,
            category: timedCategory
          }
        })

        if (existing) {
          // Update existing question if content has changed
          const hasChanges = 
            existing.optionA !== optionA ||
            existing.optionB !== optionB ||
            existing.optionC !== optionC ||
            existing.optionD !== optionD ||
            existing.correctAnswer !== question.correctAnswer ||
            existing.explanation !== question.explanation

          if (hasChanges) {
            await prisma.questionBank.update({
              where: { id: existing.id },
              data: {
                optionA,
                optionB,
                optionC,
                optionD,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation || null,
                updatedAt: new Date()
              }
            })
            updated++
          } else {
            skipped++
          }
        } else {
          // Create new QuestionBank entry
          await prisma.questionBank.create({
            data: {
              questionText: question.questionText,
              optionA,
              optionB,
              optionC,
              optionD,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation || null,
              category: timedCategory,
              isActive: true,
              timesUsed: 0,
              timesCorrect: 0
            }
          })
          created++
        }
      } catch (error) {
        console.error(`❌ Error syncing question:`, error)
        errors++
      }
    }

    const duration = Date.now() - startTime

    // Get final counts
    const [industryCount, areaCount] = await Promise.all([
      prisma.questionBank.count({
        where: { category: 'INDUSTRY', isActive: true }
      }),
      prisma.questionBank.count({
        where: { category: 'AREA_KNOWLEDGE', isActive: true }
      })
    ])

    const result = {
      success: true,
      created,
      updated,
      skipped,
      errors,
      duration,
      totals: {
        industry: industryCount,
        areaKnowledge: areaCount,
        total: industryCount + areaCount
      }
    }

    console.log('\n✅ QuestionBank Sync Complete!')
    console.log(`   ➕ Created: ${created}`)
    console.log(`   🔄 Updated: ${updated}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)
    console.log(`   ❌ Errors: ${errors}`)
    console.log(`   ⏱️  Duration: ${duration}ms`)
    console.log(`\n📊 QuestionBank Totals:`)
    console.log(`   Industry: ${industryCount}`)
    console.log(`   Area Knowledge: ${areaCount}`)
    console.log(`   Total: ${industryCount + areaCount}`)

    return result
  } catch (error) {
    console.error('❌ Error during QuestionBank sync:', error)
    throw error
  }
}

/**
 * Sync specific chapters to QuestionBank
 * Useful when adding new chapters or updating existing ones
 */
export async function syncChaptersToQuestionBank(chapterIds: string[]) {
  if (!chapterIds || chapterIds.length === 0) {
    throw new Error('At least one chapter ID is required')
  }
  
  console.log(`🎯 Syncing ${chapterIds.length} specific chapter(s)...`)
  return syncQuestionsToQuestionBank(chapterIds)
}

/**
 * Remove questions from QuestionBank that no longer exist in the Question table
 * or are from inactive chapters
 */
export async function cleanupQuestionBank() {
  console.log('🧹 Starting QuestionBank cleanup...')
  
  try {
    // Get all active question texts from Question model
    const activeQuestions = await prisma.question.findMany({
      where: {
        chapter: {
          isActive: true
        }
      },
      select: {
        questionText: true,
        category: true
      }
    })

    const activeQuestionTexts = new Set(
      activeQuestions.map(q => `${q.questionText}|${q.category}`)
    )

    // Get all QuestionBank entries
    const bankQuestions = await prisma.questionBank.findMany({
      select: {
        id: true,
        questionText: true,
        category: true
      }
    })

    let deactivated = 0

    for (const bankQuestion of bankQuestions) {
      // Map category back
      const category = bankQuestion.category === 'INDUSTRY' ? 'INDUSTRY_KNOWLEDGE' : 'AREA_KNOWLEDGE'
      const key = `${bankQuestion.questionText}|${category}`

      if (!activeQuestionTexts.has(key)) {
        // Question no longer exists or chapter is inactive - deactivate it
        await prisma.questionBank.update({
          where: { id: bankQuestion.id },
          data: { isActive: false }
        })
        deactivated++
      }
    }

    console.log(`✅ Cleanup complete! Deactivated ${deactivated} questions`)
    return { deactivated }
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  }
}
