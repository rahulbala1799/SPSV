import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config()

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Zcfd14VhMRuX@ep-calm-river-aburmq62-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
})

async function main() {
  console.log('🔍 Verifying Drumcondra to Fairview question update...\n')

  try {
    // Check Question table
    const question = await prisma.question.findUnique({
      where: {
        chapterId_questionNumber: {
          chapterId: 'chapter_northside_routes',
          questionNumber: 55
        }
      }
    })

    if (question) {
      console.log('✅ Question Table:')
      console.log(`   Question: ${question.questionText}`)
      const options = question.options as Array<{ id: string; text: string }>
      options.forEach(opt => {
        console.log(`   ${opt.id}: ${opt.text} ${opt.id === question.correctAnswer ? '✓ CORRECT' : ''}`)
      })
      console.log(`   Explanation: ${question.explanation}\n`)
    }

    // Check QuestionBank table
    const questionBank = await prisma.questionBank.findFirst({
      where: {
        questionText: 'Which road runs from Drumcondra to Fairview?',
        category: 'AREA_KNOWLEDGE'
      }
    })

    if (questionBank) {
      console.log('✅ QuestionBank Table:')
      console.log(`   Question: ${questionBank.questionText}`)
      console.log(`   Option A: ${questionBank.optionA}`)
      console.log(`   Option B: ${questionBank.optionB} ${questionBank.correctAnswer === 'B' ? '✓ CORRECT' : ''}`)
      console.log(`   Option C: ${questionBank.optionC}`)
      console.log(`   Option D: ${questionBank.optionD}`)
      console.log(`   Correct Answer: ${questionBank.correctAnswer}`)
      console.log(`   Explanation: ${questionBank.explanation}\n`)
    }

    // Verify correctness
    const isCorrect = 
      question?.correctAnswer === 'B' &&
      (question?.options as any)?.find((opt: any) => opt.id === 'B')?.text === 'Richmond Road' &&
      questionBank?.correctAnswer === 'B' &&
      questionBank?.optionB === 'Richmond Road'

    if (isCorrect) {
      console.log('✅ Verification PASSED: Both tables have the correct answer (Richmond Road)')
    } else {
      console.log('❌ Verification FAILED: Mismatch detected')
    }

  } catch (error) {
    console.error('❌ Error verifying:', error)
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
