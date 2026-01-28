import { PrismaClient, QuestionCategory } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Tourist Attractions & Landmarks chapter...')

  // Create chapter
  const chapter = await prisma.chapter.upsert({
    where: { id: 'chapter_tourist_attractions' },
    update: {},
    create: {
      id: 'chapter_tourist_attractions',
      title: 'Tourist Attractions & Landmarks',
      description: 'Test your knowledge of tourist attractions, landmarks, museums, and cultural sites in Dublin',
      chapterNumber: 7,
      type: 'MCQ',
      duration: 40,
      isActive: true,
      category: QuestionCategory.AREA_KNOWLEDGE
    }
  })

  console.log('✅ Chapter created:', chapter.title)

  // Define all 62 questions with detailed explanations
  const questions = [
    {
      questionText: 'The Old Jameson Distillery is located where?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'College Green' },
        { id: 'B', text: 'Parnell Street' },
        { id: 'C', text: 'Christ Church Place' },
        { id: 'D', text: 'Bow Street, Smithfield' }
      ],
      correctAnswer: 'D',
      explanation: 'The Old Jameson Distillery is located on Bow Street in Smithfield, Dublin 7. Smithfield is a historic area in Dublin\'s north inner city, known for its cobblestone square and proximity to the Four Courts. The distillery is one of Dublin\'s most popular tourist attractions, offering tours and whiskey tastings.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Waterways Visitor Centre located?',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Hanover Quay' },
        { id: 'B', text: 'South Lotts Road' },
        { id: 'C', text: 'Macken Street' },
        { id: 'D', text: 'Grand Canal Quay' }
      ],
      correctAnswer: 'D',
      explanation: 'The Waterways Visitor Centre is located on Grand Canal Quay in Dublin 2. Grand Canal Quay is in the Docklands area, along the Grand Canal. This location provides information about Ireland\'s waterways and is close to the financial district and the Bord Gáis Energy Theatre.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is Newbridge House located?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Howth Road' },
        { id: 'B', text: 'Glasnevin Avenue' },
        { id: 'C', text: 'Turvey Avenue' },
        { id: 'D', text: 'Malahide Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Newbridge House is located on Turvey Avenue in Donabate, County Dublin. Newbridge House is a historic Georgian mansion and farm, now a popular tourist attraction. Turvey Avenue leads to the estate, which is located in a rural setting north of Dublin city.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is the Criminal Courts of Justice located?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'Parkgate Street' },
        { id: 'B', text: 'College Green' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'O\'Connell Street' }
      ],
      correctAnswer: 'A',
      explanation: 'The Criminal Courts of Justice is located on Parkgate Street in Dublin 8. Parkgate Street runs from Phoenix Park to the city center, connecting the park to the quays along the River Liffey. This modern courthouse is one of Ireland\'s most important legal buildings and is easily accessible from the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The Book of Kells is situated where?',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'Trinity College' },
        { id: 'B', text: 'Dublin Castle' },
        { id: 'C', text: 'The National Museum' },
        { id: 'D', text: 'Royal Hospital Kilmainham' }
      ],
      correctAnswer: 'A',
      explanation: 'The Book of Kells is situated in Trinity College, Dublin 2. Trinity College is located on College Green, one of Dublin\'s most prestigious addresses. The Book of Kells is displayed in the Old Library at Trinity College, one of Ireland\'s most famous cultural treasures and a major tourist attraction.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'On what street is Dublin Castle located?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'Little Ship Street' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'Kildare Street' },
        { id: 'D', text: 'Dawson Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Dublin Castle is located on Dame Street in Dublin 2. Dame Street is one of Dublin\'s main thoroughfares in the city center, running from College Green to Christ Church. Dublin Castle is one of Ireland\'s most important historical sites, having served as the seat of British rule in Ireland and now hosting state functions and events.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'On which street do you find the James Joyce Statue?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Fitzwilliam Square' },
        { id: 'C', text: 'North Earl Street' },
        { id: 'D', text: 'Grafton Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The James Joyce Statue is located on North Earl Street in Dublin 1. North Earl Street is in the city center, connecting O\'Connell Street to Parnell Street. The statue is a popular meeting point and tribute to one of Ireland\'s most famous writers, located in the heart of Dublin\'s shopping district.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The Molesworth Gallery is situated where?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Kildare Street' },
        { id: 'B', text: 'Molesworth Street' },
        { id: 'C', text: 'Haddington Road' },
        { id: 'D', text: 'Dawson Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The Molesworth Gallery is situated on Molesworth Street in Dublin 2. Molesworth Street is in the city center, connecting Dawson Street to Kildare Street. This prestigious location is close to the Dáil (Irish Parliament), government buildings, and many cultural institutions, making it an ideal location for an art gallery.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is the National Museum of Ireland - Archaeology located?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Kildare Street' },
        { id: 'B', text: 'Nassau Street' },
        { id: 'C', text: 'Leeson Street Upper' },
        { id: 'D', text: 'Fitzwilliam Square' }
      ],
      correctAnswer: 'A',
      explanation: 'The National Museum of Ireland - Archaeology is located on Kildare Street in Dublin 2. Kildare Street is in the prestigious Georgian quarter of Dublin, home to many government buildings and cultural institutions. The museum is adjacent to the Dáil (Irish Parliament) and the National Library, making it part of Dublin\'s cultural and political heart.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'The Kerlin Gallery is found where?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'Merrion Square North' },
        { id: 'B', text: 'Anne\'s Lane, South Anne Street' },
        { id: 'C', text: 'St. Stephen\'s Green' },
        { id: 'D', text: 'Holles Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The Kerlin Gallery is found on Anne\'s Lane, South Anne Street in Dublin 2. South Anne Street is in the city center, connecting Grafton Street to St. Stephen\'s Green. This location is in the heart of Dublin\'s shopping and cultural district, making it easily accessible to visitors and art enthusiasts.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Malahide Castle is situated where?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'Malahide Road' },
        { id: 'B', text: 'Portmarnock' },
        { id: 'C', text: 'Kildare Street' },
        { id: 'D', text: 'Howth' }
      ],
      correctAnswer: 'A',
      explanation: 'Malahide Castle is situated on Malahide Road in Malahide, County Dublin. Malahide is a coastal town north of Dublin, and the castle is one of Ireland\'s most visited tourist attractions. The castle is set in extensive parklands and is easily accessible from Dublin city center via Malahide Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is the National Transport Museum located?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Howth Castle' },
        { id: 'B', text: 'Drimnagh Castle' },
        { id: 'C', text: 'Clontarf Castle' },
        { id: 'D', text: 'Malahide Castle' }
      ],
      correctAnswer: 'A',
      explanation: 'The National Transport Museum is located at Howth Castle in Howth, County Dublin. Howth is a coastal town on the north side of Dublin Bay, and the museum is situated within the grounds of Howth Castle. This location provides a scenic setting for the museum, which displays Ireland\'s transport history.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which road do you find the Fry Model Railway Museum?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'Kildare Street' },
        { id: 'B', text: 'Trinity College' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'Malahide Castle' }
      ],
      correctAnswer: 'D',
      explanation: 'The Fry Model Railway Museum is located at Malahide Castle in Malahide, County Dublin. The museum is housed within the grounds of Malahide Castle, one of Ireland\'s most popular tourist attractions. This model railway museum is a unique attraction, showcasing detailed miniature railway systems in a historic setting.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is the Maritime Museum located?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Haigh Terrace' },
        { id: 'B', text: 'Malahide Castle' },
        { id: 'C', text: 'Glasthule Road' },
        { id: 'D', text: 'Merrion Street' }
      ],
      correctAnswer: 'A',
      explanation: 'The Maritime Museum is located on Haigh Terrace in Dun Laoghaire, County Dublin. Dun Laoghaire is a coastal town south of Dublin, and Haigh Terrace is near the harbor. The museum celebrates Ireland\'s maritime heritage and is close to the DART station and the ferry terminal.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The Irish Museum of Modern Art (IMMA) at the Royal Hospital Kilmainham is situated where?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'Military Road' },
        { id: 'B', text: 'Inchicore Road' },
        { id: 'C', text: 'South Circular Road' },
        { id: 'D', text: 'Kilmainham Lane' }
      ],
      correctAnswer: 'A',
      explanation: 'The Irish Museum of Modern Art (IMMA) at the Royal Hospital Kilmainham is situated on Military Road in Kilmainham, Dublin 8. Military Road is in the historic Kilmainham area, close to Phoenix Park and the Irish Museum of Modern Art. The Royal Hospital Kilmainham is one of Ireland\'s most important historic buildings and now houses Ireland\'s leading modern art collection.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find Swords Castle?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'Seatown Road' },
        { id: 'B', text: 'Church Road' },
        { id: 'C', text: 'Back Lane' },
        { id: 'D', text: 'Bridge Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Swords Castle is located on Bridge Street (Main Street) in Swords, County Dublin. Swords is a town north of Dublin, and the castle is in the town center on the main street. The castle is a historic Norman castle and is one of the area\'s main tourist attractions, easily accessible from Dublin city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is the National Museum of Ireland - Natural History located?',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'Merrion Street Upper' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Dublin Castle' },
        { id: 'D', text: 'Clare Street' }
      ],
      correctAnswer: 'A',
      explanation: 'The National Museum of Ireland - Natural History is located on Merrion Street Upper in Dublin 2. Merrion Street Upper is in the prestigious Georgian quarter, adjacent to Merrion Square. The museum, also known as the "Dead Zoo," is close to the National Gallery, the Dáil (Irish Parliament), and many other cultural institutions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Molly Malone statue situated?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'Upper Baggot Street' },
        { id: 'B', text: 'Suffolk Street' },
        { id: 'C', text: 'Grafton Street' },
        { id: 'D', text: 'O\'Connell Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The Molly Malone statue is situated on Suffolk Street in Dublin 2. Suffolk Street is in the city center, connecting Grafton Street to St. Stephen\'s Green. The statue is one of Dublin\'s most famous landmarks and a popular meeting point for tourists, located in the heart of Dublin\'s shopping and cultural district.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is the main entrance to Malahide Castle?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Back Road' },
        { id: 'B', text: 'Kinsealy Lane' },
        { id: 'C', text: 'Church Road' },
        { id: 'D', text: 'Swords Road' }
      ],
      correctAnswer: 'A',
      explanation: 'The main entrance to Malahide Castle is on Back Road in Malahide, County Dublin. Back Road is the main access road to Malahide Castle, one of Ireland\'s most visited tourist attractions. The castle is set in extensive parklands and is easily accessible from Dublin city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Little Museum of Dublin located?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'St Stephen\'s Green' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'Kildare Street' },
        { id: 'D', text: 'Dawson Street' }
      ],
      correctAnswer: 'A',
      explanation: 'The Little Museum of Dublin is located on St. Stephen\'s Green in Dublin 2. St. Stephen\'s Green is one of Dublin\'s most famous Georgian squares, located in the city center. The museum is housed in a Georgian townhouse and tells the story of Dublin through the 20th century, making it a popular tourist attraction.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The Guinness Storehouse is found in what area?',
      questionNumber: 21,
      options: [
        { id: 'A', text: 'Dublin 8' },
        { id: 'B', text: 'Dublin 1' },
        { id: 'C', text: 'Dublin 2' },
        { id: 'D', text: 'Dublin 4' }
      ],
      correctAnswer: 'A',
      explanation: 'The Guinness Storehouse is found in Dublin 8, specifically in the St. James\'s Gate area. Dublin 8 is in the south inner city, and the Guinness Storehouse is one of Ireland\'s most visited tourist attractions. The storehouse is located at the historic St. James\'s Gate Brewery, where Guinness has been brewed since 1759.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'The Phoenix Park Visitors Centre is situated where?',
      questionNumber: 22,
      options: [
        { id: 'A', text: 'Victoria Quay' },
        { id: 'B', text: 'North Road' },
        { id: 'C', text: 'Infirmary Road' },
        { id: 'D', text: 'Near Áras an Uchtarán' }
      ],
      correctAnswer: 'D',
      explanation: 'The Phoenix Park Visitors Centre is situated near Áras an Uchtarán (the President\'s residence) in Phoenix Park, Dublin 8. Phoenix Park is one of Europe\'s largest city parks, and the Visitors Centre is located near the main entrance and the President\'s residence. This location provides information about the park\'s history, wildlife, and attractions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is The Custom House located?',
      questionNumber: 23,
      options: [
        { id: 'A', text: 'Amiens Street' },
        { id: 'B', text: 'Custom House Quay' },
        { id: 'C', text: 'Molesworth Street' },
        { id: 'D', text: 'City Quay' }
      ],
      correctAnswer: 'B',
      explanation: 'The Custom House is located on Custom House Quay in Dublin 1. Custom House Quay runs along the River Liffey, and the Custom House is one of Dublin\'s most iconic buildings. This neoclassical building is a major landmark and is close to the International Financial Services Centre and the Docklands area.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Pearse Lyons Whiskey Distillery located?',
      questionNumber: 24,
      options: [
        { id: 'A', text: 'Distillery Road' },
        { id: 'B', text: 'Bow Street' },
        { id: 'C', text: 'Newmarket' },
        { id: 'D', text: 'James Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Pearse Lyons Whiskey Distillery is located on James Street in Dublin 8. James Street is in the Liberties area of Dublin, a historic part of the city known for its whiskey distilling heritage. The distillery is housed in a converted church and is part of Dublin\'s growing whiskey tourism scene.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The National Gallery of Ireland is located on what street?',
      questionNumber: 25,
      options: [
        { id: 'A', text: 'Clare Street' },
        { id: 'B', text: 'Mount Street Upper' },
        { id: 'C', text: 'Merrion Square West' },
        { id: 'D', text: 'Fitzwilliam Square' }
      ],
      correctAnswer: 'C',
      explanation: 'The National Gallery of Ireland is located on Merrion Square West in Dublin 2. Merrion Square is one of Dublin\'s most famous Georgian squares, and the gallery is on the west side of the square. This prestigious location is close to the Dáil (Irish Parliament), the National Museum, and many other cultural institutions.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'The Hillsboro Fine Art Gallery is found where?',
      questionNumber: 26,
      options: [
        { id: 'A', text: 'Molesworth Street' },
        { id: 'B', text: 'Merrion Square' },
        { id: 'C', text: 'Hume Street' },
        { id: 'D', text: 'Parnell Square West' }
      ],
      correctAnswer: 'D',
      explanation: 'The Hillsboro Fine Art Gallery is found on Parnell Square West in Dublin 1. Parnell Square is in the north inner city, and the gallery is on the west side of the square. This location is close to the Hugh Lane Gallery, the Gate Theatre, and the Rotunda Hospital, making it part of Dublin\'s cultural quarter.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is the Oscar Wilde Statue located?',
      questionNumber: 27,
      options: [
        { id: 'A', text: 'Clare Street' },
        { id: 'B', text: 'Merrion Square North' },
        { id: 'C', text: 'Malahide Castle' },
        { id: 'D', text: 'Parnell Square North' }
      ],
      correctAnswer: 'B',
      explanation: 'The Oscar Wilde Statue is located on Merrion Square North in Dublin 2. Merrion Square is one of Dublin\'s most famous Georgian squares, and the statue is on the north side of the square, near where Wilde was born. This location is in the prestigious Georgian quarter, close to the National Gallery and many other cultural institutions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which road is the Pearse Museum located?',
      questionNumber: 28,
      options: [
        { id: 'A', text: 'Whitechurch Road' },
        { id: 'B', text: 'Baggot Street Lower' },
        { id: 'C', text: 'Dundrum Road' },
        { id: 'D', text: 'Grange Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Pearse Museum is located on Grange Road in Rathfarnham, Dublin 16. Grange Road is in the south Dublin suburb of Rathfarnham, and the museum is housed in the former school run by Patrick Pearse, one of the leaders of the 1916 Easter Rising. This historic location is set in parkland and is an important cultural and historical site.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is the Visit Dublin tourist centre located?',
      questionNumber: 29,
      options: [
        { id: 'A', text: 'Palace Street' },
        { id: 'B', text: 'Drury Street' },
        { id: 'C', text: 'O\'Connell Street' },
        { id: 'D', text: 'Andrew\'s Lane' }
      ],
      correctAnswer: 'A',
      explanation: 'The Visit Dublin tourist centre is located on Palace Street in Dublin 2. Palace Street is in the city center, close to Dublin Castle and Christ Church Cathedral. This location is ideal for a tourist information center, as it\'s easily accessible from the main tourist attractions and provides information about Dublin\'s sights, events, and services.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The Graphic Studio Gallery is found where?',
      questionNumber: 30,
      options: [
        { id: 'A', text: 'Cope Street' },
        { id: 'B', text: 'Merrion Square' },
        { id: 'C', text: 'Thomas Street' },
        { id: 'D', text: 'Essex Street East' }
      ],
      correctAnswer: 'A',
      explanation: 'The Graphic Studio Gallery is found on Cope Street in Dublin 2. Cope Street is in the Temple Bar area, Dublin\'s cultural quarter. This location is close to many galleries, restaurants, and cultural venues, making it an ideal location for an art gallery in the heart of Dublin\'s cultural district.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is Drimnagh Castle located?',
      questionNumber: 31,
      options: [
        { id: 'A', text: 'Kylemore Road' },
        { id: 'B', text: 'O\'Connell Street' },
        { id: 'C', text: 'Long Mile Road' },
        { id: 'D', text: 'Kildare Street' }
      ],
      correctAnswer: 'C',
      explanation: 'Drimnagh Castle is located on Long Mile Road in Drimnagh, Dublin 12. Long Mile Road is in the south inner city, and Drimnagh Castle is a historic Norman castle set in parkland. The castle is one of the few remaining moated castles in Ireland and is a popular tourist attraction and event venue.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The Phil Lynott Statue is situated where?',
      questionNumber: 32,
      options: [
        { id: 'A', text: 'Grafton Street' },
        { id: 'B', text: 'Harry Street' },
        { id: 'C', text: 'Drury Street' },
        { id: 'D', text: 'Kildare Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The Phil Lynott Statue is situated on Harry Street in Dublin 2. Harry Street is a small street connecting Grafton Street to St. Stephen\'s Green. The statue is a tribute to Phil Lynott, the lead singer of Thin Lizzy, and is a popular meeting point for music fans and tourists in the heart of Dublin\'s shopping district.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is the National Wax Museum located?',
      questionNumber: 33,
      options: [
        { id: 'A', text: 'Westmoreland Street' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'Kildare Street' },
        { id: 'D', text: 'Parnell Square' }
      ],
      correctAnswer: 'A',
      explanation: 'The National Wax Museum is located on Westmoreland Street in Dublin 2. Westmoreland Street is a major thoroughfare in the city center, connecting College Green to O\'Connell Bridge. This location is easily accessible from the main tourist attractions and is close to Trinity College, making it a popular tourist destination.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The Douglas Hyde Gallery is found where?',
      questionNumber: 34,
      options: [
        { id: 'A', text: 'St. Stephen\'s Green Centre' },
        { id: 'B', text: 'Trinity College' },
        { id: 'C', text: 'Parnell Square' },
        { id: 'D', text: 'Baggot Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The Douglas Hyde Gallery is found in Trinity College, Dublin 2. Trinity College is located on College Green, one of Dublin\'s most prestigious addresses. The gallery is part of Trinity College\'s cultural facilities and is located within the college campus, making it easily accessible to students, visitors, and art enthusiasts.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Teelings Whiskey Distillery situated?',
      questionNumber: 35,
      options: [
        { id: 'A', text: 'James Street' },
        { id: 'B', text: 'Teeling Way' },
        { id: 'C', text: 'Newmarket' },
        { id: 'D', text: 'Bow Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The Teelings Whiskey Distillery is situated in Newmarket in Dublin 8. Newmarket is in the Liberties area of Dublin, a historic part of the city known for its whiskey distilling heritage. The distillery is part of Dublin\'s growing whiskey tourism scene and is close to other distilleries and the Guinness Storehouse.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Farmleigh House?',
      questionNumber: 36,
      options: [
        { id: 'A', text: 'Phoenix Park' },
        { id: 'B', text: 'Jones\'s Road' },
        { id: 'C', text: 'St Stephen\'s Green' },
        { id: 'D', text: 'O\'Connell Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Farmleigh House is located in Phoenix Park, Dublin 8. Phoenix Park is one of Europe\'s largest city parks, and Farmleigh House is a historic estate within the park. The house serves as the official guest residence for visiting dignitaries and is open to the public, featuring beautiful gardens and a lake.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is Dublinia located?',
      questionNumber: 37,
      options: [
        { id: 'A', text: 'Bulfin Road' },
        { id: 'B', text: 'O\'Connell Street' },
        { id: 'C', text: 'St. Michael\'s Hill' },
        { id: 'D', text: 'Suir Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Dublinia is located on St. Michael\'s Hill in Dublin 8. St. Michael\'s Hill is in the historic area near Christ Church Cathedral. Dublinia is a living history museum that recreates Viking and medieval Dublin, and it\'s connected to Christ Church Cathedral, making it a popular tourist attraction in the historic heart of Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is the National Print Museum located?',
      questionNumber: 38,
      options: [
        { id: 'A', text: 'Merrion Street' },
        { id: 'B', text: 'Morehampton Road' },
        { id: 'C', text: 'Beggars Bush' },
        { id: 'D', text: 'Kildare Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The National Print Museum is located on Beggars Bush in Dublin 4. Beggars Bush is in the Ballsbridge area, close to the RDS and many embassies. The museum is housed in a historic building and celebrates Ireland\'s printing heritage, making it a unique cultural attraction in the area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which road do you find the GAA Museum?',
      questionNumber: 39,
      options: [
        { id: 'A', text: 'Iona Road' },
        { id: 'B', text: 'Jones\'s Road' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'Synge Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The GAA Museum is found on Jones\'s Road in Dublin 3. Jones\'s Road is in the north inner city, and the museum is located at Croke Park, the headquarters of the Gaelic Athletic Association. Croke Park is Ireland\'s largest stadium and is a major sports and cultural venue, making the museum a popular attraction for sports fans.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Gallery Zozimus is found where?',
      questionNumber: 40,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Francis Street' },
        { id: 'D', text: 'Thomas Street' }
      ],
      correctAnswer: 'C',
      explanation: 'Gallery Zozimus is found on Francis Street in Dublin 8. Francis Street is in the Liberties area, known for its antique shops and cultural venues. This location is close to St. Patrick\'s Cathedral and is part of Dublin\'s historic and cultural quarter, making it an ideal location for an art gallery.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Howth Castle is situated where?',
      questionNumber: 41,
      options: [
        { id: 'A', text: 'Kildare Street' },
        { id: 'B', text: 'Wood Quay' },
        { id: 'C', text: 'Malahide Road' },
        { id: 'D', text: 'Howth Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Howth Castle is situated on Howth Road in Howth, County Dublin. Howth is a coastal town on the north side of Dublin Bay, and the castle is located on Howth Road, the main road through the town. The castle is set in extensive grounds and is close to Howth Harbour, making it a scenic and historic attraction.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what square is the Hugh Lane Gallery situated?',
      questionNumber: 42,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Parnell Square' },
        { id: 'C', text: 'Mountjoy Square' },
        { id: 'D', text: 'Fitzwilliam Square' }
      ],
      correctAnswer: 'B',
      explanation: 'The Hugh Lane Gallery is situated on Parnell Square in Dublin 1. Parnell Square is in the north inner city, and the gallery is on the north side of the square. This prestigious location is close to the Gate Theatre, the Rotunda Hospital, and the Dublin Writers Museum, making it part of Dublin\'s cultural quarter.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is the National Leprechaun Museum situated?',
      questionNumber: 43,
      options: [
        { id: 'A', text: 'Liffey Street' },
        { id: 'B', text: 'Mary Street' },
        { id: 'C', text: 'Abbey Street' },
        { id: 'D', text: 'Jervis Street' }
      ],
      correctAnswer: 'D',
      explanation: 'The National Leprechaun Museum is situated on Jervis Street in Dublin 1. Jervis Street is in the north inner city, close to O\'Connell Street and the shopping district. The museum is a unique tourist attraction that explores Irish mythology and folklore, making it a popular destination for visitors interested in Irish culture.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Leinster House is situated where?',
      questionNumber: 44,
      options: [
        { id: 'A', text: 'Dawson Street' },
        { id: 'B', text: 'Merrion Square' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'Kildare Street' }
      ],
      correctAnswer: 'D',
      explanation: 'Leinster House is situated on Kildare Street in Dublin 2. Kildare Street is in the prestigious Georgian quarter, and Leinster House is the seat of the Oireachtas (Irish Parliament). This historic building is adjacent to the National Museum and the National Library, making it part of Dublin\'s political and cultural heart.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'On which road do you find the Glasnevin Cemetery Museum?',
      questionNumber: 45,
      options: [
        { id: 'A', text: 'Iona Road' },
        { id: 'B', text: 'Finglas Road' },
        { id: 'C', text: 'Old Finglas Road' },
        { id: 'D', text: 'Botanic Avenue' }
      ],
      correctAnswer: 'B',
      explanation: 'The Glasnevin Cemetery Museum is found on Finglas Road in Glasnevin, Dublin 11. Finglas Road is the main road through Glasnevin, and the museum is located at the main entrance to Glasnevin Cemetery, one of Ireland\'s most famous cemeteries. The museum tells the story of the cemetery and its notable burials, making it an important cultural and historical attraction.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what area is the National Monument Casino at Marino located?',
      questionNumber: 46,
      options: [
        { id: 'A', text: 'Dollymount' },
        { id: 'B', text: 'Monkstown' },
        { id: 'C', text: 'Malahide' },
        { id: 'D', text: 'Marino' }
      ],
      correctAnswer: 'D',
      explanation: 'The National Monument Casino at Marino is located in Marino, Dublin 3. Marino is a residential area in the north inner city, and the Casino is a historic Georgian building set in parkland. The Casino is one of Ireland\'s finest examples of neoclassical architecture and is a popular tourist attraction, easily accessible from the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which quay are The Four Courts located?',
      questionNumber: 47,
      options: [
        { id: 'A', text: 'Winetavern Street' },
        { id: 'B', text: 'Inns Quay' },
        { id: 'C', text: 'Arran Quay' },
        { id: 'D', text: 'Benburb Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The Four Courts are located on Inns Quay in Dublin 7. Inns Quay runs along the River Liffey, and the Four Courts is one of Dublin\'s most iconic buildings. This neoclassical courthouse is a major landmark and is close to the city center, making it easily accessible and a significant part of Dublin\'s architectural heritage.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'On which street is the Oscar Wilde House Museum located?',
      questionNumber: 48,
      options: [
        { id: 'A', text: 'Clare Street' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Merrion Square North' },
        { id: 'D', text: 'Parnell Square' }
      ],
      correctAnswer: 'C',
      explanation: 'The Oscar Wilde House Museum is located on Merrion Square North in Dublin 2. Merrion Square is one of Dublin\'s most famous Georgian squares, and the museum is on the north side of the square, in the house where Oscar Wilde was born. This prestigious location is close to the National Gallery and many other cultural institutions, making it a popular tourist attraction.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the National Museum of Ireland - Decorative Arts & History?',
      questionNumber: 49,
      options: [
        { id: 'A', text: 'Clare Street' },
        { id: 'B', text: 'Inchicore Road' },
        { id: 'C', text: 'Wolf Tone Quay' },
        { id: 'D', text: 'Collins Barracks' }
      ],
      correctAnswer: 'D',
      explanation: 'The National Museum of Ireland - Decorative Arts & History is located at Collins Barracks in Dublin 7. Collins Barracks is a historic military barracks on the north side of the River Liffey, and the museum is housed in the former barracks buildings. This location is close to Phoenix Park and the city center, making it easily accessible and an important cultural attraction.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The Mansion House is situated where?',
      questionNumber: 50,
      options: [
        { id: 'A', text: 'Dawson Street' },
        { id: 'B', text: 'Kildare Street' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'Merrion Street' }
      ],
      correctAnswer: 'A',
      explanation: 'The Mansion House is situated on Dawson Street in Dublin 2. Dawson Street is in the city center, connecting St. Stephen\'s Green to Nassau Street. The Mansion House is the official residence of the Lord Mayor of Dublin and is a historic building that has hosted many important events in Irish history, making it a significant landmark.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is the General Post Office located?',
      questionNumber: 51,
      options: [
        { id: 'A', text: 'Merrion Street' },
        { id: 'B', text: 'Wood Quay' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'O\'Connell Street' }
      ],
      correctAnswer: 'D',
      explanation: 'The General Post Office (GPO) is located on O\'Connell Street in Dublin 1. O\'Connell Street is Dublin\'s main thoroughfare in the north inner city, and the GPO is one of Ireland\'s most iconic buildings. The GPO was the headquarters of the 1916 Easter Rising and is a major landmark and tourist attraction, symbolizing Ireland\'s struggle for independence.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'On which street do you find the James Joyce Cultural Centre?',
      questionNumber: 52,
      options: [
        { id: 'A', text: 'Dorset Street' },
        { id: 'B', text: 'Parnell Street' },
        { id: 'C', text: 'North Great Georges Street' },
        { id: 'D', text: 'Marlborough Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The James Joyce Cultural Centre is found on North Great Georges Street in Dublin 1. North Great Georges Street is in the north inner city, and the center is housed in a restored Georgian townhouse. This location is close to Parnell Square and the Hugh Lane Gallery, making it part of Dublin\'s cultural quarter and a popular destination for literature enthusiasts.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is City Hall located?',
      questionNumber: 53,
      options: [
        { id: 'A', text: 'Westmoreland Street' },
        { id: 'B', text: 'Little Ship Street' },
        { id: 'C', text: 'Dame Street' },
        { id: 'D', text: 'Merrion Street' }
      ],
      correctAnswer: 'C',
      explanation: 'City Hall is located on Dame Street in Dublin 2. Dame Street is one of Dublin\'s main thoroughfares in the city center, and City Hall is adjacent to Dublin Castle. This historic building serves as the headquarters of Dublin City Council and is a major landmark, easily accessible from the main tourist attractions.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is the Irish Writers Center located?',
      questionNumber: 54,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Mountjoy Square' },
        { id: 'C', text: 'Parnell Square North' },
        { id: 'D', text: 'Mount Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The Irish Writers Center is located on Parnell Square North in Dublin 1. Parnell Square is in the north inner city, and the center is on the north side of the square. This location is close to the Hugh Lane Gallery, the Gate Theatre, and the Dublin Writers Museum, making it part of Dublin\'s literary and cultural quarter.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is the Irish Jewish Museum located?',
      questionNumber: 55,
      options: [
        { id: 'A', text: 'Walworth Road' },
        { id: 'B', text: 'Cork Street' },
        { id: 'C', text: 'Heytesbury Street' },
        { id: 'D', text: 'South Circular Road' }
      ],
      correctAnswer: 'A',
      explanation: 'The Irish Jewish Museum is located on Walworth Road in Dublin 8. Walworth Road is in the Portobello area of the south inner city, and the museum is housed in a former synagogue. This location celebrates the history of the Jewish community in Ireland and is an important cultural attraction, close to the Grand Canal and the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Spire situated?',
      questionNumber: 56,
      options: [
        { id: 'A', text: 'O\'Connell Street' },
        { id: 'B', text: 'Grafton Street' },
        { id: 'C', text: 'Pearse Street' },
        { id: 'D', text: 'Dame Street' }
      ],
      correctAnswer: 'A',
      explanation: 'The Spire is situated on O\'Connell Street in Dublin 1. O\'Connell Street is Dublin\'s main thoroughfare in the north inner city, and the Spire is located at the site of the former Nelson\'s Pillar. This 120-meter tall monument is one of Dublin\'s most recognizable landmarks and is a major meeting point and tourist attraction in the heart of the city.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'On what road is the Former Irish Houses of Parliament situated?',
      questionNumber: 57,
      options: [
        { id: 'A', text: 'Merrion Street' },
        { id: 'B', text: 'Custom House Quay' },
        { id: 'C', text: 'Kildare Street' },
        { id: 'D', text: 'College Green' }
      ],
      correctAnswer: 'D',
      explanation: 'The Former Irish Houses of Parliament is situated on College Green in Dublin 2. College Green is one of Dublin\'s most prestigious addresses, and the building now houses the Bank of Ireland. This historic building was the seat of the Irish Parliament until the Act of Union in 1800 and is a major landmark, adjacent to Trinity College.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which road do you find Isolde\'s Tower?',
      questionNumber: 58,
      options: [
        { id: 'A', text: 'Exchange Street Lower' },
        { id: 'B', text: 'Parnell Square' },
        { id: 'C', text: 'Collins Barracks' },
        { id: 'D', text: 'Dame Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Isolde\'s Tower is found on Exchange Street Lower in Dublin 8. Exchange Street Lower is in the Temple Bar area, Dublin\'s cultural quarter. The tower is a historic medieval structure and is part of Dublin\'s archaeological heritage, located close to the River Liffey and many of the city\'s main tourist attractions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The Green Gallery is found where?',
      questionNumber: 59,
      options: [
        { id: 'A', text: 'St. Stephen\'s Green Centre' },
        { id: 'B', text: 'Thomas Street' },
        { id: 'C', text: 'Duke Street' },
        { id: 'D', text: 'Baggot Street' }
      ],
      correctAnswer: 'A',
      explanation: 'The Green Gallery is found in St. Stephen\'s Green Centre in Dublin 2. St. Stephen\'s Green Centre is a shopping center in the city center, adjacent to St. Stephen\'s Green. This location is in the heart of Dublin\'s shopping and cultural district, making it easily accessible to visitors and art enthusiasts.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Tailors\' Hall is situated where?',
      questionNumber: 60,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'Thomas Street' },
        { id: 'C', text: 'Back Lane' },
        { id: 'D', text: 'Patrick Street' }
      ],
      correctAnswer: 'C',
      explanation: 'Tailors\' Hall is situated on Back Lane in Dublin 8. Back Lane is in the historic Liberties area, close to Christ Church Cathedral and Dublin Castle. Tailors\' Hall is one of Dublin\'s oldest surviving guildhalls and is an important historic building, now used as a cultural and event venue in the heart of Dublin\'s historic quarter.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where do you find the Chester Beatty Library & Museum?',
      questionNumber: 61,
      options: [
        { id: 'A', text: 'Malahide Castle' },
        { id: 'B', text: 'Dublin City Hall' },
        { id: 'C', text: 'Trinity College' },
        { id: 'D', text: 'Dublin Castle' }
      ],
      correctAnswer: 'D',
      explanation: 'The Chester Beatty Library & Museum is found at Dublin Castle in Dublin 2. Dublin Castle is located on Dame Street, one of Dublin\'s most important historical sites. The library is housed within the castle grounds and contains one of the world\'s finest collections of manuscripts and art, making it a major cultural attraction and a UNESCO-recognized collection.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which road do you find the Joyce Tower & Museum?',
      questionNumber: 62,
      options: [
        { id: 'A', text: 'Strand Road' },
        { id: 'B', text: 'Booterstown Avenue' },
        { id: 'C', text: 'Marine Road' },
        { id: 'D', text: 'Sandycove Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'The Joyce Tower & Museum is found on Sandycove Avenue in Sandycove, County Dublin. Sandycove is a coastal area south of Dublin, and the tower is a Martello tower that features in James Joyce\'s novel "Ulysses." The museum is dedicated to Joyce and is a popular literary pilgrimage site, located on the coast with scenic views of Dublin Bay.',
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

  console.log(`✅ Created ${questions.length} questions for Tourist Attractions & Landmarks chapter`)
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
