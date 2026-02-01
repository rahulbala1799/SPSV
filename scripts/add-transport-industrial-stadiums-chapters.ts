/**
 * Script to add 3 new chapters:
 * 1. Transport & Infrastructure (30 questions)
 * 2. Industrial Estates & Business Parks (15 questions)
 * 3. Stadiums, Sport Grounds and Clubs (64 questions)
 * 
 * Usage:
 *   DATABASE_URL="your_db_url" npx tsx scripts/add-transport-industrial-stadiums-chapters.ts
 * 
 * Or set DATABASE_URL in .env file
 */

// Load environment variables from .env file if it exists
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env') })

// Use unpooled connection for scripts (better for migrations/syncs)
// If DATABASE_URL_UNPOOLED is set, use it; otherwise use DATABASE_URL
if (process.env.DATABASE_URL_UNPOOLED) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED
}

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set')
  console.error('Please set it in your .env file or export it before running this script')
  console.error('Example: DATABASE_URL="postgresql://user:pass@host/db" npx tsx scripts/add-transport-industrial-stadiums-chapters.ts')
  process.exit(1)
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Helper function to generate explanations
function generateExplanation(question: string, correctAnswer: string, options: any[]): string {
  const correctOption = options.find(opt => opt.id === correctAnswer)
  if (!correctOption) return 'This is the correct answer based on Dublin transport and infrastructure knowledge.'

  // Generate contextual explanations based on the question type
  if (question.includes('DART') || question.includes('train station')) {
    return `${correctOption.text} is the correct answer. This is an important location for Dublin's rail network and is commonly used by passengers traveling in this area.`
  }
  if (question.includes('Luas')) {
    return `${correctOption.text} is the correct answer. The Luas is Dublin's light rail system, and this stop is located on the specified line.`
  }
  if (question.includes('road') || question.includes('street')) {
    return `${correctOption.text} is the correct answer. This is a well-known road in Dublin that connects important areas and is frequently used by taxi drivers.`
  }
  if (question.includes('station') || question.includes('port')) {
    return `${correctOption.text} is the correct answer. This location is a key transport hub in Dublin and is essential knowledge for taxi drivers.`
  }
  if (question.includes('Industrial Estate') || question.includes('Business Park')) {
    return `${correctOption.text} is the correct answer. This location is an important business and industrial area in Dublin, commonly accessed by taxi drivers.`
  }
  if (question.includes('Golf Club') || question.includes('Stadium') || question.includes('GAA')) {
    return `${correctOption.text} is the correct answer. This is a well-known sports venue in Dublin that taxi drivers should be familiar with for passenger drop-offs.`
  }
  
  return `${correctOption.text} is the correct answer. This information is essential knowledge for taxi drivers operating in Dublin.`
}

