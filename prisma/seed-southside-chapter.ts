import { PrismaClient } from '@prisma/client'
import { syncToQuestionBank } from './sync-to-question-bank'

const prisma = new PrismaClient()

async function seedSouthsideChapter() {
  console.log('🌱 Seeding Southside Full chapter...')

  // Create chapter
  const chapter = await prisma.chapter.upsert({
    where: { id: 'chapter_southside_full' },
    update: {},
    create: {
      id: 'chapter_southside_full',
      title: 'Southside Full',
      description: 'Test your knowledge of roads, landmarks, and locations in Dublin\'s Southside area',
      chapterNumber: 1,
      type: 'MCQ',
      duration: 30,
      isActive: true
    }
  })

  console.log('✅ Chapter created:', chapter.title)

  // Define all 20 questions
  const questions = [
    {
      questionText: 'Which road runs between Merrion to Ballsbridge?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'Nutley Lane' },
        { id: 'B', text: 'Anglesea Road' },
        { id: 'C', text: 'Strand Road' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Merrion Road is the main road connecting Merrion to Ballsbridge.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Merrion to Irishtown is via which road?',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Rock Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Sandymount Avenue' },
        { id: 'D', text: 'Strand Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Strand Road connects Merrion to Irishtown.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Blackrock to Merrion?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Frascati Road' },
        { id: 'B', text: 'Stillorgan Road' },
        { id: 'C', text: 'Carysfort Avenue' },
        { id: 'D', text: 'Rock Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Rock Road is the route from Blackrock to Merrion.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Blackrock to Booterstown?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'Seapoint Avenue' },
        { id: 'B', text: 'Monkstown Avenue' },
        { id: 'C', text: 'Mount Merrion Avenue' },
        { id: 'D', text: 'Rock Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Rock Road connects Blackrock to Booterstown.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Blackrock to Mount Merrion?',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'Stillorgan Road' },
        { id: 'B', text: 'Roebuck Road' },
        { id: 'C', text: 'Fosters Avenue' },
        { id: 'D', text: 'Mount Merrion Avenue (N31)' }
      ],
      correctAnswer: 'D',
      explanation: 'Mount Merrion Avenue (N31) is the route from Blackrock to Mount Merrion.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road adjoins Merrion Road?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'Nutley Lane' },
        { id: 'B', text: 'Elgin Road' },
        { id: 'C', text: 'Ailesbury Road' },
        { id: 'D', text: 'Anglesea Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Anglesea Road adjoins Merrion Road.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Which road adjoins Strand Road?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'Nutley Lane' },
        { id: 'B', text: 'Beach Road' },
        { id: 'C', text: 'Londonbridge Road' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Merrion Road adjoins Strand Road.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Tara Towers?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Nutley Lane' },
        { id: 'B', text: 'Anglesea Road' },
        { id: 'C', text: 'Sandymount Avenue' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Tara Towers is located on Merrion Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'RDS is located on?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Anglesea Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Sandymount Road' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The RDS (Royal Dublin Society) is located on Merrion Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Horse Show Jumping entrance?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'Merrion Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Simmonscourt Road' },
        { id: 'D', text: 'Anglesea Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Horse Show Jumping entrance is on Anglesea Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'British Embassy?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'Stillorgan Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Roebuck Road' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The British Embassy is located on Merrion Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Blackrock College?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Stillorgan Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Roebuck Road' },
        { id: 'D', text: 'Rock Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Blackrock College is located on Rock Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Blackrock Shopping Centre?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'Stillorgan Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Roebuck Road' },
        { id: 'D', text: 'Frascati Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Blackrock Shopping Centre is located on Frascati Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'American Embassy?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Stillorgan Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Roebuck Road' },
        { id: 'D', text: 'Elgin Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The American Embassy is located on Elgin Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Aviva Stadium?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'Stillorgan Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Roebuck Road' },
        { id: 'D', text: 'Lansdowne Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Aviva Stadium is located on Lansdowne Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'UCD is located in?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'Stillorgan Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Roebuck Road' },
        { id: 'D', text: 'Belfield' }
      ],
      correctAnswer: 'D',
      explanation: 'UCD (University College Dublin) is located in Belfield.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Beacon Hospital?',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'Stillorgan Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Roebuck Road' },
        { id: 'D', text: 'Bracken Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Beacon Hospital is located on Bracken Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Dundrum Shopping Centre is on?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'Stillorgan Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Roebuck Road' },
        { id: 'D', text: 'Sandyford Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Dundrum Shopping Centre is located on Sandyford Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Nutgrove Shopping Centre is on?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Stillorgan Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Roebuck Road' },
        { id: 'D', text: 'Nutgrove Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Nutgrove Shopping Centre is located on Nutgrove Avenue.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Tallaght Hospital?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'Stillorgan Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Roebuck Road' },
        { id: 'D', text: 'Belgard Square North' }
      ],
      correctAnswer: 'D',
      explanation: 'Tallaght Hospital is located on Belgard Square North.',
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
        difficulty: q.difficulty
      }
    })
  }

  console.log(`✅ Created ${questions.length} questions for Southside Full chapter`)
  
  // Auto-sync to QuestionBank for timed tests
  await syncToQuestionBank(prisma, [chapter.id])
  
  console.log('🎉 Seeding complete!')
}

seedSouthsideChapter()
  .catch((error) => {
    console.error('❌ Error seeding:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
