import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
config()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Zcfd14VhMRuX@ep-calm-river-aburmq62-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
    }
  }
})

// New answers based on updated taxi rules
const answerUpdates = [
  {
    keywords: ['standard booking fee', 'picking up a passenger', 'booking fee'],
    newAnswer: '€3',
    questionNumber: 'Q1',
    exactMatch: true
  },
  {
    keywords: ['National Min wage', 'National Minimum wage', 'minimum wage', 'come into effect', 'National Maximum Taxi Fare', 'come into effect'],
    newAnswer: '01 Dec 2024',
    questionNumber: 'Q2',
    exactMatch: false,
    note: 'May need to check if this question exists or if it refers to National Maximum Taxi Fare'
  },
  {
    keywords: ['Premium Initial Charge', 'premium initial charge'],
    newAnswer: '€5.40',
    questionNumber: 'Q3',
    exactMatch: false,
    note: 'Current options may not include €5.40 - may need to update options first'
  },
  {
    keywords: ['Tariff A', 'tariff A apply', 'how long does Tariff A'],
    newAnswer: '15km or 43 minutes',
    questionNumber: 'Q4',
    exactMatch: false,
    note: 'May need to update option text from "15 km or 45 min" to "15 km or 43 min"'
  },
  {
    keywords: ['standard initial charge', 'Standard initial charge'],
    newAnswer: '€4.40',
    questionNumber: 'Q5',
    exactMatch: false,
    excludeKeywords: ['based on distance', 'based on time', 'distance or time'], // Exclude the distance/time question
    note: 'Current options may not include €4.40 - may need to update options first. Note: There is also a question about "standard initial charge based on distance or time" which is different.'
  }
]

interface QuestionUpdate {
  questionId: string
  questionText: string
  oldAnswer: string
  oldAnswerText: string
  newAnswer: string
  newAnswerText: string
  chapterTitle: string
  chapterNumber: number
  questionNumber: number
  questionUpdateNumber: string
  note?: string
  needsOptionUpdate?: boolean
  optionToUpdate?: string // Option ID to update (A, B, C, or D)
}

