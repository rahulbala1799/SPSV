import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load environment variables
config()

// Use provided DATABASE_URL or fallback to the production URL
const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Zcfd14VhMRuX@ep-calm-river-aburmq62-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
})

async function main() {
  console.log('🚀 Updating Drumcondra to Fairview question...\n')

  try {
    // Find the Northside Routes chapter
    const chapter = await prisma.chapter.findUnique({
      where: { id: 'chapter_northside_routes' }
    })

    if (!chapter) {
      console.error('❌ Chapter "chapter_northside_routes" not found')
      process.exit(1)
    }

    console.log(`✅ Found chapter: ${chapter.title}\n`)

    // Find the question by chapterId and questionNumber
    const question = await prisma.question.findUnique({
      where: {
        chapterId_questionNumber: {
          chapterId: chapter.id,
          questionNumber: 55
        }
      }
    })

    if (!question) {
      console.error('❌ Question not found (questionNumber: 55)')
      process.exit(1)
    }

    console.log(`✅ Found question: "${question.questionText}"\n`)
    console.log('Current options:')
    const currentOptions = question.options as Array<{ id: string; text: string }>
    currentOptions.forEach(opt => {
      console.log(`   ${opt.id}: ${opt.text} ${opt.id === question.correctAnswer ? '(CORRECT)' : ''}`)
    })
    console.log(`\nCurrent correct answer: ${question.correctAnswer}`)
    console.log(`Current explanation: ${question.explanation}\n`)

    // Update the question
    const updatedOptions = [
      { id: 'A', text: 'Griffith Avenue' },
      { id: 'B', text: 'Richmond Road' },
      { id: 'C', text: 'Drumcondra Road' },
      { id: 'D', text: 'Ballybough Road' }
    ]

    const updatedQuestion = await prisma.question.update({
      where: { id: question.id },
      data: {
        options: updatedOptions,
        correctAnswer: 'B', // Richmond Road
        explanation: 'Richmond Road runs from Drumcondra to Fairview in Dublin.'
      }
    })

    console.log('✅ Question updated successfully!\n')
    console.log('Updated options:')
    updatedOptions.forEach(opt => {
      console.log(`   ${opt.id}: ${opt.text} ${opt.id === updatedQuestion.correctAnswer ? '(CORRECT)' : ''}`)
    })
    console.log(`\nUpdated correct answer: ${updatedQuestion.correctAnswer}`)
    console.log(`Updated explanation: ${updatedQuestion.explanation}\n`)

    // Now sync to QuestionBank
    console.log('🔄 Syncing to QuestionBank...\n')
    
    // Import the sync function
    const { syncToQuestionBank } = await import('../prisma/sync-to-question-bank')
    const syncResult = await syncToQuestionBank(prisma, [chapter.id])

    console.log('\n✅ Sync complete!')
    console.log(`   ➕ Created: ${syncResult.created}`)
    console.log(`   🔄 Updated: ${syncResult.updated}`)
    console.log(`   ⏭️  Skipped: ${syncResult.skipped}\n`)

    console.log('✅ All updates complete!\n')

  } catch (error) {
    console.error('❌ Error updating question:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
