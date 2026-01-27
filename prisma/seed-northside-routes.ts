import { PrismaClient, QuestionCategory } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Northside Routes chapter...')

  // Create chapter
  const chapter = await prisma.chapter.upsert({
    where: { id: 'chapter_northside_routes' },
    update: {},
    create: {
      id: 'chapter_northside_routes',
      title: 'Northside Routes',
      description: 'Test your knowledge of routes, areas, landmarks, and locations in Dublin\'s Northside area',
      chapterNumber: 4,
      type: 'MCQ',
      duration: 50,
      isActive: true,
      category: QuestionCategory.AREA_KNOWLEDGE
    }
  })

  console.log('✅ Chapter created:', chapter.title)

  // Define all 113 questions
  const questions = [
    {
      questionText: 'From Cappagh Hospital to Mount Joy Square, which areas are NOT on your route?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'Finglas, Drumcondra' },
        { id: 'B', text: 'Cabra, Phibsborough' },
        { id: 'C', text: 'Glasnevin, Ballymun' },
        { id: 'D', text: 'Ashtown, Stoneybatter' }
      ],
      correctAnswer: 'D',
      explanation: 'Ashtown and Stoneybatter are NOT on the route from Cappagh Hospital to Mount Joy Square. The route would typically pass through areas like Finglas, Drumcondra, Cabra, Phibsborough, Glasnevin, or Ballymun.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'From Cappagh Hospital to Mount Joy Square, which areas are on your route?',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Ashtown, Stoneybatter' },
        { id: 'B', text: 'Cabra, Ballymun' },
        { id: 'C', text: 'Glasnevin, Clontarf' },
        { id: 'D', text: 'Finglas, Drumcondra' }
      ],
      correctAnswer: 'D',
      explanation: 'Finglas and Drumcondra are on the route from Cappagh Hospital to Mount Joy Square in Dublin\'s northside.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Mater Misericordiae University Hospital located?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Drumcondra Road' },
        { id: 'B', text: 'Finglas Road' },
        { id: 'C', text: 'Phibsborough Road' },
        { id: 'D', text: 'Eccles Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Mater Misericordiae University Hospital is located on Eccles Street in Dublin\'s northside, one of the city\'s major teaching hospitals.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'From Glasnevin to Airport, which 3rd level institute is on your route?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'TCD (Trinity College Dublin)' },
        { id: 'B', text: 'UCD (University College Dublin)' },
        { id: 'C', text: 'DIT (Dublin Institute of Technology)' },
        { id: 'D', text: 'DCU (Dublin City University)' }
      ],
      correctAnswer: 'D',
      explanation: 'DCU (Dublin City University) is located on Collins Avenue Extension in Glasnevin, making it on the route from Glasnevin to Dublin Airport.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road goes from Finglas to Poppintree?',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'Finglas Road' },
        { id: 'B', text: 'Cappagh Road' },
        { id: 'C', text: 'Nephin Road' },
        { id: 'D', text: 'Jamestown Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Jamestown Road goes from Finglas to Poppintree in Dublin\'s northside.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Mellows Park located?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'Cabra' },
        { id: 'B', text: 'Glasnevin' },
        { id: 'C', text: 'Ballymun' },
        { id: 'D', text: 'Finglas' }
      ],
      correctAnswer: 'D',
      explanation: 'Mellows Park is located in Finglas, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Cabra Garda Station located?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'Navan Road' },
        { id: 'B', text: 'Finglas Road' },
        { id: 'C', text: 'Cabra Road' },
        { id: 'D', text: 'Nephin Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Cabra Garda Station is located on Nephin Road in Cabra, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Kinvara Residential Estate located?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Nephin Road' },
        { id: 'B', text: 'Cabra Road' },
        { id: 'C', text: 'Ashtown Road' },
        { id: 'D', text: 'Navan Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Kinvara Residential Estate is located on Navan Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road goes from Cabra to Blanchardstown?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Cabra Road' },
        { id: 'B', text: 'Ashtown Road' },
        { id: 'C', text: 'Finglas Road' },
        { id: 'D', text: 'Navan Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Navan Road goes from Cabra to Blanchardstown in Dublin\'s northside.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road goes from Cabra to Ashtown?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'Cabra Road' },
        { id: 'B', text: 'Nephin Road' },
        { id: 'C', text: 'Finglas Road' },
        { id: 'D', text: 'Navan Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Navan Road goes from Cabra to Ashtown in Dublin\'s northside.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is National Orthopaedic Hospital (Cappagh Hospital) located?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'Finglas Road' },
        { id: 'B', text: 'Ballymun Road' },
        { id: 'C', text: 'Tolka Valley Road' },
        { id: 'D', text: 'Cappagh Road (Finglas)' }
      ],
      correctAnswer: 'D',
      explanation: 'National Orthopaedic Hospital (Cappagh Hospital) is located on Cappagh Road in Finglas, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Connolly Hospital located?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Finglas' },
        { id: 'B', text: 'Cabra' },
        { id: 'C', text: 'Ballymun' },
        { id: 'D', text: 'Blanchardstown' }
      ],
      correctAnswer: 'D',
      explanation: 'Connolly Hospital is located in Blanchardstown, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Cabra to Finglas West?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'Navan Road' },
        { id: 'B', text: 'Cabra Road' },
        { id: 'C', text: 'Finglas Road' },
        { id: 'D', text: 'Ratoath Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Ratoath Road runs from Cabra to Finglas West in Dublin\'s northside.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs between Cabra to Finglas South?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Navan Road' },
        { id: 'B', text: 'Cabra Road' },
        { id: 'C', text: 'Nephin Road' },
        { id: 'D', text: 'Ratoath Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Ratoath Road runs between Cabra and Finglas South in Dublin\'s northside.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Clarence Hotel located?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'Temple Bar' },
        { id: 'B', text: 'Fleet Street' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'Wellington Quay' }
      ],
      correctAnswer: 'D',
      explanation: 'Clarence Hotel is located on Wellington Quay in Dublin\'s Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is National Museum of Archaeology located?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Dawson Street' },
        { id: 'C', text: 'Nassau Street' },
        { id: 'D', text: 'Kildare Street' }
      ],
      correctAnswer: 'D',
      explanation: 'National Museum of Archaeology is located on Kildare Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Shelbourne Hotel located?',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Grafton Street' },
        { id: 'C', text: 'Dawson Street' },
        { id: 'D', text: 'St. Stephen\'s Green' }
      ],
      correctAnswer: 'D',
      explanation: 'Shelbourne Hotel is located on St. Stephen\'s Green in Dublin, one of the city\'s most prestigious hotels.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which river runs along Botanic Avenue?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'River Liffey' },
        { id: 'B', text: 'River Dodder' },
        { id: 'C', text: 'Royal Canal' },
        { id: 'D', text: 'Tolka River' }
      ],
      correctAnswer: 'D',
      explanation: 'Tolka River runs along Botanic Avenue in Glasnevin, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Home Farm Football Grounds located?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Drumcondra Road' },
        { id: 'B', text: 'Collins Avenue' },
        { id: 'C', text: 'Ballymun Road' },
        { id: 'D', text: 'Swords Road (Whitehall)' }
      ],
      correctAnswer: 'D',
      explanation: 'Home Farm Football Grounds is located on Swords Road in Whitehall, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Skylon Hotel located?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'Collins Avenue' },
        { id: 'B', text: 'Ballymun Road' },
        { id: 'C', text: 'Swords Road' },
        { id: 'D', text: 'Drumcondra Road Upper' }
      ],
      correctAnswer: 'D',
      explanation: 'Skylon Hotel is located on Drumcondra Road Upper in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Highfield located?',
      questionNumber: 21,
      options: [
        { id: 'A', text: 'Drumcondra Road' },
        { id: 'B', text: 'Collins Avenue' },
        { id: 'C', text: 'Ballymun Road' },
        { id: 'D', text: 'Swords Road, Whitehall' }
      ],
      correctAnswer: 'D',
      explanation: 'Highfield is located on Swords Road in Whitehall, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Omni Shopping Centre located?',
      questionNumber: 22,
      options: [
        { id: 'A', text: 'Ballymun Road' },
        { id: 'B', text: 'Collins Avenue' },
        { id: 'C', text: 'Drumcondra Road' },
        { id: 'D', text: 'Swords Road (Santry)' }
      ],
      correctAnswer: 'D',
      explanation: 'Omni Shopping Centre is located on Swords Road in Santry, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Omniplex Cinemas located?',
      questionNumber: 23,
      options: [
        { id: 'A', text: 'Ballymun Road' },
        { id: 'B', text: 'Collins Avenue' },
        { id: 'C', text: 'Drumcondra Road' },
        { id: 'D', text: 'Swords Road (Santry)' }
      ],
      correctAnswer: 'D',
      explanation: 'Omniplex Cinemas is located on Swords Road in Santry, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Morton Stadium located?',
      questionNumber: 24,
      options: [
        { id: 'A', text: 'Ballymun Road' },
        { id: 'B', text: 'Collins Avenue' },
        { id: 'C', text: 'Drumcondra Road' },
        { id: 'D', text: 'Swords Road Santry' }
      ],
      correctAnswer: 'D',
      explanation: 'Morton Stadium is located on Swords Road in Santry, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Swords Castle located?',
      questionNumber: 25,
      options: [
        { id: 'A', text: 'Malahide Road' },
        { id: 'B', text: 'Swords Road' },
        { id: 'C', text: 'Dublin Road' },
        { id: 'D', text: 'Bridge Street (Main Street Swords)' }
      ],
      correctAnswer: 'D',
      explanation: 'Swords Castle is located on Bridge Street (Main Street) in Swords, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road is adjoining North Circular Road?',
      questionNumber: 26,
      options: [
        { id: 'A', text: 'Dorset Street' },
        { id: 'B', text: 'Phibsborough Road' },
        { id: 'C', text: 'Manor Street' },
        { id: 'D', text: 'Russell Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Russell Street is adjoining North Circular Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Richmond Road located?',
      questionNumber: 27,
      options: [
        { id: 'A', text: 'Drumcondra' },
        { id: 'B', text: 'Ballymun' },
        { id: 'C', text: 'Glasnevin' },
        { id: 'D', text: 'Fairview' }
      ],
      correctAnswer: 'D',
      explanation: 'Richmond Road is located in Fairview, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which area is NOT adjoining Ballymun?',
      questionNumber: 28,
      options: [
        { id: 'A', text: 'Santry' },
        { id: 'B', text: 'Glasnevin' },
        { id: 'C', text: 'Finglas' },
        { id: 'D', text: 'Drumcondra' }
      ],
      correctAnswer: 'D',
      explanation: 'Drumcondra is NOT adjoining Ballymun. Ballymun is adjacent to Santry, Glasnevin, and Finglas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Lorgan Apartments located?',
      questionNumber: 29,
      options: [
        { id: 'A', text: 'Ballymun' },
        { id: 'B', text: 'Drumcondra' },
        { id: 'C', text: 'Glasnevin' },
        { id: 'D', text: 'Santry' }
      ],
      correctAnswer: 'D',
      explanation: 'Lorgan Apartments is located in Santry, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is DCU (Dublin City University) located?',
      questionNumber: 30,
      options: [
        { id: 'A', text: 'Ballymun Road' },
        { id: 'B', text: 'Drumcondra Road' },
        { id: 'C', text: 'Swords Road' },
        { id: 'D', text: 'Collins Avenue Extension, Glasnevin' }
      ],
      correctAnswer: 'D',
      explanation: 'DCU (Dublin City University) is located on Collins Avenue Extension in Glasnevin, Dublin.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Helix Theatre located?',
      questionNumber: 31,
      options: [
        { id: 'A', text: 'Trinity College' },
        { id: 'B', text: 'DCU' },
        { id: 'C', text: 'DIT' },
        { id: 'D', text: 'UCD' }
      ],
      correctAnswer: 'B',
      explanation: 'Helix Theatre is located at DCU (Dublin City University) on Collins Avenue Extension in Glasnevin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Metro Hotel located?',
      questionNumber: 32,
      options: [
        { id: 'A', text: 'Collins Avenue' },
        { id: 'B', text: 'Ballymun Road' },
        { id: 'C', text: 'Swords Road' },
        { id: 'D', text: 'Drumcondra Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Metro Hotel is located on Ballymun Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What areas are on your route from Santry to Sutton?',
      questionNumber: 33,
      options: [
        { id: 'A', text: 'Drumcondra, Clontarf' },
        { id: 'B', text: 'Glasnevin, Raheny' },
        { id: 'C', text: 'Finglas, Coolock' },
        { id: 'D', text: 'Donaghmede, Baldoyle' }
      ],
      correctAnswer: 'D',
      explanation: 'Donaghmede and Baldoyle are on the route from Santry to Sutton in Dublin\'s northside.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Glasnevin to Ballymun?',
      questionNumber: 34,
      options: [
        { id: 'A', text: 'Collins Avenue' },
        { id: 'B', text: 'Drumcondra Road' },
        { id: 'C', text: 'Finglas Road' },
        { id: 'D', text: 'Ballymun Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Ballymun Road runs from Glasnevin to Ballymun in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road connects Botanic Road and Drumcondra Road?',
      questionNumber: 35,
      options: [
        { id: 'A', text: 'Griffith Avenue' },
        { id: 'B', text: 'Collins Avenue' },
        { id: 'C', text: 'Drumcondra Road Upper' },
        { id: 'D', text: 'Botanic Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Botanic Avenue connects Botanic Road and Drumcondra Road in Glasnevin, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road goes from Glasnevin to Finglas?',
      questionNumber: 36,
      options: [
        { id: 'A', text: 'Ballymun Road' },
        { id: 'B', text: 'Ratoath Road' },
        { id: 'C', text: 'Cabra Road' },
        { id: 'D', text: 'Finglas Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Finglas Road goes from Glasnevin to Finglas in Dublin\'s northside.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Met Éireann office located?',
      questionNumber: 37,
      options: [
        { id: 'A', text: 'Ballymun' },
        { id: 'B', text: 'Drumcondra' },
        { id: 'C', text: 'Santry' },
        { id: 'D', text: 'Glasnevin Hill' }
      ],
      correctAnswer: 'D',
      explanation: 'Met Éireann office is located on Glasnevin Hill in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Glasnevin Cemetery located?',
      questionNumber: 38,
      options: [
        { id: 'A', text: 'Ballymun Road' },
        { id: 'B', text: 'Drumcondra Road' },
        { id: 'C', text: 'Cabra Road' },
        { id: 'D', text: 'Finglas Road, Glasnevin' }
      ],
      correctAnswer: 'D',
      explanation: 'Glasnevin Cemetery is located on Finglas Road in Glasnevin, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Glasnevin Visitor Museum located?',
      questionNumber: 39,
      options: [
        { id: 'A', text: 'Ballymun Road' },
        { id: 'B', text: 'Drumcondra Road' },
        { id: 'C', text: 'Cabra Road' },
        { id: 'D', text: 'Finglas Road, Glasnevin' }
      ],
      correctAnswer: 'D',
      explanation: 'Glasnevin Visitor Museum is located on Finglas Road in Glasnevin, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Casino Model Railway Museum (Malahide Castle) located?',
      questionNumber: 40,
      options: [
        { id: 'A', text: 'Malahide Road' },
        { id: 'B', text: 'Swords Road' },
        { id: 'C', text: 'Coast Road' },
        { id: 'D', text: 'Dublin Road, Malahide' }
      ],
      correctAnswer: 'D',
      explanation: 'Casino Model Railway Museum is located at Malahide Castle on Dublin Road in Malahide, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Malahide Cricket Stadium located?',
      questionNumber: 41,
      options: [
        { id: 'A', text: 'Malahide Road' },
        { id: 'B', text: 'Coast Road' },
        { id: 'C', text: 'Kinsealy Road' },
        { id: 'D', text: 'Dublin Road, Malahide' }
      ],
      correctAnswer: 'D',
      explanation: 'Malahide Cricket Stadium is located on Dublin Road in Malahide, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Yellow Walls Road located?',
      questionNumber: 42,
      options: [
        { id: 'A', text: 'Portmarnock' },
        { id: 'B', text: 'Swords' },
        { id: 'C', text: 'Kinsealy' },
        { id: 'D', text: 'Malahide' }
      ],
      correctAnswer: 'D',
      explanation: 'Yellow Walls Road is located in Malahide, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What road runs from Glasnevin to Marino?',
      questionNumber: 43,
      options: [
        { id: 'A', text: 'Collins Avenue' },
        { id: 'B', text: 'Drumcondra Road' },
        { id: 'C', text: 'Ballymun Road' },
        { id: 'D', text: 'Griffith Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Griffith Avenue runs from Glasnevin to Marino in Dublin\'s northside.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Donnycarney to Whitehall?',
      questionNumber: 44,
      options: [
        { id: 'A', text: 'Griffith Avenue' },
        { id: 'B', text: 'Drumcondra Road' },
        { id: 'C', text: 'Swords Road' },
        { id: 'D', text: 'Collins Avenue West' }
      ],
      correctAnswer: 'D',
      explanation: 'Collins Avenue West runs from Donnycarney to Whitehall in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Whitehall to Swords?',
      questionNumber: 45,
      options: [
        { id: 'A', text: 'Collins Avenue' },
        { id: 'B', text: 'Ballymun Road' },
        { id: 'C', text: 'Malahide Road' },
        { id: 'D', text: 'Swords Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Swords Road runs from Whitehall to Swords in Dublin\'s northside.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Swords to Airport?',
      questionNumber: 46,
      options: [
        { id: 'A', text: 'Malahide Road' },
        { id: 'B', text: 'Swords Road' },
        { id: 'C', text: 'Dublin Road' },
        { id: 'D', text: 'Airport Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Swords Road runs from Swords to Dublin Airport.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Swords to Malahide?',
      questionNumber: 47,
      options: [
        { id: 'A', text: 'Dublin Road' },
        { id: 'B', text: 'Coast Road' },
        { id: 'C', text: 'Swords Road' },
        { id: 'D', text: 'Malahide Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Dublin Road runs from Swords to Malahide in County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Malahide to Portmarnock?',
      questionNumber: 48,
      options: [
        { id: 'A', text: 'Dublin Road' },
        { id: 'B', text: 'Coast Road' },
        { id: 'C', text: 'Malahide Road' },
        { id: 'D', text: 'Strand Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Coast Road runs from Malahide to Portmarnock along the coast of County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Portmarnock to Howth?',
      questionNumber: 49,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Malahide Road' },
        { id: 'D', text: 'Dublin Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Coast Road runs from Portmarnock to Howth along the coast of County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Howth to Sutton?',
      questionNumber: 50,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Sutton Road' },
        { id: 'D', text: 'Thormanby Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Howth Road runs from Howth to Sutton in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Sutton to Clontarf?',
      questionNumber: 51,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Coast Road' },
        { id: 'C', text: 'Clontarf Road' },
        { id: 'D', text: 'Sutton Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Clontarf Road runs from Sutton to Clontarf in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Clontarf to Fairview?',
      questionNumber: 52,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Fairview Strand' },
        { id: 'D', text: 'Clontarf Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Clontarf Road runs from Clontarf to Fairview in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Fairview to City Centre?',
      questionNumber: 53,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Fairview Strand' },
        { id: 'D', text: 'North Strand Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Fairview Strand runs from Fairview to the city center in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Marino to Clontarf?',
      questionNumber: 54,
      options: [
        { id: 'A', text: 'Griffith Avenue' },
        { id: 'B', text: 'Collins Avenue' },
        { id: 'C', text: 'Malahide Road' },
        { id: 'D', text: 'Howth Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Griffith Avenue runs from Marino to Clontarf in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Drumcondra to Fairview?',
      questionNumber: 55,
      options: [
        { id: 'A', text: 'Griffith Avenue' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Drumcondra Road' },
        { id: 'D', text: 'Ballybough Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Malahide Road runs from Drumcondra to Fairview in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Phibsborough to Finglas?',
      questionNumber: 56,
      options: [
        { id: 'A', text: 'Finglas Road' },
        { id: 'B', text: 'Cabra Road' },
        { id: 'C', text: 'Phibsborough Road' },
        { id: 'D', text: 'Navan Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Finglas Road runs from Phibsborough to Finglas in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Phibsborough to Cabra?',
      questionNumber: 57,
      options: [
        { id: 'A', text: 'Finglas Road' },
        { id: 'B', text: 'Cabra Road' },
        { id: 'C', text: 'Phibsborough Road' },
        { id: 'D', text: 'Navan Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Cabra Road runs from Phibsborough to Cabra in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Cabra to Ashtown?',
      questionNumber: 58,
      options: [
        { id: 'A', text: 'Cabra Road' },
        { id: 'B', text: 'Nephin Road' },
        { id: 'C', text: 'Finglas Road' },
        { id: 'D', text: 'Navan Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Navan Road runs from Cabra to Ashtown in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Ashtown to Phoenix Park?',
      questionNumber: 59,
      options: [
        { id: 'A', text: 'Navan Road' },
        { id: 'B', text: 'Ashtown Road' },
        { id: 'C', text: 'Phoenix Park Road' },
        { id: 'D', text: 'Chesterfield Avenue' }
      ],
      correctAnswer: 'A',
      explanation: 'Navan Road runs from Ashtown to Phoenix Park in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Phoenix Park to City Centre?',
      questionNumber: 60,
      options: [
        { id: 'A', text: 'Parkgate Street' },
        { id: 'B', text: 'Conyngham Road' },
        { id: 'C', text: 'Chesterfield Avenue' },
        { id: 'D', text: 'North Circular Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Parkgate Street runs from Phoenix Park to the city center in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from City Centre to Phibsborough?',
      questionNumber: 61,
      options: [
        { id: 'A', text: 'Phibsborough Road' },
        { id: 'B', text: 'North Circular Road' },
        { id: 'C', text: 'Dorset Street' },
        { id: 'D', text: 'Cabra Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Phibsborough Road runs from the city center to Phibsborough in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Phibsborough to Glasnevin?',
      questionNumber: 62,
      options: [
        { id: 'A', text: 'Finglas Road' },
        { id: 'B', text: 'Cabra Road' },
        { id: 'C', text: 'Phibsborough Road' },
        { id: 'D', text: 'Botanic Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Botanic Road runs from Phibsborough to Glasnevin in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Glasnevin to Ballymun?',
      questionNumber: 63,
      options: [
        { id: 'A', text: 'Collins Avenue' },
        { id: 'B', text: 'Drumcondra Road' },
        { id: 'C', text: 'Finglas Road' },
        { id: 'D', text: 'Ballymun Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Ballymun Road runs from Glasnevin to Ballymun in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Ballymun to Santry?',
      questionNumber: 64,
      options: [
        { id: 'A', text: 'Ballymun Road' },
        { id: 'B', text: 'Swords Road' },
        { id: 'C', text: 'Collins Avenue' },
        { id: 'D', text: 'Santry Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Swords Road runs from Ballymun to Santry in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Santry to Airport?',
      questionNumber: 65,
      options: [
        { id: 'A', text: 'Swords Road' },
        { id: 'B', text: 'Airport Road' },
        { id: 'C', text: 'Santry Road' },
        { id: 'D', text: 'M1' }
      ],
      correctAnswer: 'A',
      explanation: 'Swords Road runs from Santry to Dublin Airport.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Airport to Swords?',
      questionNumber: 66,
      options: [
        { id: 'A', text: 'Swords Road' },
        { id: 'B', text: 'Airport Road' },
        { id: 'C', text: 'M1' },
        { id: 'D', text: 'N1' }
      ],
      correctAnswer: 'A',
      explanation: 'Swords Road runs from Dublin Airport to Swords.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Swords to Malahide?',
      questionNumber: 67,
      options: [
        { id: 'A', text: 'Dublin Road' },
        { id: 'B', text: 'Coast Road' },
        { id: 'C', text: 'Swords Road' },
        { id: 'D', text: 'Malahide Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Dublin Road runs from Swords to Malahide in County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Malahide to Portmarnock?',
      questionNumber: 68,
      options: [
        { id: 'A', text: 'Dublin Road' },
        { id: 'B', text: 'Coast Road' },
        { id: 'C', text: 'Malahide Road' },
        { id: 'D', text: 'Strand Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Coast Road runs from Malahide to Portmarnock along the coast of County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Portmarnock to Howth?',
      questionNumber: 69,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Malahide Road' },
        { id: 'D', text: 'Dublin Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Coast Road runs from Portmarnock to Howth along the coast of County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Howth to Sutton?',
      questionNumber: 70,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Sutton Road' },
        { id: 'D', text: 'Thormanby Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Howth Road runs from Howth to Sutton in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Donnycarney to Killester?',
      questionNumber: 71,
      options: [
        { id: 'A', text: 'Griffith Avenue' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Howth Road' },
        { id: 'D', text: 'Collins Avenue East' }
      ],
      correctAnswer: 'D',
      explanation: 'Collins Avenue East runs from Donnycarney to Killester in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road goes from Coolock to Kilmore?',
      questionNumber: 72,
      options: [
        { id: 'A', text: 'Malahide Road' },
        { id: 'B', text: 'Collins Avenue' },
        { id: 'C', text: 'Tonlegee Road' },
        { id: 'D', text: 'Oscar Trynor Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Oscar Trynor Road goes from Coolock to Kilmore in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which roads are adjoining Malahide Road?',
      questionNumber: 73,
      options: [
        { id: 'A', text: 'Collins Avenue, Swords Road' },
        { id: 'B', text: 'Howth Road, Coast Road' },
        { id: 'C', text: 'Dublin Road, Station Road' },
        { id: 'D', text: 'Griffith Avenue, Kilmore Road, Tonlegee Road, Oscar Trynor Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Griffith Avenue, Kilmore Road, Tonlegee Road, and Oscar Trynor Road are all adjoining Malahide Road in Dublin.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Where is Grand Hotel located?',
      questionNumber: 74,
      options: [
        { id: 'A', text: 'Portmarnock' },
        { id: 'B', text: 'Howth' },
        { id: 'C', text: 'Sutton' },
        { id: 'D', text: 'Malahide' }
      ],
      correctAnswer: 'D',
      explanation: 'Grand Hotel is located in Malahide, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Hilton Airport Hotel located?',
      questionNumber: 75,
      options: [
        { id: 'A', text: 'Dublin Airport' },
        { id: 'B', text: 'Swords' },
        { id: 'C', text: 'Santry' },
        { id: 'D', text: 'Norteman Cross' }
      ],
      correctAnswer: 'D',
      explanation: 'Hilton Airport Hotel is located at Norteman Cross in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'From North Bull Island to Portmarnock, which areas are NOT on your route?',
      questionNumber: 76,
      options: [
        { id: 'A', text: 'Raheny, Baldoyle' },
        { id: 'B', text: 'Sutton, Howth' },
        { id: 'C', text: 'Clontarf, Killester' },
        { id: 'D', text: 'Coolock, Clarehall' }
      ],
      correctAnswer: 'D',
      explanation: 'Coolock and Clarehall are NOT on the route from North Bull Island to Portmarnock. The route would typically pass through coastal areas like Raheny, Baldoyle, Sutton, Howth, Clontarf, or Killester.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is St. Francis Hospice located?',
      questionNumber: 77,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Coast Road' },
        { id: 'C', text: 'Malahide Road' },
        { id: 'D', text: 'Station Road, Raheny' }
      ],
      correctAnswer: 'D',
      explanation: 'St. Francis Hospice is located on Station Road in Raheny, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Central Remedial Clinic located?',
      questionNumber: 78,
      options: [
        { id: 'A', text: 'Clontarf Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Malahide Road' },
        { id: 'D', text: 'Vernon Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Central Remedial Clinic is located on Vernon Avenue in Clontarf, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road leads to North Bull Island?',
      questionNumber: 79,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Clontarf Road' },
        { id: 'D', text: 'Causeway Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Causeway Road leads to North Bull Island in Dublin Bay.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is St. Anne\'s Golf Club located?',
      questionNumber: 80,
      options: [
        { id: 'A', text: 'Howth' },
        { id: 'B', text: 'Portmarnock' },
        { id: 'C', text: 'Malahide' },
        { id: 'D', text: 'North Bull Island' }
      ],
      correctAnswer: 'D',
      explanation: 'St. Anne\'s Golf Club is located on North Bull Island in Dublin Bay.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Royal Dublin Golf Club located?',
      questionNumber: 81,
      options: [
        { id: 'A', text: 'Howth' },
        { id: 'B', text: 'Portmarnock' },
        { id: 'C', text: 'Malahide' },
        { id: 'D', text: 'North Bull Island' }
      ],
      correctAnswer: 'D',
      explanation: 'Royal Dublin Golf Club is located on North Bull Island in Dublin Bay.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Nature Reserve located?',
      questionNumber: 82,
      options: [
        { id: 'A', text: 'Howth' },
        { id: 'B', text: 'Portmarnock' },
        { id: 'C', text: 'Bull Island' },
        { id: 'D', text: 'North Bull Island' }
      ],
      correctAnswer: 'D',
      explanation: 'Nature Reserve is located on North Bull Island in Dublin Bay.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is St. Anne\'s Park located?',
      questionNumber: 83,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Coast Road' },
        { id: 'C', text: 'Clontarf Road' },
        { id: 'D', text: 'Mount Prospect Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'St. Anne\'s Park is located on Mount Prospect Avenue in Raheny, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the nearest DART Station to Casino Marino?',
      questionNumber: 84,
      options: [
        { id: 'A', text: 'Killester' },
        { id: 'B', text: 'Raheny' },
        { id: 'C', text: 'Harmonstown' },
        { id: 'D', text: 'Clontarf' }
      ],
      correctAnswer: 'D',
      explanation: 'Clontarf DART Station is the nearest to Casino Marino in Marino, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Howth DART Station located?',
      questionNumber: 85,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Harbour Road' },
        { id: 'C', text: 'Abbey Street' },
        { id: 'D', text: 'Howth Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Howth DART Station is located on Howth Road in Howth, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Marine Hotel located?',
      questionNumber: 86,
      options: [
        { id: 'A', text: 'Howth' },
        { id: 'B', text: 'Portmarnock' },
        { id: 'C', text: 'Malahide' },
        { id: 'D', text: 'Sutton' }
      ],
      correctAnswer: 'D',
      explanation: 'Marine Hotel is located in Sutton, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Howth Summit located?',
      questionNumber: 87,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Coast Road' },
        { id: 'C', text: 'Balscadden Road' },
        { id: 'D', text: 'Thormanby Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Howth Summit is located on Thormanby Road in Howth, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is National Transport Museum located?',
      questionNumber: 88,
      options: [
        { id: 'A', text: 'Dublin City' },
        { id: 'B', text: 'Malahide' },
        { id: 'C', text: 'Swords' },
        { id: 'D', text: 'Deerpark, Howth' }
      ],
      correctAnswer: 'D',
      explanation: 'National Transport Museum is located in Deerpark, Howth, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Howth Golf Club located?',
      questionNumber: 89,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Thormanby Road' },
        { id: 'D', text: 'Carrickbarrack Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Howth Golf Club is located on Carrickbarrack Road in Howth, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Portmarnock DART Station located?',
      questionNumber: 90,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Strand Road' },
        { id: 'C', text: 'Carrickhill Road' },
        { id: 'D', text: 'Station Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Portmarnock DART Station is located on Station Road in Portmarnock, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Whitesand Hotel located?',
      questionNumber: 91,
      options: [
        { id: 'A', text: 'Strand Road' },
        { id: 'B', text: 'Station Road' },
        { id: 'C', text: 'Portmarnock Road' },
        { id: 'D', text: 'Coast Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Whitesand Hotel is located on Coast Road in Portmarnock, County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Baldoyle to Portmarnock?',
      questionNumber: 92,
      options: [
        { id: 'A', text: 'Malahide Road' },
        { id: 'B', text: 'Dublin Road' },
        { id: 'C', text: 'Grange Road' },
        { id: 'D', text: 'Coast Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Coast Road runs from Baldoyle to Portmarnock along the coast of County Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Baldoyle to Donaghmede?',
      questionNumber: 93,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Collins Avenue' },
        { id: 'D', text: 'Grange Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Grange Road runs from Baldoyle to Donaghmede in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Killbarrack to Donaghmede?',
      questionNumber: 94,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Collins Avenue' },
        { id: 'D', text: 'Grange Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Grange Road runs from Killbarrack to Donaghmede in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Raheny to Edenmore?',
      questionNumber: 95,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Station Road' },
        { id: 'D', text: 'Springdale Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Springdale Road runs from Raheny to Edenmore in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'From Howth Summit to Portmarnock, what road is NOT on your route?',
      questionNumber: 96,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Sutton Road' },
        { id: 'D', text: 'Warrenhouse Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Warrenhouse Road is NOT on the route from Howth Summit to Portmarnock. The route would typically follow Coast Road, Howth Road, and Sutton Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'From Sutton to Phoenix Park, what areas are on your route?',
      questionNumber: 97,
      options: [
        { id: 'A', text: 'Howth, Raheny, Drumcondra' },
        { id: 'B', text: 'Malahide, Coolock, Finglas' },
        { id: 'C', text: 'Clontarf, Marino, Cabra' },
        { id: 'D', text: 'Killbarrack, Artane, Glasnevin' }
      ],
      correctAnswer: 'D',
      explanation: 'Killbarrack, Artane, and Glasnevin are on the route from Sutton to Phoenix Park in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What three routes are adjoining Fairview Strand?',
      questionNumber: 98,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Collins Avenue' },
        { id: 'C', text: 'Griffith Avenue' },
        { id: 'D', text: 'Malahide Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Malahide Road is one of the routes adjoining Fairview Strand in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road goes from Fairview to Dollymount?',
      questionNumber: 99,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Coast Road' },
        { id: 'D', text: 'Clontarf Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Clontarf Road goes from Fairview to Dollymount in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road goes from Dollymount to Clontarf?',
      questionNumber: 100,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Castle Avenue' },
        { id: 'C', text: 'Vernon Avenue' },
        { id: 'D', text: 'Clontarf Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Clontarf Road goes from Dollymount to Clontarf in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which roads are adjoining Clontarf Road?',
      questionNumber: 101,
      options: [
        { id: 'A', text: 'Howth Road, Malahide Road' },
        { id: 'B', text: 'Griffith Avenue, Collins Avenue' },
        { id: 'C', text: 'Fairview Strand, East Wall' },
        { id: 'D', text: 'Castle Avenue, Vernon Avenue, James Larking Road, Seafield Road East' }
      ],
      correctAnswer: 'D',
      explanation: 'Castle Avenue, Vernon Avenue, James Larking Road, and Seafield Road East are all adjoining Clontarf Road in Dublin.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which roads are adjoining James Larking Road?',
      questionNumber: 102,
      options: [
        { id: 'A', text: 'Castle Avenue, Vernon Avenue' },
        { id: 'B', text: 'Malahide Road, Coast Road' },
        { id: 'C', text: 'Griffith Avenue, Collins Avenue' },
        { id: 'D', text: 'Watermill Road, Causeway Road, Howth Road, Clontarf Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Watermill Road, Causeway Road, Howth Road, and Clontarf Road are all adjoining James Larking Road in Dublin.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which road goes from Sutton to Killbarrack?',
      questionNumber: 103,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Station Road' },
        { id: 'D', text: 'Dublin Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Dublin Road goes from Sutton to Killbarrack in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which roads are adjoining Killbarrack Road?',
      questionNumber: 104,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Dublin Road' },
        { id: 'D', text: 'Howth Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Howth Road is adjoining Killbarrack Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What route goes from Sutton to Phoenix Park?',
      questionNumber: 105,
      options: [
        { id: 'A', text: 'M1' },
        { id: 'B', text: 'M50' },
        { id: 'C', text: 'N3' },
        { id: 'D', text: 'R105' }
      ],
      correctAnswer: 'D',
      explanation: 'R105 is the route that goes from Sutton to Phoenix Park in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Westwood Health & Leisure Centre located?',
      questionNumber: 106,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Vernon Avenue' },
        { id: 'D', text: 'Clontarf Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Westwood Health & Leisure Centre is located on Clontarf Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Clontarf Cricket Club located?',
      questionNumber: 107,
      options: [
        { id: 'A', text: 'Clontarf Road' },
        { id: 'B', text: 'Vernon Avenue' },
        { id: 'C', text: 'Howth Road' },
        { id: 'D', text: 'Castle Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Clontarf Cricket Club is located on Castle Avenue in Clontarf, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Clontarf Rugby Club located?',
      questionNumber: 108,
      options: [
        { id: 'A', text: 'Clontarf Road' },
        { id: 'B', text: 'Vernon Avenue' },
        { id: 'C', text: 'Howth Road' },
        { id: 'D', text: 'Castle Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Clontarf Rugby Club is located on Castle Avenue in Clontarf, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Blaze Disco located?',
      questionNumber: 109,
      options: [
        { id: 'A', text: 'Castle Avenue' },
        { id: 'B', text: 'Vernon Avenue' },
        { id: 'C', text: 'Fairview' },
        { id: 'D', text: 'Clontarf Rugby Club' }
      ],
      correctAnswer: 'D',
      explanation: 'Blaze Disco is located at Clontarf Rugby Club in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road runs from Clontarf to Killester?',
      questionNumber: 110,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Collins Avenue' },
        { id: 'D', text: 'Castle Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Castle Avenue runs from Clontarf to Killester in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Clontarf Hospital located?',
      questionNumber: 111,
      options: [
        { id: 'A', text: 'Castle Avenue' },
        { id: 'B', text: 'Vernon Avenue' },
        { id: 'C', text: 'Howth Road' },
        { id: 'D', text: 'Blackheath Park' }
      ],
      correctAnswer: 'D',
      explanation: 'Clontarf Hospital is located on Blackheath Park in Clontarf, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What areas are on your route from North Bull Island to Portmarnock?',
      questionNumber: 112,
      options: [
        { id: 'A', text: 'Howth, Malahide, Swords' },
        { id: 'B', text: 'Clontarf, Raheny, Coolock' },
        { id: 'C', text: 'Fairview, Marino, Drumcondra' },
        { id: 'D', text: 'Killbarrack, Sutton, Baldoyle' }
      ],
      correctAnswer: 'D',
      explanation: 'Killbarrack, Sutton, and Baldoyle are on the route from North Bull Island to Portmarnock along the coast of Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What road will NOT be on your route from Parnell Street to North Bull Island?',
      questionNumber: 113,
      options: [
        { id: 'A', text: 'Clontarf Road' },
        { id: 'B', text: 'Fairview Strand' },
        { id: 'C', text: 'East Wall Road' },
        { id: 'D', text: 'Howth Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Howth Road will NOT be on the route from Parnell Street to North Bull Island. The route would typically follow Fairview Strand, Clontarf Road, or East Wall Road, but not Howth Road.',
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

  console.log(`✅ Created ${questions.length} questions for Northside Routes chapter`)
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
