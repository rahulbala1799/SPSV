import { PrismaClient } from '@prisma/client'

/**
 * Synchronize questions from the Question model to QuestionBank for timed tests
 * This is a lightweight version for use in seed scripts
 * 
 * @param prisma - PrismaClient instance
 * @param chapterIds - Optional array of chapter IDs to sync
 */
export async function syncToQuestionBank(prisma: PrismaClient, chapterIds?: string[]) {
  console.log('\n🔄 Syncing to QuestionBank for timed tests...')
  
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
      console.log(`🎯 Syncing ${chapterIds.length} specific chapter(s)...`)
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
      }
    })

    console.log(`📚 Found ${questions.length} questions to sync`)

    let created = 0
    let updated = 0
    let skipped = 0

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
          skipped++
          continue
        }

        // Parse options from JSON
        const options = question.options as Array<{ id: string; text: string }>
        
        if (!Array.isArray(options) || options.length < 4) {
          skipped++
          continue
        }

        // Extract options
        const optionA = options.find(opt => opt.id === 'A')?.text || options[0]?.text || ''
        const optionB = options.find(opt => opt.id === 'B')?.text || options[1]?.text || ''
        const optionC = options.find(opt => opt.id === 'C')?.text || options[2]?.text || ''
        const optionD = options.find(opt => opt.id === 'D')?.text || options[3]?.text || ''

        // Check if question already exists in QuestionBank
        const existing = await prisma.questionBank.findFirst({
          where: {
            questionText: question.questionText,
            category: timedCategory
          }
        })

        if (existing) {
          // Update if content has changed OR if sourceQuestionId is missing (needed for MCQ builder)
          const hasChanges = 
            existing.optionA !== optionA ||
            existing.optionB !== optionB ||
            existing.optionC !== optionC ||
            existing.optionD !== optionD ||
            existing.correctAnswer !== question.correctAnswer ||
            existing.explanation !== question.explanation ||
            existing.sourceQuestionId !== question.id

          if (hasChanges) {
            await prisma.questionBank.update({
              where: { id: existing.id },
              data: {
                sourceQuestionId: question.id,
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
          // Create new QuestionBank entry with sourceQuestionId
          await prisma.questionBank.create({
            data: {
              sourceQuestionId: question.id,
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
      }
    }

    console.log(`✅ QuestionBank sync complete!`)
    console.log(`   ➕ Created: ${created}`)
    console.log(`   🔄 Updated: ${updated}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)

    return { created, updated, skipped }
  } catch (error) {
    console.error('❌ Error during QuestionBank sync:', error)
    throw error
  }
}
