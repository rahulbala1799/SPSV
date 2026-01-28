import { PrismaClient, QuestionCategory } from '@prisma/client'
import 'dotenv/config'
import { syncToQuestionBank } from './sync-to-question-bank'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Churches and Cemeteries chapter...')

  // Create chapter
  const chapter = await prisma.chapter.upsert({
    where: { id: 'chapter_churches_cemeteries' },
    update: {},
    create: {
      id: 'chapter_churches_cemeteries',
      title: 'Churches and Cemeteries',
      description: 'Test your knowledge of churches, cemeteries, and religious sites in Dublin',
      chapterNumber: 5,
      type: 'MCQ',
      duration: 30,
      isActive: true,
      category: QuestionCategory.AREA_KNOWLEDGE
    }
  })

  console.log('✅ Chapter created:', chapter.title)

  // Define all 34 questions
  const questions = [
    {
      questionText: 'On what road is The Croppies Acre Cemetery situated?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'Clonmel Street' },
        { id: 'B', text: 'Merrion Row' },
        { id: 'C', text: 'Suir Road' },
        { id: 'D', text: 'Benburb Street' }
      ],
      correctAnswer: 'D',
      explanation: 'The Croppies Acre Cemetery is situated on Benburb Street in Dublin, near the Liffey and the Four Courts.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what road is Ballyroan Parish Church situated?',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Butterfield Avenue' },
        { id: 'B', text: 'Whitechurch Road' },
        { id: 'C', text: 'Ballyboden Road' },
        { id: 'D', text: 'Marian Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Ballyroan Parish Church is situated on Marian Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what road is Our Lady Of Consolation (Donnycarney Church) located?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Malahide Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Ardlea Road' },
        { id: 'D', text: 'Grace Park Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Our Lady Of Consolation (Donnycarney Church) is located on Malahide Road in Donnycarney, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Arbour Hill Cemetery located?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'Iona Road' },
        { id: 'B', text: 'Arbour Hill' },
        { id: 'C', text: 'Islandbridge' },
        { id: 'D', text: 'Synge Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Arbour Hill Cemetery is located in Arbour Hill, Dublin, near the Phoenix Park area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is St. Stephen\'s Church situated?',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'Percy Place' },
        { id: 'B', text: 'Herbert Lane' },
        { id: 'C', text: 'Merrion Square East' },
        { id: 'D', text: 'Mount Street Crescent' }
      ],
      correctAnswer: 'D',
      explanation: 'St. Stephen\'s Church is situated on Mount Street Crescent in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is St. Teresa\'s Church situated?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'South William Street' },
        { id: 'B', text: 'Chatham Street' },
        { id: 'C', text: 'Clarendon Street' },
        { id: 'D', text: 'Wicklow Street' }
      ],
      correctAnswer: 'C',
      explanation: 'St. Teresa\'s Church is situated on Clarendon Street in Dublin\'s city center, near Grafton Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what road is St. Michan\'s Cemetery situated?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'High Street' },
        { id: 'B', text: 'Church Street' },
        { id: 'C', text: 'Thomas Street' },
        { id: 'D', text: 'Mary Street' }
      ],
      correctAnswer: 'B',
      explanation: 'St. Michan\'s Cemetery is situated on Church Street in Dublin\'s northside, near the Four Courts.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what road is Donnybrook Church of the Sacred Heart situated?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Morehampton Road' },
        { id: 'B', text: 'Stillorgan Road' },
        { id: 'C', text: 'Herbert Park' },
        { id: 'D', text: 'Eglinton Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Donnybrook Church of the Sacred Heart is situated on Stillorgan Road in Donnybrook, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Off what main road is Palmerstown Cemetery situated?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Kennelsfort Road' },
        { id: 'B', text: 'Brighton Road' },
        { id: 'C', text: 'Church Street' },
        { id: 'D', text: 'Edmondstown Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Palmerstown Cemetery is situated off Kennelsfort Road in Palmerstown, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is St. Audeon\'s Church situated?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'St. Augustine Street' },
        { id: 'B', text: 'High Street' },
        { id: 'C', text: 'Back Lane' },
        { id: 'D', text: 'Lamb Alley' }
      ],
      correctAnswer: 'B',
      explanation: 'St. Audeon\'s Church is situated on High Street in Dublin\'s city center, one of the oldest churches in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The entrance to Kilmashogue Cemetery is located on what street?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'Edmondstown Road' },
        { id: 'B', text: 'Navan Road' },
        { id: 'C', text: 'Merrion Street' },
        { id: 'D', text: 'Kilmainham' }
      ],
      correctAnswer: 'A',
      explanation: 'The entrance to Kilmashogue Cemetery is located on Edmondstown Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is St Kevin\'s Catholic Church situated?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Victoria Street' },
        { id: 'B', text: 'Harrington Street' },
        { id: 'C', text: 'Heytesbury Street' },
        { id: 'D', text: 'Lennox Street' }
      ],
      correctAnswer: 'B',
      explanation: 'St Kevin\'s Catholic Church is situated on Harrington Street in Dublin\'s south inner city.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The entrance to Newcastle Cemetery is located on what street?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'Synge Street' },
        { id: 'B', text: 'Blackrock' },
        { id: 'C', text: 'Parnell Street' },
        { id: 'D', text: 'Newcastle Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The entrance to Newcastle Cemetery is located on Newcastle Road in Newcastle, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The entrance to Newlands Cross Cemetery is located on what street?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Nangor Road' },
        { id: 'B', text: 'Ballymount Road' },
        { id: 'C', text: 'Naas Road' },
        { id: 'D', text: 'Kennelsfort Road' }
      ],
      correctAnswer: 'B',
      explanation: 'The entrance to Newlands Cross Cemetery is located on Ballymount Road in Newlands Cross, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is St. Mary\'s Abbey located?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'Capel Street' },
        { id: 'B', text: 'Kings Inn Street' },
        { id: 'C', text: 'Parnell Square' },
        { id: 'D', text: 'Bolton Street' }
      ],
      correctAnswer: 'A',
      explanation: 'St. Mary\'s Abbey is located on Capel Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is St. Werburgh\'s Church situated?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'Fishamble Street' },
        { id: 'B', text: 'Werburgh Street' },
        { id: 'C', text: 'Golden Lane' },
        { id: 'D', text: 'High Street' }
      ],
      correctAnswer: 'B',
      explanation: 'St. Werburgh\'s Church is situated on Werburgh Street in Dublin\'s city center, near Dublin Castle.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is Christ Church Cathedral situated?',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'Winetavern Street' },
        { id: 'B', text: 'Cook Street' },
        { id: 'C', text: 'Essex Street West' },
        { id: 'D', text: 'Christchurch Place' }
      ],
      correctAnswer: 'D',
      explanation: 'Christ Church Cathedral is situated on Christchurch Place in Dublin\'s city center, one of Dublin\'s most famous landmarks.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'The main entrance to Glasnevin Cemetery is situated on what road?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'Botanic Road' },
        { id: 'B', text: 'Glasnevin Hill' },
        { id: 'C', text: 'Iona Road' },
        { id: 'D', text: 'Finglas Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The main entrance to Glasnevin Cemetery is situated on Finglas Road in Glasnevin, Dublin. This is one of Ireland\'s most famous cemeteries.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what road is the Dublin Hebrew Congregation located?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Rathgar Road' },
        { id: 'B', text: 'Rathfarnham Road' },
        { id: 'C', text: 'Rathmines Road' },
        { id: 'D', text: 'Grosvenor Road' }
      ],
      correctAnswer: 'B',
      explanation: 'The Dublin Hebrew Congregation is located on Rathfarnham Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Shanganagh Cemetery located?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'Shankill' },
        { id: 'B', text: 'Dalkey' },
        { id: 'C', text: 'Cabinteely' },
        { id: 'D', text: 'Blackrock' }
      ],
      correctAnswer: 'A',
      explanation: 'Shanganagh Cemetery is located in Shankill, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The entrance to Mount Venus Cemetery is located on what street?',
      questionNumber: 21,
      options: [
        { id: 'A', text: 'Merrion Road' },
        { id: 'B', text: 'Parnell Street' },
        { id: 'C', text: 'Mount Venus Road' },
        { id: 'D', text: 'Kildare Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The entrance to Mount Venus Cemetery is located on Mount Venus Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what area is the Archbishop\'s House located?',
      questionNumber: 22,
      options: [
        { id: 'A', text: 'Glasnevin' },
        { id: 'B', text: 'Milltown' },
        { id: 'C', text: 'Ballsbridge' },
        { id: 'D', text: 'Drumcondra' }
      ],
      correctAnswer: 'D',
      explanation: 'The Archbishop\'s House is located in Drumcondra, Dublin, on Drumcondra Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what road is Corpus Christi Church situated?',
      questionNumber: 23,
      options: [
        { id: 'A', text: 'Griffith Avenue' },
        { id: 'B', text: 'Botanic Avenue' },
        { id: 'C', text: 'Home Farm Road' },
        { id: 'D', text: 'Millbourne Avenue' }
      ],
      correctAnswer: 'C',
      explanation: 'Corpus Christi Church is situated on Home Farm Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is St. Ann\'s Church situated?',
      questionNumber: 24,
      options: [
        { id: 'A', text: 'Dawson Street' },
        { id: 'B', text: 'Molesworth Street' },
        { id: 'C', text: 'St. Stephen\'s Green' },
        { id: 'D', text: 'Duke Street' }
      ],
      correctAnswer: 'A',
      explanation: 'St. Ann\'s Church is situated on Dawson Street in Dublin\'s city center, near St. Stephen\'s Green.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is St. Michan\'s Church situated?',
      questionNumber: 25,
      options: [
        { id: 'A', text: 'Church Street' },
        { id: 'B', text: 'Greek Street' },
        { id: 'C', text: 'Mary\'s Lane' },
        { id: 'D', text: 'Bow Street' }
      ],
      correctAnswer: 'A',
      explanation: 'St. Michan\'s Church is situated on Church Street in Dublin\'s northside, known for its crypts with preserved bodies.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The entrance to Mount Jerome Cemetery is located on what street?',
      questionNumber: 26,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Harold\'s Cross Road' },
        { id: 'C', text: 'Mount Venus Road' },
        { id: 'D', text: 'Church Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The entrance to Mount Jerome Cemetery is located on Harold\'s Cross Road in Harold\'s Cross, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Islamic Cultural Centre of Ireland located?',
      questionNumber: 27,
      options: [
        { id: 'A', text: 'Roebuck Road' },
        { id: 'B', text: 'Bird Avenue' },
        { id: 'C', text: 'Goatstown Road' },
        { id: 'D', text: 'Roebuck Downs' }
      ],
      correctAnswer: 'A',
      explanation: 'The Islamic Cultural Centre of Ireland is located on Roebuck Road in Clonskeagh, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is St. Mary\'s Pro-Cathedral situated?',
      questionNumber: 28,
      options: [
        { id: 'A', text: 'Talbot Street' },
        { id: 'B', text: 'Earl Street North' },
        { id: 'C', text: 'Cathal Brugha Street' },
        { id: 'D', text: 'Marlborough Street' }
      ],
      correctAnswer: 'D',
      explanation: 'St. Mary\'s Pro-Cathedral is situated on Marlborough Street in Dublin\'s city center, the main Catholic cathedral in Dublin.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is the Dublin Mosque located?',
      questionNumber: 29,
      options: [
        { id: 'A', text: 'Washington Street' },
        { id: 'B', text: 'Donore Avenue' },
        { id: 'C', text: 'Dolphin\'s Road' },
        { id: 'D', text: 'South Circular Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Dublin Mosque is located on South Circular Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is The Huguenot Cemetery located?',
      questionNumber: 30,
      options: [
        { id: 'A', text: 'St Stephen\'s Green' },
        { id: 'B', text: 'Merrion Street' },
        { id: 'C', text: 'Hume Street' },
        { id: 'D', text: 'Merrion Row' }
      ],
      correctAnswer: 'D',
      explanation: 'The Huguenot Cemetery is located on Merrion Row in Dublin, near St. Stephen\'s Green.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is St. Patrick\'s Cathedral situated?',
      questionNumber: 31,
      options: [
        { id: 'A', text: 'St. Patrick\'s Close' },
        { id: 'B', text: 'Golden Lane' },
        { id: 'C', text: 'Kevin Street Upper' },
        { id: 'D', text: 'Bride Street' }
      ],
      correctAnswer: 'A',
      explanation: 'St. Patrick\'s Cathedral is situated on St. Patrick\'s Close in Dublin\'s city center, one of Dublin\'s most famous landmarks and Ireland\'s largest church.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Deansgrange Cemetery located?',
      questionNumber: 32,
      options: [
        { id: 'A', text: 'Clonkeen Road' },
        { id: 'B', text: 'Deansgrange Road' },
        { id: 'C', text: 'Frascati Road' },
        { id: 'D', text: 'Monkstown Avenue' }
      ],
      correctAnswer: 'B',
      explanation: 'Deansgrange Cemetery is located on Deansgrange Road in Deansgrange, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is Whitefriar Street Church situated?',
      questionNumber: 33,
      options: [
        { id: 'A', text: 'York Street' },
        { id: 'B', text: 'Aungier Street' },
        { id: 'C', text: 'Peter Row' },
        { id: 'D', text: 'Whitefriar Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Whitefriar Street Church is situated on Aungier Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what road is the Church of the Three Patrons located?',
      questionNumber: 34,
      options: [
        { id: 'A', text: 'Rathfarnham Road' },
        { id: 'B', text: 'Rathmines Road' },
        { id: 'C', text: 'Grosvenor Road' },
        { id: 'D', text: 'Rathgar Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Church of the Three Patrons is located on Rathgar Road in Rathgar, Dublin.',
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

  console.log(`✅ Created ${questions.length} questions for Churches and Cemeteries chapter`)
  
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