async function main() {
  console.log('🚀 Starting taxi rules answer update...\n')

  try {
    // First, fetch all questions from chapter 7 (Industry Think Chapter 7 - Taximeter Fares)
    // Also check other chapters as requested
    const chapter7 = await prisma.chapter.findFirst({
      where: {
        OR: [
          { id: 'chapter_industry_7' },
          { title: { contains: 'Taximeter', mode: 'insensitive' } },
          { title: { contains: 'Chapter 7', mode: 'insensitive' } }
        ]
      }
    })

    if (!chapter7) {
      console.log('⚠️  Chapter 7 not found. Searching all chapters...\n')
    } else {
      console.log(`✅ Found Chapter 7: ${chapter7.title} (ID: ${chapter7.id})\n`)
    }

    // Get all questions from chapter 7 and all INDUSTRY_KNOWLEDGE chapters
    // First, get all INDUSTRY_KNOWLEDGE chapters
    const industryChapters = await prisma.chapter.findMany({
      where: {
        category: 'INDUSTRY_KNOWLEDGE'
      },
      select: {
        id: true,
        title: true,
        chapterNumber: true
      },
      orderBy: {
        chapterNumber: 'asc'
      }
    })

    console.log(`📖 Found ${industryChapters.length} Industry Knowledge chapters:`)
    industryChapters.forEach(ch => {
      console.log(`   - Chapter ${ch.chapterNumber}: ${ch.title}`)
    })
    console.log('')

    // Get all questions from all INDUSTRY_KNOWLEDGE chapters (prioritize chapter 7)
    const allQuestions = await prisma.question.findMany({
      where: {
        chapter: {
          category: 'INDUSTRY_KNOWLEDGE'
        }
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            chapterNumber: true,
            category: true
          }
        }
      },
      orderBy: [
        { chapter: { chapterNumber: 'asc' } },
        { questionNumber: 'asc' }
      ]
    })

    console.log(`📚 Found ${allQuestions.length} questions to check\n`)

    // Store all questions for README
    const allQuestionsForReadme: any[] = []
    const updates: QuestionUpdate[] = []

    // Process each question
    for (const question of allQuestions) {
      const options = question.options as any[]
      const currentCorrectAnswer = question.correctAnswer
      const currentAnswerText = options.find(opt => opt.id === currentCorrectAnswer)?.text || ''

      // Store for README
      allQuestionsForReadme.push({
        id: question.id,
        questionText: question.questionText,
        options: options,
        currentAnswer: currentCorrectAnswer,
        currentAnswerText: currentAnswerText,
        chapterTitle: question.chapter.title,
        chapterNumber: question.chapter.chapterNumber,
        questionNumber: question.questionNumber
      })

      // Check if this question matches any of the updates
      const questionTextLower = question.questionText.toLowerCase()
      
      for (const update of answerUpdates) {
        // Check if question matches keywords
        const matches = update.keywords.some(keyword => 
          questionTextLower.includes(keyword.toLowerCase())
        )
        
        // Check if question should be excluded
        const shouldExclude = (update as any).excludeKeywords?.some((excludeKeyword: string) =>
          questionTextLower.includes(excludeKeyword.toLowerCase())
        )
        
        if (!matches || shouldExclude) {
          continue
        }

        if (matches) {
          // Find the option that contains the new answer
          let newAnswerId: string | null = null
          let newAnswerText: string = ''

          // Create variations of the new answer for matching
          const answerVariations = [
            update.newAnswer.toLowerCase(),
            update.newAnswer.replace(/€/g, '').trim().toLowerCase(),
            update.newAnswer.replace('Dec', 'December').toLowerCase(),
            update.newAnswer.replace('01 Dec 2024', '1 December 2024').toLowerCase(),
            update.newAnswer.replace('01 Dec 2024', 'December 1, 2024').toLowerCase(),
            update.newAnswer.replace('01 Dec 2024', '1 Dec 2024').toLowerCase(),
            update.newAnswer.replace('15km', '15 km').toLowerCase(),
            update.newAnswer.replace('15km', '15 kilometers').toLowerCase(),
            update.newAnswer.replace('43 minutes', '43').toLowerCase(),
            update.newAnswer.replace('43 minutes', '43 min').toLowerCase(),
            update.newAnswer.replace('43 minutes', '43 mins').toLowerCase(),
            // Extract numbers for matching
            update.newAnswer.match(/\d+\.?\d*/)?.[0] || '',
            update.newAnswer.match(/€\s*(\d+\.?\d*)/)?.[1] || '',
            // For Q4, also try matching "15 km or 45 min" as it might need to be updated
            update.questionNumber === 'Q4' ? '15 km or 45 min' : '',
            update.questionNumber === 'Q4' ? '15km or 45min' : '',
          ].filter(v => v.length > 0)

          for (const option of options) {
            const optionText = option.text.toLowerCase()
            // Check if option text contains any variation of the new answer
            const matches = answerVariations.some(variation => {
              if (variation.length === 0) return false
              // For numeric values, check if they match exactly
              if (/^\d+\.?\d*$/.test(variation)) {
                return optionText.includes(variation) || 
                       optionText.match(new RegExp(`\\b${variation}\\b`)) !== null
              }
              // For text, check if it's contained
              return optionText.includes(variation)
            })

            if (matches) {
              // Special handling for Q4: Check if we matched "15 km or 45 min" but need "15 km or 43 min"
              if (update.questionNumber === 'Q4' && optionText.includes('45')) {
                // We found option with 15 km and 45, but user wants 43 minutes
                // This means we need to update the option text
                newAnswerId = option.id
                newAnswerText = '15 km or 43 min (NEEDS OPTION TEXT UPDATE)'
                break
              } else {
                newAnswerId = option.id
                newAnswerText = option.text
                break
              }
            }
          }

          // If still not found, try more flexible matching
          if (!newAnswerId) {
            // Extract key numbers/values from the answer
            const numericMatch = update.newAnswer.match(/(\d+\.?\d*)/g)
            const dateMatch = update.newAnswer.match(/(\d{1,2}\s+(?:Dec|December)\s+\d{4})/i)
            
            for (const option of options) {
              const optionText = option.text.toLowerCase()
              let score = 0
              
              // Check for numeric matches
              if (numericMatch) {
                numericMatch.forEach(num => {
                  if (optionText.includes(num)) score++
                })
              }
              
              // Check for date matches
              if (dateMatch) {
                const dateStr = dateMatch[0].toLowerCase()
                if (optionText.includes(dateStr) || 
                    optionText.includes(dateStr.replace('dec', 'december'))) {
                  score += 2
                }
              }
              
              // Check for "km" or "minutes" keywords
              if (update.newAnswer.toLowerCase().includes('km') && optionText.includes('km')) score++
              if (update.newAnswer.toLowerCase().includes('minute') && optionText.includes('minute')) score++
              
              // If we have a good match, use it
              if (score > 0) {
                newAnswerId = option.id
                newAnswerText = option.text
                break
              }
            }
          }

          if (newAnswerId) {
            // Check if option text needs updating (for Q4)
            let finalNote = update.note || ''
            if (update.questionNumber === 'Q4' && newAnswerText.includes('NEEDS OPTION TEXT UPDATE')) {
              finalNote = '⚠️ OPTION TEXT NEEDS UPDATE: Change option ' + newAnswerId + ' from "15 km or 45 min" to "15 km or 43 min"'
            }
            
            updates.push({
              questionId: question.id,
              questionText: question.questionText,
              oldAnswer: currentCorrectAnswer,
              oldAnswerText: currentAnswerText,
              newAnswer: newAnswerId,
              newAnswerText: newAnswerText,
              chapterTitle: question.chapter.title,
              chapterNumber: question.chapter.chapterNumber,
              questionNumber: question.questionNumber,
              questionUpdateNumber: update.questionNumber,
              note: finalNote
            })
          } else {
            // For Q4, check if option D exists with "15 km or 45 min" - we might need to update it
            if (update.questionNumber === 'Q4') {
              const optionD = options.find(opt => opt.id === 'D')
              if (optionD && (optionD.text.includes('15') && optionD.text.includes('45'))) {
                // We found option D with 15 and 45, but user wants 43 minutes
                // This means we need to update the option text first
                console.log(`⚠️  Q4: Found option D with "15 km or 45 min" but need "15 km or 43 min"`)
                console.log(`   Question: ${question.questionText}`)
                console.log(`   Current Option D: ${optionD.text}`)
                console.log(`   Need to update option text to: 15 km or 43 min`)
                console.log(`   Then set as correct answer`)
                console.log('')
                
                // Add to updates with a flag that option needs updating
                updates.push({
                  questionId: question.id,
                  questionText: question.questionText,
                  oldAnswer: currentCorrectAnswer,
                  oldAnswerText: currentAnswerText,
                  newAnswer: 'D',
                  newAnswerText: '15 km or 43 min (NEEDS OPTION UPDATE)',
                  chapterTitle: question.chapter.title,
                  chapterNumber: question.chapter.chapterNumber,
                  questionNumber: question.questionNumber,
                  questionUpdateNumber: update.questionNumber,
                  note: '⚠️ OPTION TEXT NEEDS UPDATE: Change option D from "15 km or 45 min" to "15 km or 43 min"'
                })
                continue
              }
            }
            
            // For Q2, Q3, Q5 - we need to update an option and set it as correct
            if (['Q2', 'Q3', 'Q5'].includes(update.questionNumber)) {
              // Determine which option to update (prefer updating the current correct answer option, or option C/D)
              let optionToUpdate = currentCorrectAnswer
              
              // For Q2: Update option B (current correct) to new date
              if (update.questionNumber === 'Q2') {
                optionToUpdate = 'B' // Current correct answer
              }
              // For Q3: Update option C (current correct) to €5.40
              else if (update.questionNumber === 'Q3') {
                optionToUpdate = 'C' // Current correct answer
              }
              // For Q5: Update option C (current correct) to €4.40
              else if (update.questionNumber === 'Q5') {
                optionToUpdate = 'C' // Current correct answer
              }
              
              const optionIndex = options.findIndex(opt => opt.id === optionToUpdate)
              if (optionIndex !== -1) {
                updates.push({
                  questionId: question.id,
                  questionText: question.questionText,
                  oldAnswer: currentCorrectAnswer,
                  oldAnswerText: currentAnswerText,
                  newAnswer: optionToUpdate,
                  newAnswerText: update.newAnswer,
                  chapterTitle: question.chapter.title,
                  chapterNumber: question.chapter.chapterNumber,
                  questionNumber: question.questionNumber,
                  questionUpdateNumber: update.questionNumber,
                  note: `Update option ${optionToUpdate} text to "${update.newAnswer}" and set as correct answer`,
                  needsOptionUpdate: true,
                  optionToUpdate: optionToUpdate
                })
                console.log(`✅ Found ${update.questionNumber}: Will update option ${optionToUpdate} to "${update.newAnswer}"`)
                continue
              }
            }
            
            console.log(`⚠️  Could not find matching option for update ${update.questionNumber}`)
            console.log(`   Question: ${question.questionText.substring(0, 100)}...`)
            console.log(`   Looking for: ${update.newAnswer}`)
            if (update.note) {
              console.log(`   Note: ${update.note}`)
            }
            console.log(`   Available options:`)
            options.forEach(opt => console.log(`     ${opt.id}: ${opt.text}`))
            console.log('')
          }
        }
      }
    }

    // Display findings
    console.log(`\n📊 Found ${updates.length} questions to update:\n`)
    updates.forEach(update => {
      console.log(`${update.questionUpdateNumber}: ${update.questionText.substring(0, 80)}...`)
      console.log(`   Old: ${update.oldAnswer} - ${update.oldAnswerText}`)
      console.log(`   New: ${update.newAnswer} - ${update.newAnswerText}`)
      console.log('')
    })

    // Create README with comparison
    const readmePath = path.join(process.cwd(), 'TAXI_RULES_ANSWER_UPDATES.md')
    let readmeContent = `# Taxi Rules Answer Updates - Comparison Report

Generated: ${new Date().toISOString()}

## Overview

This document shows the comparison between old and new answers for questions that have been updated based on new taxi rules.

## Questions Updated: ${updates.length}

---

`

    // Add update details
    updates.forEach((update, index) => {
      readmeContent += `## ${update.questionUpdateNumber}: ${update.questionText}

**Chapter:** ${update.chapterTitle} (Chapter ${update.chapterNumber}, Question ${update.questionNumber})

### Old Answer
- **Option ID:** ${update.oldAnswer}
- **Answer Text:** ${update.oldAnswerText}

### New Answer
- **Option ID:** ${update.newAnswer}
- **Answer Text:** ${update.newAnswerText}
${update.note ? `\n**⚠️ Note:** ${update.note}` : ''}

### All Options
`
      const question = allQuestionsForReadme.find(q => q.id === update.questionId)
      if (question) {
        question.options.forEach((opt: any) => {
          const marker = opt.id === update.newAnswer ? ' ✅ (NEW CORRECT)' : 
                        opt.id === update.oldAnswer ? ' ❌ (OLD CORRECT)' : ''
          readmeContent += `- **${opt.id}:** ${opt.text}${marker}\n`
        })
      }

      readmeContent += `\n---\n\n`
    })

    // Group questions by chapter for README
    const questionsByChapter = allQuestionsForReadme.reduce((acc: any, q: any) => {
      const key = `${q.chapterTitle} (Chapter ${q.chapterNumber})`
      if (!acc[key]) acc[key] = []
      acc[key].push(q)
      return acc
    }, {})

    // Add all questions grouped by chapter
    readmeContent += `## All Questions from Industry Knowledge Chapters

Total Questions: ${allQuestionsForReadme.length}

`

    Object.keys(questionsByChapter).sort().forEach(chapterTitle => {
      const chapterQuestions = questionsByChapter[chapterTitle]
      readmeContent += `### ${chapterTitle}

Total Questions: ${chapterQuestions.length}

`
      chapterQuestions.forEach((q: any) => {
        const isUpdated = updates.some(u => u.questionId === q.id)
        readmeContent += `#### Question ${q.questionNumber}: ${q.questionText}

**Current Correct Answer:** ${q.currentAnswer} - ${q.currentAnswerText}
${isUpdated ? '**⚠️ UPDATED**' : ''}

**Options:**
`
        q.options.forEach((opt: any) => {
          const marker = opt.id === q.currentAnswer ? ' ✅ (CORRECT)' : ''
          readmeContent += `- **${opt.id}:** ${opt.text}${marker}\n`
        })
        readmeContent += `\n`
      })
      readmeContent += `---\n\n`
    })

    // Write README
    fs.writeFileSync(readmePath, readmeContent)
    console.log(`\n✅ README created at: ${readmePath}\n`)

    // Ask for confirmation before updating
    console.log('⚠️  Ready to update questions in database.')
    console.log('⚠️  Review the README file first, then run with --confirm flag to apply updates.\n')
    console.log('To apply updates, run:')
    console.log('  npx tsx scripts/update-taxi-rules-answers.ts --confirm\n')

    // If --confirm flag is provided, apply updates
    if (process.argv.includes('--confirm')) {
      console.log('🔄 Applying updates to database...\n')
      
      for (const update of updates) {
        // Get current question to update options if needed
        const question = await prisma.question.findUnique({
          where: { id: update.questionId }
        })
        
        if (!question) {
          console.log(`❌ Question not found: ${update.questionId}`)
          continue
        }
        
        const currentOptions = question.options as Array<{ id: string; text: string }>
        let updatedOptions = [...currentOptions]
        
        // If option needs to be updated, update the option text
        if (update.needsOptionUpdate && update.optionToUpdate) {
          const optionIndex = updatedOptions.findIndex(opt => opt.id === update.optionToUpdate)
          if (optionIndex !== -1) {
            updatedOptions[optionIndex] = {
              ...updatedOptions[optionIndex],
              text: update.newAnswerText
            }
            console.log(`   📝 Updated option ${update.optionToUpdate} text to: ${update.newAnswerText}`)
          }
        }
        
        // Special handling for Q4: Update option D text from "15 km or 45 min" to "15 km or 43 min"
        if (update.questionUpdateNumber === 'Q4' && update.newAnswer === 'D') {
          const optionDIndex = updatedOptions.findIndex(opt => opt.id === 'D')
          if (optionDIndex !== -1) {
            // Update the text to "15 km or 43 min"
            updatedOptions[optionDIndex] = {
              ...updatedOptions[optionDIndex],
              text: '15 km or 43 min'
            }
            console.log(`   📝 Updated option D text from "15 km or 45 min" to "15 km or 43 min"`)
          }
        }
        
        // Update question with new options and correct answer
        await prisma.question.update({
          where: { id: update.questionId },
          data: {
            options: updatedOptions,
            correctAnswer: update.newAnswer
          }
        })
        
        console.log(`✅ Updated: ${update.questionText.substring(0, 60)}...`)
        console.log(`   Old answer: ${update.oldAnswer} - ${update.oldAnswerText}`)
        console.log(`   New answer: ${update.newAnswer} - ${update.newAnswerText}\n`)
      }

      console.log(`\n✅ Successfully updated ${updates.length} questions in database!`)
    }

  } catch (error) {
    console.error('❌ Error:', error)
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
