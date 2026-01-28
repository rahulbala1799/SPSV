import { PrismaClient, QuestionCategory } from '@prisma/client'
import 'dotenv/config'
import { syncToQuestionBank } from './sync-to-question-bank'

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
      questionText: 'What is the name of the one-way street that runs from Cornmarket to Dean Street in Dublin?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'Francis Street' },
        { id: 'B', text: 'Meath Street' },
        { id: 'C', text: 'Thomas Street' },
        { id: 'D', text: 'Bride Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Francis Street is a one-way street in Dublin that runs from Cornmarket to Dean Street. This is important knowledge for navigating the Liberties area of Dublin city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that operates from King Street North to Little Britain Street?',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Green Street' },
        { id: 'B', text: 'Queen Street' },
        { id: 'C', text: 'Church Street' },
        { id: 'D', text: 'Brunswick Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Green Street is a one-way street that operates from King Street North to Little Britain Street in Dublin\'s north inner city area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Coombe to Thomas Street?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Meath Street' },
        { id: 'B', text: 'Francis Street' },
        { id: 'C', text: 'Gray Street' },
        { id: 'D', text: 'Talbot Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Meath Street is a one-way street that runs from Coombe to Thomas Street in the Liberties area of Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Leinster Street South to St. Stephen\'s Green North?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'Kildare Street' },
        { id: 'B', text: 'Dawson Street' },
        { id: 'C', text: 'Nassau Street' },
        { id: 'D', text: 'Molesworth Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Kildare Street is a one-way street that runs from Leinster Street South to St. Stephen\'s Green North. This street is located in the prestigious Georgian area of Dublin and is home to the National Library and National Museum.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Dawson Street to Kildare Street?',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'Molesworth Street' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Westmoreland Street' },
        { id: 'D', text: 'D\'Olier Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Molesworth Street is a one-way street that runs from Dawson Street to Kildare Street in Dublin\'s city center, connecting the shopping district to the Georgian quarter.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Grangegorman Lower to Manor Street?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'Kirwan Street' },
        { id: 'B', text: 'Brunswick Street' },
        { id: 'C', text: 'Queen Street' },
        { id: 'D', text: 'Church Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Kirwan Street is a one-way street that runs from Grangegorman Lower to Manor Street in Dublin\'s north inner city area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Meath Street to Pimlico?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'Gray Street' },
        { id: 'B', text: 'Francis Street' },
        { id: 'C', text: 'Bride Street' },
        { id: 'D', text: 'Fade Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Gray Street is a one-way street that runs from Meath Street to Pimlico in the Liberties area of Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Stephen Street Lower to Exchequer Street?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Drury Street' },
        { id: 'B', text: 'Fade Street' },
        { id: 'C', text: 'Wicklow Street' },
        { id: 'D', text: 'South Great Georges Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Drury Street is a one-way street that runs from Stephen Street Lower to Exchequer Street in Dublin\'s city center, connecting the shopping district.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Bride Street to Patrick Street?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Bulle Alley' },
        { id: 'B', text: 'Francis Street' },
        { id: 'C', text: 'Thomas Street' },
        { id: 'D', text: 'Meath Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Bulle Alley is a one-way street that runs from Bride Street to Patrick Street in the Liberties area of Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from College Green to Aston Quay?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'Westmoreland Street' },
        { id: 'B', text: 'D\'Olier Street' },
        { id: 'C', text: 'O\'Connell Street' },
        { id: 'D', text: 'Parliament Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Westmoreland Street is a major one-way street that runs from College Green to Aston Quay, connecting the city center to the quays along the River Liffey.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Burgh Quay to College Green?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'D\'Olier Street' },
        { id: 'B', text: 'Westmoreland Street' },
        { id: 'C', text: 'Nassau Street' },
        { id: 'D', text: 'Parliament Street' }
      ],
      correctAnswer: 'A',
      explanation: 'D\'Olier Street is a one-way street that runs from Burgh Quay to College Green, providing an important route from the quays to the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Blackhall Place to Church Street?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Brunswick Street' },
        { id: 'B', text: 'Queen Street' },
        { id: 'C', text: 'Kirwan Street' },
        { id: 'D', text: 'Green Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Brunswick Street is a one-way street that runs from Blackhall Place to Church Street in Dublin\'s north inner city area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from King Street North to Arran Quay?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'Queen Street' },
        { id: 'B', text: 'Church Street' },
        { id: 'C', text: 'Brunswick Street' },
        { id: 'D', text: 'Green Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Queen Street is a one-way street that runs from King Street North to Arran Quay, connecting the north inner city to the quays.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from South Great Georges Street to Exchequer Street?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Wicklow Street' },
        { id: 'B', text: 'Fade Street' },
        { id: 'C', text: 'Drury Street' },
        { id: 'D', text: 'Nassau Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Wicklow Street is a one-way street that runs from South Great Georges Street to Exchequer Street in Dublin\'s city center shopping district.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Dame Street to Wellington Quay?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'Eustace Street' },
        { id: 'B', text: 'Sycamore Street' },
        { id: 'C', text: 'East Essex Street' },
        { id: 'D', text: 'Fleet Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Eustace Street is a one-way street that runs from Dame Street to Wellington Quay, connecting the main thoroughfare to the quays along the River Liffey.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Amiens Street to Marlborough Street?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'Talbot Street' },
        { id: 'B', text: 'Gardiner Street' },
        { id: 'C', text: 'Parnell Street' },
        { id: 'D', text: 'Summerhill' }
      ],
      correctAnswer: 'A',
      explanation: 'Talbot Street is a one-way street that runs from Amiens Street to Marlborough Street in Dublin\'s north inner city, connecting the Connolly Station area to the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Drury Street to South Great Georges Street?',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'Fade Street' },
        { id: 'B', text: 'Wicklow Street' },
        { id: 'C', text: 'Exchequer Street' },
        { id: 'D', text: 'Dame Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Fade Street is a one-way street that runs from Drury Street to South Great Georges Street in Dublin\'s city center shopping district.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Tara Street to Hawkins Street?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'Poolbeg Street' },
        { id: 'B', text: 'Pearse Street' },
        { id: 'C', text: 'Westmoreland Street' },
        { id: 'D', text: 'Mark Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Poolbeg Street is a one-way street that runs from Tara Street to Hawkins Street, connecting the Tara Street DART station area to the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Townsend Street to Pearse Street?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Shaw Street' },
        { id: 'B', text: 'Mark Street' },
        { id: 'C', text: 'Poolbeg Street' },
        { id: 'D', text: 'Lombard Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Shaw Street is a one-way street that runs from Townsend Street to Pearse Street in Dublin\'s south inner city area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Pearse Street to Townsend Street?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'Mark Street' },
        { id: 'B', text: 'Shaw Street' },
        { id: 'C', text: 'Sandwith Street' },
        { id: 'D', text: 'Poolbeg Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Mark Street is a one-way street that runs from Pearse Street to Townsend Street, providing a return route in the opposite direction to Shaw Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Stephens Street South to Adelaide Road?',
      questionNumber: 21,
      options: [
        { id: 'A', text: 'Earlsfort Terrace' },
        { id: 'B', text: 'Hatch Street' },
        { id: 'C', text: 'Leeson Street' },
        { id: 'D', text: 'Harcourt Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Earlsfort Terrace is a one-way street that runs from Stephens Street South to Adelaide Road, connecting the city center to the Grand Canal area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Camden Street Lower to New Bride Street?',
      questionNumber: 22,
      options: [
        { id: 'A', text: 'Camden Row' },
        { id: 'B', text: 'Harcourt Street' },
        { id: 'C', text: 'Charlemont Street' },
        { id: 'D', text: 'Wexford Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Camden Row is a one-way street that runs from Camden Street Lower to New Bride Street in Dublin\'s south inner city area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Baggot Street Lower to Mount Street Upper?',
      questionNumber: 23,
      options: [
        { id: 'A', text: 'James Street East' },
        { id: 'B', text: 'Haddington Road' },
        { id: 'C', text: 'Northumberland Road' },
        { id: 'D', text: 'Shelbourne Road' }
      ],
      correctAnswer: 'A',
      explanation: 'James Street East is a one-way street that runs from Baggot Street Lower to Mount Street Upper in Dublin\'s Ballsbridge area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Dame Street to East Essex Street?',
      questionNumber: 24,
      options: [
        { id: 'A', text: 'Sycamore Street' },
        { id: 'B', text: 'Eustace Street' },
        { id: 'C', text: 'Fleet Street' },
        { id: 'D', text: 'Parliament Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Sycamore Street is a one-way street that runs from Dame Street to East Essex Street, connecting the main thoroughfare to the Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from St. Stephen\'s Green North to Nassau Street?',
      questionNumber: 25,
      options: [
        { id: 'A', text: 'Dawson Street' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Molesworth Street' },
        { id: 'D', text: 'Leinster Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Dawson Street is a one-way street that runs from St. Stephen\'s Green North to Nassau Street, connecting the prestigious Georgian square to the shopping and cultural district.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Suffolk Street to Leinster Street South?',
      questionNumber: 26,
      options: [
        { id: 'A', text: 'Nassau Street' },
        { id: 'B', text: 'Dawson Street' },
        { id: 'C', text: 'Kildare Street' },
        { id: 'D', text: 'Molesworth Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Nassau Street is a one-way street that runs from Suffolk Street to Leinster Street South, connecting the shopping district to the Georgian quarter near Trinity College.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Parliament Street to Eustace Street?',
      questionNumber: 27,
      options: [
        { id: 'A', text: 'East Essex Street' },
        { id: 'B', text: 'Sycamore Street' },
        { id: 'C', text: 'Fleet Street' },
        { id: 'D', text: 'Werburgh Street' }
      ],
      correctAnswer: 'A',
      explanation: 'East Essex Street is a one-way street that runs from Parliament Street to Eustace Street, connecting the Temple Bar area to the quays.',
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
  
  // Auto-sync to QuestionBank for timed tests
  await syncToQuestionBank(prisma, [chapter.id])
  
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
