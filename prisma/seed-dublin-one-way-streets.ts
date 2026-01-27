import { PrismaClient, QuestionCategory } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Dublin One Way Streets chapter...')

  // Create chapter
  const chapter = await prisma.chapter.upsert({
    where: { id: 'chapter_dublin_one_way_streets' },
    update: {},
    create: {
      id: 'chapter_dublin_one_way_streets',
      title: 'Dublin One Way Streets',
      description: 'Test your knowledge of one-way street directions in Dublin city center',
      chapterNumber: 2,
      type: 'MCQ',
      duration: 30,
      isActive: true,
      category: QuestionCategory.AREA_KNOWLEDGE
    }
  })

  console.log('✅ Chapter created:', chapter.title)

  // Define all 27 questions
  const questions = [
    {
      questionText: 'Which street is one-way from Cornmarket to Dean Street?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'Francis Street' },
        { id: 'B', text: 'Meath Street' },
        { id: 'C', text: 'Thomas Street' },
        { id: 'D', text: 'Bride Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Francis Street is one-way from Cornmarket to Dean Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street operates one-way from King Street North to Little Britain Street?',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Green Street' },
        { id: 'B', text: 'Queen Street' },
        { id: 'C', text: 'Church Street' },
        { id: 'D', text: 'Brunswick Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Green Street operates one-way from King Street North to Little Britain Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Coombe to Thomas Street?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Meath Street' },
        { id: 'B', text: 'Francis Street' },
        { id: 'C', text: 'Gray Street' },
        { id: 'D', text: 'Talbot Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Meath Street is one-way from Coombe to Thomas Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Leinster Street South to St. Stephen\'s Green North?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'Kildare Street' },
        { id: 'B', text: 'Dawson Street' },
        { id: 'C', text: 'Nassau Street' },
        { id: 'D', text: 'Molesworth Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Kildare Street is one-way from Leinster Street South to St. Stephen\'s Green North.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Dawson Street to Kildare Street?',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'Molesworth Street' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Westmoreland Street' },
        { id: 'D', text: 'D\'Olier Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Molesworth Street is one-way from Dawson Street to Kildare Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Grangegorman Lower to Manor Street?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'Kirwan Street' },
        { id: 'B', text: 'Brunswick Street' },
        { id: 'C', text: 'Queen Street' },
        { id: 'D', text: 'Church Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Kirwan Street is one-way from Grangegorman Lower to Manor Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Meath Street to Pimlico?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'Gray Street' },
        { id: 'B', text: 'Francis Street' },
        { id: 'C', text: 'Bride Street' },
        { id: 'D', text: 'Fade Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Gray Street is one-way from Meath Street to Pimlico.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Stephen Street Lower to Exchequer Street?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Drury Street' },
        { id: 'B', text: 'Fade Street' },
        { id: 'C', text: 'Wicklow Street' },
        { id: 'D', text: 'South Great Georges Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Drury Street is one-way from Stephen Street Lower to Exchequer Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Bride Street to Patrick Street?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Bulle Alley' },
        { id: 'B', text: 'Francis Street' },
        { id: 'C', text: 'Thomas Street' },
        { id: 'D', text: 'Meath Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Bulle Alley is one-way from Bride Street to Patrick Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from College Green to Aston Quay?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'Westmoreland Street' },
        { id: 'B', text: 'D\'Olier Street' },
        { id: 'C', text: 'O\'Connell Street' },
        { id: 'D', text: 'Parliament Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Westmoreland Street is one-way from College Green to Aston Quay.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Burgh Quay to College Green?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'D\'Olier Street' },
        { id: 'B', text: 'Westmoreland Street' },
        { id: 'C', text: 'Nassau Street' },
        { id: 'D', text: 'Parliament Street' }
      ],
      correctAnswer: 'A',
      explanation: 'D\'Olier Street is one-way from Burgh Quay to College Green.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Blackhall Place to Church Street?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Brunswick Street' },
        { id: 'B', text: 'Queen Street' },
        { id: 'C', text: 'Kirwan Street' },
        { id: 'D', text: 'Green Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Brunswick Street is one-way from Blackhall Place to Church Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from King Street North to Arran Quay?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'Queen Street' },
        { id: 'B', text: 'Church Street' },
        { id: 'C', text: 'Brunswick Street' },
        { id: 'D', text: 'Green Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Queen Street is one-way from King Street North to Arran Quay.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from South Great Georges Street to Exchequer Street?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Wicklow Street' },
        { id: 'B', text: 'Fade Street' },
        { id: 'C', text: 'Drury Street' },
        { id: 'D', text: 'Nassau Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Wicklow Street is one-way from South Great Georges Street to Exchequer Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Dame Street to Wellington Quay?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'Eustace Street' },
        { id: 'B', text: 'Sycamore Street' },
        { id: 'C', text: 'East Essex Street' },
        { id: 'D', text: 'Fleet Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Eustace Street is one-way from Dame Street to Wellington Quay.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Amiens Street to Marlborough Street?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'Talbot Street' },
        { id: 'B', text: 'Gardiner Street' },
        { id: 'C', text: 'Parnell Street' },
        { id: 'D', text: 'Summerhill' }
      ],
      correctAnswer: 'A',
      explanation: 'Talbot Street is one-way from Amiens Street to Marlborough Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Drury Street to South Great Georges Street?',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'Fade Street' },
        { id: 'B', text: 'Wicklow Street' },
        { id: 'C', text: 'Exchequer Street' },
        { id: 'D', text: 'Dame Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Fade Street is one-way from Drury Street to South Great Georges Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Tara Street to Hawkins Street?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'Poolbeg Street' },
        { id: 'B', text: 'Pearse Street' },
        { id: 'C', text: 'Westmoreland Street' },
        { id: 'D', text: 'Mark Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Poolbeg Street is one-way from Tara Street to Hawkins Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Townsend Street to Pearse Street?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Shaw Street' },
        { id: 'B', text: 'Mark Street' },
        { id: 'C', text: 'Poolbeg Street' },
        { id: 'D', text: 'Lombard Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Shaw Street is one-way from Townsend Street to Pearse Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Pearse Street to Townsend Street?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'Mark Street' },
        { id: 'B', text: 'Shaw Street' },
        { id: 'C', text: 'Sandwith Street' },
        { id: 'D', text: 'Poolbeg Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Mark Street is one-way from Pearse Street to Townsend Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Stephens Street South to Adelaide Road?',
      questionNumber: 21,
      options: [
        { id: 'A', text: 'Earlsfort Terrace' },
        { id: 'B', text: 'Hatch Street' },
        { id: 'C', text: 'Leeson Street' },
        { id: 'D', text: 'Harcourt Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Earlsfort Terrace is one-way from Stephens Street South to Adelaide Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Camden Street Lower to New Bride Street?',
      questionNumber: 22,
      options: [
        { id: 'A', text: 'Camden Row' },
        { id: 'B', text: 'Harcourt Street' },
        { id: 'C', text: 'Charlemont Street' },
        { id: 'D', text: 'Wexford Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Camden Row is one-way from Camden Street Lower to New Bride Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Baggot Street Lower to Mount Street Upper?',
      questionNumber: 23,
      options: [
        { id: 'A', text: 'James Street East' },
        { id: 'B', text: 'Haddington Road' },
        { id: 'C', text: 'Northumberland Road' },
        { id: 'D', text: 'Shelbourne Road' }
      ],
      correctAnswer: 'A',
      explanation: 'James Street East is one-way from Baggot Street Lower to Mount Street Upper.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Dame Street to East Essex Street?',
      questionNumber: 24,
      options: [
        { id: 'A', text: 'Sycamore Street' },
        { id: 'B', text: 'Eustace Street' },
        { id: 'C', text: 'Fleet Street' },
        { id: 'D', text: 'Parliament Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Sycamore Street is one-way from Dame Street to East Essex Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Stephens Green North to Nassau Street?',
      questionNumber: 25,
      options: [
        { id: 'A', text: 'Dawson Street' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Molesworth Street' },
        { id: 'D', text: 'Leinster Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Dawson Street is one-way from Stephens Green North to Nassau Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Suffolk Street to Leinster Street South?',
      questionNumber: 26,
      options: [
        { id: 'A', text: 'Nassau Street' },
        { id: 'B', text: 'Dawson Street' },
        { id: 'C', text: 'Kildare Street' },
        { id: 'D', text: 'Molesworth Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Nassau Street is one-way from Suffolk Street to Leinster Street South.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street is one-way from Parliament Street to Eustace Street?',
      questionNumber: 27,
      options: [
        { id: 'A', text: 'East Essex Street' },
        { id: 'B', text: 'Sycamore Street' },
        { id: 'C', text: 'Fleet Street' },
        { id: 'D', text: 'Werburgh Street' }
      ],
      correctAnswer: 'A',
      explanation: 'East Essex Street is one-way from Parliament Street to Eustace Street.',
      points: 1,
      difficulty: 'medium'
    }
  ]

  // Delete existing questions for this chapter (if re-seeding)
  await prisma.question.deleteMany({
    where: { chapterId: chapter.id }
  })

  // Create all questions
  for (const q of questions) {
    await prisma.question.create({
      data: {
        chapterId: chapter.id,
        questionText: q.questionText,
        questionNumber: q.questionNumber,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points,
        difficulty: q.difficulty,
        category: QuestionCategory.AREA_KNOWLEDGE
      }
    })
  }

  console.log(`✅ Created ${questions.length} questions for Dublin One Way Streets chapter`)
  console.log('🎉 Seeding complete!')
}

main()
  .catch((error) => {
    console.error('❌ Error seeding:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
