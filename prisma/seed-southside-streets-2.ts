import { PrismaClient, QuestionCategory } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Southside Streets 2 chapter...')

  // Create chapter
  const chapter = await prisma.chapter.upsert({
    where: { id: 'chapter_southside_streets_2' },
    update: {},
    create: {
      id: 'chapter_southside_streets_2',
      title: 'Southside Streets 2',
      description: 'Test your knowledge of landmarks, locations, and one-way streets in Dublin\'s Southside area',
      chapterNumber: 3,
      type: 'MCQ',
      duration: 45,
      isActive: true,
      category: QuestionCategory.AREA_KNOWLEDGE
    }
  })

  console.log('✅ Chapter created:', chapter.title)

  // Define all 87 questions
  const questions = [
    {
      questionText: 'Where is Harding Hotel located?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'Fleet Street' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'Exchange Street Upper' },
        { id: 'D', text: 'Fishamble Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Harding Hotel is located on Fishamble Street in Dublin\'s Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street adjoins Lord Edward Street?',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'Fishamble Street' },
        { id: 'C', text: 'Wellington Quay' },
        { id: 'D', text: 'Exchange Street Upper' }
      ],
      correctAnswer: 'D',
      explanation: 'Exchange Street Upper adjoins Lord Edward Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Dublin Castle located?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Exchange Street Lower' },
        { id: 'B', text: 'Fishamble Street' },
        { id: 'C', text: 'Parliament Street' },
        { id: 'D', text: 'Dame Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Dublin Castle is located on Dame Street, one of Dublin\'s most historic landmarks in the city center.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Smoke Alley Theatre located?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'Exchange Street Upper' },
        { id: 'C', text: 'Fishamble Street' },
        { id: 'D', text: 'Exchange Street Lower' }
      ],
      correctAnswer: 'D',
      explanation: 'Smoke Alley Theatre is located on Exchange Street Lower in Dublin\'s Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Isoldes Tower located?',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'Exchange Street Upper' },
        { id: 'C', text: 'Fishamble Street' },
        { id: 'D', text: 'Exchange Street Lower' }
      ],
      correctAnswer: 'D',
      explanation: 'Isoldes Tower is located on Exchange Street Lower in Dublin\'s Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Town Hall located?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'Exchange Street Upper' },
        { id: 'B', text: 'Parliament Street' },
        { id: 'C', text: 'Wellington Quay' },
        { id: 'D', text: 'Dame Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Town Hall is located on Dame Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is City Hall located?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'Exchange Street Upper' },
        { id: 'B', text: 'Parliament Street' },
        { id: 'C', text: 'Lord Edward Street' },
        { id: 'D', text: 'Dame Street' }
      ],
      correctAnswer: 'D',
      explanation: 'City Hall is located on Dame Street, adjacent to Dublin Castle in the city center.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Parliament Hotel located?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'Parliament Street' },
        { id: 'C', text: 'Wellington Quay' },
        { id: 'D', text: 'Exchange Street Upper' }
      ],
      correctAnswer: 'D',
      explanation: 'Parliament Hotel is located on Exchange Street Upper in Dublin\'s Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Dame Street to East Essex Street?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Dame Street (One Way)' },
        { id: 'B', text: 'East Essex Street (One Way)' },
        { id: 'C', text: 'Parliament Street (One Way)' },
        { id: 'D', text: 'Sycamore Street (One Way)' }
      ],
      correctAnswer: 'D',
      explanation: 'Sycamore Street is a one-way street that runs from Dame Street to East Essex Street, connecting the main thoroughfare to the Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Dame Street to Wellington Quay?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'Dame Street (One Way)' },
        { id: 'B', text: 'Wellington Quay (One Way)' },
        { id: 'C', text: 'Sycamore Street (One Way)' },
        { id: 'D', text: 'Eustace Street (One Way)' }
      ],
      correctAnswer: 'D',
      explanation: 'Eustace Street is a one-way street that runs from Dame Street to Wellington Quay, connecting the main thoroughfare to the quays along the River Liffey.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Irish Film Institute located?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'Wellington Quay' },
        { id: 'C', text: 'Temple Bar' },
        { id: 'D', text: 'Eustace Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Irish Film Institute is located on Eustace Street in Dublin\'s Temple Bar cultural quarter.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Ark Theatre located?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'Wellington Quay' },
        { id: 'C', text: 'Temple Bar' },
        { id: 'D', text: 'Eustace Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Ark Theatre is located on Eustace Street in Dublin\'s Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Stock Exchange located?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'College Green' },
        { id: 'C', text: 'Westmoreland Street' },
        { id: 'D', text: 'Anglesea Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Stock Exchange is located on Anglesea Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Wax Museum located?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'College Green' },
        { id: 'C', text: 'Anglesea Street' },
        { id: 'D', text: 'Westmoreland Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Wax Museum is located on Westmoreland Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Trinity College Entrance located?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'Westmoreland Street' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'Trinity Street' },
        { id: 'D', text: 'College Green' }
      ],
      correctAnswer: 'D',
      explanation: 'Trinity College Entrance is located on College Green, one of Dublin\'s most prestigious addresses.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Banker\'s Bar located?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'College Green' },
        { id: 'B', text: 'Westmoreland Street' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'Trinity Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Banker\'s Bar is located on Trinity Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Westin Hotel located?',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'College Green' },
        { id: 'B', text: 'Trinity Street' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'Westmoreland Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Westin Hotel is located on Westmoreland Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from College Green to Aston Quay?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'College Green (One Way)' },
        { id: 'B', text: 'Aston Quay (One Way)' },
        { id: 'C', text: 'Trinity Street (One Way)' },
        { id: 'D', text: 'Westmoreland Street (One Way)' }
      ],
      correctAnswer: 'D',
      explanation: 'Westmoreland Street is a major one-way street that runs from College Green to Aston Quay, connecting the city center to the quays along the River Liffey.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Dublin Castle - Chester Beatty Library located?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Trinity College' },
        { id: 'B', text: 'National Gallery' },
        { id: 'C', text: 'Irish Museum of Modern Art' },
        { id: 'D', text: 'Dublin Castle - Chester Beatty Library' }
      ],
      correctAnswer: 'D',
      explanation: 'Dublin Castle - Chester Beatty Library is located within Dublin Castle on Dame Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Morgan Hotel located?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'Temple Bar' },
        { id: 'C', text: 'Westmoreland Street' },
        { id: 'D', text: 'Fleet Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Morgan Hotel is located on Fleet Street in Dublin\'s Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Project Art Centre located?',
      questionNumber: 21,
      options: [
        { id: 'A', text: 'West Essex Street' },
        { id: 'B', text: 'Temple Bar' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'East Essex Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Project Art Centre is located on East Essex Street in Dublin\'s Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Gaiety School of Acting located?',
      questionNumber: 22,
      options: [
        { id: 'A', text: 'East Essex Street' },
        { id: 'B', text: 'Temple Bar' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'West Essex Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Gaiety School of Acting is located on West Essex Street in Dublin\'s Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street adjoins Dame Street?',
      questionNumber: 23,
      options: [
        { id: 'A', text: 'Parliament Street' },
        { id: 'B', text: 'Exchange Street' },
        { id: 'C', text: 'Temple Bar' },
        { id: 'D', text: 'Sycamore Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Sycamore Street adjoins Dame Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street does NOT adjoin Dame Street?',
      questionNumber: 24,
      options: [
        { id: 'A', text: 'Sycamore Street' },
        { id: 'B', text: 'Parliament Street' },
        { id: 'C', text: 'Exchange Street' },
        { id: 'D', text: 'Aungier Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Aungier Street does not adjoin Dame Street. It is located further south in the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Dublin Business School located?',
      questionNumber: 25,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'Temple Bar' },
        { id: 'C', text: 'College Green' },
        { id: 'D', text: 'Aungier Street, South Great George\'s Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Dublin Business School is located on Aungier Street, South Great George\'s Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is O\'Shea Merchant\'s Club located?',
      questionNumber: 26,
      options: [
        { id: 'A', text: 'Wellington Quay' },
        { id: 'B', text: 'Aston Quay' },
        { id: 'C', text: 'Ormond Quay' },
        { id: 'D', text: 'Merchant Quay' }
      ],
      correctAnswer: 'D',
      explanation: 'O\'Shea Merchant\'s Club is located on Merchant Quay in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Royal College of Surgeons located?',
      questionNumber: 27,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Trinity College' },
        { id: 'C', text: 'College Green' },
        { id: 'D', text: 'St. Stephen\'s Green' }
      ],
      correctAnswer: 'D',
      explanation: 'Royal College of Surgeons is located on St. Stephen\'s Green in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Clarence Hotel located?',
      questionNumber: 28,
      options: [
        { id: 'A', text: 'Merchant Quay' },
        { id: 'B', text: 'Aston Quay' },
        { id: 'C', text: 'Ormond Quay' },
        { id: 'D', text: 'Wellington Quay' }
      ],
      correctAnswer: 'D',
      explanation: 'Clarence Hotel is located on Wellington Quay in Dublin\'s Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Workman Pub located?',
      questionNumber: 29,
      options: [
        { id: 'A', text: 'Temple Bar' },
        { id: 'B', text: 'Fleet Street' },
        { id: 'C', text: 'Merchant Quay' },
        { id: 'D', text: 'Wellington Quay' }
      ],
      correctAnswer: 'D',
      explanation: 'Workman Pub is located on Wellington Quay in Dublin\'s Temple Bar area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What area is nearby Sycamore Street?',
      questionNumber: 30,
      options: [
        { id: 'A', text: 'Grafton Street (Area)' },
        { id: 'B', text: 'O\'Connell Street (Area)' },
        { id: 'C', text: 'Merrion Square (Area)' },
        { id: 'D', text: 'Temple Bar (Area)' }
      ],
      correctAnswer: 'D',
      explanation: 'Sycamore Street is located in the Temple Bar area of Dublin, known for its cultural venues and nightlife.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Parliament Street to Eustace Street?',
      questionNumber: 31,
      options: [
        { id: 'A', text: 'Parliament Street (One Way)' },
        { id: 'B', text: 'Eustace Street (One Way)' },
        { id: 'C', text: 'Dame Street (One Way)' },
        { id: 'D', text: 'East Essex Street (One Way)' }
      ],
      correctAnswer: 'D',
      explanation: 'East Essex Street is a one-way street that runs from Parliament Street to Eustace Street, connecting the Temple Bar area to the quays.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Stag Head located?',
      questionNumber: 32,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'Temple Bar' },
        { id: 'C', text: 'Fleet Street' },
        { id: 'D', text: 'Dame Lane' }
      ],
      correctAnswer: 'D',
      explanation: 'Stag Head is located on Dame Lane in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Mint Bar located?',
      questionNumber: 33,
      options: [
        { id: 'A', text: 'Trinity Street' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'Westmoreland Street' },
        { id: 'D', text: 'College Green' }
      ],
      correctAnswer: 'D',
      explanation: 'Mint Bar is located on College Green in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Times Hostel located?',
      questionNumber: 34,
      options: [
        { id: 'A', text: 'Trinity Street' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'Fleet Street' },
        { id: 'D', text: 'College Green' }
      ],
      correctAnswer: 'D',
      explanation: 'Times Hostel is located on College Green in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from South Great George\'s Street to Wicklow Street?',
      questionNumber: 35,
      options: [
        { id: 'A', text: 'South Great George\'s Street (One Way)' },
        { id: 'B', text: 'Wicklow Street (One Way)' },
        { id: 'C', text: 'Dame Street (One Way)' },
        { id: 'D', text: 'Exchequer Street (One Way)' }
      ],
      correctAnswer: 'D',
      explanation: 'Exchequer Street is a one-way street that runs from South Great George\'s Street to Wicklow Street in Dublin\'s city center shopping district.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Molly Malone Statue located?',
      questionNumber: 36,
      options: [
        { id: 'A', text: 'Grafton Street' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'College Green' },
        { id: 'D', text: 'Suffolk Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Molly Malone Statue is located on Suffolk Street, near Grafton Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Powerscourt Centre located?',
      questionNumber: 37,
      options: [
        { id: 'A', text: 'Grafton Street' },
        { id: 'B', text: 'South Great George\'s Street' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'South William Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Powerscourt Centre is located on South William Street in Dublin\'s city center shopping district.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Wax in the City located?',
      questionNumber: 38,
      options: [
        { id: 'A', text: 'Grafton Street' },
        { id: 'B', text: 'Westmoreland Street' },
        { id: 'C', text: 'College Green' },
        { id: 'D', text: 'South William Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Wax in the City is located on South William Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Between which two streets is Powerscourt Shopping Centre located?',
      questionNumber: 39,
      options: [
        { id: 'A', text: 'Grafton Street and Clarendon Street' },
        { id: 'B', text: 'South William Street and Dame Street' },
        { id: 'C', text: 'Wicklow Street and Clarendon Street' },
        { id: 'D', text: 'South William Street and Clarendon Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Powerscourt Shopping Centre is located between South William Street and Clarendon Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Westbury Hotel located?',
      questionNumber: 40,
      options: [
        { id: 'A', text: 'Grafton Street' },
        { id: 'B', text: 'South William Street' },
        { id: 'C', text: 'Clarendon Street' },
        { id: 'D', text: 'Balfe Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Westbury Hotel is located on Balfe Street in Dublin\'s city center, near Grafton Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Burgh Quay to College Green?',
      questionNumber: 41,
      options: [
        { id: 'A', text: 'Burgh Quay (One Way)' },
        { id: 'B', text: 'College Street (One Way)' },
        { id: 'C', text: 'Westmoreland Street (One Way)' },
        { id: 'D', text: 'D\'Olier Street (One Way)' }
      ],
      correctAnswer: 'D',
      explanation: 'D\'Olier Street is a one-way street that runs from Burgh Quay to College Green, providing an important route from the quays to the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Tara Street located?',
      questionNumber: 42,
      options: [
        { id: 'A', text: 'Pearse Street' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'College Street' },
        { id: 'D', text: 'Hawkins Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Tara Street is located near Hawkins Street in Dublin\'s south inner city area, close to the Tara Street DART station.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Townsend Street to Pearse Street?',
      questionNumber: 43,
      options: [
        { id: 'A', text: 'Hawkins Street (One Way)' },
        { id: 'B', text: 'Tara Street (One Way)' },
        { id: 'C', text: 'College Street (One Way)' },
        { id: 'D', text: 'Townsend Street - Pearse Street (One Way)' }
      ],
      correctAnswer: 'D',
      explanation: 'The route from Townsend Street to Pearse Street is one-way in Dublin\'s south inner city area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Pearse Street located?',
      questionNumber: 44,
      options: [
        { id: 'A', text: 'Hawkins Street' },
        { id: 'B', text: 'Tara Street' },
        { id: 'C', text: 'College Street' },
        { id: 'D', text: 'Townsend Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Pearse Street is located near Townsend Street in Dublin\'s south inner city area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Department of Health and Children located?',
      questionNumber: 45,
      options: [
        { id: 'A', text: 'Merrion Street' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Dawson Street' },
        { id: 'D', text: 'Baggot Street Lower' }
      ],
      correctAnswer: 'D',
      explanation: 'Department of Health and Children is located on Baggot Street Lower in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Trinity City Hotel located?',
      questionNumber: 46,
      options: [
        { id: 'A', text: 'College Street' },
        { id: 'B', text: 'Townsend Street' },
        { id: 'C', text: 'Westland Row' },
        { id: 'D', text: 'Pearse Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Trinity City Hotel is located on Pearse Street in Dublin\'s south inner city area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the entrance to Pearse DART Station located?',
      questionNumber: 47,
      options: [
        { id: 'A', text: 'Pearse Street' },
        { id: 'B', text: 'Townsend Street' },
        { id: 'C', text: 'College Street' },
        { id: 'D', text: 'Westland Row' }
      ],
      correctAnswer: 'D',
      explanation: 'The entrance to Pearse DART Station is located on Westland Row in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Bord Gáis Theatre located?',
      questionNumber: 48,
      options: [
        { id: 'A', text: 'Pearse Street' },
        { id: 'B', text: 'Townsend Street' },
        { id: 'C', text: 'Sir John Rogerson\'s Quay' },
        { id: 'D', text: 'Grand Canal Square' }
      ],
      correctAnswer: 'D',
      explanation: 'Bord Gáis Theatre is located on Grand Canal Square in Dublin\'s Docklands area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Google Docks located?',
      questionNumber: 49,
      options: [
        { id: 'A', text: 'Grand Canal Square' },
        { id: 'B', text: 'Pearse Street' },
        { id: 'C', text: 'Townsend Street' },
        { id: 'D', text: 'Barrow Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Google Docks is located on Barrow Street in Dublin\'s Docklands area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Shelbourne Park Greyhound Stadium located?',
      questionNumber: 50,
      options: [
        { id: 'A', text: 'Barrow Street' },
        { id: 'B', text: 'Grand Canal Street' },
        { id: 'C', text: 'Pearse Street' },
        { id: 'D', text: 'South Lotts Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Shelbourne Park Greyhound Stadium is located on South Lotts Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Between which two streets is Stephen Place situated?',
      questionNumber: 51,
      options: [
        { id: 'A', text: 'Merrion Square and Baggot Street' },
        { id: 'B', text: 'Kildare Street and Dawson Street' },
        { id: 'C', text: 'Grafton Street and Nassau Street' },
        { id: 'D', text: 'Mount Street Lower and Mount Street Upper' }
      ],
      correctAnswer: 'D',
      explanation: 'Stephen Place is situated between Mount Street Lower and Mount Street Upper in Dublin\'s Ballsbridge area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from St. Stephen\'s Green North to Nassau Street?',
      questionNumber: 52,
      options: [
        { id: 'A', text: 'St. Stephen\'s Green North (One Way)' },
        { id: 'B', text: 'Nassau Street (One Way)' },
        { id: 'C', text: 'Kildare Street (One Way)' },
        { id: 'D', text: 'Dawson Street (One Way)' }
      ],
      correctAnswer: 'D',
      explanation: 'Dawson Street is a one-way street that runs from St. Stephen\'s Green North to Nassau Street, connecting the prestigious Georgian square to the shopping and cultural district.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is The Pig\'s Ear Restaurant located?',
      questionNumber: 53,
      options: [
        { id: 'A', text: 'Grafton Street' },
        { id: 'B', text: 'Temple Bar' },
        { id: 'C', text: 'South William Street' },
        { id: 'D', text: 'Nassau Street' }
      ],
      correctAnswer: 'D',
      explanation: 'The Pig\'s Ear Restaurant is located on Nassau Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Gaiety Theatre located?',
      questionNumber: 54,
      options: [
        { id: 'A', text: 'Grafton Street' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'Temple Bar' },
        { id: 'D', text: 'South King Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Gaiety Theatre is located on South King Street in Dublin\'s city center, near Grafton Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Mansion House located?',
      questionNumber: 55,
      options: [
        { id: 'A', text: 'Grafton Street' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Merrion Square' },
        { id: 'D', text: 'Dawson Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Mansion House is located on Dawson Street in Dublin, the official residence of the Lord Mayor of Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is International Bar located?',
      questionNumber: 56,
      options: [
        { id: 'A', text: 'Grafton Street' },
        { id: 'B', text: 'South William Street' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'Wicklow Street' }
      ],
      correctAnswer: 'D',
      explanation: 'International Bar is located on Wicklow Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Buswell\'s Hotel located?',
      questionNumber: 57,
      options: [
        { id: 'A', text: 'Dawson Street' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Grafton Street' },
        { id: 'D', text: 'Molesworth Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Buswell\'s Hotel is located on Molesworth Street in Dublin\'s city center, connecting the shopping district to the Georgian quarter.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Dunne & Crescenzi Italian Restaurant located?',
      questionNumber: 58,
      options: [
        { id: 'A', text: 'Grafton Street' },
        { id: 'B', text: 'Dawson Street' },
        { id: 'C', text: 'Nassau Street' },
        { id: 'D', text: 'South Frederick Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Dunne & Crescenzi Italian Restaurant is located on South Frederick Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Leinster Street South to St. Stephen\'s Green North?',
      questionNumber: 59,
      options: [
        { id: 'A', text: 'Leinster Street South (One Way)' },
        { id: 'B', text: 'St. Stephen\'s Green North (One Way)' },
        { id: 'C', text: 'Dawson Street (One Way)' },
        { id: 'D', text: 'Kildare Street (One Way)' }
      ],
      correctAnswer: 'D',
      explanation: 'Kildare Street is a one-way street that runs from Leinster Street South to St. Stephen\'s Green North. This street is located in the prestigious Georgian area of Dublin and is home to the National Library and National Museum.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the street that runs from Molesworth Street to Nassau Street?',
      questionNumber: 60,
      options: [
        { id: 'A', text: 'Kildare Street' },
        { id: 'B', text: 'Dawson Street' },
        { id: 'C', text: 'Grafton Street' },
        { id: 'D', text: 'South Frederick Street' }
      ],
      correctAnswer: 'D',
      explanation: 'South Frederick Street runs from Molesworth Street to Nassau Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street adjoins Kildare Street?',
      questionNumber: 61,
      options: [
        { id: 'A', text: 'Molesworth Street' },
        { id: 'B', text: 'Nassau Street' },
        { id: 'C', text: 'Dawson Street' },
        { id: 'D', text: 'School House Lane' }
      ],
      correctAnswer: 'D',
      explanation: 'School House Lane adjoins Kildare Street in Dublin\'s city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is National Art Gallery located?',
      questionNumber: 62,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Dawson Street' },
        { id: 'D', text: 'Clare Street' }
      ],
      correctAnswer: 'D',
      explanation: 'National Art Gallery is located on Clare Street in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is National Gallery located?',
      questionNumber: 63,
      options: [
        { id: 'A', text: 'Clare Street' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Dawson Street' },
        { id: 'D', text: 'Merrion Square West' }
      ],
      correctAnswer: 'D',
      explanation: 'National Gallery is located on Merrion Square West in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is O\'Callaghan Mont Clare Hotel located?',
      questionNumber: 64,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Clare Street' },
        { id: 'D', text: 'Merrion Street Lower' }
      ],
      correctAnswer: 'D',
      explanation: 'O\'Callaghan Mont Clare Hotel is located on Merrion Street Lower in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is O\'Callaghan Davenport Hotel located?',
      questionNumber: 65,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Clare Street' },
        { id: 'D', text: 'Merrion Street Lower' }
      ],
      correctAnswer: 'D',
      explanation: 'O\'Callaghan Davenport Hotel is located on Merrion Street Lower in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Dental Hospital located?',
      questionNumber: 66,
      options: [
        { id: 'A', text: 'Merrion Street' },
        { id: 'B', text: 'Nassau Street' },
        { id: 'C', text: 'Clare Street' },
        { id: 'D', text: 'Lincoln Place' }
      ],
      correctAnswer: 'D',
      explanation: 'Dental Hospital is located on Lincoln Place in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is National Maternity Hospital located?',
      questionNumber: 67,
      options: [
        { id: 'A', text: 'Merrion Street' },
        { id: 'B', text: 'Baggot Street' },
        { id: 'C', text: 'Lincoln Place' },
        { id: 'D', text: 'Holles Street' }
      ],
      correctAnswer: 'D',
      explanation: 'National Maternity Hospital is located on Holles Street in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Royal City of Dublin Hospital located?',
      questionNumber: 68,
      options: [
        { id: 'A', text: 'Merrion Street' },
        { id: 'B', text: 'Holles Street' },
        { id: 'C', text: 'Pembroke Street' },
        { id: 'D', text: 'Baggot Street Upper' }
      ],
      correctAnswer: 'D',
      explanation: 'Royal City of Dublin Hospital is located on Baggot Street Upper in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Skin and Cancer Hospital located?',
      questionNumber: 69,
      options: [
        { id: 'A', text: 'Merrion Street' },
        { id: 'B', text: 'Baggot Street' },
        { id: 'C', text: 'Holles Street' },
        { id: 'D', text: 'Hume Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Skin and Cancer Hospital is located on Hume Street in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Little Museum located?',
      questionNumber: 70,
      options: [
        { id: 'A', text: 'Grafton Street' },
        { id: 'B', text: 'Dawson Street' },
        { id: 'C', text: 'Kildare Street' },
        { id: 'D', text: 'St. Stephen\'s Green North' }
      ],
      correctAnswer: 'D',
      explanation: 'Little Museum is located on St. Stephen\'s Green North in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Royal Hibernian Academy located?',
      questionNumber: 71,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'St. Stephen\'s Green' },
        { id: 'C', text: 'Kildare Street' },
        { id: 'D', text: 'Ely Place' }
      ],
      correctAnswer: 'D',
      explanation: 'Royal Hibernian Academy is located on Ely Place in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Australian Embassy located?',
      questionNumber: 72,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Baggot Street' },
        { id: 'D', text: 'St. Stephen\'s Green East' }
      ],
      correctAnswer: 'D',
      explanation: 'Australian Embassy is located on St. Stephen\'s Green East in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is French Embassy located?',
      questionNumber: 73,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'St. Stephen\'s Green' },
        { id: 'C', text: 'Pembroke Road' },
        { id: 'D', text: 'Ailesbury Road (Ballsbridge)' }
      ],
      correctAnswer: 'D',
      explanation: 'French Embassy is located on Ailesbury Road in Ballsbridge, Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Dublin Passport Office located?',
      questionNumber: 74,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Dawson Street' },
        { id: 'D', text: 'Mount Street Lower' }
      ],
      correctAnswer: 'D',
      explanation: 'Dublin Passport Office is located on Mount Street Lower in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Italian Embassy located?',
      questionNumber: 75,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Pembroke Road' },
        { id: 'C', text: 'Baggot Street' },
        { id: 'D', text: 'Northumberland Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Italian Embassy is located on Northumberland Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is School House Hotel located?',
      questionNumber: 76,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Pembroke Road' },
        { id: 'C', text: 'Baggot Street' },
        { id: 'D', text: 'Northumberland Road' }
      ],
      correctAnswer: 'D',
      explanation: 'School House Hotel is located on Northumberland Road in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Georgian House Museum located?',
      questionNumber: 77,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'St. Stephen\'s Green' },
        { id: 'C', text: 'Kildare Street' },
        { id: 'D', text: 'Fitzwilliam Street Lower' }
      ],
      correctAnswer: 'D',
      explanation: 'Georgian House Museum is located on Fitzwilliam Street Lower in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Royal College of Surgeons located?',
      questionNumber: 78,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Grafton Street' },
        { id: 'D', text: 'York Street, St. Stephen\'s Green' }
      ],
      correctAnswer: 'D',
      explanation: 'Royal College of Surgeons is located on York Street, St. Stephen\'s Green in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Doheny & Nesbitt located?',
      questionNumber: 79,
      options: [
        { id: 'A', text: 'Merrion Street' },
        { id: 'B', text: 'Fitzwilliam Street' },
        { id: 'C', text: 'Pembroke Street' },
        { id: 'D', text: 'Baggot Street Lower' }
      ],
      correctAnswer: 'D',
      explanation: 'Doheny & Nesbitt is located on Baggot Street Lower in Dublin, a famous traditional pub.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the one-way street that runs from Baggot Street Lower to Mount Street Upper?',
      questionNumber: 80,
      options: [
        { id: 'A', text: 'Baggot Street Lower (One Way)' },
        { id: 'B', text: 'Mount Street (One Way)' },
        { id: 'C', text: 'Fitzwilliam Street (One Way)' },
        { id: 'D', text: 'James Street East (One Way)' }
      ],
      correctAnswer: 'D',
      explanation: 'James Street East is a one-way street that runs from Baggot Street Lower to Mount Street Upper in Dublin\'s Ballsbridge area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is National Concert Hall located?',
      questionNumber: 81,
      options: [
        { id: 'A', text: 'St. Stephen\'s Green' },
        { id: 'B', text: 'Merrion Square' },
        { id: 'C', text: 'Grafton Street' },
        { id: 'D', text: 'Earlsfort Terrace' }
      ],
      correctAnswer: 'D',
      explanation: 'National Concert Hall is located on Earlsfort Terrace in Dublin, connecting the city center to the Grand Canal area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Conrad Hotel located?',
      questionNumber: 82,
      options: [
        { id: 'A', text: 'St. Stephen\'s Green' },
        { id: 'B', text: 'Merrion Square' },
        { id: 'C', text: 'Grafton Street' },
        { id: 'D', text: 'Earlsfort Terrace' }
      ],
      correctAnswer: 'D',
      explanation: 'Conrad Hotel is located on Earlsfort Terrace in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the name of the terrace that runs from St. Stephen\'s Green South to Adelaide Road?',
      questionNumber: 83,
      options: [
        { id: 'A', text: 'Pembroke Terrace' },
        { id: 'B', text: 'Palmerston Terrace' },
        { id: 'C', text: 'Belgrave Terrace' },
        { id: 'D', text: 'Earlsfort Terrace' }
      ],
      correctAnswer: 'D',
      explanation: 'Earlsfort Terrace runs from St. Stephen\'s Green South to Adelaide Road, connecting the city center to the Grand Canal area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is D-2 Club located?',
      questionNumber: 84,
      options: [
        { id: 'A', text: 'St. Stephen\'s Green' },
        { id: 'B', text: 'Camden Street' },
        { id: 'C', text: 'Wexford Street' },
        { id: 'D', text: 'Harcourt Street' }
      ],
      correctAnswer: 'D',
      explanation: 'D-2 Club is located on Harcourt Street in Dublin\'s south inner city area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Dice\'s Club located?',
      questionNumber: 85,
      options: [
        { id: 'A', text: 'St. Stephen\'s Green' },
        { id: 'B', text: 'Camden Street' },
        { id: 'C', text: 'Wexford Street' },
        { id: 'D', text: 'Harcourt Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Dice\'s Club is located on Harcourt Street in Dublin\'s south inner city area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Odeon Bar & Grill located?',
      questionNumber: 86,
      options: [
        { id: 'A', text: 'St. Stephen\'s Green' },
        { id: 'B', text: 'Camden Street' },
        { id: 'C', text: 'Wexford Street' },
        { id: 'D', text: 'Harcourt Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Odeon Bar & Grill is located on Harcourt Street in Dublin\'s south inner city area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Irish Jewish Museum located?',
      questionNumber: 87,
      options: [
        { id: 'A', text: 'Portobello' },
        { id: 'B', text: 'South Circular Road' },
        { id: 'C', text: 'Clanbrassil Street' },
        { id: 'D', text: 'Walworth Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Irish Jewish Museum is located on Walworth Road in Dublin.',
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

  console.log(`✅ Created ${questions.length} questions for Southside Streets 2 chapter`)
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
