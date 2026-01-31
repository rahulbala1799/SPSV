import { PrismaClient, QuestionCategory } from '@prisma/client'
import 'dotenv/config'
import { syncToQuestionBank } from './sync-to-question-bank'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Areas and Roads chapter...')

  // Create chapter
  const chapter = await prisma.chapter.upsert({
    where: { id: 'chapter_areas_and_roads' },
    update: {},
    create: {
      id: 'chapter_areas_and_roads',
      title: 'Areas and Roads',
      description: 'Master your knowledge of Dublin\'s areas, roads, and their connections. Learn which roads connect different areas, where specific roads run from and to, and understand the geographical relationships between various locations throughout Dublin.',
      chapterNumber: 12,
      type: 'MCQ',
      duration: 55,
      isActive: true,
      category: QuestionCategory.AREA_KNOWLEDGE
    }
  })

  console.log('✅ Chapter created:', chapter.title)

  // Define all 72 questions with detailed explanations
  const questions = [
    {
      questionText: 'Where does Castle Avenue run from?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'Fairview to Kilbarrack' },
        { id: 'B', text: 'Killester to Clontarf' },
        { id: 'C', text: 'Kilester to Raheny' },
        { id: 'D', text: 'Clontarf to Malahide' }
      ],
      correctAnswer: 'B',
      explanation: 'Castle Avenue runs from Killester to Clontarf. Castle Avenue is a residential road in north Dublin, connecting the area of Killester (which is inland) with Clontarf (which is along the coast). This road provides an important connection between these two areas in north Dublin, running through residential neighborhoods.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Drumartin Road links which of the following areas:',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Sandyford and Ballinteer' },
        { id: 'B', text: 'Sandyford and Goatstown' },
        { id: 'C', text: 'Mount Merrion and Churchtown' },
        { id: 'D', text: 'Goatstown and Churchtown' }
      ],
      correctAnswer: 'B',
      explanation: 'Drumartin Road links Sandyford and Goatstown. Drumartin Road is in south Dublin, providing a connection between the Sandyford area (which includes Sandyford Industrial Estate) and Goatstown. This road is part of the network connecting various areas in the south Dublin suburbs.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which two areas does Richmond Road run between?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Fairview and Marino' },
        { id: 'B', text: 'Fairview and Drumcondra' },
        { id: 'C', text: 'Drumcondra and Marino' },
        { id: 'D', text: 'Fairview and East Wall' }
      ],
      correctAnswer: 'B',
      explanation: 'Richmond Road runs between Fairview and Drumcondra. As we learned earlier, Richmond Road runs from Drumcondra to Fairview. This is an important road in north Dublin, connecting these two areas. Richmond Road is in the Fairview/Marino area and provides access to Drumcondra Road, connecting Fairview with Drumcondra.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what area is Highfield Road?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'Rathgar' },
        { id: 'B', text: 'Terenure' },
        { id: 'C', text: 'Dundrum' },
        { id: 'D', text: 'Rathfarnham' }
      ],
      correctAnswer: 'A',
      explanation: 'Highfield Road is in Rathgar. Rathgar is a residential area in south Dublin, and Highfield Road is one of the local roads in this area. Rathgar is known for its tree-lined streets and residential character, and Highfield Road is part of this residential network.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Ballyfermot Road connects which of the following?',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'Ballyfermot and Castleknock' },
        { id: 'B', text: 'Ballyfermot and Palmerstown' },
        { id: 'C', text: 'Park West and Cherry Orchard' },
        { id: 'D', text: 'Ballyfermot and Cherry Orchard' }
      ],
      correctAnswer: 'D',
      explanation: 'Ballyfermot Road connects Ballyfermot and Cherry Orchard. Ballyfermot is in west Dublin, and Cherry Orchard is an adjacent area. Ballyfermot Road is the main road serving the Ballyfermot area and connects it with Cherry Orchard, which is nearby. Both areas are in west Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What two areas does Snugborough Road connect?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'Ballycoolin and Clonee' },
        { id: 'B', text: 'Blanchardstown and Castleknock' },
        { id: 'C', text: 'Clonsilla and Corduff' },
        { id: 'D', text: 'Coolmine and Castleknock' }
      ],
      correctAnswer: 'C',
      explanation: 'Snugborough Road connects Clonsilla and Corduff. As mentioned in question 50 of the Routes chapter, Snugborough Road is in northwest Dublin, connecting areas like Clonsilla and Corduff. These are all areas in the Blanchardstown region of northwest Dublin.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What two areas does the Stillorgan Road run between?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'Ballsbridge and Blackrock' },
        { id: 'B', text: 'Stillorgan and Cabinteely' },
        { id: 'C', text: 'Ranelagh and Leopardstown' },
        { id: 'D', text: 'Donnybrook and Stillorgan' }
      ],
      correctAnswer: 'D',
      explanation: 'The Stillorgan Road runs between Donnybrook and Stillorgan. Stillorgan Road is a major route in south Dublin, running from Donnybrook (closer to the city center) to Stillorgan (further south). This road is part of the N11 route and is one of the main thoroughfares in south Dublin, connecting the city center with the southern suburbs.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'What area is between Blanchardstown and Ashtown?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Cabra' },
        { id: 'B', text: 'Castleknock' },
        { id: 'C', text: 'Ballymun' },
        { id: 'D', text: 'Chapelizod' }
      ],
      correctAnswer: 'B',
      explanation: 'Castleknock is between Blanchardstown and Ashtown. Blanchardstown is in northwest Dublin, and Ashtown is closer to the city center. Castleknock is located between these two areas, making it a key area in the northwest Dublin region. The route from Blanchardstown to Ashtown passes through Castleknock.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Oscar Traynor Road connects what two areas?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Coolock and Kilmore' },
        { id: 'B', text: 'Coolock and Kilbarrack' },
        { id: 'C', text: 'Ballymun and Killester' },
        { id: 'D', text: 'Ballymore and Kilbarrack' }
      ],
      correctAnswer: 'A',
      explanation: 'Oscar Traynor Road connects Coolock and Kilmore. Oscar Traynor Road is in northeast Dublin, running from Coolock towards areas like Kilmore and Santry. This road is an important route in north Dublin, connecting these areas and providing access to locations like Omni Park Shopping Centre.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Greenhills Road joins which of the following areas?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'Crumlin and Tallaght' },
        { id: 'B', text: 'Clondalkin and Drimnagh' },
        { id: 'C', text: 'Greenhills and Drimnagh' },
        { id: 'D', text: 'Greenhills and Tallaght' }
      ],
      correctAnswer: 'D',
      explanation: 'Greenhills Road joins Greenhills and Tallaght. As mentioned in question 77 of the Routes chapter, Greenhills Road connects Tallaght and Walkinstown, but it also extends to connect Greenhills (which is in the Tallaght area) with Tallaght itself. Greenhills is a residential area in southwest Dublin, and Greenhills Road provides the connection to Tallaght.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The Sweepstakes Apartments are located where?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'Stillorgan' },
        { id: 'B', text: 'IFSC' },
        { id: 'C', text: 'Ballsbridge' },
        { id: 'D', text: 'Donnybrook' }
      ],
      correctAnswer: 'C',
      explanation: 'The Sweepstakes Apartments are located in Ballsbridge. Ballsbridge is an affluent area in southeast Dublin, known for its embassies, hotels, and residential developments. The Sweepstakes Apartments are a residential development in this area, which is along the coast and close to the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The housing estate Lorcan is located where?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Santry' },
        { id: 'B', text: 'Drumcondra' },
        { id: 'C', text: 'Ranelagh' },
        { id: 'D', text: 'Cabra' }
      ],
      correctAnswer: 'A',
      explanation: 'The housing estate Lorcan is located in Santry. As mentioned in question 11 of the Routes chapter, Lorcan estate is located off Swords Road in Santry. Santry is in north Dublin, and the Lorcan estate is a residential development in this area, accessible from Swords Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what area is Kildare Road?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'Harold\'s Cross' },
        { id: 'B', text: 'Perrystown' },
        { id: 'C', text: 'Drimnagh' },
        { id: 'D', text: 'Crumlin' }
      ],
      correctAnswer: 'D',
      explanation: 'Kildare Road is in Crumlin. Crumlin is in southwest Dublin, and Kildare Road is one of the local roads in this area. Crumlin is a residential area, and Kildare Road is part of the local road network serving this community.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What two areas does the Finglas Road run between?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Finglas and Glasnevin' },
        { id: 'B', text: 'Poppintree and Whitehall' },
        { id: 'C', text: 'Finglas and Whitehall' },
        { id: 'D', text: 'Finglas and Ballymun' }
      ],
      correctAnswer: 'A',
      explanation: 'The Finglas Road runs between Finglas and Glasnevin. Finglas is in northwest Dublin, and Glasnevin is slightly to the east. Finglas Road is the main road connecting these two areas, running from Finglas through to Glasnevin, where it connects with other routes. This is an important route in north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which of the following areas is not directly beside Dalkey?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'Killiney' },
        { id: 'B', text: 'Glenageary' },
        { id: 'C', text: 'Blackrock' },
        { id: 'D', text: 'Sandycove' }
      ],
      correctAnswer: 'C',
      explanation: 'Blackrock is not directly beside Dalkey. Dalkey is a coastal area in south Dublin, and it is directly adjacent to areas like Killiney (to the south), Glenageary (to the north), and Sandycove (also nearby along the coast). Blackrock, however, is further north along the coast and is not directly beside Dalkey.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The River Dodder does NOT run through which area?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'Rathfarnham' },
        { id: 'B', text: 'Donnybrook' },
        { id: 'C', text: 'Kimmage' },
        { id: 'D', text: 'Milltown' }
      ],
      correctAnswer: 'C',
      explanation: 'The River Dodder does NOT run through Kimmage. The River Dodder flows through south Dublin, and it does run through areas like Rathfarnham, Donnybrook, and Milltown. Kimmage, however, is in a different location (southwest Dublin) and the Dodder does not flow through this area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Malahide Road does NOT pass through which area?',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'Kinsealy' },
        { id: 'B', text: 'Artane' },
        { id: 'C', text: 'Raheny' },
        { id: 'D', text: 'Coolock' }
      ],
      correctAnswer: 'C',
      explanation: 'Malahide Road does NOT pass through Raheny. Malahide Road runs from Fairview towards Malahide, and it passes through areas like Artane, Coolock, and Kinsealy. Raheny, however, is accessed via Howth Road or other routes, not directly via Malahide Road. Raheny is to the east of the Malahide Road route.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What area is NOT near the Howth Road?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'Sutton' },
        { id: 'B', text: 'Clontarf' },
        { id: 'C', text: 'Coolock' },
        { id: 'D', text: 'Kilbarrack' }
      ],
      correctAnswer: 'C',
      explanation: 'Coolock is NOT near the Howth Road. Howth Road runs along the coast in north Dublin, connecting areas like Clontarf, Kilbarrack, and Sutton (as it continues towards Howth). Coolock, however, is inland and is accessed via Malahide Road or other routes, not via Howth Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is St. Michael\'s Church located?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Marine Road, Dún Laoghaire' },
        { id: 'B', text: 'Kill Avenue, Dún Laoghaire' },
        { id: 'C', text: 'Loghlinstown Drive, Loughlinstown' },
        { id: 'D', text: 'Castle Street, Dalkey' }
      ],
      correctAnswer: 'A',
      explanation: 'St. Michael\'s Church is located on Marine Road, Dún Laoghaire. Dún Laoghaire is a coastal town in south Dublin, and Marine Road is one of the main streets in the area, running along the coast. St. Michael\'s Church is a significant landmark in Dún Laoghaire, located on this prominent road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which two areas are connected by Sandyford Road?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'Sandyford and Leopardstown' },
        { id: 'B', text: 'Sandyford and Dundrum' },
        { id: 'C', text: 'Stepaside and Ballyogan' },
        { id: 'D', text: 'Stillorgan and Dundrum' }
      ],
      correctAnswer: 'B',
      explanation: 'Sandyford Road connects Sandyford and Dundrum. Sandyford is in south Dublin, and Dundrum is slightly to the north. Sandyford Road is the main road connecting these two areas, running from Sandyford (which includes Sandyford Industrial Estate) to Dundrum. This is an important route in south Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Templeville Road runs between which two areas?',
      questionNumber: 21,
      options: [
        { id: 'A', text: 'Greenhills and Templeogue' },
        { id: 'B', text: 'Greentrees Road and Rathfarnham' },
        { id: 'C', text: 'Terenure and Firhouse' },
        { id: 'D', text: 'Templeogue and Ballowen' }
      ],
      correctAnswer: 'A',
      explanation: 'Templeville Road runs between Greenhills and Templeogue. Templeville Road is in southwest Dublin, connecting the Greenhills area (in Tallaght) with Templeogue. This road provides an important connection between these areas in southwest Dublin.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Collins Avenue connects what two areas?',
      questionNumber: 22,
      options: [
        { id: 'A', text: 'Finglas and Santry' },
        { id: 'B', text: 'Killester and Ballymun' },
        { id: 'C', text: 'Coolock and Artane' },
        { id: 'D', text: 'Whitehall and Fairview' }
      ],
      correctAnswer: 'B',
      explanation: 'Collins Avenue connects Killester and Ballymun. Collins Avenue is a major road in north Dublin, running from areas like Killester (near the coast) through to Ballymun (inland). This road is an important route in north Dublin, connecting these areas and providing access to locations like DCU (Dublin City University).',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Clonsilla Road joins which of the following areas?',
      questionNumber: 23,
      options: [
        { id: 'A', text: 'Clonsilla and Blanchardstown' },
        { id: 'B', text: 'Clonsilla and Ballymun' },
        { id: 'C', text: 'Blanchardstown and Ashtown' },
        { id: 'D', text: 'Clonsilla and Clondalkin' }
      ],
      correctAnswer: 'A',
      explanation: 'Clonsilla Road joins Clonsilla and Blanchardstown. Clonsilla is in northwest Dublin, and Blanchardstown is nearby. Clonsilla Road is the main road connecting these two areas, both of which are in the Blanchardstown region of northwest Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Collins Avenue East links which of the following:',
      questionNumber: 24,
      options: [
        { id: 'A', text: 'Beaumont and Artane' },
        { id: 'B', text: 'Artane and Raheny' },
        { id: 'C', text: 'Donnycarney and Marino' },
        { id: 'D', text: 'Donnycarney and Killester' }
      ],
      correctAnswer: 'D',
      explanation: 'Collins Avenue East links Donnycarney and Killester. Collins Avenue has different sections, and Collins Avenue East is the eastern section that connects Donnycarney (which is near Marino) with Killester. This is part of the Collins Avenue route system in north Dublin.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What area is between Ballybrack and Dalkey?',
      questionNumber: 25,
      options: [
        { id: 'A', text: 'Loughlinstown' },
        { id: 'B', text: 'Cherrywood' },
        { id: 'C', text: 'Shankill' },
        { id: 'D', text: 'Killiney' }
      ],
      correctAnswer: 'D',
      explanation: 'Killiney is between Ballybrack and Dalkey. Ballybrack, Killiney, and Dalkey are all coastal areas in south Dublin, arranged along the coast. Ballybrack is to the south, Dalkey is to the north, and Killiney is located between them. These areas are all part of the scenic coastal route in south Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Taney Road runs between which two areas?',
      questionNumber: 26,
      options: [
        { id: 'A', text: 'Dundrum and Churchtown' },
        { id: 'B', text: 'Goatstown and Dundrum' },
        { id: 'C', text: 'Kilmacud and Sandyford' },
        { id: 'D', text: 'Ballsbridge and Blackrock' }
      ],
      correctAnswer: 'B',
      explanation: 'Taney Road runs between Goatstown and Dundrum. As mentioned in question 28 of the Dublin Roads and Navigation chapter, Churchtown Road Upper adjoins Taney Road. Taney Road is in south Dublin, connecting Goatstown (which is near Stillorgan) with Dundrum. This is an important local route in the south Dublin suburbs.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Coast Road is taken between what two areas?',
      questionNumber: 27,
      options: [
        { id: 'A', text: 'Kilbarrack and Baldoyle' },
        { id: 'B', text: 'Portmarnock and Baldoyle' },
        { id: 'C', text: 'Howth and Sutton' },
        { id: 'D', text: 'Portmarnock and Howth' }
      ],
      correctAnswer: 'B',
      explanation: 'Coast Road is taken between Portmarnock and Baldoyle. Coast Road is a regional road (R105) that runs along the coast in north Dublin, connecting Portmarnock (which is along the coast) with Baldoyle. This road follows the coastal route in this area of north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What is the closest area to Mount Merrion?',
      questionNumber: 28,
      options: [
        { id: 'A', text: 'Monkstown' },
        { id: 'B', text: 'Stillorgan' },
        { id: 'C', text: 'Blackrock' },
        { id: 'D', text: 'Booterstown' }
      ],
      correctAnswer: 'B',
      explanation: 'Stillorgan is the closest area to Mount Merrion. Mount Merrion is an affluent residential area in south Dublin, and Stillorgan is immediately adjacent to it. These areas are very close together, with Mount Merrion Avenue connecting Mount Merrion with other areas. Stillorgan is the nearest of the options provided.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Which dart station is closest to Casino at Marino?',
      questionNumber: 29,
      options: [
        { id: 'A', text: 'Connolly' },
        { id: 'B', text: 'Harmonstown' },
        { id: 'C', text: 'Clontarf' },
        { id: 'D', text: 'Raheny' }
      ],
      correctAnswer: 'C',
      explanation: 'The DART station closest to Casino at Marino is Clontarf. The Casino at Marino is a historic building in Marino, which is in north Dublin near the coast. Clontarf DART station is the nearest station to this location, as Marino is close to Clontarf and the coastal DART line runs through this area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What two areas does the Royal Canal NOT run through?',
      questionNumber: 30,
      options: [
        { id: 'A', text: 'Glasnevin and Artane' },
        { id: 'B', text: 'Coolmine and Blanchardstown' },
        { id: 'C', text: 'Portobello and Harold\'s Cross' },
        { id: 'D', text: 'Drumcondra and East Wall' }
      ],
      correctAnswer: 'C',
      explanation: 'The Royal Canal does NOT run through Portobello and Harold\'s Cross. The Royal Canal runs through north Dublin, and it does pass through areas like Glasnevin, Artane, Coolmine, Blanchardstown, Drumcondra, and East Wall. However, Portobello and Harold\'s Cross are in the south of the city, and the Royal Canal does not run through these areas. The Grand Canal runs through the south, but the Royal Canal is in the north.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What area does NOT adjoin Kilmainham?',
      questionNumber: 31,
      options: [
        { id: 'A', text: 'Drimnagh' },
        { id: 'B', text: 'Islandbridge' },
        { id: 'C', text: 'Inchicore' },
        { id: 'D', text: 'Crumlin' }
      ],
      correctAnswer: 'D',
      explanation: 'Crumlin does NOT adjoin Kilmainham. Kilmainham is in west Dublin, near Phoenix Park, and it adjoins areas like Drimnagh, Islandbridge, and Inchicore. Crumlin, however, is further south and does not directly adjoin Kilmainham. There are other areas between them.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what area is the Nangor Road?',
      questionNumber: 32,
      options: [
        { id: 'A', text: 'Blanchardstown' },
        { id: 'B', text: 'Ballymount' },
        { id: 'C', text: 'Tallaght' },
        { id: 'D', text: 'Clondalkin' }
      ],
      correctAnswer: 'D',
      explanation: 'The Nangor Road is in Clondalkin. Clondalkin is a large area in southwest Dublin, and Nangor Road is one of the local roads in this area. Clondalkin is known for its industrial estates and residential communities, and Nangor Road is part of the local road network.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'The Navan Road runs between which two areas?',
      questionNumber: 33,
      options: [
        { id: 'A', text: 'Cabra and Ballymun' },
        { id: 'B', text: 'Palmerstown and Blanchardstown' },
        { id: 'C', text: 'Blanchardstown and Cabra' },
        { id: 'D', text: 'Blanchardstown and Palmerstown' }
      ],
      correctAnswer: 'C',
      explanation: 'The Navan Road (N3) runs between Blanchardstown and Cabra. As mentioned in question 25 of the Routes chapter, the Navan Road is the main route from Blanchardstown to the city center. It runs from the city center (through Cabra) to Blanchardstown and continues towards Navan. This is the primary route connecting these areas.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Which two areas does Ballyboden Road connect?',
      questionNumber: 34,
      options: [
        { id: 'A', text: 'Ballyboden and Knocklyon' },
        { id: 'B', text: 'Ballyboden and Tallaght' },
        { id: 'C', text: 'Ballyboden and Ballinteer' },
        { id: 'D', text: 'Ballyboden and Rathfarnham' }
      ],
      correctAnswer: 'D',
      explanation: 'Ballyboden Road connects Ballyboden and Rathfarnham. As mentioned in question 67 of the Dublin Roads and Navigation chapter, Ballyboden Way adjoins Taylors Lane. Ballyboden is in south Dublin, and Ballyboden Road connects this area with Rathfarnham, which is nearby. This is an important local route in the south Dublin suburbs.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What two areas are connected by the Ballymun Road?',
      questionNumber: 35,
      options: [
        { id: 'A', text: 'Glasnevin and Ballymun' },
        { id: 'B', text: 'Glasnevin and Swords' },
        { id: 'C', text: 'Santry and Beaumont' },
        { id: 'D', text: 'Ballymun and Finglas' }
      ],
      correctAnswer: 'A',
      explanation: 'The Ballymun Road connects Glasnevin and Ballymun. As mentioned in question 33 of the Dublin Roads and Navigation chapter, Glasnevin Avenue adjoins the Ballymun Road. Ballymun Road is a major route in north Dublin, running from Glasnevin (near the city) to Ballymun (further north). This is an important route serving north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Ratoath road connects which two areas?',
      questionNumber: 36,
      options: [
        { id: 'A', text: 'Whitehall and Ballymun' },
        { id: 'B', text: 'Stoneybatter and Smithfield' },
        { id: 'C', text: 'Blanchardstown and Clonsilla' },
        { id: 'D', text: 'Cabra and Finglas' }
      ],
      correctAnswer: 'D',
      explanation: 'Ratoath Road connects Cabra and Finglas. Ratoath Road is in northwest Dublin, running from Cabra (which is closer to the city center) to Finglas (which is further north). This road provides an important connection between these two areas in northwest Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'River Road joins which two areas?',
      questionNumber: 37,
      options: [
        { id: 'A', text: 'Finglas and Cabra' },
        { id: 'B', text: 'Glasnevin and Finglas' },
        { id: 'C', text: 'Blanchardstown and Finglas' },
        { id: 'D', text: 'Ballymun and Glasnevin' }
      ],
      correctAnswer: 'C',
      explanation: 'River Road joins Blanchardstown and Finglas. River Road is in northwest Dublin, running along the Tolka River. It connects Blanchardstown (in the west) with Finglas (in the north). This road follows the river and provides a connection between these areas.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which of the following areas is not located beside Dun Laoghaire?',
      questionNumber: 38,
      options: [
        { id: 'A', text: 'Sandycove' },
        { id: 'B', text: 'Killiney' },
        { id: 'C', text: 'Monkstown' },
        { id: 'D', text: 'Sallynoggin' }
      ],
      correctAnswer: 'B',
      explanation: 'Killiney is not located directly beside Dún Laoghaire. Dún Laoghaire is a coastal town in south Dublin, and it is directly adjacent to areas like Sandycove (to the south), Monkstown (to the north), and Sallynoggin (nearby). Killiney, however, is further south along the coast and is not directly beside Dún Laoghaire.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What two areas does Marlborough Road connect?',
      questionNumber: 39,
      options: [
        { id: 'A', text: 'Donnybrook and Ranelagh' },
        { id: 'B', text: 'Rathmines and Ranelagh' },
        { id: 'C', text: 'Ballsbridge and Donnybrook' },
        { id: 'D', text: 'Merrion and Ballsbridge' }
      ],
      correctAnswer: 'A',
      explanation: 'Marlborough Road connects Donnybrook and Ranelagh. Marlborough Road is in south Dublin, running from Donnybrook (which is near Ballsbridge) to Ranelagh (which is closer to the city center). This road provides an important connection between these two areas in the south inner city.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which area does NOT surround Kilmainham?',
      questionNumber: 40,
      options: [
        { id: 'A', text: 'Goldenbridge' },
        { id: 'B', text: 'Bluebell' },
        { id: 'C', text: 'Inchicore' },
        { id: 'D', text: 'Islandbridge' }
      ],
      correctAnswer: 'B',
      explanation: 'Bluebell does NOT surround Kilmainham. Kilmainham is in west Dublin, and it is surrounded by areas like Goldenbridge, Inchicore, and Islandbridge. Bluebell, however, is further south and does not directly surround Kilmainham. There are other areas between Bluebell and Kilmainham.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Jamestown Road joins which two areas?',
      questionNumber: 41,
      options: [
        { id: 'A', text: 'Finglas and Glasnevin' },
        { id: 'B', text: 'Santry and Ballymun' },
        { id: 'C', text: 'Finglas and Ballymun/Poppintree' },
        { id: 'D', text: 'Ballymun and Swords' }
      ],
      correctAnswer: 'C',
      explanation: 'Jamestown Road joins Finglas and Ballymun/Poppintree. As mentioned in question 5 of the Northside Routes chapter, Jamestown Road goes from Finglas to Poppintree. Poppintree is near Ballymun, so Jamestown Road connects Finglas with the Ballymun/Poppintree area. This is an important route in northwest Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What area does NOT directly border Ballymun?',
      questionNumber: 42,
      options: [
        { id: 'A', text: 'Santry' },
        { id: 'B', text: 'Whitehall' },
        { id: 'C', text: 'Poppintree' },
        { id: 'D', text: 'Beaumont' }
      ],
      correctAnswer: 'D',
      explanation: 'Beaumont does NOT directly border Ballymun. Ballymun is in north Dublin, and it directly borders areas like Santry (to the east), Whitehall (to the south), and Poppintree (which is part of Ballymun). Beaumont, however, is further east and does not directly border Ballymun - there are other areas between them.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What two areas does the Finglas Road connect?',
      questionNumber: 43,
      options: [
        { id: 'A', text: 'Finglas and Phibsborough' },
        { id: 'B', text: 'Swords and Ballymun' },
        { id: 'C', text: 'Finglas and Santry' },
        { id: 'D', text: 'Phibsborough and Cabra' }
      ],
      correctAnswer: 'A',
      explanation: 'The Finglas Road connects Finglas and Phibsborough. Finglas Road runs from Finglas (in northwest Dublin) towards the city center, and it connects with Phibsborough (which is closer to the city). This is an important route in north Dublin, providing access from Finglas to the city center via Phibsborough.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Blakestown Road runs through what area?',
      questionNumber: 44,
      options: [
        { id: 'A', text: 'Ballycoolin' },
        { id: 'B', text: 'Mulhuddart' },
        { id: 'C', text: 'Clonee' },
        { id: 'D', text: 'Palmerstown' }
      ],
      correctAnswer: 'B',
      explanation: 'Blakestown Road runs through Mulhuddart. Mulhuddart is in northwest Dublin, and Blakestown Road is a local road in this area. Mulhuddart is along the N3 route, and Blakestown Road is part of the local road network serving this area.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What two areas does Griffith Avenue connect?',
      questionNumber: 45,
      options: [
        { id: 'A', text: 'Glasnevin and Marino' },
        { id: 'B', text: 'Drumcondra and Beaumont' },
        { id: 'C', text: 'Killester and Fairview' },
        { id: 'D', text: 'Artane and Whitehall' }
      ],
      correctAnswer: 'A',
      explanation: 'Griffith Avenue connects Glasnevin and Marino. As mentioned in question 19 of the Dublin Roads and Navigation chapter, Griffith Avenue joins Saint Mobhi Road and Malahide Road. Griffith Avenue runs through areas like Whitehall and Glasnevin, and it connects to Marino (via connections to other roads). This is an important east-west route in north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Mount Merrion Avenue runs between which two areas?',
      questionNumber: 46,
      options: [
        { id: 'A', text: 'Blackrock and Goatstown' },
        { id: 'B', text: 'Booterstown and Stillorgan' },
        { id: 'C', text: 'Blackrock and Kilmacud' },
        { id: 'D', text: 'Mount Merrion and Blackrock' }
      ],
      correctAnswer: 'D',
      explanation: 'Mount Merrion Avenue runs between Mount Merrion and Blackrock. Mount Merrion Avenue is in south Dublin, connecting Mount Merrion (which is an affluent residential area) with Blackrock (which is along the coast). This road provides an important connection between these two areas in south Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Malahide Road joins which two areas?',
      questionNumber: 47,
      options: [
        { id: 'A', text: 'Malahide and Howth' },
        { id: 'B', text: 'Malahide and North Strand' },
        { id: 'C', text: 'Malahide and Killester' },
        { id: 'D', text: 'Fairview and Malahide' }
      ],
      correctAnswer: 'D',
      explanation: 'Malahide Road joins Fairview and Malahide. Malahide Road is a major route in north Dublin, running from Fairview (which is near the city center) all the way to Malahide (which is a coastal town further north). This is one of the main routes connecting the city center with the north coastal areas.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'What two areas does Grand Canal NOT run through?',
      questionNumber: 48,
      options: [
        { id: 'A', text: 'Inchicore and Goldenbridge' },
        { id: 'B', text: 'Portobello and Dolphins Barn' },
        { id: 'C', text: 'Cabra and Ashtown' },
        { id: 'D', text: 'Park West and Clondalkin' }
      ],
      correctAnswer: 'C',
      explanation: 'The Grand Canal does NOT run through Cabra and Ashtown. The Grand Canal runs through south Dublin, and it does pass through areas like Inchicore, Goldenbridge, Portobello, Dolphin\'s Barn, Park West, and Clondalkin. However, Cabra and Ashtown are in the north of the city, and the Grand Canal does not run through these areas. The Royal Canal runs through the north.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Merrion Road runs between which two areas?',
      questionNumber: 49,
      options: [
        { id: 'A', text: 'Ballsbridge and Merrion' },
        { id: 'B', text: 'Milltown and Ballsbridge' },
        { id: 'C', text: 'Donnybrook and Ballsbridge' },
        { id: 'D', text: 'Ballsbridge and Blackrock' }
      ],
      correctAnswer: 'A',
      explanation: 'Merrion Road runs between Ballsbridge and Merrion. Merrion Road is a major route in southeast Dublin, running from Ballsbridge (which is closer to the city center) to Merrion (which is along the coast). This road is part of the coastal route in south Dublin and is an important thoroughfare.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Leinster Road connects which of the following areas?',
      questionNumber: 50,
      options: [
        { id: 'A', text: 'Rathmines and Ranelagh' },
        { id: 'B', text: 'Rathmines and Rathgar' },
        { id: 'C', text: 'Harold\'s Cross and Kimmage' },
        { id: 'D', text: 'Harold\'s Cross and Rathmines' }
      ],
      correctAnswer: 'D',
      explanation: 'Leinster Road connects Harold\'s Cross and Rathmines. Leinster Road is in south Dublin, running from Harold\'s Cross (which is in the southwest) to Rathmines (which is closer to the city center). This road provides an important connection between these two areas in the south inner city.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Rathgar Road joins which two areas?',
      questionNumber: 51,
      options: [
        { id: 'A', text: 'Rathgar and Milltown' },
        { id: 'B', text: 'Kimmage and Terenure' },
        { id: 'C', text: 'Rathgar and Rathmines' },
        { id: 'D', text: 'Rathgar and Ranelagh' }
      ],
      correctAnswer: 'C',
      explanation: 'Rathgar Road joins Rathgar and Rathmines. Rathgar Road is a major route in south Dublin, running from Rathgar (which is further from the city) to Rathmines (which is closer to the city center). This is an important route connecting these two areas in the south inner city.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Which two areas does Crumlin Road run between?',
      questionNumber: 52,
      options: [
        { id: 'A', text: 'Crumlin and Harolds Cross' },
        { id: 'B', text: 'Crumlin and Terenure' },
        { id: 'C', text: 'Crumlin and Kimmage' },
        { id: 'D', text: 'Crumlin and Dolphins Barn' }
      ],
      correctAnswer: 'D',
      explanation: 'Crumlin Road runs between Crumlin and Dolphin\'s Barn. Crumlin Road is in southwest Dublin, running from Crumlin (which is further from the city) to Dolphin\'s Barn (which is closer to the city center). This road provides an important connection between these areas and connects to the South Circular Road area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Skellys Lane connects which of the following?',
      questionNumber: 53,
      options: [
        { id: 'A', text: 'Coolock and Donaghmede' },
        { id: 'B', text: 'Whitehall and Donnycarney' },
        { id: 'C', text: 'Santry and Glasnevin' },
        { id: 'D', text: 'Beaumont and Artane' }
      ],
      correctAnswer: 'D',
      explanation: 'Skellys Lane connects Beaumont and Artane. Skellys Lane is in north Dublin, providing a connection between Beaumont (which is near the coast) and Artane (which is slightly inland). This is a local road connecting these adjacent areas in north Dublin.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which two areas are joined by Stephen\'s Place?',
      questionNumber: 54,
      options: [
        { id: 'A', text: 'Bride Street and Patrick Street' },
        { id: 'B', text: 'Mount Street Upper and Mount Street Lower' },
        { id: 'C', text: 'Waterloo Road and Raglan Road' },
        { id: 'D', text: 'Townsend Street and City Quay' }
      ],
      correctAnswer: 'B',
      explanation: 'Stephen\'s Place joins Mount Street Upper and Mount Street Lower. As mentioned in question 83 of the Dublin Roads and Navigation chapter, Stephens Place joins Mount Street Upper and Mount Street Lower. Mount Street is in Dublin 2, and Stephens Place is a small street that connects the Upper and Lower sections of Mount Street.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What two areas does the Rock Road connect?',
      questionNumber: 55,
      options: [
        { id: 'A', text: 'Booterstown and Dun Laoghaire' },
        { id: 'B', text: 'Blackrock and Ballsbridge' },
        { id: 'C', text: 'Blackrock and Merrion' },
        { id: 'D', text: 'Monkstown and Blackrock' }
      ],
      correctAnswer: 'C',
      explanation: 'The Rock Road connects Blackrock and Merrion. Rock Road is a major coastal route in south Dublin, running from Blackrock (which is along the coast) to Merrion (which is also along the coast, closer to the city). This road is part of the scenic coastal route in south Dublin and is an important thoroughfare.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Tonlegee Road connects which two areas?',
      questionNumber: 56,
      options: [
        { id: 'A', text: 'Kilbarrack and Coolock' },
        { id: 'B', text: 'Coolock and Beaumont' },
        { id: 'C', text: 'Raheny and Killester' },
        { id: 'D', text: 'Raheny and Donaghmede' }
      ],
      correctAnswer: 'A',
      explanation: 'Tonlegee Road connects Kilbarrack and Coolock. As mentioned in question 6 of the Routes chapter, travelling from Donaghmede to Donnycarney, you travel on Tonlegee Road and Malahide Road. Tonlegee Road is in northeast Dublin, connecting Kilbarrack (which is along the coast) with Coolock (which is inland). This is an important route in northeast Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Cappagh Road joins which two areas?',
      questionNumber: 57,
      options: [
        { id: 'A', text: 'Blanchardstown and Clonsilla' },
        { id: 'B', text: 'Ballymun and Finglas' },
        { id: 'C', text: 'Ballycoolin and Finglas' },
        { id: 'D', text: 'Finglas and Glasnevin' }
      ],
      correctAnswer: 'C',
      explanation: 'Cappagh Road joins Ballycoolin and Finglas. Cappagh Road is in northwest Dublin, running from Ballycoolin (which is an industrial area near Blanchardstown) to Finglas. This road provides an important connection between these areas in northwest Dublin.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'In which of these areas is there an NCT centre?',
      questionNumber: 58,
      options: [
        { id: 'A', text: 'Goatstown' },
        { id: 'B', text: 'Ballyfermot' },
        { id: 'C', text: 'Clontarf' },
        { id: 'D', text: 'Fonthill' }
      ],
      correctAnswer: 'D',
      explanation: 'There is an NCT (National Car Test) centre in Fonthill. Fonthill is an area in west Dublin, and it is home to one of Dublin\'s NCT test centers. NCT centers are located throughout Dublin for vehicle testing, and Fonthill is one of these locations.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Coolmine Road runs through which of the following areas:',
      questionNumber: 59,
      options: [
        { id: 'A', text: 'Mulhuddart and Tyrellstown' },
        { id: 'B', text: 'Carpenterstown and Clonsilla' },
        { id: 'C', text: 'Castleknock and Chapelizod' },
        { id: 'D', text: 'Ongar and Clonee' }
      ],
      correctAnswer: 'B',
      explanation: 'Coolmine Road runs through Carpenterstown and Clonsilla. As mentioned in question 50 of the Routes chapter, travelling from Carpenterstown to Blanchardstown Shopping Centre, you travel on Coolmine Road and Snugborough Road. Coolmine Road is in northwest Dublin, connecting Carpenterstown with Clonsilla, both areas in the Blanchardstown region.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which of the following does Rochestown Avenue connect?',
      questionNumber: 60,
      options: [
        { id: 'A', text: 'Kill of the Grange and Glenageary' },
        { id: 'B', text: 'Deansgrange and Kill of the Grange' },
        { id: 'C', text: 'Cabinteely and Glenageary' },
        { id: 'D', text: 'Glenageary and Sallynoggin' }
      ],
      correctAnswer: 'A',
      explanation: 'Rochestown Avenue connects Kill of the Grange and Glenageary. Rochestown Avenue is in south Dublin, running from Kill of the Grange (which is near Deansgrange) to Glenageary (which is along the coast). This road provides a connection between these areas in south Dublin.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'In what area is Kirwan Street?',
      questionNumber: 61,
      options: [
        { id: 'A', text: 'Cabra' },
        { id: 'B', text: 'Stoneybatter' },
        { id: 'C', text: 'Phibsborough' },
        { id: 'D', text: 'Smithfield' }
      ],
      correctAnswer: 'B',
      explanation: 'Kirwan Street is in Stoneybatter. Stoneybatter is an area in Dublin 7, in the north inner city, and Kirwan Street is one of the local streets in this area. Stoneybatter is known for its historic character and is located near Phoenix Park.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which of the following Quays is NOT on the South side?',
      questionNumber: 62,
      options: [
        { id: 'A', text: 'Wellington Quay' },
        { id: 'B', text: 'Merchants Quay' },
        { id: 'C', text: 'City Quay' },
        { id: 'D', text: 'Arran Quay' }
      ],
      correctAnswer: 'D',
      explanation: 'Arran Quay is NOT on the South side - it is on the North side of the River Liffey. The River Liffey flows through Dublin from west to east, and the quays on the south side include Wellington Quay, Merchants Quay, and City Quay. Arran Quay, however, is on the north bank of the Liffey, making it a northside quay.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Lorcan Avenue?',
      questionNumber: 63,
      options: [
        { id: 'A', text: 'Santry' },
        { id: 'B', text: 'Clontarf' },
        { id: 'C', text: 'North Strand' },
        { id: 'D', text: 'Crumlin' }
      ],
      correctAnswer: 'A',
      explanation: 'Lorcan Avenue is in Santry. As mentioned in question 12, the housing estate Lorcan is located in Santry. Lorcan Avenue is part of this estate, located off Swords Road in Santry, north Dublin. This is a residential area in Santry.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What areas are either side of Kilmacud?',
      questionNumber: 64,
      options: [
        { id: 'A', text: 'Leopardstown and Dundrum' },
        { id: 'B', text: 'Mount Merrion and Goatstown' },
        { id: 'C', text: 'Leopardstown and Stillorgan' },
        { id: 'D', text: 'Goatstown and Sandyford' }
      ],
      correctAnswer: 'D',
      explanation: 'The areas on either side of Kilmacud are Goatstown and Sandyford. Kilmacud is in south Dublin, and it is located between Goatstown (to the north) and Sandyford (to the south). These areas are all part of the south Dublin suburbs, and Kilmacud is positioned between them.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where does Castle Avenue run from?',
      questionNumber: 65,
      options: [
        { id: 'A', text: 'Fairview to Kilbarrack' },
        { id: 'B', text: 'Killester to Clontarf' },
        { id: 'C', text: 'Kilester to Raheny' },
        { id: 'D', text: 'Clontarf to Malahide' }
      ],
      correctAnswer: 'B',
      explanation: 'Castle Avenue runs from Killester to Clontarf. This is the same as question 1 - Castle Avenue is a residential road in north Dublin, connecting Killester (inland) with Clontarf (along the coast). This road provides an important connection between these two areas in north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which two areas is Crumlin adjoining?',
      questionNumber: 66,
      options: [
        { id: 'A', text: 'Drimnagh and Bluebell' },
        { id: 'B', text: 'Kimmage and Terenure' },
        { id: 'C', text: 'Kimmage and Drimnagh' },
        { id: 'D', text: 'Perrystown and Templeogue' }
      ],
      correctAnswer: 'C',
      explanation: 'Crumlin is adjoining Kimmage and Drimnagh. Crumlin is in southwest Dublin, and it directly borders both Kimmage (to the east) and Drimnagh (to the north). These areas are all adjacent to each other in the southwest Dublin area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Tonlegee Road runs between which two areas?',
      questionNumber: 67,
      options: [
        { id: 'A', text: 'Killester and Clare Hall' },
        { id: 'B', text: 'Kilbarrack and Clare Hall' },
        { id: 'C', text: 'Coolock and Raheny' },
        { id: 'D', text: 'Kilbarrack and Coolock' }
      ],
      correctAnswer: 'D',
      explanation: 'Tonlegee Road runs between Kilbarrack and Coolock. This is the same as question 56 - Tonlegee Road is in northeast Dublin, connecting Kilbarrack (along the coast) with Coolock (inland). This road provides an important connection between these areas in northeast Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where are Royal Canal Court Apartments located?',
      questionNumber: 68,
      options: [
        { id: 'A', text: 'Ashtown' },
        { id: 'B', text: 'Ballybough' },
        { id: 'C', text: 'Harolds Cross' },
        { id: 'D', text: 'Portobello' }
      ],
      correctAnswer: 'A',
      explanation: 'Royal Canal Court Apartments are located in Ashtown. Ashtown is in northwest Dublin, and the Royal Canal runs through this area. Royal Canal Court Apartments are a residential development in Ashtown, located near the Royal Canal, which gives the development its name.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what area is Cherry Orchard?',
      questionNumber: 69,
      options: [
        { id: 'A', text: 'Ballyfermot' },
        { id: 'B', text: 'Palmerstown' },
        { id: 'C', text: 'Clondalkin' },
        { id: 'D', text: 'Bluebell' }
      ],
      correctAnswer: 'A',
      explanation: 'Cherry Orchard is in Ballyfermot. As mentioned in question 5, Ballyfermot Road connects Ballyfermot and Cherry Orchard. Cherry Orchard is a residential area that is part of or adjacent to Ballyfermot in west Dublin. Both areas are in the Ballyfermot region.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which two areas does Collins Avenue run through?',
      questionNumber: 70,
      options: [
        { id: 'A', text: 'Whitehall and Donnycarney' },
        { id: 'B', text: 'Ballymun and Santry' },
        { id: 'C', text: 'Beaumont and Phibsboro' },
        { id: 'D', text: 'Glasnevin and Finglas' }
      ],
      correctAnswer: 'A',
      explanation: 'Collins Avenue runs through Whitehall and Donnycarney. Collins Avenue is a major road in north Dublin, and it has different sections. The route runs through areas like Whitehall (which is near the city) and Donnycarney (which is along the coast), connecting these areas. This road is an important route in north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The River Santry runs through which area?',
      questionNumber: 71,
      options: [
        { id: 'A', text: 'Donaghmede' },
        { id: 'B', text: 'Beaumont' },
        { id: 'C', text: 'Coolock' },
        { id: 'D', text: 'Drumcondra' }
      ],
      correctAnswer: 'C',
      explanation: 'The River Santry runs through Coolock. The Santry River is a small river in north Dublin, and it flows through the Coolock area. As mentioned in question 54 of the Dublin Roads and Navigation chapter, several roads cross the Santry River including Malahide Road, Tonglegee Road, and Oscar Traynor Road, all in the Coolock/northeast Dublin area.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Where does Castleknock road run from?',
      questionNumber: 72,
      options: [
        { id: 'A', text: 'Blanchardstown to Ashtown' },
        { id: 'B', text: 'Blanchardstown to Castleknock' },
        { id: 'C', text: 'Blanchardstown to Clonsilla' },
        { id: 'D', text: 'Blanchardstown to Carpenterstown' }
      ],
      correctAnswer: 'A',
      explanation: 'Castleknock Road runs from Blanchardstown to Ashtown. As mentioned in question 8, Castleknock is between Blanchardstown and Ashtown. Castleknock Road is the main road connecting these areas, running from Blanchardstown (in the west) through Castleknock to Ashtown (closer to the city center). This is an important route in northwest Dublin.',
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

  console.log(`✅ Created ${questions.length} questions for Areas and Roads chapter`)
  
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