async function main() {
  console.log('🚀 Starting to add 3 new chapters...\n')

  // Get the highest chapter number
  const lastChapter = await prisma.chapter.findFirst({
    orderBy: { chapterNumber: 'desc' }
  })
  const nextChapterNumber = (lastChapter?.chapterNumber || 0) + 1

  console.log(`📊 Next chapter number: ${nextChapterNumber}\n`)

  // ============================================
  // CHAPTER 1: Transport & Infrastructure
  // ============================================
  console.log('📝 Creating Chapter 1: Transport & Infrastructure...')
  
  const transportChapter = await prisma.chapter.create({
    data: {
      id: 'chapter_transport_infrastructure',
      title: 'Transport & Infrastructure',
      description: 'Test your knowledge of Dublin\'s transport network including DART stations, Luas lines, train stations, ports, and major roads.',
      chapterNumber: nextChapterNumber,
      type: 'MCQ',
      category: 'AREA_KNOWLEDGE',
      duration: 45,
      isActive: true,
    }
  })

  const transportQuestions = [
    {
      questionText: 'What Dart station is the furthest north?',
      options: [
        { id: 'A', text: 'Rush' },
        { id: 'B', text: 'Malahide' },
        { id: 'C', text: 'Portmarnock' },
        { id: 'D', text: 'Skerries' }
      ],
      correctAnswer: 'B',
      explanation: 'Malahide is the furthest north DART station. The DART line runs from Malahide in the north to Greystones in the south, making Malahide the northernmost station on the DART network.'
    },
    {
      questionText: 'Travelling south on the Dart what is the final stop?',
      options: [
        { id: 'A', text: 'Greystones' },
        { id: 'B', text: 'Bray' },
        { id: 'C', text: 'Dun Laoghaire' },
        { id: 'D', text: 'Shankill' }
      ],
      correctAnswer: 'A',
      explanation: 'Greystones is the final stop when travelling south on the DART. The DART line extends from Malahide in the north to Greystones in County Wicklow, making it the southern terminus of the line.'
    },
    {
      questionText: 'Which is the nearest train station to Rathborne?',
      options: [
        { id: 'A', text: 'Pelletstown' },
        { id: 'B', text: 'Broombridge' },
        { id: 'C', text: 'Ashtown' },
        { id: 'D', text: 'Navan Road Parkway' }
      ],
      correctAnswer: 'C',
      explanation: 'Ashtown is the nearest train station to Rathborne. Ashtown station is located on the Maynooth line and serves the Rathborne area in Dublin 15.'
    },
    {
      questionText: 'O\'Connell-GPO stop is on which Luas line?',
      options: [
        { id: 'A', text: 'Green Line' },
        { id: 'B', text: 'Red Line' }
      ],
      correctAnswer: 'A',
      explanation: 'O\'Connell-GPO stop is on the Green Line. The Green Line runs from Broombridge to Brides Glen, passing through the city center including O\'Connell Street where the GPO is located.'
    },
    {
      questionText: 'On what road is Portmarnock train station?',
      options: [
        { id: 'A', text: 'Strand Road' },
        { id: 'B', text: 'Station Road' },
        { id: 'C', text: 'Carrickhill Road Lower' },
        { id: 'D', text: 'Coast Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Portmarnock train station is located on Station Road. This is a common naming convention for roads that lead to train stations in Ireland.'
    },
    {
      questionText: 'From what Ferry Port does the Stena Line depart?',
      options: [
        { id: 'A', text: 'Dublin Port' },
        { id: 'B', text: 'Howth Harbour' },
        { id: 'C', text: 'Malahide' },
        { id: 'D', text: 'Dun Laoghaire Harbour' }
      ],
      correctAnswer: 'A',
      explanation: 'Stena Line departs from Dublin Port. Dublin Port is the main ferry terminal in Dublin, located on the north side of the River Liffey, and serves ferry routes to the UK and continental Europe.'
    },
    {
      questionText: 'Which is the nearest train station to Luttrellstown?',
      options: [
        { id: 'A', text: 'Clonsilla' },
        { id: 'B', text: 'Castleknock' },
        { id: 'C', text: 'Hansfield' },
        { id: 'D', text: 'Navan Road Parkway' }
      ],
      correctAnswer: 'A',
      explanation: 'Clonsilla is the nearest train station to Luttrellstown. Clonsilla station is on the Maynooth line and serves the Luttrellstown area in Dublin 15.'
    },
    {
      questionText: 'The passenger entrance for Pearse Street train station is situated on which street?',
      options: [
        { id: 'A', text: 'Tara Street' },
        { id: 'B', text: 'Townsend Street' },
        { id: 'C', text: 'Westland Row' },
        { id: 'D', text: 'Lombard Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The passenger entrance for Pearse Street train station is situated on Westland Row. Pearse Station (formerly Westland Row Station) is one of Dublin\'s main railway stations, located near Trinity College.'
    },
    {
      questionText: 'Dublin Tunnel peak times are when?',
      options: [
        { id: 'A', text: 'Southbound (Monday- Saturday) 06:00-10:00, Northbound (Monday- Saturday) 16:00-19:00' },
        { id: 'B', text: 'Northbound (Monday-Friday) 06:00-10:00, Southbound (Monday-Friday) 16:00-19:00' },
        { id: 'C', text: 'Southbound (Monday-Friday) 06:00-10:00, Northbound (Monday-Friday) 16:00-19:00' },
        { id: 'D', text: 'Northbound (Monday-Saturday) 06:00-10:00, Southbound (Monday- Saturday) 16:00-19:00' }
      ],
      correctAnswer: 'C',
      explanation: 'Dublin Tunnel peak times are Southbound (Monday-Friday) 06:00-10:00, Northbound (Monday-Friday) 16:00-19:00. These times reflect the morning rush hour into the city center and the evening rush hour out of the city.'
    },
    {
      questionText: 'Which is the nearest train station to Ronanstown?',
      options: [
        { id: 'A', text: 'Clondalkin and Fonthill' },
        { id: 'B', text: 'Parkwest and Cherry Orchard' },
        { id: 'C', text: 'Adamstown' },
        { id: 'D', text: 'Clonsilla' }
      ],
      correctAnswer: 'A',
      explanation: 'Clondalkin and Fonthill is the nearest train station to Ronanstown. This station is on the Kildare line and serves the Ronanstown area in Dublin 22.'
    },
    {
      questionText: 'Where is Connolly Station?',
      options: [
        { id: 'A', text: 'Railway Street' },
        { id: 'B', text: 'Amiens Street' },
        { id: 'C', text: 'Foley Street' },
        { id: 'D', text: 'Mayor Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Connolly Station is located on Amiens Street. It is one of Dublin\'s main railway stations and serves as a major transport hub, connecting DART, commuter rail, and intercity services.'
    },
    {
      questionText: 'Which is the nearest train station to Cabra?',
      options: [
        { id: 'A', text: 'Drumcondra' },
        { id: 'B', text: 'Pelletstown' },
        { id: 'C', text: 'Broombridge' },
        { id: 'D', text: 'Ashtown' }
      ],
      correctAnswer: 'C',
      explanation: 'Broombridge is the nearest train station to Cabra. Broombridge station is on the Maynooth line and serves the Cabra area in Dublin 7.'
    },
    {
      questionText: 'Which is the nearest train station to Lucan?',
      options: [
        { id: 'A', text: 'Adamstown' },
        { id: 'B', text: 'Park West and Cherry Orchard' },
        { id: 'C', text: 'Heuston' },
        { id: 'D', text: 'Clondalkin and Fonthill' }
      ],
      correctAnswer: 'A',
      explanation: 'Adamstown is the nearest train station to Lucan. Adamstown station is on the Kildare line and serves the Lucan area in Dublin.'
    },
    {
      questionText: 'Busaras Station is located where?',
      options: [
        { id: 'A', text: 'Amiens Street' },
        { id: 'B', text: 'Talbot Street' },
        { id: 'C', text: 'Store Street' },
        { id: 'D', text: 'O\'Connell Street' }
      ],
      correctAnswer: 'C',
      explanation: 'Busaras (Busáras) Station is located on Store Street. It is Dublin\'s main bus station, serving both local and intercity bus services, and is adjacent to Connolly Station.'
    },
    {
      questionText: 'Which TWO Luas stops can be found on Davitt Road?',
      options: [
        { id: 'A', text: 'Blackhorse and Kylemore' },
        { id: 'B', text: 'Rialto and Suir Road' },
        { id: 'C', text: 'Drimnagh and Bluebell' },
        { id: 'D', text: 'Blackhorse and Goldenbridge' }
      ],
      correctAnswer: 'D',
      explanation: 'Blackhorse and Goldenbridge are the two Luas stops found on Davitt Road. Both stops are on the Red Line, which runs along Davitt Road in Dublin 12.'
    },
    {
      questionText: 'Dublin Airport can be accessed using which motorway?',
      options: [
        { id: 'A', text: 'M11' },
        { id: 'B', text: 'M1' },
        { id: 'C', text: 'M7' },
        { id: 'D', text: 'M4' }
      ],
      correctAnswer: 'B',
      explanation: 'Dublin Airport can be accessed using the M1 motorway. The M1 runs from Dublin to the border with Northern Ireland, and Dublin Airport is located just off the M1 near the airport junction.'
    },
    {
      questionText: 'Travelling from Dublin to Sligo, by train, what station is used?',
      options: [
        { id: 'A', text: 'Tara Street Station' },
        { id: 'B', text: 'Heuston Station' },
        { id: 'C', text: 'Pearse Street Station' },
        { id: 'D', text: 'Connolly Station' }
      ],
      correctAnswer: 'D',
      explanation: 'Connolly Station is used for trains travelling from Dublin to Sligo. Connolly Station serves the northern and western rail routes, including the Sligo line.'
    },
    {
      questionText: 'Where does the Luas Red Line start and finish?',
      options: [
        { id: 'A', text: 'Tallaght and Spencer Dock' },
        { id: 'B', text: 'Abbey Street and Bluebell' },
        { id: 'C', text: 'Red Cow and The Point' },
        { id: 'D', text: 'Saggart and The Point' }
      ],
      correctAnswer: 'D',
      explanation: 'The Luas Red Line starts at Saggart and finishes at The Point (now called Parnell). The Red Line runs from Saggart in the west through the city center to The Point in the east.'
    },
    {
      questionText: 'Travelling from Dublin to Cork, by train, what station is used?',
      options: [
        { id: 'A', text: 'Pearse Street Station' },
        { id: 'B', text: 'Heuston Station' },
        { id: 'C', text: 'Tara Street Station' },
        { id: 'D', text: 'Connolly Station' }
      ],
      correctAnswer: 'B',
      explanation: 'Heuston Station is used for trains travelling from Dublin to Cork. Heuston Station serves the southern and western rail routes, including the Cork line.'
    },
    {
      questionText: 'On what road is the entrance to Howth DART station located?',
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Summit Drive' },
        { id: 'C', text: 'Harbour Road' },
        { id: 'D', text: 'Howth Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The entrance to Howth DART station is located on Howth Road. Howth Road is the main road leading to Howth village and the station is easily accessible from this road.'
    },
    {
      questionText: 'On what road is Raheny Dart Station?',
      options: [
        { id: 'A', text: 'Brookwood Avenue' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Springdale Road' },
        { id: 'D', text: 'Station Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Raheny DART station is located on Station Road. This follows the common naming convention for roads leading to train stations in Ireland.'
    },
    {
      questionText: 'Which is the nearest train station to Arbour Hill?',
      options: [
        { id: 'A', text: 'Connolly' },
        { id: 'B', text: 'Pearse Street' },
        { id: 'C', text: 'Heuston' },
        { id: 'D', text: 'Drumcondra' }
      ],
      correctAnswer: 'C',
      explanation: 'Heuston is the nearest train station to Arbour Hill. Heuston Station is located in Dublin 8, close to the Arbour Hill area.'
    },
    {
      questionText: 'Dublin Ferry Port is directly accessed via which main road?',
      options: [
        { id: 'A', text: 'Eastwall Road' },
        { id: 'B', text: 'Mayor Street' },
        { id: 'C', text: 'North Wall Quay' },
        { id: 'D', text: 'City Quay' }
      ],
      correctAnswer: 'A',
      explanation: 'Dublin Ferry Port is directly accessed via Eastwall Road. Eastwall Road runs along the north side of the River Liffey and provides direct access to the ferry port terminals.'
    },
    {
      questionText: 'Weston Airport is located off what national road?',
      options: [
        { id: 'A', text: 'N2' },
        { id: 'B', text: 'N7' },
        { id: 'C', text: 'N4' },
        { id: 'D', text: 'N11' }
      ],
      correctAnswer: 'C',
      explanation: 'Weston Airport is located off the N4 national road. The N4 runs from Dublin to Sligo, and Weston Airport (a small general aviation airport) is located near Lucan, just off the N4.'
    },
    {
      questionText: 'Where is Heuston Station?',
      options: [
        { id: 'A', text: 'Arran Quay' },
        { id: 'B', text: 'North Wall Quay' },
        { id: 'C', text: 'Victoria Quay' },
        { id: 'D', text: 'Inns Quay' }
      ],
      correctAnswer: 'C',
      explanation: 'Heuston Station is located on Victoria Quay. The station is situated on the south side of the River Liffey, near Phoenix Park, and serves as a major railway terminus for southern and western routes.'
    },
    {
      questionText: 'Where is Busáras Bus Station situated?',
      options: [
        { id: 'A', text: 'Pearse Street' },
        { id: 'B', text: 'Store Street' },
        { id: 'C', text: 'Tara Street' },
        { id: 'D', text: 'Amiens Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Busáras Bus Station is situated on Store Street. It is Dublin\'s main bus station, located adjacent to Connolly Station, and serves both local and intercity bus routes.'
    },
    {
      questionText: 'Which is the nearest train station to Western Industrial Estate?',
      options: [
        { id: 'A', text: 'Clondalkin & Fonthill' },
        { id: 'B', text: 'Adamstown' },
        { id: 'C', text: 'Clonsilla' },
        { id: 'D', text: 'Parkwest and Cherry Orchard' }
      ],
      correctAnswer: 'D',
      explanation: 'Parkwest and Cherry Orchard is the nearest train station to Western Industrial Estate. This station is on the Kildare line and serves the industrial area in Dublin 12.'
    },
    {
      questionText: 'Leap card is NOT an accepted payment method for which of the following?',
      options: [
        { id: 'A', text: 'Luas' },
        { id: 'B', text: 'Dublin Bus' },
        { id: 'C', text: 'DART' },
        { id: 'D', text: 'Taxis' }
      ],
      correctAnswer: 'D',
      explanation: 'Leap card is NOT an accepted payment method for taxis. The Leap card is accepted on Luas, Dublin Bus, and DART services, but taxis require cash or card payment directly to the driver.'
    },
    {
      questionText: 'Where does the Luas Green Line start and finish?',
      options: [
        { id: 'A', text: 'Sandyford and O\'Connell Upper' },
        { id: 'B', text: 'Broombridge and St. Stephen\'s Green' },
        { id: 'C', text: 'Brides Glen and Broombridge' },
        { id: 'D', text: 'St. Stephen\'s Green and Brides Glen' }
      ],
      correctAnswer: 'C',
      explanation: 'The Luas Green Line starts at Brides Glen and finishes at Broombridge. The Green Line runs from Brides Glen in the south through the city center to Broombridge in the north.'
    },
    {
      questionText: 'Abbey Street is on which Luas line?',
      options: [
        { id: 'A', text: 'Red Line' },
        { id: 'B', text: 'Green Line' }
      ],
      correctAnswer: 'A',
      explanation: 'Abbey Street is on the Red Line. The Red Line passes through Abbey Street in the city center, connecting Saggart in the west to The Point in the east.'
    }
  ]

  for (let i = 0; i < transportQuestions.length; i++) {
    const q = transportQuestions[i]
    await prisma.question.create({
      data: {
        chapterId: transportChapter.id,
        questionText: q.questionText,
        questionNumber: i + 1,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: 'medium',
        points: 1,
        category: 'AREA_KNOWLEDGE',
      }
    })
  }

  console.log(`✅ Created ${transportQuestions.length} questions for Transport & Infrastructure\n`)

  // ============================================
  // CHAPTER 2: Industrial Estates & Business Parks
  // ============================================
  console.log('📝 Creating Chapter 2: Industrial Estates & Business Parks...')
  
  const industrialChapter = await prisma.chapter.create({
    data: {
      id: 'chapter_industrial_estates_business_parks',
      title: 'Industrial Estates & Business Parks',
      description: 'Learn about Dublin\'s major industrial estates and business parks, their locations, and the roads that access them.',
      chapterNumber: nextChapterNumber + 1,
      type: 'MCQ',
      category: 'AREA_KNOWLEDGE',
      duration: 25,
      isActive: true,
    }
  })

  const industrialQuestions = [
    {
      questionText: 'Baldoyle Industrial Estate is located off what main road?',
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Clontarf Road' },
        { id: 'C', text: 'Kilbarrack Road' },
        { id: 'D', text: 'Grange Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Baldoyle Industrial Estate is located off Grange Road. Grange Road is a main road in Baldoyle, Dublin 13, and provides access to the industrial estate which is an important business area.'
    },
    {
      questionText: 'Ballymount Industrial Estate is located where?',
      options: [
        { id: 'A', text: 'Naas Road' },
        { id: 'B', text: 'Kylemore Road' },
        { id: 'C', text: 'Turnpike Road' },
        { id: 'D', text: 'Ballymount Road Lower' }
      ],
      correctAnswer: 'D',
      explanation: 'Ballymount Industrial Estate is located on Ballymount Road Lower. This is a major industrial area in Dublin 12, easily accessible from the M50 and N7.'
    },
    {
      questionText: 'Citywest Business Campus is located off which national roads?',
      options: [
        { id: 'A', text: 'N7 & N11' },
        { id: 'B', text: 'N4 & N7' },
        { id: 'C', text: 'N2 & N3' },
        { id: 'D', text: 'N7 & N81' }
      ],
      correctAnswer: 'D',
      explanation: 'Citywest Business Campus is located off the N7 and N81 national roads. This large business park in Dublin 24 is strategically located near major transport routes, making it easily accessible.'
    },
    {
      questionText: 'EastPoint Business Park is located off what main road?',
      options: [
        { id: 'A', text: 'Alfie Byrne Road' },
        { id: 'B', text: 'Strand Road' },
        { id: 'C', text: 'Leopardstown Road' },
        { id: 'D', text: 'East Wall Road' }
      ],
      correctAnswer: 'A',
      explanation: 'EastPoint Business Park is located off Alfie Byrne Road. This business park in Dublin 3 is situated near the coast and is easily accessible from the city center and Dublin Port.'
    },
    {
      questionText: 'John F Kennedy Industrial Estate is located off what main road?',
      options: [
        { id: 'A', text: 'Inchicore Road' },
        { id: 'B', text: 'Naas Road' },
        { id: 'C', text: 'Nangor Road' },
        { id: 'D', text: 'Long Mile Road' }
      ],
      correctAnswer: 'B',
      explanation: 'John F Kennedy Industrial Estate is located off Naas Road. This industrial estate in Dublin 12 is named after the US President and is a significant business area along the N7 corridor.'
    },
    {
      questionText: 'Park West Business Campus/Park & Industrial Park is located off what main road?',
      options: [
        { id: 'A', text: 'Navan Road' },
        { id: 'B', text: 'Nangor Road' },
        { id: 'C', text: 'Monastery Road' },
        { id: 'D', text: 'Cherry Orchard Avenue' }
      ],
      correctAnswer: 'B',
      explanation: 'Park West Business Campus and Industrial Park is located off Nangor Road. This is one of Dublin\'s largest business and industrial parks, located in Dublin 12 near the M50.'
    },
    {
      questionText: 'Sandyford Industrial estate is accessed using which motorway?',
      options: [
        { id: 'A', text: 'M7' },
        { id: 'B', text: 'M50' },
        { id: 'C', text: 'M11' },
        { id: 'D', text: 'M4' }
      ],
      correctAnswer: 'B',
      explanation: 'Sandyford Industrial estate is accessed using the M50 motorway. The M50 ring road provides easy access to Sandyford in Dublin 18, which is a major business and industrial area.'
    },
    {
      questionText: 'Where is Airside Business Park situated?',
      options: [
        { id: 'A', text: 'Baldonnell' },
        { id: 'B', text: 'Clonshaugh' },
        { id: 'C', text: 'Ballycoolin' },
        { id: 'D', text: 'Swords' }
      ],
      correctAnswer: 'D',
      explanation: 'Airside Business Park is situated in Swords. This business park in Dublin is located near Dublin Airport and is easily accessible from the M1 and M50 motorways.'
    },
    {
      questionText: 'Where is Cookstown Industrial Estate situated?',
      options: [
        { id: 'A', text: 'Belgard Road' },
        { id: 'B', text: 'Kylemore Road' },
        { id: 'C', text: 'Calmount Road' },
        { id: 'D', text: 'Lower Ballymount Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Cookstown Industrial Estate is situated on Belgard Road. This industrial estate in Tallaght, Dublin 24, is a significant business area along the N81 corridor.'
    },
    {
      questionText: 'Where is Fashion City located?',
      options: [
        { id: 'A', text: 'Ballymount' },
        { id: 'B', text: 'Knocklyon' },
        { id: 'C', text: 'Bluebell' },
        { id: 'D', text: 'Clondalkin' }
      ],
      correctAnswer: 'A',
      explanation: 'Fashion City is located in Ballymount. This is a major retail and business complex in Dublin 12, known for its fashion outlets and business units.'
    },
    {
      questionText: 'Where is Hibernian Industrial Estate located?',
      options: [
        { id: 'A', text: 'Tallaght' },
        { id: 'B', text: 'Clondalkin' },
        { id: 'C', text: 'Sandyford' },
        { id: 'D', text: 'Bluebell' }
      ],
      correctAnswer: 'A',
      explanation: 'Hibernian Industrial Estate is located in Tallaght. This industrial estate in Dublin 24 is an important business area, easily accessible from the N81 and M50.'
    },
    {
      questionText: 'Where is Robinhood Industrial Estate situated?',
      options: [
        { id: 'A', text: 'Belgard Road' },
        { id: 'B', text: 'Kylemore Road' },
        { id: 'C', text: 'Nangor Road' },
        { id: 'D', text: 'Long Mile Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Robinhood Industrial Estate is situated on Long Mile Road. This industrial estate in Dublin 12 is a significant business area along this main road.'
    },
    {
      questionText: 'Where is South County Business Park situated?',
      options: [
        { id: 'A', text: 'Stillorgan' },
        { id: 'B', text: 'Dundrum' },
        { id: 'C', text: 'Leopardstown' },
        { id: 'D', text: 'Dun Laoghaire' }
      ],
      correctAnswer: 'C',
      explanation: 'South County Business Park is situated in Leopardstown. This business park in Dublin 18 is located near the M50 and is easily accessible from the city center and airport.'
    },
    {
      questionText: 'Where is Western Business Park & Industrial Estate located?',
      options: [
        { id: 'A', text: 'Bluebell' },
        { id: 'B', text: 'Tallaght' },
        { id: 'C', text: 'Knocklyon' },
        { id: 'D', text: 'Fox & Geese' }
      ],
      correctAnswer: 'D',
      explanation: 'Western Business Park & Industrial Estate is located in Fox & Geese. This business and industrial area in Dublin 12 is an important location for businesses operating in west Dublin.'
    },
    {
      questionText: 'Which road is Cherrywood Business Park on?',
      options: [
        { id: 'A', text: 'Sandyford Road' },
        { id: 'B', text: 'Enniskerry Road' },
        { id: 'C', text: 'Mullinastill Road' },
        { id: 'D', text: 'Cherrywood Park' }
      ],
      correctAnswer: 'D',
      explanation: 'Cherrywood Business Park is on Cherrywood Park. This business park in Dublin is located in the Cherrywood area and is easily accessible from the M50 and N11.'
    }
  ]

  for (let i = 0; i < industrialQuestions.length; i++) {
    const q = industrialQuestions[i]
    await prisma.question.create({
      data: {
        chapterId: industrialChapter.id,
        questionText: q.questionText,
        questionNumber: i + 1,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: 'medium',
        points: 1,
        category: 'AREA_KNOWLEDGE',
      }
    })
  }

  console.log(`✅ Created ${industrialQuestions.length} questions for Industrial Estates & Business Parks\n`)

  // ============================================
  // CHAPTER 3: Stadiums, Sport Grounds and Clubs
  // ============================================
  console.log('📝 Creating Chapter 3: Stadiums, Sport Grounds and Clubs...')
  
  const stadiumsChapter = await prisma.chapter.create({
    data: {
      id: 'chapter_stadiums_sport_grounds_clubs',
      title: 'Stadiums, Sport Grounds and Clubs',
      description: 'Master your knowledge of Dublin\'s sports venues including GAA stadiums, golf clubs, cricket clubs, and other sporting facilities.',
      chapterNumber: nextChapterNumber + 2,
      type: 'MCQ',
      category: 'AREA_KNOWLEDGE',
      duration: 90,
      isActive: true,
    }
  })

  const stadiumsQuestions = [
    {
      questionText: 'Ballyboden GAA Clubhouse is located where?',
      options: [
        { id: 'A', text: 'Ballyboden Road' },
        { id: 'B', text: 'Stocking Lane' },
        { id: 'C', text: 'Firhouse Road' },
        { id: 'D', text: 'Rathfarnham' }
      ],
      correctAnswer: 'C',
      explanation: 'Ballyboden GAA Clubhouse is located on Firhouse Road. This is the home of Ballyboden St Enda\'s GAA club, one of Dublin\'s prominent GAA clubs.'
    },
    {
      questionText: 'Clontarf Cricket Club is situated on which road?',
      options: [
        { id: 'A', text: 'Clontarf Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Kincora Avenue' },
        { id: 'D', text: 'Castle Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Clontarf Cricket Club is situated on Castle Avenue. This is a well-known cricket club in the Clontarf area of Dublin 3.'
    },
    {
      questionText: 'Donnybrook Lawn Tennis Club is situated where?',
      options: [
        { id: 'A', text: 'Anglesea Road' },
        { id: 'B', text: 'Park Avenue' },
        { id: 'C', text: 'Belmont Avenue' },
        { id: 'D', text: 'Brookvale Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Donnybrook Lawn Tennis Club is situated on Brookvale Road. This tennis club is located in the Donnybrook area of Dublin 4.'
    },
    {
      questionText: 'Fitzwilliam Lawn Tennis Club is situated on which road?',
      options: [
        { id: 'A', text: 'Waterloo Road' },
        { id: 'B', text: 'Donnybrook Road' },
        { id: 'C', text: 'Winton Road' },
        { id: 'D', text: 'Appian Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Fitzwilliam Lawn Tennis Club is situated on Winton Road. This is one of Dublin\'s premier tennis clubs, located in the Donnybrook area.'
    },
    {
      questionText: 'In what area is Lansdowne Valley Pitch and Putt?',
      options: [
        { id: 'A', text: 'Kimmage' },
        { id: 'B', text: 'Crumlin' },
        { id: 'C', text: 'Bluebell' },
        { id: 'D', text: 'Drimnagh' }
      ],
      correctAnswer: 'D',
      explanation: 'Lansdowne Valley Pitch and Putt is in Drimnagh. This pitch and putt course is located in the Drimnagh area of Dublin 12.'
    },
    {
      questionText: 'In what area is Parnell Park GAA stadium situated?',
      options: [
        { id: 'A', text: 'Artane' },
        { id: 'B', text: 'Cabra' },
        { id: 'C', text: 'Coolock' },
        { id: 'D', text: 'Donnycarney' }
      ],
      correctAnswer: 'D',
      explanation: 'Parnell Park GAA stadium is situated in Donnycarney. This is the home ground of Parnell\'s GAA club and is an important GAA venue in north Dublin.'
    },
    {
      questionText: 'Luttrellstown Golf Club is situated where?',
      options: [
        { id: 'A', text: 'Ashtown' },
        { id: 'B', text: 'Blanchardstown' },
        { id: 'C', text: 'Mount Merrion' },
        { id: 'D', text: 'Castleknock' }
      ],
      correctAnswer: 'D',
      explanation: 'Luttrellstown Golf Club is situated in Castleknock. This is a prestigious golf club located in the Castleknock area of Dublin 15.'
    },
    {
      questionText: 'Merrion Cricket Club is situated where?',
      options: [
        { id: 'A', text: 'Castle Avenue' },
        { id: 'B', text: 'Chesterfield Avenue' },
        { id: 'C', text: 'Observatory Lane' },
        { id: 'D', text: 'Anglesea Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Merrion Cricket Club is situated on Anglesea Road. This cricket club is located in the Ballsbridge area of Dublin 4.'
    },
    {
      questionText: 'Milltown Golf Club is situated on which road?',
      options: [
        { id: 'A', text: 'Lower Churchtown Road' },
        { id: 'B', text: 'Whitechurch Road' },
        { id: 'C', text: 'Milltown Road' },
        { id: 'D', text: 'Golf Links Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Milltown Golf Club is situated on Lower Churchtown Road. This golf club is located in the Milltown area of Dublin 6.'
    },
    {
      questionText: 'Morton Stadium is an athletics stadium in what area?',
      options: [
        { id: 'A', text: 'UCD' },
        { id: 'B', text: 'DCU' },
        { id: 'C', text: 'Malahide' },
        { id: 'D', text: 'Santry' }
      ],
      correctAnswer: 'D',
      explanation: 'Morton Stadium is an athletics stadium in Santry. This is Ireland\'s premier athletics stadium, located in the Santry area of Dublin 9.'
    },
    {
      questionText: 'Neptune Rowing Club is situated where?',
      options: [
        { id: 'A', text: 'Conyngham Road' },
        { id: 'B', text: 'Chapelizod Road' },
        { id: 'C', text: 'Goldenbridge' },
        { id: 'D', text: 'North Circular Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Neptune Rowing Club is situated on Chapelizod Road. This rowing club is located in the Chapelizod area, along the River Liffey.'
    },
    {
      questionText: 'Off which main road is Leinster Cricket Club located?',
      options: [
        { id: 'A', text: 'Lower Rathmines Road' },
        { id: 'B', text: 'Ranelagh Road' },
        { id: 'C', text: 'Park Avenue' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Leinster Cricket Club is located off Lower Rathmines Road. This cricket club is situated in the Rathmines area of Dublin 6.'
    },
    {
      questionText: 'On a GAA match day in Croke Park what road is inaccessible to vehicles?',
      options: [
        { id: 'A', text: 'Clonliffe Road' },
        { id: 'B', text: 'Distillery Road' },
        { id: 'C', text: 'North Circular Road' },
        { id: 'D', text: 'Richmond Road' }
      ],
      correctAnswer: 'A',
      explanation: 'On a GAA match day in Croke Park, Clonliffe Road is inaccessible to vehicles. This road is closed to traffic on match days to facilitate pedestrian access to the stadium.'
    },
    {
      questionText: 'On a match day, where would you drop a passenger that wants to go to the West entrance of Croke Park?',
      options: [
        { id: 'A', text: 'St James\'s Avenue' },
        { id: 'B', text: 'Distillery Road' },
        { id: 'C', text: 'Russell Street' },
        { id: 'D', text: 'Clonliffe Road' }
      ],
      correctAnswer: 'C',
      explanation: 'On a match day, you would drop a passenger at Russell Street for the West entrance of Croke Park. Russell Street provides access to the western side of the stadium.'
    },
    {
      questionText: 'On what road is Deerpark Golf Club found?',
      options: [
        { id: 'A', text: 'Nutley Road' },
        { id: 'B', text: 'Deerpark Road' },
        { id: 'C', text: 'Howth Road' },
        { id: 'D', text: 'Collins Avenue' }
      ],
      correctAnswer: 'C',
      explanation: 'Deerpark Golf Club is found on Howth Road. This golf club is located in the Howth area of north Dublin.'
    },
    {
      questionText: 'On what road is Edmondstown Golf Club found?',
      options: [
        { id: 'A', text: 'Whitehall Road' },
        { id: 'B', text: 'Grange Road' },
        { id: 'C', text: 'Stocking Lane' },
        { id: 'D', text: 'Edmonstown Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Edmondstown Golf Club is found on Edmonstown Road. This golf club is located in the Rathfarnham area of Dublin 14.'
    },
    {
      questionText: 'On what road is Elm Park Golf Club found?',
      options: [
        { id: 'A', text: 'Torquay Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Grange Road' },
        { id: 'D', text: 'Malahide Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Elm Park Golf Club is found on Nutley Lane. This golf club is located in the Donnybrook area of Dublin 4.'
    },
    {
      questionText: 'On what road is Elmgreen Golf Club found?',
      options: [
        { id: 'A', text: 'South Bull Island' },
        { id: 'B', text: 'Cappagh Road' },
        { id: 'C', text: 'Dunsink Lane' },
        { id: 'D', text: 'River Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Elmgreen Golf Club is found on Dunsink Lane. This golf club is located in the Finglas area of Dublin 11.'
    },
    {
      questionText: 'On what road is Forrest Little Golf Club found?',
      options: [
        { id: 'A', text: 'Swords, Cloghran' },
        { id: 'B', text: 'Santry' },
        { id: 'C', text: 'Ballymun' },
        { id: 'D', text: 'Kinsealy' }
      ],
      correctAnswer: 'A',
      explanation: 'Forrest Little Golf Club is found in Swords, Cloghran. This golf club is located in the Swords area of north Dublin, near Dublin Airport.'
    },
    {
      questionText: 'On what road is Foxrock Golf Club situated?',
      options: [
        { id: 'A', text: 'Brighton Road' },
        { id: 'B', text: 'Westminister Road' },
        { id: 'C', text: 'Torquay Road' },
        { id: 'D', text: 'Leopardstown Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Foxrock Golf Club is situated on Torquay Road. This golf club is located in the Foxrock area of Dublin 18.'
    },
    {
      questionText: 'On what road is Grange Golf Club found?',
      options: [
        { id: 'A', text: 'Stocking Lane' },
        { id: 'B', text: 'Kimmage Road West' },
        { id: 'C', text: 'Whitechurch Road' },
        { id: 'D', text: 'Grange Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Grange Golf Club is found on Whitechurch Road. This golf club is located in the Rathfarnham area of Dublin 14.'
    },
    {
      questionText: 'On what road is Howth Golf Club found?',
      options: [
        { id: 'A', text: 'Station Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Bailey Green Road' },
        { id: 'D', text: 'Carrickbrack Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Howth Golf Club is found on Carrickbrack Road. This golf club is located in the Howth area of north Dublin.'
    },
    {
      questionText: 'On what road is the Aviva Stadium situated?',
      options: [
        { id: 'A', text: 'Lansdowne Road' },
        { id: 'B', text: 'Bath Avenue' },
        { id: 'C', text: 'Merrion Road' },
        { id: 'D', text: 'Shelbourne Road' }
      ],
      correctAnswer: 'A',
      explanation: 'The Aviva Stadium is situated on Lansdowne Road. This is Ireland\'s national rugby and football stadium, located in the Ballsbridge area of Dublin 4.'
    },
    {
      questionText: 'On what road is the entrance to Tolka Valley Pitch and Putt?',
      options: [
        { id: 'A', text: 'Tolka Valley Road' },
        { id: 'B', text: 'Ballybogan Road' },
        { id: 'C', text: 'Rathoath Road' },
        { id: 'D', text: 'River Road' }
      ],
      correctAnswer: 'B',
      explanation: 'The entrance to Tolka Valley Pitch and Putt is on Ballybogan Road. This pitch and putt course is located in the Finglas area of Dublin 11.'
    },
    {
      questionText: 'On what road is West Wood Gym located?',
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Alfie Byrne Road' },
        { id: 'C', text: 'East Wall Road' },
        { id: 'D', text: 'Clontarf Road' }
      ],
      correctAnswer: 'D',
      explanation: 'West Wood Gym is located on Clontarf Road. This gym is situated in the Clontarf area of Dublin 3.'
    },
    {
      questionText: 'On what street is City West Golf Club situated?',
      options: [
        { id: 'A', text: 'Mount Merrion' },
        { id: 'B', text: 'Naas Road' },
        { id: 'C', text: 'Grange Road' },
        { id: 'D', text: 'Leopardstown Road' }
      ],
      correctAnswer: 'B',
      explanation: 'City West Golf Club is situated on Naas Road. This golf club is located in the Citywest area of Dublin 24, along the N7 corridor.'
    },
    {
      questionText: 'On what street is Clontarf Golf Club situated?',
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Castle Avenue' },
        { id: 'D', text: 'Vernon Avenue' }
      ],
      correctAnswer: 'B',
      explanation: 'Clontarf Golf Club is situated on Malahide Road. This golf club is located in the Clontarf area of Dublin 3.'
    },
    {
      questionText: 'On what ROAD is St. Patrick\'s Athletic F.C. situated?',
      options: [
        { id: 'A', text: 'Kimmage Road West' },
        { id: 'B', text: 'Emmet Road' },
        { id: 'C', text: 'Whitestown Way' },
        { id: 'D', text: 'Richmond Road' }
      ],
      correctAnswer: 'B',
      explanation: 'St. Patrick\'s Athletic F.C. is situated on Emmet Road. This is the home ground of St. Patrick\'s Athletic football club, located in Inchicore, Dublin 8.'
    },
    {
      questionText: 'On what ROAD is Tolka Park situated?',
      options: [
        { id: 'A', text: 'Grace Park Road' },
        { id: 'B', text: 'Richmond Road' },
        { id: 'C', text: 'Griffith Avenue' },
        { id: 'D', text: 'Emmet Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Tolka Park is situated on Richmond Road. This is the home ground of Shelbourne F.C., located in the Drumcondra area of Dublin 9.'
    },
    {
      questionText: 'Railway Union Sports Club is situated where?',
      options: [
        { id: 'A', text: 'The Hole in the Wall Road' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Kiltipper Road' },
        { id: 'D', text: 'Park Avenue, Sandymount' }
      ],
      correctAnswer: 'D',
      explanation: 'Railway Union Sports Club is situated on Park Avenue, Sandymount. This sports club is located in the Sandymount area of Dublin 4.'
    },
    {
      questionText: 'Royal Dublin Golf Club is found where?',
      options: [
        { id: 'A', text: 'Clontarf' },
        { id: 'B', text: 'Santry' },
        { id: 'C', text: 'Sutton' },
        { id: 'D', text: 'North Bull Island, Dollymount' }
      ],
      correctAnswer: 'D',
      explanation: 'Royal Dublin Golf Club is found on North Bull Island, Dollymount. This is a prestigious links golf course located on Bull Island in Dublin Bay.'
    },
    {
      questionText: 'St. Anne\'s Golf Club is situated where?',
      options: [
        { id: 'A', text: 'Malahide' },
        { id: 'B', text: 'North Bull Island' },
        { id: 'C', text: 'Dollymount' },
        { id: 'D', text: 'Portmarnock' }
      ],
      correctAnswer: 'B',
      explanation: 'St. Anne\'s Golf Club is situated on North Bull Island. This golf club is located on Bull Island in Dublin Bay, near Dollymount.'
    },
    {
      questionText: 'The Athletic Union League (AUL) Complex is situated where?',
      options: [
        { id: 'A', text: 'Coolock Lane' },
        { id: 'B', text: 'Malahide Road' },
        { id: 'C', text: 'Santry Avenue' },
        { id: 'D', text: 'Clonshaugh Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Athletic Union League (AUL) Complex is situated on Clonshaugh Road. This sports complex is located in the Clonshaugh area of Dublin 17.'
    },
    {
      questionText: 'The Castle Golf Club is situated on which road?',
      options: [
        { id: 'A', text: 'Nutley Lane' },
        { id: 'B', text: 'Lower Churchtown Road' },
        { id: 'C', text: 'Greystones Road' },
        { id: 'D', text: 'Woodside Drive, Rathfarnam' }
      ],
      correctAnswer: 'D',
      explanation: 'The Castle Golf Club is situated on Woodside Drive, Rathfarnam. This golf club is located in the Rathfarnham area of Dublin 14.'
    },
    {
      questionText: 'The GAA Centre of Excellence is situated where?',
      options: [
        { id: 'A', text: 'Edenmore Park' },
        { id: 'B', text: 'Kiltipper Road' },
        { id: 'C', text: 'Snugborough Road' },
        { id: 'D', text: 'Botanic Avenue' }
      ],
      correctAnswer: 'C',
      explanation: 'The GAA Centre of Excellence is situated on Snugborough Road. This is a major GAA training and development facility located in Blanchardstown, Dublin 15.'
    },
    {
      questionText: 'The Island Golf Club is situated where?',
      options: [
        { id: 'A', text: 'Dollymount' },
        { id: 'B', text: 'Donabate' },
        { id: 'C', text: 'Portmarnock' },
        { id: 'D', text: 'Clontarf' }
      ],
      correctAnswer: 'B',
      explanation: 'The Island Golf Club is situated in Donabate. This is a links golf course located in Donabate, north County Dublin.'
    },
    {
      questionText: 'The National Aquatic Centre is situated where?',
      options: [
        { id: 'A', text: 'Belfield' },
        { id: 'B', text: 'Navan Road' },
        { id: 'C', text: 'Castle Avenue' },
        { id: 'D', text: 'Snugborough Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The National Aquatic Centre is situated on Snugborough Road. This is Ireland\'s premier swimming and aquatic sports facility, located in Blanchardstown, Dublin 15.'
    },
    {
      questionText: 'The National Sports Campus is situated where?',
      options: [
        { id: 'A', text: 'Observatory Lane' },
        { id: 'B', text: 'Templeogue Road' },
        { id: 'C', text: 'Oscar Traynor Road' },
        { id: 'D', text: 'Snugborough Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The National Sports Campus is situated on Snugborough Road. This is Ireland\'s premier sports facility complex, located in Blanchardstown, Dublin 15, and includes the National Aquatic Centre and other sports facilities.'
    },
    {
      questionText: 'The World Rugby offices are situated where?',
      options: [
        { id: 'A', text: 'Castle Avenue' },
        { id: 'B', text: 'Rugby Road' },
        { id: 'C', text: 'Lansdowne Road' },
        { id: 'D', text: 'Lower Pembroke Street' }
      ],
      correctAnswer: 'D',
      explanation: 'The World Rugby offices are situated on Lower Pembroke Street. These offices are located in the Ballsbridge area of Dublin 4, near the Aviva Stadium.'
    },
    {
      questionText: 'Where are Home Farm Grounds located?',
      options: [
        { id: 'A', text: 'Phibsborough Road' },
        { id: 'B', text: 'Emmet Road' },
        { id: 'C', text: 'Swords Road' },
        { id: 'D', text: 'Richmond Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Home Farm Grounds are located on Swords Road. This is the home ground of Home Farm F.C., located in the Whitehall area of Dublin 9.'
    },
    {
      questionText: 'Where are Shamrock Rovers Grounds located?',
      options: [
        { id: 'A', text: 'Whitestown Way' },
        { id: 'B', text: 'Richmond Road' },
        { id: 'C', text: 'Swords Road' },
        { id: 'D', text: 'Emmet Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Shamrock Rovers Grounds are located on Whitestown Way. This is Tallaght Stadium, the home ground of Shamrock Rovers F.C., located in Tallaght, Dublin 24.'
    },
    {
      questionText: 'Where are the Union Iveagh Grounds/ St. James Gaels located?',
      options: [
        { id: 'A', text: 'Grange Road' },
        { id: 'B', text: 'Kildare Road' },
        { id: 'C', text: 'Crumlin Road' },
        { id: 'D', text: 'Clonmel Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The Union Iveagh Grounds/St. James Gaels are located on Crumlin Road. This GAA ground is located in the Crumlin area of Dublin 12.'
    },
    {
      questionText: 'Where is Clontarf Cricket Club located?',
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Clontarf Road' },
        { id: 'C', text: 'Vernon Avenue' },
        { id: 'D', text: 'Castle Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Clontarf Cricket Club is located on Castle Avenue. This cricket club is situated in the Clontarf area of Dublin 3.'
    },
    {
      questionText: 'Where is Clontarf Rugby Club located?',
      options: [
        { id: 'A', text: 'Clontarf Road' },
        { id: 'B', text: 'Vernon Avenue' },
        { id: 'C', text: 'Castle Avenue' },
        { id: 'D', text: 'Howth Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Clontarf Rugby Club is located on Castle Avenue. This rugby club is situated in the Clontarf area of Dublin 3.'
    },
    {
      questionText: 'Where is Croke Park located?',
      options: [
        { id: 'A', text: 'Clonliffe Road' },
        { id: 'B', text: 'North Circular Road' },
        { id: 'C', text: 'Jones\' Road' },
        { id: 'D', text: 'Drumcondra Road Lower' }
      ],
      correctAnswer: 'C',
      explanation: 'Croke Park is located on Jones\' Road. This is Ireland\'s largest stadium and the headquarters of the GAA, located in the Drumcondra area of Dublin 3.'
    },
    {
      questionText: 'Where is Cuala GAA, Dalkey located?',
      options: [
        { id: 'A', text: 'Ulverton Road' },
        { id: 'B', text: 'Hyde Road' },
        { id: 'C', text: 'Harbour Road' },
        { id: 'D', text: 'Castle Park Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Cuala GAA, Dalkey is located on Hyde Road. This GAA club is situated in the Dalkey area of south Dublin.'
    },
    {
      questionText: 'Where is Dalymount Park located?',
      options: [
        { id: 'A', text: 'Richmond Road' },
        { id: 'B', text: 'Emmet Road' },
        { id: 'C', text: 'Swords Road' },
        { id: 'D', text: 'Phibsborough Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Dalymount Park is located on Phibsborough Road. This is the home ground of Bohemians F.C., located in the Phibsborough area of Dublin 7.'
    },
    {
      questionText: 'Where is Fitzwilliam Tennis Club located is situated where?',
      options: [
        { id: 'A', text: 'Mountpleasant Square' },
        { id: 'B', text: 'Whitworth Road' },
        { id: 'C', text: 'Winton Road' },
        { id: 'D', text: 'Ballymun Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Fitzwilliam Tennis Club is located on Winton Road. This is one of Dublin\'s premier tennis clubs, located in the Donnybrook area.'
    },
    {
      questionText: 'Where is Howth Yacht Club located?',
      options: [
        { id: 'A', text: 'Balscadden Road' },
        { id: 'B', text: 'Thormanby Road' },
        { id: 'C', text: 'Church Street' },
        { id: 'D', text: 'Harbour Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Howth Yacht Club is located on Harbour Road. This yacht club is situated in Howth Harbour, north Dublin.'
    },
    {
      questionText: 'Where is Irishtown Stadium is situated where?',
      options: [
        { id: 'A', text: 'Strand Street' },
        { id: 'B', text: 'Richmond Road' },
        { id: 'C', text: 'Lansdowne Road' },
        { id: 'D', text: 'South Circular Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Irishtown Stadium is situated on Strand Street. This athletics stadium is located in the Irishtown area of Dublin 4.'
    },
    {
      questionText: 'Where is Kilmacud GAA Clubhouse is situated where?',
      options: [
        { id: 'A', text: 'Glenalbyn Road' },
        { id: 'B', text: 'Collins Avenue' },
        { id: 'C', text: 'Spruce Avenue' },
        { id: 'D', text: 'Botanic Avenue' }
      ],
      correctAnswer: 'A',
      explanation: 'Kilmacud GAA Clubhouse is situated on Glenalbyn Road. This GAA club is located in the Stillorgan area of Dublin 18.'
    },
    {
      questionText: 'Where is Leopardstown Racecourse located?',
      options: [
        { id: 'A', text: 'Brewery Road' },
        { id: 'B', text: 'Grange Road' },
        { id: 'C', text: 'Leopardstown Road' },
        { id: 'D', text: 'Brighton Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Leopardstown Racecourse is located on Leopardstown Road. This is one of Ireland\'s premier horse racing venues, located in the Leopardstown area of Dublin 18.'
    },
    {
      questionText: 'Where is Old Belvedere Rugby Club is situated where?',
      options: [
        { id: 'A', text: 'Greenlea Grove' },
        { id: 'B', text: 'Park Avenue' },
        { id: 'C', text: 'Ballychorus Road' },
        { id: 'D', text: 'Ailesbury Grove' }
      ],
      correctAnswer: 'D',
      explanation: 'Old Belvedere Rugby Club is situated on Ailesbury Grove. This rugby club is located in the Donnybrook area of Dublin 4.'
    },
    {
      questionText: 'Where is Old Wesley Rugby Club is situated where?',
      options: [
        { id: 'A', text: 'Donnybrook Road' },
        { id: 'B', text: 'Edmondstown Road' },
        { id: 'C', text: 'Merrion Road' },
        { id: 'D', text: 'Gordon Park' }
      ],
      correctAnswer: 'A',
      explanation: 'Old Wesley Rugby Club is situated on Donnybrook Road. This rugby club is located in the Donnybrook area of Dublin 4.'
    },
    {
      questionText: 'Where is Pembroke Cricket Club situated?',
      options: [
        { id: 'A', text: 'Blackrock' },
        { id: 'B', text: 'Clontarf' },
        { id: 'C', text: 'Ballsbridge' },
        { id: 'D', text: 'Sandymount' }
      ],
      correctAnswer: 'D',
      explanation: 'Pembroke Cricket Club is situated in Sandymount. This cricket club is located in the Sandymount area of Dublin 4.'
    },
    {
      questionText: 'Where is Richmond Park situated?',
      options: [
        { id: 'A', text: 'Raheny' },
        { id: 'B', text: 'Stillorgan' },
        { id: 'C', text: 'Inchicore' },
        { id: 'D', text: 'Tallaght' }
      ],
      correctAnswer: 'C',
      explanation: 'Richmond Park is situated in Inchicore. This is the home ground of St. Patrick\'s Athletic F.C., located in Inchicore, Dublin 8.'
    },
    {
      questionText: 'Where is Shelbourne Park Greyhound Stadium located?',
      options: [
        { id: 'A', text: 'Ringsend Road' },
        { id: 'B', text: 'Bath Avenue' },
        { id: 'C', text: 'South Lotts Road' },
        { id: 'D', text: 'Tritonville Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Shelbourne Park Greyhound Stadium is located on South Lotts Road. This greyhound racing stadium is situated in the Ringsend area of Dublin 4.'
    },
    {
      questionText: 'Where is St. Finians GAA Club located?',
      options: [
        { id: 'A', text: 'Ballymun' },
        { id: 'B', text: 'Swords' },
        { id: 'C', text: 'Cabra' },
        { id: 'D', text: 'Santry' }
      ],
      correctAnswer: 'B',
      explanation: 'St. Finians GAA Club is located in Swords. This GAA club is situated in the Swords area of north County Dublin.'
    },
    {
      questionText: 'Where is St. Vincents GAA Club located?',
      options: [
        { id: 'A', text: 'Clontarf' },
        { id: 'B', text: 'Cabra' },
        { id: 'C', text: 'Marino' },
        { id: 'D', text: 'Ballymun' }
      ],
      correctAnswer: 'C',
      explanation: 'St. Vincents GAA Club is located in Marino. This GAA club is situated in the Marino area of Dublin 3.'
    },
    {
      questionText: 'Where is Tennis Ireland situated?',
      options: [
        { id: 'A', text: 'Nephin Road, Castleknock' },
        { id: 'B', text: 'Beneavin Dr, Ballygall' },
        { id: 'C', text: 'Snugborough Rd, Blanchardstown' },
        { id: 'D', text: 'Claremont Road, Dublin 4' }
      ],
      correctAnswer: 'C',
      explanation: 'Tennis Ireland is situated on Snugborough Road, Blanchardstown. This is the national governing body for tennis in Ireland, located in the Blanchardstown area of Dublin 15.'
    },
    {
      questionText: 'Where is the National Basketball Arena located?',
      options: [
        { id: 'A', text: 'Greenhills Road' },
        { id: 'B', text: 'Knocklyon Road' },
        { id: 'C', text: 'Tymon North' },
        { id: 'D', text: 'Fettercairn' }
      ],
      correctAnswer: 'C',
      explanation: 'The National Basketball Arena is located in Tymon North. This is Ireland\'s premier basketball venue, located in the Tallaght area of Dublin 24.'
    },
    {
      questionText: 'Where is the National Hockey Stadium located?',
      options: [
        { id: 'A', text: 'Marley Park' },
        { id: 'B', text: 'Trinity College' },
        { id: 'C', text: 'Nutley Lane' },
        { id: 'D', text: 'UCD' }
      ],
      correctAnswer: 'D',
      explanation: 'The National Hockey Stadium is located at UCD (University College Dublin). This is Ireland\'s premier field hockey venue, located on the UCD campus in Belfield, Dublin 4.'
    },
    {
      questionText: 'Where is the National Stadium located?',
      options: [
        { id: 'A', text: 'Swords Road' },
        { id: 'B', text: 'Santry Avenue' },
        { id: 'C', text: 'Finglas Road' },
        { id: 'D', text: 'South Circular Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The National Stadium is located on South Circular Road. This is Ireland\'s premier boxing and combat sports venue, located in the Inchicore area of Dublin 8.'
    },
    {
      questionText: 'Where is the Royal Irish Yacht Club, Dun Laoghaire located?',
      options: [
        { id: 'A', text: 'Park Road' },
        { id: 'B', text: 'Marine Road' },
        { id: 'C', text: 'Queen\'s Road' },
        { id: 'D', text: 'Harbour Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Royal Irish Yacht Club, Dun Laoghaire is located on Harbour Road. This prestigious yacht club is situated in Dun Laoghaire Harbour, south County Dublin.'
    }
  ]

  for (let i = 0; i < stadiumsQuestions.length; i++) {
    const q = stadiumsQuestions[i]
    await prisma.question.create({
      data: {
        chapterId: stadiumsChapter.id,
        questionText: q.questionText,
        questionNumber: i + 1,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: 'medium',
        points: 1,
        category: 'AREA_KNOWLEDGE',
      }
    })
  }

  console.log(`✅ Created ${stadiumsQuestions.length} questions for Stadiums, Sport Grounds and Clubs\n`)

  console.log('🎉 All chapters and questions created successfully!')
  console.log('\n📋 Summary:')
  console.log(`   - Transport & Infrastructure: ${transportQuestions.length} questions`)
  console.log(`   - Industrial Estates & Business Parks: ${industrialQuestions.length} questions`)
  console.log(`   - Stadiums, Sport Grounds and Clubs: ${stadiumsQuestions.length} questions`)
  console.log(`   - Total: ${transportQuestions.length + industrialQuestions.length + stadiumsQuestions.length} questions`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
