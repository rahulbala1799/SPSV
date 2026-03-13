/**
 * Backfill sourceQuestionId for QuestionBank rows that are missing it.
 *
 * Required for: Hard questions from timed tests → MCQ builder flow.
 * Timed test answers use TimedTestQuestion IDs; we need to resolve to main
 * Question IDs via QuestionBank.sourceQuestionId.
 *
 * Run: npx tsx scripts/backfill-question-bank-source-question-id.ts
 */

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config()

const prisma = new PrismaClient()

function toQuestionCategory(qbCategory: string): string {
  if (qbCategory === 'INDUSTRY') return 'INDUSTRY_KNOWLEDGE'
  if (qbCategory === 'AREA_KNOWLEDGE') return 'AREA_KNOWLEDGE'
  return qbCategory
}

async function main() {
  console.log('🔄 Backfilling sourceQuestionId for QuestionBank...\n')

  const missing = await prisma.questionBank.findMany({
    where: { sourceQuestionId: null },
    orderBy: { id: 'asc' }
  })

  console.log(`Found ${missing.length} QuestionBank rows missing sourceQuestionId\n`)

  if (missing.length === 0) {
    console.log('✅ Nothing to do.')
    return
  }

  let updated = 0
  let notFound = 0
  let ambiguous = 0

  for (const qb of missing) {
    const questionCategory = toQuestionCategory(qb.category)

    const matches = await prisma.question.findMany({
      where: {
        questionText: qb.questionText,
        OR: [
          { category: questionCategory },
          { chapter: { category: questionCategory } }
        ]
      },
      select: { id: true }
    })

    if (matches.length === 0) {
      notFound++
      continue
    }

    if (matches.length > 1) {
      ambiguous++
      continue
    }

    await prisma.questionBank.update({
      where: { id: qb.id },
      data: { sourceQuestionId: matches[0].id }
    })
    updated++

    if (updated % 50 === 0) {
      console.log(`   Updated ${updated}...`)
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Updated: ${updated}`)
  console.log(`   ⚠️  No matching Question: ${notFound}`)
  console.log(`   ⚠️  Ambiguous (multiple matches): ${ambiguous}`)
  console.log('\n✨ Done.')
}

main()
  .finally(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
