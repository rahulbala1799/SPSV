import { PrismaClient, QuestionCategory } from '@prisma/client'
import 'dotenv/config'
import { syncToQuestionBank } from './sync-to-question-bank'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Routes chapter...')

  // Create chapter
  const chapter = await prisma.chapter.upsert({
    where: { id: 'chapter_routes' },
    update: {},
    create: {
      id: 'chapter_routes',
      title: 'Routes',
      description: 'Master your knowledge of routes and navigation between different locations in Dublin. Learn the most direct routes, which roads to take, and which areas you pass through when traveling between various destinations throughout the city.',
      chapterNumber: 11,
      type: 'MCQ',
      duration: 50,
      isActive: true,
      category: QuestionCategory.AREA_KNOWLEDGE
    }
  })

  console.log('✅ Chapter created:', chapter.title)

  // Define all 61 questions with detailed explanations
  const questions = [
    {
      questionText: 'Travelling from Coolock to Omni Park Shopping Centre what two roads do you travel on?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'Oscar Traynor Road and Swords Road' },
        { id: 'B', text: 'Griffith Avenue and Beaumont Road' },
        { id: 'C', text: 'Malahide Road and Saint Brigids Road' },
        { id: 'D', text: 'Kilmore Road and Ardlea Road' }
      ],
      correctAnswer: 'A',
      explanation: 'When travelling from Coolock to Omni Park Shopping Centre, you travel on Oscar Traynor Road and Swords Road. Coolock is in north Dublin, and Omni Park Shopping Centre is located in Santry. Oscar Traynor Road runs from Coolock towards Santry, and then you continue on Swords Road to reach the shopping centre. This is the most direct route connecting these two locations in north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'When travelling from Walkinstown to Dublin City which two areas do you pass?',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Crumlin and Dolphin\'s Barn' },
        { id: 'B', text: 'Kimmage and Harold\'s Cross' },
        { id: 'C', text: 'Terenure and Harold\'s Cross' },
        { id: 'D', text: 'Drimnagh and Crumlin' }
      ],
      correctAnswer: 'A',
      explanation: 'When travelling from Walkinstown to Dublin City Centre, you pass through Crumlin and Dolphin\'s Barn. Walkinstown is in southwest Dublin, and the most direct route to the city center takes you through Crumlin (via Crumlin Road) and then through Dolphin\'s Barn (via the South Circular Road area). This route connects the southwest suburbs to the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Driving from Drumcondra to Kilbarrack what areas would you drive by?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Fairview, Killester and Raheny' },
        { id: 'B', text: 'Whitehall, Donnycarney and Artane' },
        { id: 'C', text: 'Marino, Donnycarney and Beaumont' },
        { id: 'D', text: 'Clontarf, Coolock and Beaumont' }
      ],
      correctAnswer: 'A',
      explanation: 'Driving from Drumcondra to Kilbarrack, you would drive by Fairview, Killester, and Raheny. Drumcondra is in north Dublin, and Kilbarrack is further north along the coast. The route takes you through Fairview (via Fairview Strand/Howth Road), then through Killester, and finally through Raheny before reaching Kilbarrack. This follows the coastal route in north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Driving from O\'Connell Street to Drumcondra, which would be the furthest away?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'Whitehall' },
        { id: 'B', text: 'Phibsborough' },
        { id: 'C', text: 'Fairview' },
        { id: 'D', text: 'Ballybough' }
      ],
      correctAnswer: 'A',
      explanation: 'When driving from O\'Connell Street to Drumcondra, Whitehall would be the furthest away from the direct route. The most direct route from O\'Connell Street to Drumcondra goes through Ballybough, Fairview, and then Drumcondra Road. Phibsborough is also relatively close to this route. Whitehall, however, is located further west and would require a significant detour, making it the furthest away from the direct route to Drumcondra.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What National Road takes you from the city centre to Lucan?',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'N3' },
        { id: 'B', text: 'N5' },
        { id: 'C', text: 'N4' },
        { id: 'D', text: 'N6' }
      ],
      correctAnswer: 'C',
      explanation: 'The N4 (Navan Road) takes you from the city centre to Lucan. The N4 is a major national primary road that runs from Dublin city center westwards. It passes through areas like Chapelizod and continues towards Lucan, and then further west to Maynooth, Mullingar, and beyond. This is the main route connecting Dublin city center with Lucan and the west of Ireland.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Travelling from Donaghmede to Donnycarney what two roads do you travel on?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'Howth Road and Watermill Road' },
        { id: 'B', text: 'Grange Road and Oscar Traynor Road' },
        { id: 'C', text: 'Tonlegee Road and Malahide Road' },
        { id: 'D', text: 'Malahide Road and Skellys Lane' }
      ],
      correctAnswer: 'C',
      explanation: 'Travelling from Donaghmede to Donnycarney, you travel on Tonlegee Road and Malahide Road. Donaghmede is in northeast Dublin, and Donnycarney is slightly to the west. The route takes you from Donaghmede via Tonlegee Road, which then connects to Malahide Road, and Malahide Road continues through Donnycarney. This is the most direct route between these two areas in north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What road would NOT be included on the route from UCD, Belfield to St. Vincent\'s Hospital?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'Nutley Lane' },
        { id: 'B', text: 'Foster\'s Avenue' },
        { id: 'C', text: 'Stillorgan Road' },
        { id: 'D', text: 'Mount Merrion Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Mount Merrion Avenue would NOT be included on the route from UCD (Belfield) to St. Vincent\'s Hospital. UCD is in Belfield, south Dublin, and St. Vincent\'s Hospital is on Merrion Road. The most direct route would typically use roads like Nutley Lane, Foster\'s Avenue, or Stillorgan Road, but Mount Merrion Avenue is in a different area (Mount Merrion) and would not be on the direct route between these two locations.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'If travelling to the Phoenix Park from Sutton what three areas do you pass through?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Coolock, Glasnevin and Finglas' },
        { id: 'B', text: 'Malahide, Ballymun and Finglas' },
        { id: 'C', text: 'Kilbarrack, Ballymun and Cabra' },
        { id: 'D', text: 'Kilbarrack, Clontarf and Fairview' }
      ],
      correctAnswer: 'D',
      explanation: 'If travelling to the Phoenix Park from Sutton, you pass through Kilbarrack, Clontarf, and Fairview. Sutton is on the north coast of Dublin, and Phoenix Park is in the west of the city. The route takes you from Sutton through Kilbarrack, then along the coast through Clontarf, and then through Fairview before heading towards the city center and then to Phoenix Park. This follows the coastal route and then connects to routes leading to Phoenix Park.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Driving from Glenageary to Blackrock, which area would you drive by?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Monkstown' },
        { id: 'B', text: 'Dalkey' },
        { id: 'C', text: 'Mount Merrion' },
        { id: 'D', text: 'Booterstown' }
      ],
      correctAnswer: 'A',
      explanation: 'Driving from Glenageary to Blackrock, you would drive by Monkstown. Glenageary is in south Dublin, along the coast, and Blackrock is further north along the same coastal route. The most direct route between these two areas takes you through Monkstown, which is located between them along the coast. This follows the coastal road (Rock Road) connecting these areas.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Travelling from Palmerstown to the City Centre what two areas do you pass?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'Ballyfermot and Inchicore' },
        { id: 'B', text: 'Chapelizod and Islandbridge' },
        { id: 'C', text: 'Islandbridge and Dolphin\'s Barn' },
        { id: 'D', text: 'Ballyfermot and Chapelizod' }
      ],
      correctAnswer: 'B',
      explanation: 'Travelling from Palmerstown to the City Centre, you pass through Chapelizod and Islandbridge. Palmerstown is in west Dublin, and the most direct route to the city center takes you through Chapelizod (via the Chapelizod Road/Chapelizod Bypass area) and then through Islandbridge before reaching the city center. This route follows the R148 and connects to the city via the quays.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Travelling from Templeogue to the city centre what road do you travel on?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'Greenhills Road' },
        { id: 'B', text: 'Templeville Road' },
        { id: 'C', text: 'Ballyroan Road' },
        { id: 'D', text: 'Templeogue Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Travelling from Templeogue to the city centre, you travel on Templeogue Road. Templeogue is in southwest Dublin, and Templeogue Road is the main road connecting this area to the city center. It continues as various other roads (like Terenure Road, Harold\'s Cross Road) as it approaches the city, but it starts as Templeogue Road from Templeogue itself.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Taking the most direct route from Walkinstown to Ranelagh, which of the following areas would you pass?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Dartry and Kimmage' },
        { id: 'B', text: 'Kimmage and Drimnagh' },
        { id: 'C', text: 'Donnybrook and Ballsbridge' },
        { id: 'D', text: 'Kimmage and Rathgar' }
      ],
      correctAnswer: 'D',
      explanation: 'Taking the most direct route from Walkinstown to Ranelagh, you would pass through Kimmage and Rathgar. Walkinstown is in southwest Dublin, and Ranelagh is in the south inner city. The route takes you through Kimmage (via Kimmage Road) and then through Rathgar (via Rathgar Road) before reaching Ranelagh. This is the most direct route connecting these areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the quickest route from Tallaght to Rathgar?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'R137' },
        { id: 'B', text: 'R821' },
        { id: 'C', text: 'R115' },
        { id: 'D', text: 'R112' }
      ],
      correctAnswer: 'A',
      explanation: 'The quickest route from Tallaght to Rathgar is the R137. The R137 is a regional road that connects Tallaght (in southwest Dublin) with areas to the east, including Rathgar. Regional roads are numbered routes that serve important connections between areas, and the R137 provides a direct route from Tallaght towards the south Dublin area where Rathgar is located.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Taking the most direct route from the Red Cow Hotel to Ranelagh, what areas do you pass?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Terenure, Rathgar and Rathmines' },
        { id: 'B', text: 'Ballymount, Kimmage, Rathmines' },
        { id: 'C', text: 'Drimnagh, Terenure, Rathgar' },
        { id: 'D', text: 'Drimnagh, Dolphins Barn and Portbello' }
      ],
      correctAnswer: 'D',
      explanation: 'Taking the most direct route from the Red Cow Hotel to Ranelagh, you pass through Drimnagh, Dolphin\'s Barn, and Portobello. The Red Cow Hotel is located near the Red Cow Interchange on the Naas Road (N7) in southwest Dublin. The most direct route to Ranelagh takes you through Drimnagh, then through Dolphin\'s Barn (via the South Circular Road area), and then through Portobello before reaching Ranelagh. This route follows the R148 and connects to the city via the southside.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the main road taken from the city centre to Palmerstown?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'R112' },
        { id: 'B', text: 'R148' },
        { id: 'C', text: 'M50' },
        { id: 'D', text: 'N4' }
      ],
      correctAnswer: 'B',
      explanation: 'The main road taken from the city centre to Palmerstown is the R148. The R148 is a regional road that runs from the city center (via the quays and Chapelizod) to Palmerstown and beyond. This is the primary route connecting the city center with Palmerstown and other areas in west Dublin. It follows a route through Chapelizod and Islandbridge before reaching Palmerstown.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'You pick up a passenger at Heuston Station going to the 3Arena, what of the following would you NOT pass through on the quickest route?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'Ellis Quay' },
        { id: 'B', text: 'Wolfe Tone Quay' },
        { id: 'C', text: 'City Quay' },
        { id: 'D', text: 'Ormond Quay' }
      ],
      correctAnswer: 'C',
      explanation: 'On the quickest route from Heuston Station to the 3Arena, you would NOT pass through City Quay. Heuston Station is on the south side of the River Liffey, and the 3Arena is on the north side in the Docklands. The quickest route would take you along the quays on the north side: from Heuston you\'d cross to the north side and travel along Ellis Quay, Ormond Quay, and Wolfe Tone Quay. City Quay is on the south side and would require an unnecessary detour.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The most direct route from Santry to Phoenix Park, takes you by the following three areas:',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'Whitehall, Glasnevin and Cabra' },
        { id: 'B', text: 'Whitehall, East Wall and Smithfield' },
        { id: 'C', text: 'Santry, Finglas and Cabra' },
        { id: 'D', text: 'Glasnevin, Phibsborough and Stoneybatter' }
      ],
      correctAnswer: 'D',
      explanation: 'The most direct route from Santry to Phoenix Park takes you by Glasnevin, Phibsborough, and Stoneybatter. Santry is in north Dublin, and Phoenix Park is in the west of the city. The route takes you from Santry through Glasnevin (via Collins Avenue/Glasnevin Avenue), then through Phibsborough (via Phibsborough Road), and then through Stoneybatter before reaching Phoenix Park. This is the most direct route connecting north Dublin to Phoenix Park.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Driving from Heuston Station to Dublin Zoo, which of the following roads is NOT on your route?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'Chesterfield Avenue' },
        { id: 'B', text: 'Pargate Street' },
        { id: 'C', text: 'Chapelizod Bypass' },
        { id: 'D', text: 'North Road' }
      ],
      correctAnswer: 'D',
      explanation: 'When driving from Heuston Station to Dublin Zoo, North Road is NOT on your route. Heuston Station is near the Phoenix Park, and Dublin Zoo is located within Phoenix Park. The route would take you through the park, likely using roads like Pargate Street (which leads into the park), Chapelizod Bypass (if coming from that direction), and Chesterfield Avenue (the main road through Phoenix Park). North Road, however, is in Finglas and would not be on the route to Dublin Zoo from Heuston.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What areas would you pass through on a route from Kimmage to Leopardstown?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Rathmines, Milltown and Stillorgan' },
        { id: 'B', text: 'Rathgar, Clonskeagh and Mount Merrion' },
        { id: 'C', text: 'Rathgar, Dundrum and Sandyford' },
        { id: 'D', text: 'Dundrum, Sandyford and Stillorgan' }
      ],
      correctAnswer: 'C',
      explanation: 'On a route from Kimmage to Leopardstown, you would pass through Rathgar, Dundrum, and Sandyford. Kimmage is in southwest Dublin, and Leopardstown is in the southeast. The route takes you from Kimmage through Rathgar (via Rathgar Road), then through Dundrum (via Dundrum Road), and then through Sandyford before reaching Leopardstown. This follows a route through the south Dublin suburbs.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Driving from Coolock to Sutton which two roads do you drive on?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'R104 and R808' },
        { id: 'B', text: 'R809 and R124' },
        { id: 'C', text: 'R103 and R105' },
        { id: 'D', text: 'R104 and R105' }
      ],
      correctAnswer: 'D',
      explanation: 'Driving from Coolock to Sutton, you drive on R104 and R105. Coolock is in northeast Dublin, and Sutton is on the north coast. The R104 runs from Coolock towards the coast, and then you continue on the R105 which leads to Sutton. These regional roads provide the connection between Coolock and the coastal areas including Sutton.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Going from Heuston Station to Phibsborough Shopping Center what road would you NOT take?',
      questionNumber: 21,
      options: [
        { id: 'A', text: 'Phibsborough Road' },
        { id: 'B', text: 'Church Street' },
        { id: 'C', text: 'Capel Street' },
        { id: 'D', text: 'Wolfe Tone Quay' }
      ],
      correctAnswer: 'C',
      explanation: 'Going from Heuston Station to Phibsborough Shopping Center, you would NOT take Capel Street. Heuston Station is on the south side of the Liffey, and Phibsborough is on the north side. The route would typically take you across the Liffey via one of the bridges, then along the north quays (like Wolfe Tone Quay), through the city center (possibly Church Street), and then up Phibsborough Road. Capel Street runs parallel to the quays and would not be on the most direct route.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Driving from Stillorgan to Rathmines what areas do you drive by?',
      questionNumber: 22,
      options: [
        { id: 'A', text: 'Goatstown, Clonskeagh and Ballsbridge' },
        { id: 'B', text: 'Booterstown, Ballsbridge and Donnybrook' },
        { id: 'C', text: 'Mount Merrion, Dundrum and Rathfarnham' },
        { id: 'D', text: 'Goatstown, Clonskeagh and Milltown' }
      ],
      correctAnswer: 'D',
      explanation: 'Driving from Stillorgan to Rathmines, you drive by Goatstown, Clonskeagh, and Milltown. Stillorgan is in south Dublin, and Rathmines is closer to the city center. The route takes you from Stillorgan through Goatstown (via Goatstown Road), then through Clonskeagh (via Clonskeagh Road), and then through Milltown before reaching Rathmines. This follows a route through the south Dublin suburbs.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The most direct route from Crumlin to Windy Arbour will have you pass through which two areas?',
      questionNumber: 23,
      options: [
        { id: 'A', text: 'Rathmines and Donnybrook' },
        { id: 'B', text: 'Kimmage and Templeogue' },
        { id: 'C', text: 'Kimmage and Rathgar' },
        { id: 'D', text: 'Harolds Cross and Portobello' }
      ],
      correctAnswer: 'C',
      explanation: 'The most direct route from Crumlin to Windy Arbour will have you pass through Kimmage and Rathgar. Crumlin is in southwest Dublin, and Windy Arbour is in the south. The route takes you from Crumlin through Kimmage (via Kimmage Road), and then through Rathgar (via Rathgar Road) before reaching Windy Arbour. This is the most direct route connecting these areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Going from Trinity College to Rathmines what road would you NOT take?',
      questionNumber: 24,
      options: [
        { id: 'A', text: 'Richmond Street South' },
        { id: 'B', text: 'College Green' },
        { id: 'C', text: 'Aungier Street' },
        { id: 'D', text: 'Kevin Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Going from Trinity College to Rathmines, you would NOT take Kevin Street. Trinity College is in the city center, and Rathmines is to the south. The route would typically take you from College Green, then along streets like Aungier Street or Richmond Street South, which lead towards Rathmines. Kevin Street, however, runs in a different direction (towards the Liberties) and would not be on the direct route to Rathmines.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Travelling from Blanchardstown to the city centre what road do you travel on?',
      questionNumber: 25,
      options: [
        { id: 'A', text: 'Naas Road' },
        { id: 'B', text: 'Clonsilla Road' },
        { id: 'C', text: 'Navan Road' },
        { id: 'D', text: 'Church Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Travelling from Blanchardstown to the city centre, you travel on the Navan Road (N3). Blanchardstown is in northwest Dublin, and the Navan Road is the main route connecting this area to the city center. The N3 (Navan Road) runs from the city center through areas like Cabra, Finglas, and Blanchardstown, continuing towards Navan and beyond. This is the primary route for accessing Blanchardstown from the city.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Taking the most direct route from Blackrock to Drimnagh, which two areas will you drive through?',
      questionNumber: 26,
      options: [
        { id: 'A', text: 'Ranalagh and Inchicore' },
        { id: 'B', text: 'Ringsend and Portobello' },
        { id: 'C', text: 'Rathmines and Rathgar' },
        { id: 'D', text: 'Ballsbridge and Harolds Cross' }
      ],
      correctAnswer: 'D',
      explanation: 'Taking the most direct route from Blackrock to Drimnagh, you will drive through Ballsbridge and Harold\'s Cross. Blackrock is in southeast Dublin, and Drimnagh is in southwest Dublin. The route takes you from Blackrock through Ballsbridge (via Merrion Road/Ballsbridge area), then through Harold\'s Cross (via Harold\'s Cross Road), before reaching Drimnagh. This route connects the southeast to the southwest through the south inner city.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Taking the most direct route from Blackrock to Merrion Square, which of the following areas would you pass?',
      questionNumber: 27,
      options: [
        { id: 'A', text: 'Booterstown, Merrion and Ballsbridge' },
        { id: 'B', text: 'Booterstown, Mount Merrion and Donnybrook' },
        { id: 'C', text: 'Stillorgan, Mount Merrion and Donnybrook' },
        { id: 'D', text: 'Merrion, Sandymount and Irishtown' }
      ],
      correctAnswer: 'A',
      explanation: 'Taking the most direct route from Blackrock to Merrion Square, you would pass through Booterstown, Merrion, and Ballsbridge. Blackrock is along the coast in southeast Dublin, and Merrion Square is in the city center. The coastal route takes you from Blackrock through Booterstown, then through Merrion, and then through Ballsbridge before reaching Merrion Square. This follows the coastal road (Rock Road/Merrion Road) which is the most direct route.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'When travelling from Dún Laoghaire to Blackrock Village, what road do you travel on?',
      questionNumber: 28,
      options: [
        { id: 'A', text: 'N81' },
        { id: 'B', text: 'N31' },
        { id: 'C', text: 'N11' },
        { id: 'D', text: 'N7' }
      ],
      correctAnswer: 'B',
      explanation: 'When travelling from Dún Laoghaire to Blackrock Village, you travel on the N31. The N31 is a national secondary road that runs along the coast in south Dublin, connecting Dún Laoghaire with areas like Blackrock and continuing towards the city center. This road follows the coastal route and is the main road connecting these coastal areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What national road brings you from Cabinteely to the City Centre?',
      questionNumber: 29,
      options: [
        { id: 'A', text: 'N11' },
        { id: 'B', text: 'N81' },
        { id: 'C', text: 'N7' },
        { id: 'D', text: 'N31' }
      ],
      correctAnswer: 'A',
      explanation: 'The N11 brings you from Cabinteely to the City Centre. The N11 is a major national primary road that runs from the city center southwards through areas like Stillorgan, Cabinteely, and continues towards Bray and Wicklow. Cabinteely is located along the N11, making it the main route connecting this area to the city center.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'What National Road will take you to from the City Centre to Saggart?',
      questionNumber: 30,
      options: [
        { id: 'A', text: 'N3' },
        { id: 'B', text: 'N11' },
        { id: 'C', text: 'N7' },
        { id: 'D', text: 'N4' }
      ],
      correctAnswer: 'C',
      explanation: 'The N7 will take you from the City Centre to Saggart. The N7 (Naas Road) runs from the city center southwest towards Naas, and Saggart is located along this route. The N7 is the main road connecting the city center with southwest Dublin and continues towards Kildare and beyond. Saggart is a village along this route.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'What would NOT be included on the route from Grace Park Road to Heuston Station?',
      questionNumber: 31,
      options: [
        { id: 'A', text: 'Dorset Street Lower' },
        { id: 'B', text: 'Ormond Quay Lower' },
        { id: 'C', text: 'Ushers Island' },
        { id: 'D', text: 'Drumcondra Road Lower' }
      ],
      correctAnswer: 'B',
      explanation: 'Ormond Quay Lower would NOT be included on the route from Grace Park Road to Heuston Station. Grace Park Road is in Drumcondra (north Dublin), and Heuston Station is on the south side of the Liffey in the west. The route would take you from Drumcondra Road Lower, through the city center (possibly Dorset Street Lower), across the Liffey, and then along Ushers Island to reach Heuston. Ormond Quay Lower is on the north side of the Liffey and would not be on the route to Heuston Station which is on the south side.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which of the following is the best route to travel from Rathcoole to the city centre?',
      questionNumber: 32,
      options: [
        { id: 'A', text: 'N7, R810 and R148' },
        { id: 'B', text: 'N7, R818 and R137' },
        { id: 'C', text: 'N7, R110 and R138' },
        { id: 'D', text: 'N7, M50 and R148' }
      ],
      correctAnswer: 'A',
      explanation: 'The best route to travel from Rathcoole to the city centre is N7, R810 and R148. Rathcoole is in southwest Dublin, and the N7 is the main road connecting this area. You would take the N7, then connect to the R810, and finally use the R148 which leads into the city center. This provides the most direct route from Rathcoole to the city.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Travelling from Santry to Sutton which of the following two areas do you pass through?',
      questionNumber: 33,
      options: [
        { id: 'A', text: 'Glasnevin and Kinsealy' },
        { id: 'B', text: 'Coolock and Baldoyle' },
        { id: 'C', text: 'Malahide and Ballymun' },
        { id: 'D', text: 'Artane and Coolock' }
      ],
      correctAnswer: 'B',
      explanation: 'Travelling from Santry to Sutton, you pass through Coolock and Baldoyle. Santry is in north Dublin, and Sutton is on the north coast. The route takes you from Santry through Coolock (via Coolock area), and then through Baldoyle before reaching Sutton. This follows a route through northeast Dublin connecting these areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Driving from the city centre to Tallaght, which national road do you use?',
      questionNumber: 34,
      options: [
        { id: 'A', text: 'N17' },
        { id: 'B', text: 'N81' },
        { id: 'C', text: 'N31' },
        { id: 'D', text: 'N11' }
      ],
      correctAnswer: 'B',
      explanation: 'Driving from the city centre to Tallaght, you use the N81. The N81 is a national secondary road that runs from the city center southwest towards Tallaght and continues towards Blessington. This is the main route connecting the city center with Tallaght, which is a major suburban center in southwest Dublin.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'What National Road would you take from City Centre to Ashbourne, County Meath?',
      questionNumber: 35,
      options: [
        { id: 'A', text: 'N2' },
        { id: 'B', text: 'N4' },
        { id: 'C', text: 'N3' },
        { id: 'D', text: 'N1' }
      ],
      correctAnswer: 'A',
      explanation: 'You would take the N2 from City Centre to Ashbourne, County Meath. The N2 is a national primary road that runs from Dublin city center northwards towards Ashbourne and continues to Monaghan and beyond. Ashbourne is a town in County Meath located along the N2 route, making it the main road connecting Dublin with this area.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Taking the most direct route from Rathmines to Marley Park, which of the following areas would you pass?',
      questionNumber: 36,
      options: [
        { id: 'A', text: 'Rathgar, Terenure and Rathfarnham' },
        { id: 'B', text: 'Rathgar, Dartry, Churchtown' },
        { id: 'C', text: 'Terenure, Kimmage and Nutgrove' },
        { id: 'D', text: 'Churchtown, Dundrum and Goatstown' }
      ],
      correctAnswer: 'A',
      explanation: 'Taking the most direct route from Rathmines to Marley Park, you would pass through Rathgar, Terenure, and Rathfarnham. Rathmines is in the south inner city, and Marley Park is in the southwest suburbs. The route takes you from Rathmines through Rathgar (via Rathgar Road), then through Terenure (via Terenure Road), and finally through Rathfarnham before reaching Marley Park. This follows a route through the south Dublin suburbs.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Taking the most direct route from the Mater Private to Hermitage Medical, what road would you travel along?',
      questionNumber: 37,
      options: [
        { id: 'A', text: 'R148' },
        { id: 'B', text: 'R833' },
        { id: 'C', text: 'R109' },
        { id: 'D', text: 'R147' }
      ],
      correctAnswer: 'A',
      explanation: 'Taking the most direct route from the Mater Private to Hermitage Medical, you would travel along the R148. The Mater Private is in north Dublin (Eccles Street area), and Hermitage Medical is in Lucan (west Dublin). The R148 is a regional road that connects the city center with west Dublin, passing through areas like Chapelizod and Palmerstown, and would be the main route connecting these two medical facilities.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Driving from the InterContinental, Dublin to St. Stephens Green, which road do you NOT take?',
      questionNumber: 38,
      options: [
        { id: 'A', text: 'Merrion Road' },
        { id: 'B', text: 'Adelaide Road' },
        { id: 'C', text: 'Pembroke Road' },
        { id: 'D', text: 'Baggot Street Upper' }
      ],
      correctAnswer: 'B',
      explanation: 'Driving from the InterContinental, Dublin to St. Stephen\'s Green, you would NOT take Adelaide Road. The InterContinental is in Ballsbridge (southeast), and St. Stephen\'s Green is in the city center. The route would typically take you along Merrion Road, then Pembroke Road, and then Baggot Street Upper before reaching St. Stephen\'s Green. Adelaide Road runs in a different direction (towards Ranelagh) and would not be on the direct route.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Going from Trinity City Hotel to 3Arena what road would you NOT take?',
      questionNumber: 39,
      options: [
        { id: 'A', text: 'City Quay' },
        { id: 'B', text: 'Tara Street' },
        { id: 'C', text: 'Pearse Street' },
        { id: 'D', text: 'Custom House Quay' }
      ],
      correctAnswer: 'A',
      explanation: 'Going from Trinity City Hotel to 3Arena, you would NOT take City Quay. Trinity City Hotel is in the city center (near Trinity College), and the 3Arena is in the Docklands on the north side of the Liffey. The route would take you along Pearse Street, then Tara Street, and then Custom House Quay (on the north side) to reach the 3Arena. City Quay is on the south side of the Liffey and would not be on the route to the 3Arena which is on the north side.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which is the most direct route from UCD to Dublin Airport?',
      questionNumber: 40,
      options: [
        { id: 'A', text: 'Dundrum, Ballinteer and M50' },
        { id: 'B', text: 'Ballsbridge, City Centre and Drumcondra' },
        { id: 'C', text: 'Ballsbridge, City Centre, Navan Road and M50' },
        { id: 'D', text: 'Ballsbridge, Christchurch and Glasnevin' }
      ],
      correctAnswer: 'B',
      explanation: 'The most direct route from UCD to Dublin Airport is via Ballsbridge, City Centre, and Drumcondra. UCD is in Belfield (south Dublin), and Dublin Airport is in the north. The route takes you from UCD through Ballsbridge (via Stillorgan Road/Merrion Road), then through the city center, and then through Drumcondra (via Drumcondra Road) before continuing to the airport. This is the most direct route avoiding the M50.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Driving from the city centre to Mulhuddart which national road do you use?',
      questionNumber: 41,
      options: [
        { id: 'A', text: 'N1' },
        { id: 'B', text: 'N2' },
        { id: 'C', text: 'N4' },
        { id: 'D', text: 'N3' }
      ],
      correctAnswer: 'D',
      explanation: 'Driving from the city centre to Mulhuddart, you use the N3. The N3 (Navan Road) runs from the city center northwest towards Navan, and Mulhuddart is located along this route. The N3 is the main road connecting the city center with northwest Dublin, passing through areas like Cabra, Finglas, and Mulhuddart before continuing to Navan.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Going from DIT, Bolton Street to Abbey Street Lower what road would you NOT take?',
      questionNumber: 42,
      options: [
        { id: 'A', text: 'Dorset Street' },
        { id: 'B', text: 'O\'Connell Street' },
        { id: 'C', text: 'Parnell Street' },
        { id: 'D', text: 'Cathal Brugha Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Going from DIT, Bolton Street to Abbey Street Lower, you would NOT take Cathal Brugha Street. DIT Bolton Street is in the north inner city, and Abbey Street Lower is nearby in the same area. The route would typically take you along Dorset Street, then Parnell Street, and then O\'Connell Street before reaching Abbey Street Lower. Cathal Brugha Street runs in a different direction (parallel to O\'Connell Street) and would not be on the direct route.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Taking the most direct route from Ballyfermot to Blanchardstown, which of the following areas would you pass?',
      questionNumber: 43,
      options: [
        { id: 'A', text: 'Ballycoolin' },
        { id: 'B', text: 'Ashtown' },
        { id: 'C', text: 'Palmerstown' },
        { id: 'D', text: 'Fonthill' }
      ],
      correctAnswer: 'C',
      explanation: 'Taking the most direct route from Ballyfermot to Blanchardstown, you would pass through Palmerstown. Ballyfermot is in west Dublin, and Blanchardstown is in northwest Dublin. The route takes you from Ballyfermot through Palmerstown (via the R148/Palmerstown area) before continuing to Blanchardstown. This connects the west and northwest areas of Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Going from Fitzwilliam Square to Busaras what road would you NOT take?',
      questionNumber: 44,
      options: [
        { id: 'A', text: 'Baggot Street Lower' },
        { id: 'B', text: 'Fitzwilliam Street Upper' },
        { id: 'C', text: 'Amiens Street' },
        { id: 'D', text: 'Pearse Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Going from Fitzwilliam Square to Busaras, you would NOT take Baggot Street Lower. Fitzwilliam Square is in the south city center, and Busaras (the central bus station) is on Store Street in the north inner city. The route would typically take you along Fitzwilliam Street Upper, then across the city (possibly Pearse Street), and then Amiens Street to reach Store Street. Baggot Street Lower runs in a different direction and would not be on the direct route to Busaras.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What areas would you pass through from Bull Island to Donabate?',
      questionNumber: 45,
      options: [
        { id: 'A', text: 'Raheny, Coolock, Swords' },
        { id: 'B', text: 'Clontarf, Killester and Malahide' },
        { id: 'C', text: 'Raheny, Clarehall, Swords' },
        { id: 'D', text: 'Howth, Malahide and Portmarnock' }
      ],
      correctAnswer: 'A',
      explanation: 'From Bull Island to Donabate, you would pass through Raheny, Coolock, and Swords. Bull Island is off the coast of Clontarf/Raheny in north Dublin, and Donabate is further north along the coast. The route takes you from the Bull Island area through Raheny, then through Coolock, and then through Swords before reaching Donabate. This follows a route through northeast Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Travelling from Lucan directly to the City Centre, what two roads do you use?',
      questionNumber: 46,
      options: [
        { id: 'A', text: 'N4 and R148' },
        { id: 'B', text: 'N4 and R833' },
        { id: 'C', text: 'N4 and R147' },
        { id: 'D', text: 'N4 and M50' }
      ],
      correctAnswer: 'A',
      explanation: 'Travelling from Lucan directly to the City Centre, you use the N4 and R148. Lucan is in west Dublin, and the N4 is the main road connecting this area. You would take the N4 from Lucan, and then connect to the R148 which leads into the city center via Chapelizod and the quays. This is the most direct route from Lucan to the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Taking the most direct route from Sandyford Industrial Estate to Ranelagh, which of the following areas would you pass?',
      questionNumber: 47,
      options: [
        { id: 'A', text: 'Stillorgan, Clonskeagh and Rathmines' },
        { id: 'B', text: 'Goatstown, Clonskeagh and Milltown' },
        { id: 'C', text: 'Kilmacud, Mount Merrion, Donnybrook' },
        { id: 'D', text: 'Goatstown, Stillorgan and Donnybrook' }
      ],
      correctAnswer: 'B',
      explanation: 'Taking the most direct route from Sandyford Industrial Estate to Ranelagh, you would pass through Goatstown, Clonskeagh, and Milltown. Sandyford Industrial Estate is in south Dublin, and Ranelagh is closer to the city center. The route takes you from Sandyford through Goatstown (via Goatstown Road), then through Clonskeagh (via Clonskeagh Road), and then through Milltown before reaching Ranelagh. This follows a route through the south Dublin suburbs.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Driving from Phoenix Park to Churchtown, which areas do you drive through?',
      questionNumber: 48,
      options: [
        { id: 'A', text: 'Rialto, Kimmage, Terenure' },
        { id: 'B', text: 'Inchicore, Drimnagh, Kimmage' },
        { id: 'C', text: 'Christchurch, Harold\'s Cross, Terenure' },
        { id: 'D', text: 'Christchurch, Ranelagh, Donnybrook' }
      ],
      correctAnswer: 'C',
      explanation: 'Driving from Phoenix Park to Churchtown, you drive through Christchurch, Harold\'s Cross, and Terenure. Phoenix Park is in the west of the city, and Churchtown is in the south suburbs. The route takes you from Phoenix Park through the city center (via Christchurch area), then through Harold\'s Cross (via Harold\'s Cross Road), and then through Terenure before reaching Churchtown. This connects the west of the city with the south suburbs.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Driving from Dame Street to Kimmage which would be the furthest away?',
      questionNumber: 49,
      options: [
        { id: 'A', text: 'Dundrum' },
        { id: 'B', text: 'Templeogue' },
        { id: 'C', text: 'Perrystown' },
        { id: 'D', text: 'Ballinteer' }
      ],
      correctAnswer: 'D',
      explanation: 'When driving from Dame Street to Kimmage, Ballinteer would be the furthest away from the direct route. Dame Street is in the city center, and Kimmage is in southwest Dublin. The direct route to Kimmage would pass through areas like Terenure or Harold\'s Cross. While Dundrum, Templeogue, and Perrystown are all in the general southwest direction, Ballinteer is further south and would be the furthest away from the direct route to Kimmage.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Travelling from Carpenterstown to Blanchardstown Shopping Centre what two roads do you travel on?',
      questionNumber: 50,
      options: [
        { id: 'A', text: 'Luttrellstown Road and Hunstown Way' },
        { id: 'B', text: 'Coolmine Road and Snugborough Road' },
        { id: 'C', text: 'Clonsilla Road and Hansfield Road' },
        { id: 'D', text: 'Laurel Lodge Road and Auburn Avenue' }
      ],
      correctAnswer: 'B',
      explanation: 'Travelling from Carpenterstown to Blanchardstown Shopping Centre, you travel on Coolmine Road and Snugborough Road. Carpenterstown is in northwest Dublin, near Blanchardstown. The route takes you from Carpenterstown via Coolmine Road, and then Snugborough Road which leads to Blanchardstown Shopping Centre. These are local roads connecting these adjacent areas in northwest Dublin.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Taking the most direct route from Lower Drumcondra Road to Bull Island what areas do you pass through?',
      questionNumber: 51,
      options: [
        { id: 'A', text: 'Fairview, Sutton and Santry' },
        { id: 'B', text: 'Dollymount, Drumcondra and Howth' },
        { id: 'C', text: 'Fairview, Whitehall and Killester' },
        { id: 'D', text: 'Fairview, Clontarf and Dollymount' }
      ],
      correctAnswer: 'D',
      explanation: 'Taking the most direct route from Lower Drumcondra Road to Bull Island, you pass through Fairview, Clontarf, and Dollymount. Lower Drumcondra Road is in north Dublin, and Bull Island is off the coast of Clontarf. The route takes you from Drumcondra through Fairview (via Fairview Strand), then through Clontarf (via Clontarf Road), and then through Dollymount before reaching Bull Island. This follows the coastal route in north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Going from Connolly Station to The Savoy Cinema what road would you NOT take?',
      questionNumber: 52,
      options: [
        { id: 'A', text: 'Cathal Brugha Street' },
        { id: 'B', text: 'Amiens Street' },
        { id: 'C', text: 'O\'Connell Street' },
        { id: 'D', text: 'Marlborough Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Going from Connolly Station to The Savoy Cinema, you would NOT take Marlborough Street. Connolly Station is in the north inner city (near Amiens Street), and The Savoy Cinema is on O\'Connell Street. The route would typically take you along Amiens Street, then O\'Connell Street to reach the cinema. You might also use Cathal Brugha Street which connects to O\'Connell Street. Marlborough Street, however, runs parallel to O\'Connell Street and would not be on the direct route.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Going from St. Patricks Cathedral to Merrion Square what road would you NOT take?',
      questionNumber: 53,
      options: [
        { id: 'A', text: 'Leeson Street' },
        { id: 'B', text: 'St. Patricks Close' },
        { id: 'C', text: 'Cuffe Street' },
        { id: 'D', text: 'Kevin Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Going from St. Patrick\'s Cathedral to Merrion Square, you would NOT take Leeson Street. St. Patrick\'s Cathedral is in the Liberties area (south inner city), and Merrion Square is in the southeast city center. The route would typically take you from St. Patrick\'s Close, then Kevin Street or Cuffe Street, which lead towards the city center and then to Merrion Square. Leeson Street runs in a different direction (towards Ballsbridge) and would not be on the direct route.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What National Road takes you from the city centre to Jobstown?',
      questionNumber: 54,
      options: [
        { id: 'A', text: 'N4' },
        { id: 'B', text: 'N11' },
        { id: 'C', text: 'N3' },
        { id: 'D', text: 'N7' }
      ],
      correctAnswer: 'D',
      explanation: 'The N7 takes you from the city centre to Jobstown. The N7 (Naas Road) runs from the city center southwest, and Jobstown is located along this route in Tallaght. As mentioned in question 29, Jobstown is on the N81, but the N7 is the main route to the area, and Jobstown can be accessed via the N7. The N7 is the primary route connecting the city center with southwest Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which of the following roads takes the most direct route between Portmarnock and Malahide?',
      questionNumber: 55,
      options: [
        { id: 'A', text: 'R132' },
        { id: 'B', text: 'R124' },
        { id: 'C', text: 'R107' },
        { id: 'D', text: 'R106' }
      ],
      correctAnswer: 'D',
      explanation: 'The R106 takes the most direct route between Portmarnock and Malahide. Portmarnock and Malahide are both coastal areas in north Dublin, and the R106 is a regional road that connects these two areas along the coast. This road provides the most direct connection between Portmarnock and Malahide.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which road do you NOT take from Drumcondra Road Lower to Bull Island?',
      questionNumber: 56,
      options: [
        { id: 'A', text: 'Fairview Park' },
        { id: 'B', text: 'Clonliffe Road' },
        { id: 'C', text: 'Oscar Traynor Road' },
        { id: 'D', text: 'Annesley Bridge Road' }
      ],
      correctAnswer: 'C',
      explanation: 'From Drumcondra Road Lower to Bull Island, you would NOT take Oscar Traynor Road. Drumcondra Road Lower is in north Dublin, and Bull Island is off the coast of Clontarf. The route would take you through areas like Clonliffe Road (connecting to Fairview), then Fairview Park area, and then Annesley Bridge Road (connecting to Clontarf Road) to reach Bull Island. Oscar Traynor Road is in a different area (Coolock/Santry) and would not be on the route to Bull Island.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Driving from Donnybrook to Dtwo Harcourt Street, which road should you NOT take?',
      questionNumber: 57,
      options: [
        { id: 'A', text: 'Hatch Street Upper' },
        { id: 'B', text: 'Morehampton Road' },
        { id: 'C', text: 'Leeson Street Lower' },
        { id: 'D', text: 'Suffolk Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Driving from Donnybrook to Dtwo Harcourt Street, you should NOT take Suffolk Street. Donnybrook is in south Dublin, and Harcourt Street is in the city center. The route would typically take you along Morehampton Road, then Leeson Street Lower, and then Hatch Street Upper before reaching Harcourt Street. Suffolk Street is in the Temple Bar area and would not be on the direct route from Donnybrook to Harcourt Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The most direct route from Rathmines to Marlay Park takes you by which of the following areas?',
      questionNumber: 58,
      options: [
        { id: 'A', text: 'Miltown and Dundrum' },
        { id: 'B', text: 'Rathgar and Knocklyon' },
        { id: 'C', text: 'Rathgar and Rathfarnham' },
        { id: 'D', text: 'Kimmage and Rathfarnham' }
      ],
      correctAnswer: 'C',
      explanation: 'The most direct route from Rathmines to Marlay Park takes you by Rathgar and Rathfarnham. As mentioned in question 36, the route from Rathmines to Marley Park passes through Rathgar and Rathfarnham. Rathmines is in the south inner city, and Marlay Park is in the southwest suburbs. The route takes you through Rathgar (via Rathgar Road), and then through Rathfarnham before reaching Marlay Park.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the main road taken from the City Centre to Loughlinstown?',
      questionNumber: 59,
      options: [
        { id: 'A', text: 'R113' },
        { id: 'B', text: 'M50' },
        { id: 'C', text: 'N11' },
        { id: 'D', text: 'R117' }
      ],
      correctAnswer: 'C',
      explanation: 'The main road taken from the City Centre to Loughlinstown is the N11. The N11 is a major national primary road that runs from the city center southwards through areas like Stillorgan, Cabinteely, and continues to Loughlinstown and beyond towards Bray and Wicklow. Loughlinstown is located along the N11 route, making it the main road connecting the city center with this area.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Which of the following would you NOT pass through when travelling from Howth to Malahide?',
      questionNumber: 60,
      options: [
        { id: 'A', text: 'Station Road' },
        { id: 'B', text: 'Kilbarrack Road' },
        { id: 'C', text: 'Howth Road' },
        { id: 'D', text: 'Warrenhouse Road' }
      ],
      correctAnswer: 'B',
      explanation: 'When travelling from Howth to Malahide, you would NOT pass through Kilbarrack Road. Howth and Malahide are both coastal areas in north Dublin. The route between them would typically take you along Howth Road, then Station Road, and possibly Warrenhouse Road. Kilbarrack Road, however, is in a different area (Kilbarrack is between Howth and the city, but the direct route to Malahide would go along the coast, not through Kilbarrack Road).',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'From the following, which one would you NOT pass through when driving from Howth to Malahide?',
      questionNumber: 61,
      options: [
        { id: 'A', text: 'Swords Road' },
        { id: 'B', text: 'Thormanby Road' },
        { id: 'C', text: 'Station Road' },
        { id: 'D', text: 'Howth Road' }
      ],
      correctAnswer: 'A',
      explanation: 'When driving from Howth to Malahide, you would NOT pass through Swords Road. Howth and Malahide are both coastal areas in north Dublin, and the route between them follows the coast. You would travel along Howth Road, then Station Road, and possibly Thormanby Road. Swords Road, however, runs inland from Santry towards Swords and would not be on the coastal route between Howth and Malahide.',
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

  console.log(`✅ Created ${questions.length} questions for Routes chapter`)
  
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
