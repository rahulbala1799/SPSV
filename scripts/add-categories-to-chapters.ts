import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * This script updates existing chapters with category tags
 * Run with: npx tsx scripts/add-categories-to-chapters.ts
 */

async function main() {
  console.log('🚀 Starting chapter category update...\n')

  try {
    // Get all chapters
    const chapters = await prisma.chapter.findMany({
      orderBy: {
        chapterNumber: 'asc',
      },
      include: {
        questions: {
          take: 1, // Just to check if chapter has questions
        },
      },
    })

    console.log(`Found ${chapters.length} chapters\n`)

    // Define chapter categorization based on chapter titles and numbers
    // Industry Knowledge chapters
    const industryKnowledgeTitles = [
      'Industry Knowledge',
      'Working as an SPSV Operator',
      'Taximeter Fares',
      'Delivering Customer Satisfaction',
    ]
    const industryKnowledgeNumbers = [5, 7, 8] // Chapters 5, 7, 8 are industry knowledge
    
    // Area Knowledge chapters
    const areaKnowledgeTitles = ['Southside Full']

    let updatedCount = 0
    let skippedCount = 0

    for (const chapter of chapters) {
      let category: 'INDUSTRY_KNOWLEDGE' | 'AREA_KNOWLEDGE' | null = null

      // Determine category based on title first (more reliable)
      const titleLower = chapter.title.toLowerCase()
      if (industryKnowledgeTitles.some((title) => titleLower.includes(title.toLowerCase()))) {
        category = 'INDUSTRY_KNOWLEDGE'
      } else if (areaKnowledgeTitles.some((title) => titleLower.includes(title.toLowerCase()))) {
        category = 'AREA_KNOWLEDGE'
      }
      // Fallback to chapter number if title doesn't match
      else if (industryKnowledgeNumbers.includes(chapter.chapterNumber)) {
        category = 'INDUSTRY_KNOWLEDGE'
      }

      if (!category) {
        console.log(`⚠️  Skipping Chapter ${chapter.chapterNumber}: "${chapter.title}" (no category mapping)`)
        skippedCount++
        continue
      }

      // Update chapter
      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { category },
      })

      // Update all questions in this chapter
      const updatedQuestions = await prisma.question.updateMany({
        where: { chapterId: chapter.id },
        data: { category },
      })

      console.log(
        `✅ Chapter ${chapter.chapterNumber}: "${chapter.title}" → ${category} (${updatedQuestions.count} questions updated)`
      )
      updatedCount++
    }

    console.log('\n📊 Summary:')
    console.log(`  ✅ Updated: ${updatedCount} chapters`)
    console.log(`  ⚠️  Skipped: ${skippedCount} chapters`)
    console.log('\n✨ Chapter category update completed!')
  } catch (error) {
    console.error('❌ Error updating chapters:', error)
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
