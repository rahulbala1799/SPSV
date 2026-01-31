import { prisma } from '@/lib/prisma'

/**
 * Fast sync - Only sync specific questions by ID (instant lookup)
 * Use this when editing individual questions
 */
export async function syncSingleQuestion(questionId: string) {
  try {
    // Get the question with chapter info
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            category: true,
            isActive: true,
          },
        },
      },
    })

    if (!question) {
      throw new Error('Question not found')
    }

    // Skip if chapter is not active
    if (!question.chapter.isActive) {
      return { skipped: true, reason: 'Chapter not active' }
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
      return { skipped: true, reason: 'No valid category' }
    }

    // Parse options from JSON
    const options = question.options as Array<{ id: string; text: string }>
    
    if (!Array.isArray(options) || options.length < 4) {
      return { skipped: true, reason: 'Invalid options format' }
    }

    // Extract options
    const optionA = options.find(opt => opt.id === 'A')?.text || options[0]?.text || ''
    const optionB = options.find(opt => opt.id === 'B')?.text || options[1]?.text || ''
    const optionC = options.find(opt => opt.id === 'C')?.text || options[2]?.text || ''
    const optionD = options.find(opt => opt.id === 'D')?.text || options[3]?.text || ''

    // Fast lookup by sourceQuestionId (indexed)
    const existing = await prisma.questionBank.findFirst({
      where: { sourceQuestionId: questionId }
    })

    if (existing) {
      // Update existing question
      await prisma.questionBank.update({
        where: { id: existing.id },
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
          updatedAt: new Date()
        }
      })
      return { updated: true }
    } else {
      // Create new QuestionBank entry with sourceQuestionId
      await prisma.questionBank.create({
        data: {
          sourceQuestionId: questionId,
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
      return { created: true }
    }
  } catch (error) {
    console.error('Error syncing single question:', error)
    throw error
  }
}

/**
 * Fast sync - Sync multiple specific questions by their IDs
 * Use this when editing multiple questions or publishing a chapter
 */
export async function syncMultipleQuestions(questionIds: string[]) {
  const results = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0
  }

  for (const questionId of questionIds) {
    try {
      const result = await syncSingleQuestion(questionId)
      if ('created' in result && result.created) results.created++
      else if ('updated' in result && result.updated) results.updated++
      else if ('skipped' in result && result.skipped) results.skipped++
    } catch (error) {
      console.error(`Error syncing question ${questionId}:`, error)
      results.errors++
    }
  }

  return results
}

/**
 * Deactivate a question in QuestionBank (for deletions)
 */
export async function deactivateQuestionInBank(questionId: string) {
  try {
    await prisma.questionBank.updateMany({
      where: { sourceQuestionId: questionId },
      data: { isActive: false }
    })
    return { success: true }
  } catch (error) {
    console.error('Error deactivating question:', error)
    throw error
  }
}

/**
 * Sync all questions from a specific chapter (for initial sync or chapter publish)
 * Still uses sourceQuestionId for efficient upserts
 */
export async function syncChapterQuestions(chapterId: string | string[]) {
  const startTime = Date.now()
  const chapterIds = Array.isArray(chapterId) ? chapterId : [chapterId]
  
  // Get all questions from the specified chapters
  const questions = await prisma.question.findMany({
    where: {
      chapterId: { in: chapterIds },
      chapter: { isActive: true }
    },
    select: { id: true }
  })

  const questionIds = questions.map(q => q.id)
  const results = await syncMultipleQuestions(questionIds)

  return {
    ...results,
    duration: Date.now() - startTime,
    questionsProcessed: questionIds.length
  }
}

/**
 * Deactivate all questions from a chapter in QuestionBank
 * Use this when a chapter is unpublished or deleted
 */
export async function deactivateChapterQuestions(chapterId: string | string[]) {
  try {
    const chapterIds = Array.isArray(chapterId) ? chapterId : [chapterId]
    
    // Get all questions from the chapter
    const questions = await prisma.question.findMany({
      where: { chapterId: { in: chapterIds } },
      select: { id: true }
    })

    // Deactivate all in QuestionBank
    await prisma.questionBank.updateMany({
      where: {
        sourceQuestionId: { in: questions.map(q => q.id) }
      },
      data: { isActive: false }
    })

    return { success: true, count: questions.length }
  } catch (error) {
    console.error('Error deactivating chapter questions:', error)
    throw error
  }
}
