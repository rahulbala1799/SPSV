#!/usr/bin/env tsx
/**
 * Sync Question Bank with latest questions from chapters
 * 
 * This script synchronizes all questions from active chapters to the QuestionBank
 * for use in timed tests. It will:
 * - Update existing questions if content has changed
 * - Create new questions that don't exist yet
 * - Skip questions that haven't changed
 * 
 * Usage:
 *   DATABASE_URL="your_db_url" npx tsx scripts/sync-question-bank.ts
 *   DATABASE_URL="your_db_url" npx tsx scripts/sync-question-bank.ts --cleanup
 * 
 * Or set DATABASE_URL in .env file
 * 
 * ⚠️  SECURITY:
 * - This script reads DATABASE_URL from environment variables only
 * - Never hardcode credentials in this file
 * - The .env file is gitignored and will NOT be committed
 * - This script file is safe to commit (no credentials stored)
 */

// Load environment variables from .env file if it exists
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env') })

// Use unpooled connection for scripts (better for migrations/syncs)
// If DATABASE_URL_UNPOOLED is set, use it; otherwise use DATABASE_URL
if (process.env.DATABASE_URL_UNPOOLED) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED
}

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set')
  console.error('Please set it in your .env file or export it before running this script')
  console.error('Example: DATABASE_URL="postgresql://user:pass@host/db" npx tsx scripts/sync-question-bank.ts')
  console.error('\n⚠️  Security Note: Never commit .env files to git!')
  process.exit(1)
}

// Security: Never log the actual DATABASE_URL to prevent credential exposure
const dbUrlSet = !!process.env.DATABASE_URL
if (dbUrlSet) {
  const urlParts = process.env.DATABASE_URL.split('@')
  const safeUrl = urlParts.length > 1 
    ? `postgresql://***@${urlParts[urlParts.length - 1].split('/')[0]}/***` 
    : '***'
  console.log(`🔐 Using database connection: ${safeUrl}`)
}

import { PrismaClient } from '@prisma/client'

// Create a new Prisma client for this script with direct connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Import sync functions and modify to use our prisma client
async function syncQuestionsToQuestionBank(chapterIds?: string[]) {
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
    console.log()

    let created = 0
    let updated = 0
    let skipped = 0
    let errors = 0
    const updatedQuestions: Array<{ question: string; chapter: string; changes: string[] }> = []

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
            // Track what changed
            const changes: string[] = []
            if (existing.optionA !== optionA) changes.push('Option A')
            if (existing.optionB !== optionB) changes.push('Option B')
            if (existing.optionC !== optionC) changes.push('Option C')
            if (existing.optionD !== optionD) changes.push('Option D')
            if (existing.correctAnswer !== question.correctAnswer) changes.push('Correct Answer')
            if (existing.explanation !== question.explanation) changes.push('Explanation')

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
            updatedQuestions.push({
              question: question.questionText,
              chapter: question.chapter.title,
              changes
            })
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

    return {
      success: true,
      created,
      updated,
      skipped,
      errors,
      duration,
      updatedQuestions,
      totals: {
        industry: industryCount,
        areaKnowledge: areaCount,
        total: industryCount + areaCount
      }
    }
  } catch (error) {
    console.error('❌ Error during QuestionBank sync:', error)
    throw error
  }
}

async function cleanupQuestionBank() {
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

async function main() {
  console.log('🔄 Question Bank Sync Script')
  console.log('='.repeat(50))
  console.log()

  try {
    // Check if cleanup flag is set
    const cleanup = process.argv.includes('--cleanup')

    // Perform sync
    console.log('📚 Syncing questions from chapters to QuestionBank...\n')
    const syncResult = await syncQuestionsToQuestionBank()

    console.log()
    console.log('='.repeat(50))
    console.log('✅ Sync Complete!')
    console.log('='.repeat(50))
    console.log(`   ➕ Created: ${syncResult.created} new questions`)
    console.log(`   🔄 Updated: ${syncResult.updated} existing questions`)
    console.log(`   ⏭️  Skipped: ${syncResult.skipped} unchanged questions`)
    console.log(`   ❌ Errors: ${syncResult.errors}`)
    console.log(`   ⏱️  Duration: ${syncResult.duration}ms`)
    
    // Show details of updated questions
    if (syncResult.updatedQuestions && syncResult.updatedQuestions.length > 0) {
      console.log(`\n📝 Updated Questions (${syncResult.updatedQuestions.length}):`)
      console.log('='.repeat(80))
      syncResult.updatedQuestions.forEach((uq, index) => {
        console.log(`\n${index + 1}. Chapter: ${uq.chapter}`)
        const questionPreview = uq.question.length > 100 
          ? uq.question.substring(0, 100) + '...' 
          : uq.question
        console.log(`   Question: ${questionPreview}`)
        console.log(`   Changes: ${uq.changes.join(', ')}`)
      })
      console.log('='.repeat(80))
    }
    
    console.log()
    console.log('📊 QuestionBank Totals:')
    console.log(`   Industry: ${syncResult.totals.industry}`)
    console.log(`   Area Knowledge: ${syncResult.totals.areaKnowledge}`)
    console.log(`   Total: ${syncResult.totals.total}`)
    console.log()

    // Optional cleanup
    if (cleanup) {
      console.log('🧹 Running cleanup to deactivate orphaned questions...\n')
      const cleanupResult = await cleanupQuestionBank()
      console.log(`✅ Cleanup complete! Deactivated ${cleanupResult.deactivated} questions`)
      console.log()
    }

    console.log('='.repeat(50))
    console.log('✨ All done!')
    console.log('='.repeat(50))
  } catch (error) {
    console.error('❌ Error during sync:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
