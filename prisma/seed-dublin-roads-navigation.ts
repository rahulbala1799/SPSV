import { PrismaClient, QuestionCategory } from '@prisma/client'
import 'dotenv/config'
import { syncToQuestionBank } from './sync-to-question-bank'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Dublin Roads and Navigation chapter...')

  // Create chapter
  const chapter = await prisma.chapter.upsert({
    where: { id: 'chapter_dublin_roads_navigation' },
    update: {},
    create: {
      id: 'chapter_dublin_roads_navigation',
      title: 'Dublin Roads and Navigation',
      description: 'Master your knowledge of Dublin\'s road network, street connections, map reading, and navigation. Learn about road intersections, street connections, map symbols, and how to navigate through Dublin\'s complex road system.',
      chapterNumber: 10,
      type: 'MCQ',
      duration: 60,
      isActive: true,
      category: QuestionCategory.AREA_KNOWLEDGE
    }
  })

  console.log('✅ Chapter created:', chapter.title)

  // Define all 93 questions with detailed explanations
  const questions = [
    {
      questionText: 'Where is Monastery Road?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'Tallaght' },
        { id: 'B', text: 'Crumlin' },
        { id: 'C', text: 'Clondalkin' },
        { id: 'D', text: 'Knocklyon' }
      ],
      correctAnswer: 'C',
      explanation: 'Monastery Road is located in Clondalkin, Dublin 22. This road is in the southwest area of Dublin, connecting various residential areas in Clondalkin. Clondalkin is a large suburban area known for its industrial estates and residential communities, and Monastery Road is one of the key local roads serving this area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Saint Mobhi Road, heading towards town, leads onto what road?',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Whitworth Road' },
        { id: 'B', text: 'Phibsborough Road' },
        { id: 'C', text: 'Old Finglas Road' },
        { id: 'D', text: 'Botanic Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Saint Mobhi Road, when heading towards town (south towards the city center), leads onto Botanic Road in Glasnevin. This is an important connection in the northside area, linking the residential areas around Saint Mobhi Road with the main thoroughfare of Botanic Road, which itself connects to other major routes like Drumcondra Road and Griffith Avenue.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Heading east what does the Emmet Road becomes?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Bulfin Road' },
        { id: 'B', text: 'Old Kilmainham Road' },
        { id: 'C', text: 'Tyrconnell Road' },
        { id: 'D', text: 'Inchicore Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Heading east, Emmet Road becomes Old Kilmainham Road. This is an important route in Dublin\'s southwest, running through areas like Inchicore and Kilmainham. The road continues eastward and changes name to Old Kilmainham Road as it approaches the historic Kilmainham area, which is home to Kilmainham Gaol and other significant historical sites.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Red Cow Interchange located?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'Navan Road' },
        { id: 'B', text: 'Stillorgan Road' },
        { id: 'C', text: 'Howth Road' },
        { id: 'D', text: 'Naas Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Red Cow Interchange is located on the Naas Road (N7) in Dublin. This is one of Dublin\'s busiest and most important road interchanges, connecting the M50 motorway with the N7 (Naas Road) which leads to the southwest of Ireland. The interchange is a major transport hub, with the Red Cow Luas stop also located nearby, making it a critical junction for both road and public transport networks.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'The following road does NOT run through Sandyford Industrial Estate:',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'Blackthorn Road' },
        { id: 'B', text: 'Brighton Road' },
        { id: 'C', text: 'Three Rock Road' },
        { id: 'D', text: 'Carmanhall Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Brighton Road does NOT run through Sandyford Industrial Estate. Sandyford Industrial Estate is a major business park in south Dublin, accessible via roads like Blackthorn Road, Three Rock Road, and Carmanhall Road. Brighton Road is located in a different area of Dublin and does not connect to or pass through the Sandyford Industrial Estate.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which street does NOT connect to Cardiffsbridge Road?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'Ratoath Road' },
        { id: 'B', text: 'St Helena\'s Road' },
        { id: 'C', text: 'Deanstown Avenue' },
        { id: 'D', text: 'Wellmount Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Ratoath Road does NOT connect to Cardiffsbridge Road. Cardiffsbridge Road is in the Finglas area of north Dublin, and it connects to several local roads including St Helena\'s Road, Deanstown Avenue, and Wellmount Road. Ratoath Road is a different road in the area and does not directly connect to Cardiffsbridge Road.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which of these roads adjoin South Great Georges Street?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'Drury Street, South William Street, Chatham Row' },
        { id: 'B', text: 'Dame Lane, Fade Street, Exchequer Street' },
        { id: 'C', text: 'Bow Lane East, Wicklow Street, Longford Street Little' },
        { id: 'D', text: 'York Street, Trinity Street, St Andrews Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Dame Lane, Fade Street, and Exchequer Street adjoin South Great Georges Street. South Great Georges Street is a major shopping street in Dublin\'s city center, running parallel to Grafton Street. It connects to several important streets including Dame Lane (which leads to Dame Street), Fade Street (a popular area with restaurants and bars), and Exchequer Street (connecting to the Temple Bar area).',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road does NOT directly connect to Aungier Street?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Longford Street Lower' },
        { id: 'B', text: 'Stephen Street Upper' },
        { id: 'C', text: 'Mercer Street Lower' },
        { id: 'D', text: 'Bow Lane East' }
      ],
      correctAnswer: 'C',
      explanation: 'Mercer Street Lower does NOT directly connect to Aungier Street. Aungier Street is a major street in Dublin 2, running from Wexford Street to Stephen Street. It connects to Longford Street Lower, Stephen Street Upper, and Bow Lane East, but Mercer Street Lower is located in a different area and does not directly connect to Aungier Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which Quay is NOT on the north side of the River Liffey?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Arran Quay' },
        { id: 'B', text: 'Wood Quay' },
        { id: 'C', text: 'Wolfe Tone Quay' },
        { id: 'D', text: 'Eden Quay' }
      ],
      correctAnswer: 'B',
      explanation: 'Wood Quay is NOT on the north side of the River Liffey - it is on the south side. The River Liffey flows through Dublin from west to east, and the quays on the north side include Arran Quay, Wolfe Tone Quay, and Eden Quay. Wood Quay is on the south bank of the Liffey, near the Four Courts and Dublin City Council offices.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street are the Castleforbes Apartments located?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'Mayor Street Upper' },
        { id: 'B', text: 'Eastwall Road' },
        { id: 'C', text: 'City Quay' },
        { id: 'D', text: 'Pearse Street' }
      ],
      correctAnswer: 'A',
      explanation: 'The Castleforbes Apartments are located on Mayor Street Upper in the IFSC (International Financial Services Centre) area of Dublin 1. This is a modern residential development in the heart of Dublin\'s financial district, close to the River Liffey and the city center. Mayor Street Upper is in the Docklands area, which has been extensively redeveloped in recent years.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Lorcan estate is located off which road?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'Collins Avenue' },
        { id: 'B', text: 'Coolgariff Road' },
        { id: 'C', text: 'Shantalla Road' },
        { id: 'D', text: 'Swords Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Lorcan estate is located off Swords Road in Santry, Dublin 9. Swords Road is a major route in north Dublin, running from the city center towards Swords and the airport. The Lorcan estate is a residential area accessed from Swords Road, in the Santry area which is well-known for its proximity to Dublin Airport.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What road runs from St Stephen\'s Green to Adelaide Road?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Hume Street' },
        { id: 'B', text: 'Earlsfort Terrace' },
        { id: 'C', text: 'Harcourt Street' },
        { id: 'D', text: 'Hatch Street Lower' }
      ],
      correctAnswer: 'B',
      explanation: 'Earlsfort Terrace runs from St Stephen\'s Green to Adelaide Road. This is an important street in Dublin 2, connecting the prestigious St Stephen\'s Green area with Adelaide Road. Earlsfort Terrace is home to several important buildings and is part of the route that connects the city center with areas like Ranelagh and Rathmines to the south.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which of the following streets does NOT connect to Dame Street?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'Sycamore Street' },
        { id: 'B', text: 'Drury Street' },
        { id: 'C', text: 'Trinity Street' },
        { id: 'D', text: 'Eustace Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Drury Street does NOT connect to Dame Street. Dame Street is one of Dublin\'s main thoroughfares, running from College Green to Christchurch. It connects to Sycamore Street, Trinity Street, and Eustace Street, but Drury Street is parallel to Dame Street and connects to South Great Georges Street instead.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Of the following Dublin streets, which street is NOT pedestrianised?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Cecilia Street' },
        { id: 'B', text: 'Mary Street' },
        { id: 'C', text: 'Grafton Street' },
        { id: 'D', text: 'South King Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Cecilia Street is NOT pedestrianised. Grafton Street, Mary Street, and South King Street are all pedestrianised shopping streets in Dublin\'s city center. Cecilia Street, however, is a regular street in the Temple Bar area that allows vehicular traffic, though it may have restricted access during certain times.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'As you head north, what does Wyattville Road become?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'Church Road' },
        { id: 'B', text: 'Killiney Hill Road' },
        { id: 'C', text: 'Rochestown Avenue' },
        { id: 'D', text: 'Bray Road' }
      ],
      correctAnswer: 'A',
      explanation: 'As you head north, Wyattville Road becomes Church Road. This is in the Dún Laoghaire area of south Dublin. Wyattville Road runs through residential areas and continues northward as Church Road, which is part of the coastal route in this area, connecting various residential neighborhoods.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Howth Summit is located off which main road in Howth?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'Thormanby Road' },
        { id: 'B', text: 'Bailey Green Road' },
        { id: 'C', text: 'Carrickbrack Road' },
        { id: 'D', text: 'Windgate Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Howth Summit is located off Bailey Green Road in Howth. Howth is a coastal area in north Dublin, and the summit provides stunning views over Dublin Bay. Bailey Green Road is the main access road to reach the summit area, which is a popular destination for walkers and tourists visiting Howth.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which Luas stop is not on the Naas Road?',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'Bluebell' },
        { id: 'B', text: 'Goldenbridge' },
        { id: 'C', text: 'Kylemore' },
        { id: 'D', text: 'Redcow' }
      ],
      correctAnswer: 'B',
      explanation: 'Goldenbridge Luas stop is NOT on the Naas Road. The Luas Red Line runs along the Naas Road and includes stops like Bluebell, Kylemore, and Redcow. However, Goldenbridge stop is located on Davitt Road, not on the Naas Road. The Naas Road is part of the N7 route in southwest Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'North Road leads onto which of the following roads?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'Finglas Road' },
        { id: 'B', text: 'Mellowes Road' },
        { id: 'C', text: 'Finglaswood Road' },
        { id: 'D', text: 'Jamestown Road' }
      ],
      correctAnswer: 'A',
      explanation: 'North Road leads onto Finglas Road. This is in the Finglas area of north Dublin. North Road is a local road that connects to the main Finglas Road, which is a significant route serving the Finglas area and connecting it to other parts of north Dublin and the city center.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which two roads does Griffith Avenue join?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Saint Mobhi Road and Malahide Road' },
        { id: 'B', text: 'Drumcondra Road and Collins Avenue' },
        { id: 'C', text: 'Finglas Road and Navan Road' },
        { id: 'D', text: 'Howth Road and Drumcondra Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Griffith Avenue joins Saint Mobhi Road and Malahide Road. Griffith Avenue is a major residential road in north Dublin, running through areas like Whitehall and Glasnevin. It connects Saint Mobhi Road (which leads towards Botanic Road and the city) with Malahide Road (which continues towards the coast and Malahide). This makes it an important east-west route in north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What colour are Regional Roads on a map?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'Blue' },
        { id: 'B', text: 'Orange' },
        { id: 'C', text: 'White' },
        { id: 'D', text: 'Green' }
      ],
      correctAnswer: 'B',
      explanation: 'Regional Roads are represented in orange on maps. In Ireland\'s road classification system, different road types are color-coded on maps: Motorways are blue, National Primary Roads are green, National Secondary Roads are green with white, and Regional Roads are orange. This color coding helps drivers quickly identify road types and their importance in the road network.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'The following road does NOT connect to South Great George Street:',
      questionNumber: 21,
      options: [
        { id: 'A', text: 'Fade Street' },
        { id: 'B', text: 'Clarendon Street' },
        { id: 'C', text: 'Exchequer Street' },
        { id: 'D', text: 'Dame Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Clarendon Street does NOT connect to South Great Georges Street. South Great Georges Street is a major shopping street in Dublin\'s city center, connecting to Fade Street, Exchequer Street, and Dame Street. Clarendon Street, however, is a different street that runs parallel and connects to Grafton Street and other streets in the area, but not directly to South Great Georges Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road does NOT run off Amien Street?',
      questionNumber: 22,
      options: [
        { id: 'A', text: 'Ossory Road' },
        { id: 'B', text: 'Talbot Street' },
        { id: 'C', text: 'Store Street' },
        { id: 'D', text: 'Sheriff Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Ossory Road does NOT run off Amiens Street. Amiens Street (also spelled Amien Street) is in Dublin 1, in the north inner city area. It connects to Talbot Street, Store Street, and Sheriff Street Lower, but Ossory Road is located in a different area (Dublin 5, in the Coolock area) and does not connect to Amiens Street.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Drumcondra Road Upper is intersected by which road?',
      questionNumber: 23,
      options: [
        { id: 'A', text: 'Collins Avenue' },
        { id: 'B', text: 'Saint Mobhi Road' },
        { id: 'C', text: 'Clonliffe Road' },
        { id: 'D', text: 'Griffith Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Drumcondra Road Upper is intersected by Griffith Avenue. Drumcondra Road is a major route in north Dublin, running from the city center through Drumcondra. The Upper section of Drumcondra Road crosses Griffith Avenue, which is another important residential road in the area. This intersection is a significant junction in the northside road network.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Malahide Road is intersected by which road?',
      questionNumber: 24,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Shantalla Road' },
        { id: 'C', text: 'Collins Avenue' },
        { id: 'D', text: 'Ardmore Drive' }
      ],
      correctAnswer: 'C',
      explanation: 'Malahide Road is intersected by Collins Avenue. Malahide Road is a major route in north Dublin, running from Fairview towards Malahide. Collins Avenue is an important road that crosses Malahide Road, connecting areas like Whitehall and Santry. This intersection is significant for traffic flow in north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what colour are Pedestrian Streets represented on a map?',
      questionNumber: 25,
      options: [
        { id: 'A', text: 'Green' },
        { id: 'B', text: 'Pink' },
        { id: 'C', text: 'Blue' },
        { id: 'D', text: 'Yellow' }
      ],
      correctAnswer: 'B',
      explanation: 'Pedestrian Streets are represented in pink on maps. This color coding helps map readers quickly identify areas that are pedestrian-only zones, which is important for navigation and understanding traffic restrictions. Pedestrian streets like Grafton Street and parts of Henry Street are typically shown in pink on detailed city maps.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Which road runs directly off Griffith Avenue?',
      questionNumber: 26,
      options: [
        { id: 'A', text: 'Whitehall Road' },
        { id: 'B', text: 'Drumcondra Road' },
        { id: 'C', text: 'Collins Avenue' },
        { id: 'D', text: 'Santry Avenue' }
      ],
      correctAnswer: 'B',
      explanation: 'Drumcondra Road runs directly off Griffith Avenue. Griffith Avenue is a major residential road in north Dublin, and Drumcondra Road connects to it. This connection is important for traffic flow in the area, allowing access between these two significant routes in north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'From the following roads, which one does NOT cross the Royal Canal?',
      questionNumber: 27,
      options: [
        { id: 'A', text: 'Broombridge Road' },
        { id: 'B', text: 'Straffan Road' },
        { id: 'C', text: 'Phibsborough Road' },
        { id: 'D', text: 'Moyle Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Moyle Road does NOT cross the Royal Canal. The Royal Canal runs through north Dublin, and several roads cross it including Broombridge Road, Straffan Road, and Phibsborough Road. Moyle Road, however, is located in a different area and does not cross the Royal Canal.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What road does Churchtown Road Upper adjoin:',
      questionNumber: 28,
      options: [
        { id: 'A', text: 'Goatstown Road' },
        { id: 'B', text: 'Orwell Road' },
        { id: 'C', text: 'Weston Park' },
        { id: 'D', text: 'Taney Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Churchtown Road Upper adjoins Taney Road. Churchtown is a residential area in south Dublin, and Churchtown Road Upper is a local road in this area. It connects to Taney Road, which is another important local route serving the Churchtown and Dundrum areas.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'On what national road is Jobstown situated?',
      questionNumber: 29,
      options: [
        { id: 'A', text: 'N4' },
        { id: 'B', text: 'N2' },
        { id: 'C', text: 'N81' },
        { id: 'D', text: 'N11' }
      ],
      correctAnswer: 'C',
      explanation: 'Jobstown is situated on the N81 national road. Jobstown is a residential area in Tallaght, southwest Dublin. The N81 is a national secondary road that runs from Tallaght through areas like Jobstown, continuing towards Blessington and beyond. This road is an important route serving southwest Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Sean McDermott Upper and Lower is intersected by what street?',
      questionNumber: 30,
      options: [
        { id: 'A', text: 'Cathal Brugha Street' },
        { id: 'B', text: 'Malborough Street' },
        { id: 'C', text: 'Parnell Street' },
        { id: 'D', text: 'Gardiner Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Sean McDermott Street Upper and Lower is intersected by Gardiner Street. Sean McDermott Street is in Dublin 1, in the north inner city area. Gardiner Street is a major north-south route that crosses Sean McDermott Street, creating an important intersection in this part of the city.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The following road does NOT connect to Ballyfermot Road:',
      questionNumber: 31,
      options: [
        { id: 'A', text: 'Le Fanu Road' },
        { id: 'B', text: 'Drumfinn Road' },
        { id: 'C', text: 'Claddagh Road' },
        { id: 'D', text: 'Clifden Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Claddagh Road does NOT connect to Ballyfermot Road. Ballyfermot Road is in west Dublin, serving the Ballyfermot area. It connects to several local roads including Le Fanu Road, Drumfinn Road, and Clifden Road. Claddagh Road, however, is in a different location and does not connect to Ballyfermot Road.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What roads cross over the Grand Canal?',
      questionNumber: 32,
      options: [
        { id: 'A', text: 'Northumberland Road, Baggot Street and South Lotts Road' },
        { id: 'B', text: 'Clanwilliam Place, Baggot Street and Mount Street Upper' },
        { id: 'C', text: 'Leeson Street, Northumberland Road and Baggot Street' },
        { id: 'D', text: 'Leeson Street, Percy Place and Baggot Street' }
      ],
      correctAnswer: 'C',
      explanation: 'Leeson Street, Northumberland Road, and Baggot Street cross over the Grand Canal. The Grand Canal runs through south Dublin, and these are three of the main roads that cross it. Leeson Street crosses near the city center, Northumberland Road crosses further east, and Baggot Street also crosses the canal, all providing important connections between areas north and south of the canal.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What road adjoins the Ballymun Road?',
      questionNumber: 33,
      options: [
        { id: 'A', text: 'Beaumont Road' },
        { id: 'B', text: 'Drumcondra Road Upper' },
        { id: 'C', text: 'Home Farm Road' },
        { id: 'D', text: 'Glasnevin Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Glasnevin Avenue adjoins the Ballymun Road. Ballymun Road is a major route in north Dublin, running from the city center towards Ballymun. Glasnevin Avenue is an important local road that connects to Ballymun Road, serving the Glasnevin area which is known for the Glasnevin Cemetery and National Botanic Gardens.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road connects Stillorgan Road and Rock Road?',
      questionNumber: 34,
      options: [
        { id: 'A', text: 'Woodbine Avenue' },
        { id: 'B', text: 'Foster Avenue' },
        { id: 'C', text: 'Avoca Avenue' },
        { id: 'D', text: 'Booterstown Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Booterstown Avenue connects Stillorgan Road and Rock Road. These are all major roads in south Dublin. Stillorgan Road runs through Stillorgan, Rock Road runs along the coast through areas like Blackrock, and Booterstown Avenue provides the connection between these two important routes in the southside area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road does NOT run ON to Aungier Street?',
      questionNumber: 35,
      options: [
        { id: 'A', text: 'Whitefriar Place' },
        { id: 'B', text: 'Longford Street' },
        { id: 'C', text: 'Wexford Street' },
        { id: 'D', text: 'York Street' }
      ],
      correctAnswer: 'D',
      explanation: 'York Street does NOT run on to Aungier Street. Aungier Street is a major street in Dublin 2, and several streets connect to it including Whitefriar Place, Longford Street, and Wexford Street. York Street, however, is in a different location and does not connect to Aungier Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Old Kilmainham Road merges with which of the following roads?',
      questionNumber: 36,
      options: [
        { id: 'A', text: 'South Circular Road' },
        { id: 'B', text: 'Emmet Road' },
        { id: 'C', text: 'Inchicore Road' },
        { id: 'D', text: 'Bulfin Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Old Kilmainham Road merges with Emmet Road. As mentioned in question 3, heading east, Emmet Road becomes Old Kilmainham Road. So in the opposite direction, heading west, Old Kilmainham Road merges with or becomes Emmet Road. This is an important route in southwest Dublin, running through areas like Inchicore and Kilmainham.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Lord Edward Street becomes the following street:',
      questionNumber: 37,
      options: [
        { id: 'A', text: 'Castle Street' },
        { id: 'B', text: 'Winetavern Street' },
        { id: 'C', text: 'Parliament Street' },
        { id: 'D', text: 'Dame Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Lord Edward Street becomes Dame Street. Lord Edward Street is in Dublin\'s city center, running from Christchurch towards the east. It continues as Dame Street, which is one of Dublin\'s main thoroughfares, running from College Green to Christchurch. This is an important east-west route through the historic center of Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which of these roads is NOT along the Grand Canal?',
      questionNumber: 38,
      options: [
        { id: 'A', text: 'Grand Parade' },
        { id: 'B', text: 'Appian Way' },
        { id: 'C', text: 'Grove Road' },
        { id: 'D', text: 'Mespil Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Appian Way is NOT along the Grand Canal. The Grand Canal runs through south Dublin, and several roads run alongside it including Grand Parade, Grove Road, and Mespil Road. Appian Way, however, is in the Ranelagh area and runs in a different direction, not along the Grand Canal.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What street is not connected to Aungier Street?',
      questionNumber: 39,
      options: [
        { id: 'A', text: 'Whitefriar Place' },
        { id: 'B', text: 'Bow Lane East Street' },
        { id: 'C', text: 'Fade Street' },
        { id: 'D', text: 'Bishop Street' }
      ],
      correctAnswer: 'C',
      explanation: 'Fade Street is not connected to Aungier Street. Aungier Street connects to Whitefriar Place, Bow Lane East, and Bishop Street, but Fade Street is a different street that connects to South Great Georges Street and other streets in the area, not directly to Aungier Street.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road does NOT adjoin Clanbrassil Street?',
      questionNumber: 40,
      options: [
        { id: 'A', text: 'Long Lane' },
        { id: 'B', text: 'Clanbrassil Terrace' },
        { id: 'C', text: 'South Circular Road' },
        { id: 'D', text: 'Lombard Street West' }
      ],
      correctAnswer: 'A',
      explanation: 'Long Lane does NOT adjoin Clanbrassil Street. Clanbrassil Street is a major street in Dublin 8, running through the Liberties area. It connects to Clanbrassil Terrace, South Circular Road, and Lombard Street West, but Long Lane is in a different location and does not adjoin Clanbrassil Street.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which of these roads does NOT cross the Dodder river?',
      questionNumber: 41,
      options: [
        { id: 'A', text: 'Templeville Road' },
        { id: 'B', text: 'Dundrum Road' },
        { id: 'C', text: 'Orwell Road' },
        { id: 'D', text: 'Rathfarnham Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Templeville Road does NOT cross the River Dodder. The River Dodder flows through south Dublin, and several roads cross it including Dundrum Road, Orwell Road, and Rathfarnham Road. Templeville Road, however, is in a different location and does not cross the Dodder.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which road does NOT adjoin Amien Street?',
      questionNumber: 42,
      options: [
        { id: 'A', text: 'Sheriff Street Lower' },
        { id: 'B', text: 'Preston Street' },
        { id: 'C', text: 'Ossory Road' },
        { id: 'D', text: 'Talbot Street' }
      ],
      correctAnswer: 'C',
      explanation: 'Ossory Road does NOT adjoin Amiens Street. As mentioned in question 22, Amiens Street connects to Sheriff Street Lower, Preston Street, and Talbot Street, but Ossory Road is in the Coolock area (Dublin 5) and does not adjoin Amiens Street which is in Dublin 1.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What colour are Motorways on a map?',
      questionNumber: 43,
      options: [
        { id: 'A', text: 'Green' },
        { id: 'B', text: 'Blue' },
        { id: 'C', text: 'Yellow' },
        { id: 'D', text: 'Red' }
      ],
      correctAnswer: 'B',
      explanation: 'Motorways are represented in blue on maps. In Ireland\'s road classification system, motorways (like the M50, M1, M4, etc.) are shown in blue on maps. This helps drivers quickly identify the highest-capacity roads in the network. National Primary Roads are green, National Secondary Roads are green with white, and Regional Roads are orange.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'What road does Strand Road join?',
      questionNumber: 44,
      options: [
        { id: 'A', text: 'Beach Road and Ailesbury Road' },
        { id: 'B', text: 'Ailesbury Road and Serpentine Avenue' },
        { id: 'C', text: 'Merrion Road and Sandymount Road' },
        { id: 'D', text: 'Merrion Road and Beach Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Strand Road joins Merrion Road and Beach Road. Strand Road is a coastal road in south Dublin, running along the coast. It connects Merrion Road (which continues towards the city) with Beach Road (which continues along the coast). This is part of the coastal route in the southside area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What river runs along Botanic Avenue?',
      questionNumber: 45,
      options: [
        { id: 'A', text: 'Tolka River' },
        { id: 'B', text: 'Royal Canal' },
        { id: 'C', text: 'River Dodder' },
        { id: 'D', text: 'River Liffey' }
      ],
      correctAnswer: 'A',
      explanation: 'The Tolka River runs along Botanic Avenue. Botanic Avenue is in Glasnevin, north Dublin, and it runs alongside the Tolka River. The Tolka is one of Dublin\'s main rivers, flowing through areas like Glasnevin and Drumcondra before reaching the sea. The National Botanic Gardens are also located in this area, near Botanic Avenue.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which two roads does Alfie Byrne Road connect?',
      questionNumber: 46,
      options: [
        { id: 'A', text: 'Church Road and Bargy Road' },
        { id: 'B', text: 'Church Road and Bargy Road' },
        { id: 'C', text: 'Clontarf Road and East Wall Road' },
        { id: 'D', text: 'Clontarf Road and Annesley Bridge Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Alfie Byrne Road connects Clontarf Road and East Wall Road. Alfie Byrne Road is in the Clontarf area of north Dublin, running along the coast. It provides an important connection between Clontarf Road (which continues along the coast) and East Wall Road (which leads towards the city center and the port area).',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road connects Booterstown Avenue and Mount Merrion Avenue?',
      questionNumber: 47,
      options: [
        { id: 'A', text: 'Avoca Avenue' },
        { id: 'B', text: 'Cross Avenue' },
        { id: 'C', text: 'Grove Avenue' },
        { id: 'D', text: 'Booterstown Park' }
      ],
      correctAnswer: 'B',
      explanation: 'Cross Avenue connects Booterstown Avenue and Mount Merrion Avenue. These are all roads in the affluent south Dublin area. Booterstown Avenue runs along the coast, Mount Merrion Avenue serves the Mount Merrion area, and Cross Avenue provides the connection between these two important routes.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What road intersects the Kylemore Road?',
      questionNumber: 48,
      options: [
        { id: 'A', text: 'St Laurences Road' },
        { id: 'B', text: 'Chapelizod Bypass' },
        { id: 'C', text: 'Old Naas Road' },
        { id: 'D', text: 'Rossmore Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Old Naas Road intersects the Kylemore Road. Kylemore Road is in west Dublin, and Old Naas Road crosses it. This intersection is significant for traffic flow in the area, as both roads serve important functions in the west Dublin road network.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Off which road is Kinvara Estate located?',
      questionNumber: 49,
      options: [
        { id: 'A', text: 'Finglas Road' },
        { id: 'B', text: 'Lucan Road' },
        { id: 'C', text: 'Ratoath Road' },
        { id: 'D', text: 'Navan Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Kinvara Estate is located off the Navan Road. The Navan Road (N3) is a major route in northwest Dublin, running from the city center towards Navan and beyond. Kinvara Estate is a residential development accessed from the Navan Road, in the area around Finglas and Cabra.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What two streets are connected by the Powerscourt Centre?',
      questionNumber: 50,
      options: [
        { id: 'A', text: 'Exchequer Street and Wicklow Street' },
        { id: 'B', text: 'Drury Street and Fade Street' },
        { id: 'C', text: 'South William Street and Clarendon Street' },
        { id: 'D', text: 'Clarendon Street and Grafton Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The Powerscourt Centre connects South William Street and Clarendon Street. The Powerscourt Centre is a historic shopping center in Dublin\'s city center, located in a beautifully restored Georgian building. It provides a pedestrian connection between South William Street (which runs parallel to Grafton Street) and Clarendon Street (which also runs in the same area).',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What street does NOT connect directly to Amiens Street?',
      questionNumber: 51,
      options: [
        { id: 'A', text: 'Store Street' },
        { id: 'B', text: 'Commons Street' },
        { id: 'C', text: 'Sheriff Street Lower' },
        { id: 'D', text: 'Talbot Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Commons Street does NOT connect directly to Amiens Street. Amiens Street connects to Store Street, Sheriff Street Lower, and Talbot Street, but Commons Street is in a different location and does not connect directly to Amiens Street.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which road does NOT cross the River Dodder?',
      questionNumber: 52,
      options: [
        { id: 'A', text: 'Bushy Park Road' },
        { id: 'B', text: 'Orwell Road' },
        { id: 'C', text: 'Dundrum Road' },
        { id: 'D', text: 'Clonskeagh Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Bushy Park Road does NOT cross the River Dodder. The River Dodder flows through south Dublin, and several roads cross it including Orwell Road, Dundrum Road, and Clonskeagh Road. Bushy Park Road, however, is in the Terenure area and does not cross the Dodder.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Where is Bison Bar & BBQ situated?',
      questionNumber: 53,
      options: [
        { id: 'A', text: 'North Wall Quay' },
        { id: 'B', text: 'Wellington Quay' },
        { id: 'C', text: 'City Quay' },
        { id: 'D', text: 'Lower Ormond Quay' }
      ],
      correctAnswer: 'B',
      explanation: 'Bison Bar & BBQ is situated on Wellington Quay. Wellington Quay is on the south side of the River Liffey in Dublin\'s city center, in the Temple Bar area. It\'s a popular area with restaurants, bars, and entertainment venues, and Bison Bar & BBQ is one of the establishments located there.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which road do NOT cross the Santry River?',
      questionNumber: 54,
      options: [
        { id: 'A', text: 'Malahide Road' },
        { id: 'B', text: 'Tonglegee Road' },
        { id: 'C', text: 'Oscar Traynor Road' },
        { id: 'D', text: 'Barry Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Barry Road does NOT cross the Santry River. The Santry River is a small river in north Dublin, and several roads cross it including Malahide Road, Tonglegee Road, and Oscar Traynor Road. Barry Road, however, is in a different location and does not cross the Santry River.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Molesworth Street connects which two streets?',
      questionNumber: 55,
      options: [
        { id: 'A', text: 'Stephens Green and Dawson Street' },
        { id: 'B', text: 'Frederick Street and South Anne Street' },
        { id: 'C', text: 'Dawson Street and Kildare Street' },
        { id: 'D', text: 'Schoolhouse Lane East and Nassau Street' }
      ],
      correctAnswer: 'C',
      explanation: 'Molesworth Street connects Dawson Street and Kildare Street. Molesworth Street is in Dublin\'s city center, in a prestigious area near the Dáil (Irish Parliament) and other important government buildings. It provides a connection between Dawson Street (which runs towards Grafton Street) and Kildare Street (which is home to the National Library and National Museum).',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The Clontarf Golf Course entrance is on which road?',
      questionNumber: 56,
      options: [
        { id: 'A', text: 'Vernon Avenue' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Castle Avenue' },
        { id: 'D', text: 'Malahide Road' }
      ],
      correctAnswer: 'C',
      explanation: 'The Clontarf Golf Course entrance is on Castle Avenue. Clontarf is a coastal area in north Dublin, and Castle Avenue is one of the main roads in the area. The golf course is a popular recreational facility in Clontarf, and its entrance is accessed from Castle Avenue.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On a map with a scale of 1:450000, a distance measured on the map is:',
      questionNumber: 57,
      options: [
        { id: 'A', text: '450 times smaller than it is on the ground' },
        { id: 'B', text: '45,000 times smaller than it is on the ground' },
        { id: 'C', text: '4,500 times smaller than it is on the ground' },
        { id: 'D', text: '450,000 times smaller than it is on the ground' }
      ],
      correctAnswer: 'D',
      explanation: 'On a map with a scale of 1:450,000, a distance measured on the map is 450,000 times smaller than it is on the ground. Map scales work by showing that one unit on the map represents a larger number of units on the ground. So 1:450,000 means 1 cm on the map equals 450,000 cm (or 4.5 km) on the ground.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Travelling away from the city centre, Clontarf Road leads onto what road?',
      questionNumber: 58,
      options: [
        { id: 'A', text: 'Oscar Traynor Road' },
        { id: 'B', text: 'James Larkin Road' },
        { id: 'C', text: 'Alfie Byrne Road' },
        { id: 'D', text: 'Howth Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Travelling away from the city centre, Clontarf Road leads onto James Larkin Road. Clontarf Road runs along the coast in north Dublin, and as you travel north away from the city center, it continues as James Larkin Road, which then continues towards areas like Raheny and Howth.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Camden Row runs between which two streets?',
      questionNumber: 59,
      options: [
        { id: 'A', text: 'Wexford Street and Montague Street' },
        { id: 'B', text: 'Wexford Street and Camden Place' },
        { id: 'C', text: 'Harcourt Street and Pleasants Street' },
        { id: 'D', text: 'Wexford Street and Heytesbury Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Camden Row runs between Wexford Street and Heytesbury Street. Camden Row is in Dublin 2, in the area around Camden Street and Wexford Street. It provides a connection between Wexford Street (which runs towards Aungier Street) and Heytesbury Street (which is in the same area).',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Where is the Convention Centre located?',
      questionNumber: 60,
      options: [
        { id: 'A', text: 'Spencer Dock, North Wall Quay' },
        { id: 'B', text: 'City Quay' },
        { id: 'C', text: 'Burgh Quay' },
        { id: 'D', text: 'Victoria Quay' }
      ],
      correctAnswer: 'A',
      explanation: 'The Convention Centre is located at Spencer Dock, North Wall Quay. The Convention Centre Dublin (CCD) is a modern conference and events venue in the Docklands area of Dublin 1. It\'s located at Spencer Dock on North Wall Quay, in the heart of Dublin\'s redeveloped Docklands area, close to the IFSC and the River Liffey.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Which street does Killiney Road adjoin?',
      questionNumber: 61,
      options: [
        { id: 'A', text: 'Bellevue Road' },
        { id: 'B', text: 'Dalkey Avenue' },
        { id: 'C', text: 'Albert Road Upper' },
        { id: 'D', text: 'Cunningham Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Killiney Road adjoins Dalkey Avenue. Killiney and Dalkey are adjacent coastal areas in south Dublin, known for their scenic beauty and affluent residential areas. Killiney Road connects to Dalkey Avenue, providing access between these two areas along the coast.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'How is a National Secondary Road represented on a map?',
      questionNumber: 62,
      options: [
        { id: 'A', text: 'Blue & White line' },
        { id: 'B', text: 'Solid green line' },
        { id: 'C', text: 'Green & White line' },
        { id: 'D', text: 'Solid orange line' }
      ],
      correctAnswer: 'C',
      explanation: 'A National Secondary Road is represented as a Green & White line on maps. In Ireland\'s road classification system, National Secondary Roads (like the N81, N82, etc.) are shown with a green line with white markings or borders. This distinguishes them from National Primary Roads (solid green) and helps map readers identify different road types.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Harold\'s Cross Road links which of the following:',
      questionNumber: 63,
      options: [
        { id: 'A', text: 'Terenure and Clanbrassil Street' },
        { id: 'B', text: 'Harolds Cross and Walkinstown Avenue' },
        { id: 'C', text: 'Dolphins Barn and Cork Street' },
        { id: 'D', text: 'Rathmines and Sundrive Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Harold\'s Cross Road links Terenure and Clanbrassil Street. Harold\'s Cross Road is an important route in south Dublin, running from the Terenure area towards the city center. It connects to Clanbrassil Street, which continues into the city. This is a significant route serving the southside area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Mulhuddart is located beside which National road?',
      questionNumber: 64,
      options: [
        { id: 'A', text: 'N11' },
        { id: 'B', text: 'N4' },
        { id: 'C', text: 'N81' },
        { id: 'D', text: 'N3' }
      ],
      correctAnswer: 'D',
      explanation: 'Mulhuddart is located beside the N3 national road. Mulhuddart is an area in west Dublin, and the N3 (Navan Road) runs through or near this area. The N3 is a major route connecting Dublin with Navan and beyond, and Mulhuddart is situated along this route.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Heading to town, Terenure Road North leads onto what road?',
      questionNumber: 65,
      options: [
        { id: 'A', text: 'Lower Kimmage Road' },
        { id: 'B', text: 'Sundrive Road' },
        { id: 'C', text: 'Larkfield Park' },
        { id: 'D', text: 'Harolds Cross Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Heading to town (towards the city center), Terenure Road North leads onto Harolds Cross Road. Terenure Road North is in the Terenure area of south Dublin, and as you travel towards the city center, it continues as Harolds Cross Road, which then connects to other routes leading into the city.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'How is a National Primary Road represented on a map?',
      questionNumber: 66,
      options: [
        { id: 'A', text: 'Solid green line' },
        { id: 'B', text: 'White & Blue line' },
        { id: 'C', text: 'Orange line' },
        { id: 'D', text: 'White & Green line' }
      ],
      correctAnswer: 'A',
      explanation: 'A National Primary Road is represented as a Solid green line on maps. In Ireland\'s road classification system, National Primary Roads (like the N1, N2, N3, N4, N7, N11, etc.) are shown with a solid green line. This distinguishes them from motorways (blue), National Secondary Roads (green & white), and Regional Roads (orange).',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Which of the following does Ballyboden Way adjoin:',
      questionNumber: 67,
      options: [
        { id: 'A', text: 'Stocking Lane' },
        { id: 'B', text: 'Grange Road' },
        { id: 'C', text: 'Taylors Lane' },
        { id: 'D', text: 'Firhouse Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Ballyboden Way adjoins Taylors Lane. Ballyboden is an area in south Dublin, and Ballyboden Way is a local road in this area. It connects to Taylors Lane, which is another local route serving the Ballyboden and surrounding areas.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Driving towards the City Centre, Clonskeagh Road leads onto what road?',
      questionNumber: 68,
      options: [
        { id: 'A', text: 'Bird Avenue' },
        { id: 'B', text: 'Goatstown Road' },
        { id: 'C', text: 'Ranelagh Road' },
        { id: 'D', text: 'Sandford Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Driving towards the City Centre, Clonskeagh Road leads onto Sandford Road. Clonskeagh Road is in south Dublin, and as you travel towards the city center, it continues as Sandford Road, which then connects to other routes leading into the city center area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Davitt Road runs between what two Luas stops?',
      questionNumber: 69,
      options: [
        { id: 'A', text: 'Bluebell and Suir Road' },
        { id: 'B', text: 'Blackhorse and Suir Road' },
        { id: 'C', text: 'Blackhorse and Rialto' },
        { id: 'D', text: 'Goldenbridge and Rialto' }
      ],
      correctAnswer: 'B',
      explanation: 'Davitt Road runs between the Blackhorse and Suir Road Luas stops. The Luas Red Line runs along Davitt Road in west Dublin, and these are two of the stops along this route. Blackhorse stop is to the west, and Suir Road stop is to the east, with Davitt Road running between them.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Heading out of the city centre the Long Mile Road leads onto what road?',
      questionNumber: 70,
      options: [
        { id: 'A', text: 'Ballymount Road' },
        { id: 'B', text: 'Crumlin Road' },
        { id: 'C', text: 'Kylemore Road' },
        { id: 'D', text: 'Naas Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Heading out of the city centre, the Long Mile Road leads onto the Naas Road (N7). Long Mile Road is in southwest Dublin, and as you travel away from the city center, it continues as the Naas Road, which is part of the N7 route leading towards Naas, Kildare, and beyond.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Kevin Street Upper connects what street?',
      questionNumber: 71,
      options: [
        { id: 'A', text: 'Harcourt Street' },
        { id: 'B', text: 'Patrick Street' },
        { id: 'C', text: 'Peter Street' },
        { id: 'D', text: 'Digges Street Upper' }
      ],
      correctAnswer: 'B',
      explanation: 'Kevin Street Upper connects to Patrick Street. Kevin Street is in Dublin 8, in the Liberties area. Kevin Street Upper connects to Patrick Street, which is an important route in this historic part of Dublin, near St. Patrick\'s Cathedral and other significant landmarks.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Carrickbrack Road becomes what road when travelling out of Howth?',
      questionNumber: 72,
      options: [
        { id: 'A', text: 'Coast Road' },
        { id: 'B', text: 'Greenfield Road' },
        { id: 'C', text: 'Dublin Road' },
        { id: 'D', text: 'Howth Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Carrickbrack Road becomes Greenfield Road when travelling out of Howth. Howth is a coastal area in north Dublin, and Carrickbrack Road is one of the roads in the area. As you travel away from Howth, it continues as Greenfield Road, which then connects to other routes.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What road does NOT run along the Guinness Brewery?',
      questionNumber: 73,
      options: [
        { id: 'A', text: 'Watling Street' },
        { id: 'B', text: 'Wolfe Tone Quay' },
        { id: 'C', text: 'Victoria Quay' },
        { id: 'D', text: 'Thomas Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Wolfe Tone Quay does NOT run along the Guinness Brewery. The Guinness Brewery (St. James\'s Gate) is in Dublin 8, and several roads run along or near it including Watling Street, Victoria Quay, and Thomas Street. Wolfe Tone Quay, however, is on the north side of the River Liffey and does not run along the brewery.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The following road does not adjoin Crumlin Road:',
      questionNumber: 74,
      options: [
        { id: 'A', text: 'Mourne Road' },
        { id: 'B', text: 'Windmill Road' },
        { id: 'C', text: 'Old County Road' },
        { id: 'D', text: 'Clonard Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Mourne Road does not adjoin Crumlin Road. Crumlin Road is in southwest Dublin, and it connects to several local roads including Windmill Road, Old County Road, and Clonard Road. Mourne Road, however, is in a different location and does not adjoin Crumlin Road.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which of these roads is NOT pedestrianised?',
      questionNumber: 75,
      options: [
        { id: 'A', text: 'Upper Liffey Street' },
        { id: 'B', text: 'Henry Street' },
        { id: 'C', text: 'Parnell Street' },
        { id: 'D', text: 'North Earl Street' }
      ],
      correctAnswer: 'C',
      explanation: 'Parnell Street is NOT pedestrianised. Upper Liffey Street, Henry Street, and North Earl Street are all pedestrianised shopping streets in Dublin\'s city center. Parnell Street, however, is a regular street that allows vehicular traffic, though it may have some pedestrian-friendly sections.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What road does Blackhourse Avenue connect to?',
      questionNumber: 76,
      options: [
        { id: 'A', text: 'Ratoath Road' },
        { id: 'B', text: 'Prussia Street' },
        { id: 'C', text: 'North Circular Road' },
        { id: 'D', text: 'Chesterfield Avenue' }
      ],
      correctAnswer: 'C',
      explanation: 'Blackhorse Avenue connects to the North Circular Road. Blackhorse Avenue is in west Dublin, and it connects to the North Circular Road, which is a major route that runs around the north side of Dublin city center. This connection is important for traffic flow in the area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What road connects Tallaght and Walkinstown?',
      questionNumber: 77,
      options: [
        { id: 'A', text: 'Whitehall Road' },
        { id: 'B', text: 'Naas Road' },
        { id: 'C', text: 'Greenhills Road' },
        { id: 'D', text: 'Monastery Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Greenhills Road connects Tallaght and Walkinstown. Both Tallaght and Walkinstown are areas in southwest Dublin, and Greenhills Road provides the connection between them. This is an important local route serving these residential and commercial areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which of these roads are NOT directly accessible by Ranelagh Road?',
      questionNumber: 78,
      options: [
        { id: 'A', text: 'Dartmouth Road' },
        { id: 'B', text: 'Chelmsford Road' },
        { id: 'C', text: 'Appian Way' },
        { id: 'D', text: 'Northbrook Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Appian Way is NOT directly accessible by Ranelagh Road. Ranelagh Road is in the Ranelagh area of south Dublin, and it connects to several local roads including Dartmouth Road, Chelmsford Road, and Northbrook Road. Appian Way, however, is in a slightly different location and is not directly accessible from Ranelagh Road.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which road runs through the center of the Phoenix Park?',
      questionNumber: 79,
      options: [
        { id: 'A', text: 'Blackhorse Avenue' },
        { id: 'B', text: 'Chesterfield Avenue' },
        { id: 'C', text: 'Infirmary Road' },
        { id: 'D', text: 'Conyngham Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Chesterfield Avenue runs through the center of the Phoenix Park. Phoenix Park is one of the largest urban parks in Europe, located in Dublin 8. Chesterfield Avenue is the main road that runs through the center of the park, providing access to various areas of the park including the Dublin Zoo, Áras an Uachtaráin (the President\'s residence), and other attractions.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'On what road is the Goldenbridge Luas stop?',
      questionNumber: 80,
      options: [
        { id: 'A', text: 'Davitt Road' },
        { id: 'B', text: 'Dolphin Road' },
        { id: 'C', text: 'Jame\'s Walk' },
        { id: 'D', text: 'Naas Road' }
      ],
      correctAnswer: 'A',
      explanation: 'The Goldenbridge Luas stop is on Davitt Road. As mentioned in question 17, Goldenbridge stop is on Davitt Road, not on the Naas Road. The Luas Red Line runs along Davitt Road in this area, and Goldenbridge is one of the stops along this route in west Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Heading east what does the Howth Road become?',
      questionNumber: 81,
      options: [
        { id: 'A', text: 'Dublin Road' },
        { id: 'B', text: 'Coast Road' },
        { id: 'C', text: 'Clontarf Road' },
        { id: 'D', text: 'Raheny Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Heading east, the Howth Road becomes Dublin Road. Howth Road runs from the city center towards Howth in north Dublin. As you travel east (away from the city), it continues as Dublin Road, which then continues towards Howth and other coastal areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Driving towards the City Centre, Long Mile Road leads onto what road?',
      questionNumber: 82,
      options: [
        { id: 'A', text: 'Bunting Road' },
        { id: 'B', text: 'Drimnagh Road' },
        { id: 'C', text: 'Walkinstown Ave' },
        { id: 'D', text: 'Walkinstown Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Driving towards the City Centre, Long Mile Road leads onto Drimnagh Road. Long Mile Road is in southwest Dublin, and as you travel towards the city center, it continues as Drimnagh Road, which then connects to other routes leading into the city center area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Stephens Place joins which two streets?',
      questionNumber: 83,
      options: [
        { id: 'A', text: 'Mount Street Upper and Baggot Street Lower' },
        { id: 'B', text: 'Mount Street Lower and Merrion Square' },
        { id: 'C', text: 'Mount Street Lower and Grand Canal Street Lower' },
        { id: 'D', text: 'Mount Street Upper and Mount Street Lower' }
      ],
      correctAnswer: 'D',
      explanation: 'Stephens Place joins Mount Street Upper and Mount Street Lower. Mount Street is in Dublin 2, in the area around the Grand Canal. Stephens Place is a small street that connects the Upper and Lower sections of Mount Street, providing access between these two parts of the same road.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which two roads does Clonliffe Road connect?',
      questionNumber: 84,
      options: [
        { id: 'A', text: 'Ballybough Road and Summerhill Parade' },
        { id: 'B', text: 'Lower Drumcondra Road and Ballybough Road' },
        { id: 'C', text: 'Fairview Strand and Upper Drumcondra Road' },
        { id: 'D', text: 'Jones Road and Richmond Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Clonliffe Road connects Lower Drumcondra Road and Ballybough Road. Clonliffe Road is in north Dublin, running through the Drumcondra area. It provides an important connection between Lower Drumcondra Road (which continues towards the city) and Ballybough Road (which serves the Ballybough area).',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where does Parnell Street start and end?',
      questionNumber: 85,
      options: [
        { id: 'A', text: 'Gardiner Street to O\'Connell Street' },
        { id: 'B', text: 'Gardiner Street to Capel Street' },
        { id: 'C', text: 'Capel Street to O\'Connell Street' },
        { id: 'D', text: 'Gardiner Street to Jervis Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Parnell Street starts at Gardiner Street and ends at Capel Street. Parnell Street is a major street in Dublin 1, running from Gardiner Street (in the north) to Capel Street (in the south). It\'s an important route in the north inner city, connecting various areas and providing access to O\'Connell Street and other major thoroughfares.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What road does Walkinstown Avenue adjoin?',
      questionNumber: 86,
      options: [
        { id: 'A', text: 'Cooley Road' },
        { id: 'B', text: 'Bluebell Avenue' },
        { id: 'C', text: 'Naas Road' },
        { id: 'D', text: 'Robinhood Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Walkinstown Avenue adjoins the Naas Road. Walkinstown is an area in southwest Dublin, and Walkinstown Avenue is a local road in this area. It connects to the Naas Road (N7), which is a major route serving southwest Dublin and beyond.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'What street does NOT adjoin King Street North?',
      questionNumber: 87,
      options: [
        { id: 'A', text: 'Bolton Street' },
        { id: 'B', text: 'Church Street' },
        { id: 'C', text: 'Blackhall Street' },
        { id: 'D', text: 'Queen Street' }
      ],
      correctAnswer: 'C',
      explanation: 'Blackhall Street does NOT adjoin King Street North. King Street North is in Dublin 7, in the north inner city area. It connects to Bolton Street, Church Street, and Queen Street, but Blackhall Street is in a different location (near Blackhall Place) and does not adjoin King Street North.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'What two streets does Earlsfort Terrace connect?',
      questionNumber: 88,
      options: [
        { id: 'A', text: 'St Stephen\'s Green and Camden Street' },
        { id: 'B', text: 'Harcourt Street and Hatch Street Lower' },
        { id: 'C', text: 'St Stephen\'s Green and Merrion Street' },
        { id: 'D', text: 'St Stephen\'s Green and Adelaide Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Earlsfort Terrace connects St Stephen\'s Green and Adelaide Road. As mentioned in question 12, Earlsfort Terrace runs from St Stephen\'s Green to Adelaide Road. This is an important street in Dublin 2, connecting the prestigious St Stephen\'s Green area with Adelaide Road, which continues towards areas like Ranelagh and Rathmines.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Which street does Dean Street connect to?',
      questionNumber: 89,
      options: [
        { id: 'A', text: 'Lower Kevin Street' },
        { id: 'B', text: 'The Coombe' },
        { id: 'C', text: 'Meath Street' },
        { id: 'D', text: 'St Lukes Avenue' }
      ],
      correctAnswer: 'B',
      explanation: 'Dean Street connects to The Coombe. Both are in Dublin 8, in the Liberties area. The Coombe is a historic street in this area, and Dean Street provides a connection to it. This is part of the historic Liberties area of Dublin, known for its rich history and cultural significance.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Which of these roads does NOT adjoin Marlborough Street?',
      questionNumber: 90,
      options: [
        { id: 'A', text: 'Abbey Street Lower' },
        { id: 'B', text: 'Cathal Brugha Street' },
        { id: 'C', text: 'Talbot Street' },
        { id: 'D', text: 'Gardiner Street Lower' }
      ],
      correctAnswer: 'D',
      explanation: 'Gardiner Street Lower does NOT adjoin Marlborough Street. Marlborough Street is in Dublin 1, in the north inner city area. It connects to Abbey Street Lower, Cathal Brugha Street, and Talbot Street, but Gardiner Street Lower is parallel to Marlborough Street and does not directly adjoin it.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Grace Park Road connects what two roads?',
      questionNumber: 91,
      options: [
        { id: 'A', text: 'Richmond Road and Collins Avenue' },
        { id: 'B', text: 'Philipsburgh Avenue and Howth Road' },
        { id: 'C', text: 'Blackpitts Road and James\'s Avenue' },
        { id: 'D', text: 'Drumcondra Road and Santry Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Grace Park Road connects Richmond Road and Collins Avenue. Grace Park Road is in Drumcondra, north Dublin. It provides an important connection between Richmond Road (which runs through Fairview and Marino) and Collins Avenue (which continues towards areas like Whitehall and Santry). This is a significant route in north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'From the following roads, which one does NOT cross the Grand Canal?',
      questionNumber: 92,
      options: [
        { id: 'A', text: 'Clanbrassil Street' },
        { id: 'B', text: 'Baggot Street' },
        { id: 'C', text: 'Northumberland Road' },
        { id: 'D', text: 'Earlsfort Terrace' }
      ],
      correctAnswer: 'D',
      explanation: 'Earlsfort Terrace does NOT cross the Grand Canal. The Grand Canal runs through south Dublin, and several roads cross it including Clanbrassil Street, Baggot Street, and Northumberland Road. Earlsfort Terrace, however, runs parallel to the canal area but does not cross it.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Kevin Street Lower connects to which street?',
      questionNumber: 93,
      options: [
        { id: 'A', text: 'Harcourt Street' },
        { id: 'B', text: 'Cuffe Street' },
        { id: 'C', text: 'Montague Street' },
        { id: 'D', text: 'Bishop Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Kevin Street Lower connects to Cuffe Street. Kevin Street is in Dublin 8, in the Liberties area. Kevin Street Lower (the southern section) connects to Cuffe Street, which is another important street in this area, providing access to various parts of the south inner city.',
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

  console.log(`✅ Created ${questions.length} questions for Dublin Roads and Navigation chapter`)
  
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
