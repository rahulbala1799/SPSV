import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load environment variables
config()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Zcfd14VhMRuX@ep-calm-river-aburmq62-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
    }
  }
})

/**
 * Migrate questions from Question model to QuestionBank for timed tests
 * This script:
 * 1. Reads all questions from the Question model
 * 2. Converts them to QuestionBank format
 * 3. Maps categories: INDUSTRY_KNOWLEDGE -> INDUSTRY, AREA_KNOWLEDGE -> AREA_KNOWLEDGE
 * 4. Converts JSON options to individual optionA-D fields
 * 
 * Run with: npx tsx scripts/migrate-questions-to-question-bank.ts
 */

async function main() {
  console.log('🚀 Starting question migration to QuestionBank...\n')

  try {
    // Get all questions with their chapters
    const questions = await prisma.question.findMany({
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

    console.log(`Found ${questions.length} questions to migrate\n`)

    let migrated = 0
    let skipped = 0
    let errors = 0

    for (const question of questions) {
      try {
        // Skip if chapter is not active
        if (!question.chapter.isActive) {
          console.log(`⏭️  Skipping question from inactive chapter: ${question.chapter.title}`)
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
          console.log(`⚠️  Skipping question ${question.id}: No category found (Chapter: ${question.chapter.title})`)
          skipped++
          continue
        }

        // Parse options from JSON
        const options = question.options as Array<{ id: string; text: string }>
        
        if (!Array.isArray(options) || options.length < 4) {
          console.log(`⚠️  Skipping question ${question.id}: Invalid options format`)
          skipped++
          continue
        }

        // Extract options
        const optionA = options.find(opt => opt.id === 'A')?.text || options[0]?.text || ''
        const optionB = options.find(opt => opt.id === 'B')?.text || options[1]?.text || ''
        const optionC = options.find(opt => opt.id === 'C')?.text || options[2]?.text || ''
        const optionD = options.find(opt => opt.id === 'D')?.text || options[3]?.text || ''

        // Check if question already exists in QuestionBank (by question text)
        const existing = await prisma.questionBank.findFirst({
          where: {
            questionText: question.questionText,
            category: timedCategory
          }
        })

        if (existing) {
          console.log(`⏭️  Question already exists: "${question.questionText.substring(0, 50)}..."`)
          skipped++
          continue
        }

        // Create QuestionBank entry
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

        migrated++
        
        if (migrated % 10 === 0) {
          console.log(`✅ Migrated ${migrated} questions...`)
        }
      } catch (error) {
        console.error(`❌ Error migrating question ${question.id}:`, error)
        errors++
      }
    }

    console.log('\n📊 Migration Summary:')
    console.log(`  ✅ Migrated: ${migrated} questions`)
    console.log(`  ⏭️  Skipped: ${skipped} questions`)
    console.log(`  ❌ Errors: ${errors} questions`)

    // Show category breakdown
    const industryCount = await prisma.questionBank.count({
      where: { category: 'INDUSTRY', isActive: true }
    })
    const areaCount = await prisma.questionBank.count({
      where: { category: 'AREA_KNOWLEDGE', isActive: true }
    })

    console.log('\n📈 QuestionBank Status:')
    console.log(`  Industry: ${industryCount} questions`)
    console.log(`  Area Knowledge: ${areaCount} questions`)
    console.log(`  Total: ${industryCount + areaCount} questions`)

    // Check if we have enough questions for full test
    if (industryCount < 54) {
      console.log(`\n⚠️  Warning: Need at least 54 INDUSTRY questions for full test. Currently have ${industryCount}`)
    }
    if (areaCount < 36) {
      console.log(`\n⚠️  Warning: Need at least 36 AREA_KNOWLEDGE questions for full test. Currently have ${areaCount}`)
    }

    if (industryCount >= 54 && areaCount >= 36) {
      console.log('\n✅ Sufficient questions available for full timed test!')
    }

    console.log('\n✨ Migration completed!')
  } catch (error) {
    console.error('❌ Error during migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
