import { PrismaClient, QuestionCategory } from '@prisma/client'
import 'dotenv/config'
import { syncToQuestionBank } from './sync-to-question-bank'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Schools, Libraries and Universities chapter...')

  // Create chapter
  const chapter = await prisma.chapter.upsert({
    where: { id: 'chapter_schools_libraries_universities' },
    update: {},
    create: {
      id: 'chapter_schools_libraries_universities',
      title: 'Schools, Libraries and Universities',
      description: 'Master your knowledge of educational institutions, libraries, and universities throughout Dublin. Learn the exact locations of schools, colleges, libraries, and cultural institutions to help you navigate the city with confidence.',
      chapterNumber: 9,
      type: 'MCQ',
      duration: 45,
      isActive: true,
      category: QuestionCategory.AREA_KNOWLEDGE
    }
  })

  console.log('✅ Chapter created:', chapter.title)

  // Define all 35 questions with detailed explanations
  const questions = [
    {
      questionText: 'In which area is Dunsink Observatory?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'Blanchardstown' },
        { id: 'B', text: 'Castleknock' },
        { id: 'C', text: 'Finglas' },
        { id: 'D', text: 'Ballycoolin' }
      ],
      correctAnswer: 'B',
      explanation: 'Dunsink Observatory is located in Castleknock, Dublin 15. This historic astronomical observatory, founded in 1785, is one of the oldest scientific institutions in Ireland. It sits on a hilltop in Castleknock, providing excellent views and clear skies for astronomical observations. The observatory is part of the Dublin Institute for Advanced Studies and has played a significant role in Irish astronomy for over two centuries.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Honorable Society of King\'s Inns?',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Blackhall Place' },
        { id: 'B', text: 'Dorset Street' },
        { id: 'C', text: 'Kildare Street' },
        { id: 'D', text: 'Henrietta Street' }
      ],
      correctAnswer: 'D',
      explanation: 'The Honorable Society of King\'s Inns is located on Henrietta Street in Dublin 1. This prestigious institution is the body which governs the entry of barristers-at-law into the justice system of Ireland. Founded in 1541, King\'s Inns is one of the oldest professional and educational institutions in Ireland. The building on Henrietta Street is an impressive Georgian structure that houses the library, dining hall, and educational facilities for aspiring barristers.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where are the Dublin City Archives located?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Dame Street' },
        { id: 'B', text: 'Pearse Street' },
        { id: 'C', text: 'Thomas Street' },
        { id: 'D', text: 'Kildare Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The Dublin City Archives are located on Pearse Street in Dublin 2. This important repository houses historical records, documents, maps, and photographs relating to Dublin City Council and the city\'s history. The archives provide valuable resources for researchers, historians, and anyone interested in Dublin\'s rich heritage. Pearse Street is in the heart of Dublin\'s city center, making the archives easily accessible to the public.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Chester Beatty Library Located?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'Kildare Street' },
        { id: 'B', text: 'Merrion Square' },
        { id: 'C', text: 'Dublin Castle' },
        { id: 'D', text: 'Bride Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The Chester Beatty Library is located within Dublin Castle in Dublin 2. This world-renowned museum and library houses one of the finest collections of manuscripts, rare books, and art from Europe, the Middle East, North Africa, and Asia. The collection was bequeathed to the Irish State by Sir Alfred Chester Beatty in 1968. The library is a must-visit cultural institution, showcasing treasures including ancient Egyptian papyri, illuminated manuscripts, and Islamic art, all beautifully displayed in the historic setting of Dublin Castle.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is the Law Library located?',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'Inns Quay' },
        { id: 'B', text: 'Merchant\'s Quay' },
        { id: 'C', text: 'Wood Quay' },
        { id: 'D', text: 'Ormond Quay Lower' }
      ],
      correctAnswer: 'A',
      explanation: 'The Law Library is located on Inns Quay in Dublin 7, near the Four Courts. This is the professional library used by barristers practicing in Ireland. The Law Library provides essential legal resources, research facilities, and workspace for members of the Bar. Inns Quay runs along the north bank of the River Liffey, in close proximity to the Four Courts, making it a central location for legal professionals working in the area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Royal Irish Academy Library located?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'Parnell Street' },
        { id: 'B', text: 'Henrietta Street' },
        { id: 'C', text: 'Dawson Street' },
        { id: 'D', text: 'Clare Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The Royal Irish Academy Library is located on Dawson Street in Dublin 2. The Royal Irish Academy is Ireland\'s leading body of experts in the sciences and humanities. The library houses an important collection of manuscripts, including the oldest surviving manuscripts in the Irish language. Dawson Street is in the heart of Dublin\'s cultural quarter, near Trinity College and other important institutions, making it easily accessible for researchers and scholars.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is the National Library of Ireland?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'Kildare Street' },
        { id: 'B', text: 'Dawson Street' },
        { id: 'C', text: 'Clare Street' },
        { id: 'D', text: 'St. Patrick\'s Close' }
      ],
      correctAnswer: 'A',
      explanation: 'The National Library of Ireland is located on Kildare Street in Dublin 2. This magnificent building, opened in 1890, houses Ireland\'s most comprehensive collection of Irish documentary material. The library contains books, manuscripts, newspapers, maps, photographs, and other materials relating to Ireland. Kildare Street is one of Dublin\'s most prestigious addresses, also home to the National Museum of Ireland and Leinster House (the seat of the Oireachtas). The library is free to use and open to the public.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Institute of Education located?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Leeson Street Upper' },
        { id: 'B', text: 'Leeson Street Lower' },
        { id: 'C', text: 'Baggot Street Lower' },
        { id: 'D', text: 'Baggot Street Upper' }
      ],
      correctAnswer: 'B',
      explanation: 'The Institute of Education is located on Leeson Street Lower in Dublin 2. This is one of Ireland\'s leading private secondary schools, known for its academic excellence and high Leaving Certificate results. The Institute of Education provides intensive revision courses and grinds for secondary school students. Leeson Street Lower is in the Ballsbridge area, a prestigious location in Dublin\'s southside, easily accessible by public transport and close to many other educational institutions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Marsh\'s Library situated?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Kevin Street' },
        { id: 'B', text: 'York Street' },
        { id: 'C', text: 'Dawson Street' },
        { id: 'D', text: 'St. Patrick\'s Close' }
      ],
      correctAnswer: 'D',
      explanation: 'Marsh\'s Library is situated on St. Patrick\'s Close in Dublin 8, adjacent to St. Patrick\'s Cathedral. This is Ireland\'s oldest public library, founded in 1701 by Archbishop Narcissus Marsh. The library has remained virtually unchanged since the 18th century, with its original oak bookcases and reading cages still in place. It houses over 25,000 books and 300 manuscripts from the 16th to the 18th centuries. The library is a unique historical treasure, offering visitors a glimpse into the past and the opportunity to see rare books in their original setting.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is Dublin Business School (DBS) located?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'Exchequer Street' },
        { id: 'B', text: 'Aungier Street' },
        { id: 'C', text: 'Wexford Street' },
        { id: 'D', text: 'Kevin Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Dublin Business School (DBS) is located on Aungier Street in Dublin 2. DBS is one of Ireland\'s largest independent third-level institutions, offering a wide range of undergraduate and postgraduate programs in business, law, arts, and social sciences. The main campus on Aungier Street is in the heart of Dublin city center, making it easily accessible to students. Aungier Street is a vibrant area with many shops, cafes, and restaurants, creating a dynamic learning environment for students.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Dublin Institute of Technology (DIT) located?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'Capel Street' },
        { id: 'B', text: 'Aungier Street' },
        { id: 'C', text: 'York Street' },
        { id: 'D', text: 'Cork Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The Dublin Institute of Technology (DIT), now part of Technological University Dublin (TU Dublin), has its main campus on Aungier Street in Dublin 2. DIT was one of Ireland\'s largest and most diverse higher education institutions before it merged with other institutes to form TU Dublin. The Aungier Street campus houses various faculties including business, arts, and tourism. The institution has multiple campuses across Dublin, but Aungier Street remains a significant location for the university.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Drimnagh Castle located?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Naas Road' },
        { id: 'B', text: 'Long Mile Road' },
        { id: 'C', text: 'Kylemore Road' },
        { id: 'D', text: 'Crumlin Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Drimnagh Castle is located on Long Mile Road in Drimnagh, Dublin 12. This is one of the last remaining medieval castles in Dublin, dating back to the 13th century. The castle is surrounded by a moat (the only remaining moated castle in Ireland) and has been beautifully restored. While it\'s not an educational institution itself, Drimnagh Castle is an important historical site and is sometimes used for educational visits. Long Mile Road is a major route in Dublin\'s southwest, connecting the city to areas like Walkinstown and Crumlin.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Where is the entrance to the National College of Art & Design (NCAD)?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'Bride Street' },
        { id: 'B', text: 'Thomas Street' },
        { id: 'C', text: 'Meath Street' },
        { id: 'D', text: 'Francis Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The entrance to the National College of Art & Design (NCAD) is on Thomas Street in Dublin 8. NCAD is Ireland\'s leading art and design education institution, offering undergraduate and postgraduate programs in fine art, design, education, and visual culture. The main campus on Thomas Street is in the historic Liberties area of Dublin, an area rich in cultural heritage. The college has played a significant role in Irish art and design education since its establishment in 1746, making it one of the oldest art schools in Europe.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is All Hallows College?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Glasnevin Avenue' },
        { id: 'B', text: 'Drumcondra Road' },
        { id: 'C', text: 'Griffith Avenue' },
        { id: 'D', text: 'Grace Park Road' }
      ],
      correctAnswer: 'D',
      explanation: 'All Hallows College is located on Grace Park Road in Drumcondra, Dublin 9. This historic college was founded in 1842 by the Vincentian order and was originally a seminary for the training of priests. The college has a beautiful campus with historic buildings and gardens. While the college closed as a seminary in 2016, the campus and buildings remain significant landmarks in the area. Grace Park Road is in the heart of Drumcondra, a residential area known for its proximity to the city center and its educational institutions.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'Where is Mount Anville Secondary School located?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'Mount Anville Road' },
        { id: 'B', text: 'Lower Kilmacud Road' },
        { id: 'C', text: 'Taney Road' },
        { id: 'D', text: 'Dundrum Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Mount Anville Secondary School is located on Mount Anville Road in Goatstown, Dublin 14. This is a prestigious all-girls secondary school run by the Society of the Sacred Heart. The school is known for its academic excellence and strong tradition in education. Mount Anville Road is in the affluent area of Goatstown, in Dublin\'s southside, surrounded by beautiful residential areas. The school has a long history of providing quality education to generations of students.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Law Society of Ireland?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'Bolton Street' },
        { id: 'B', text: 'Blackhall Place' },
        { id: 'C', text: 'Henrietta Street' },
        { id: 'D', text: 'Dorset Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The Law Society of Ireland is located on Blackhall Place in Dublin 7. This is the professional body for solicitors in Ireland, responsible for the education, training, and regulation of solicitors. The Law Society provides professional training courses, continuing professional development, and maintains standards for the legal profession. Blackhall Place is in the Smithfield area, close to the Four Courts and other legal institutions, making it a central location for legal professionals in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Gaiety School of Acting?',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'Parliament Street' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'Essex Street West' },
        { id: 'D', text: 'St. Stephen\'s Green' }
      ],
      correctAnswer: 'C',
      explanation: 'The Gaiety School of Acting is located on Essex Street West in Dublin 2, in the Temple Bar area. This is Ireland\'s leading drama school, offering full-time and part-time acting courses, as well as youth theatre programs. The school has produced many successful actors who have gone on to work in film, television, and theatre both in Ireland and internationally. Essex Street West is in the vibrant Temple Bar cultural quarter, surrounded by theatres, galleries, and cultural venues, making it an ideal location for a drama school.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the National College of Ireland (NCI)?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'Amiens Street' },
        { id: 'B', text: 'City Quay' },
        { id: 'C', text: 'North Wall Quay' },
        { id: 'D', text: 'Mayor Street' }
      ],
      correctAnswer: 'D',
      explanation: 'The National College of Ireland (NCI) is located on Mayor Street in the IFSC (International Financial Services Centre) area of Dublin 1. NCI is a third-level educational institution offering undergraduate and postgraduate programs in business, computing, psychology, and education. The college is known for its strong industry connections and focus on preparing students for careers in business and technology. Mayor Street is in the modern IFSC district, Dublin\'s financial hub, providing students with excellent opportunities for internships and employment in the business sector.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Trinity College Dublin (TCD) is situated where?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Stillorgan Road' },
        { id: 'B', text: 'College Green' },
        { id: 'C', text: 'Dartry' },
        { id: 'D', text: 'O\'Connell Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Trinity College Dublin (TCD) is situated on College Green in Dublin 2. Founded in 1592 by Queen Elizabeth I, Trinity is Ireland\'s oldest and most prestigious university. The main campus is in the heart of Dublin city center, with its iconic Front Square, the Old Library (home to the Book of Kells), and historic buildings. College Green is one of Dublin\'s most famous locations, facing the Bank of Ireland (formerly the Irish Parliament) and surrounded by important cultural and historical landmarks. Trinity College is consistently ranked among the top universities in the world.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Mount Temple School located?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'Vernon Avenue' },
        { id: 'B', text: 'Castle Avenue' },
        { id: 'C', text: 'Howth Road' },
        { id: 'D', text: 'Malahide Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Mount Temple School is located on Malahide Road in Clontarf, Dublin 3. This is a co-educational secondary school known for its inclusive and progressive approach to education. The school has a strong reputation for academic achievement and extracurricular activities. Malahide Road is a major route in Dublin\'s northside, running from Fairview through Clontarf and on towards Malahide. The area is well-served by public transport and is close to the coast, providing a pleasant environment for students.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the DLR LexIcon located?',
      questionNumber: 21,
      options: [
        { id: 'A', text: 'Monkstown' },
        { id: 'B', text: 'Dalkey' },
        { id: 'C', text: 'Deansgrange' },
        { id: 'D', text: 'Dun Laoghaire' }
      ],
      correctAnswer: 'D',
      explanation: 'The DLR LexIcon is located in Dun Laoghaire, County Dublin. This is a state-of-the-art public library and cultural center opened in 2014. The LexIcon (Library and Cultural Centre) is a modern architectural landmark, housing extensive library facilities, exhibition spaces, a performance area, and stunning views over Dun Laoghaire Harbour. Dun Laoghaire is a coastal town in south Dublin, easily accessible by DART and bus services. The LexIcon has become a central hub for the community, offering books, digital resources, cultural events, and educational programs.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Project Arts Centre located?',
      questionNumber: 22,
      options: [
        { id: 'A', text: 'Parliament Street' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'Essex Street East' },
        { id: 'D', text: 'Wellington Quay' }
      ],
      correctAnswer: 'C',
      explanation: 'The Project Arts Centre is located on Essex Street East in Dublin 2, in the Temple Bar area. This is one of Ireland\'s leading contemporary arts centers, presenting a diverse program of theatre, dance, music, visual arts, and film. The Project has been a vital part of Dublin\'s cultural scene since 1966, providing a platform for emerging and established artists. Essex Street East is in the heart of Temple Bar, Dublin\'s cultural quarter, surrounded by galleries, theatres, and creative spaces, making it an ideal location for an arts center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Blackrock College?',
      questionNumber: 23,
      options: [
        { id: 'A', text: 'Rock Road' },
        { id: 'B', text: 'Mount Merrion Avenue' },
        { id: 'C', text: 'Booterstown Avenue' },
        { id: 'D', text: 'Carysfort Avenue' }
      ],
      correctAnswer: 'A',
      explanation: 'Blackrock College is located on Rock Road in Blackrock, Dublin. This is one of Ireland\'s most prestigious boys\' secondary schools, founded in 1860 by the Holy Ghost Fathers (now Spiritans). The college is known for its academic excellence, strong sporting tradition, and beautiful campus overlooking Dublin Bay. Rock Road is a major route in south Dublin, running through Blackrock and connecting to areas like Stillorgan and Booterstown. The college has produced many notable alumni in various fields including politics, business, sports, and the arts.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Griffith College located?',
      questionNumber: 24,
      options: [
        { id: 'A', text: 'Suir Road' },
        { id: 'B', text: 'York Street' },
        { id: 'C', text: 'South Circular Road' },
        { id: 'D', text: 'South Richmond Street' }
      ],
      correctAnswer: 'C',
      explanation: 'Griffith College is located on South Circular Road in Dublin 8. This is Ireland\'s largest independent third-level institution, offering a wide range of undergraduate and postgraduate programs in business, law, computing, design, media, music, and drama. The main campus on South Circular Road is set in beautiful historic buildings, including the former Portobello Barracks. South Circular Road is a major route in Dublin\'s southside, easily accessible by public transport and close to the city center. Griffith College has multiple campuses across Ireland and is known for its practical, career-focused approach to education.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Tallaght IT\'s entrance?',
      questionNumber: 25,
      options: [
        { id: 'A', text: 'Cheeverstown Road' },
        { id: 'B', text: 'Greenhills Road' },
        { id: 'C', text: 'Blessington Road' },
        { id: 'D', text: 'Old Bawn Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Tallaght IT\'s (now part of Technological University Dublin - TU Dublin) entrance is on Blessington Road in Tallaght, Dublin 24. The Tallaght campus is one of the main campuses of TU Dublin, offering programs in business, computing, engineering, and applied sciences. Blessington Road is in the Tallaght area, a major suburban center in southwest Dublin. The campus is modern and well-equipped, serving a large student population from the surrounding areas. Tallaght is well-connected by public transport, including the Luas Red Line, making it easily accessible for students.',
      points: 1,
      difficulty: 'hard'
    },
    {
      questionText: 'In what area is Dublin City University (DCU) located?',
      questionNumber: 26,
      options: [
        { id: 'A', text: 'Ballymun' },
        { id: 'B', text: 'Glasnevin' },
        { id: 'C', text: 'Drumcondra' },
        { id: 'D', text: 'Santry' }
      ],
      correctAnswer: 'B',
      explanation: 'Dublin City University (DCU) is located in Glasnevin, Dublin 9. DCU is a modern, innovative university known for its strong focus on enterprise, research, and innovation. The main campus is on Collins Avenue Extension in Glasnevin, with additional campuses in All Hallows and St. Patrick\'s. DCU offers a wide range of undergraduate and postgraduate programs across five faculties. Glasnevin is a residential area in north Dublin, known for the Glasnevin Cemetery and the National Botanic Gardens. The university is easily accessible by bus and is close to Dublin Airport, making it convenient for both local and international students.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is the Royal College of Surgeons of Ireland (RCSI) located?',
      questionNumber: 27,
      options: [
        { id: 'A', text: 'St Stephen\'s Green' },
        { id: 'B', text: 'Dawson Street' },
        { id: 'C', text: 'Kildare Street' },
        { id: 'D', text: 'Dame Street' }
      ],
      correctAnswer: 'A',
      explanation: 'The Royal College of Surgeons of Ireland (RCSI) is located on St. Stephen\'s Green in Dublin 2. Founded in 1784, RCSI is one of Ireland\'s leading medical schools and is internationally recognized for medical education and research. The college offers undergraduate and postgraduate programs in medicine, pharmacy, physiotherapy, and other health sciences. St. Stephen\'s Green is one of Dublin\'s most prestigious locations, a beautiful Georgian square in the heart of the city. The college\'s historic building overlooks the park, providing a stunning setting for medical education. RCSI has a strong reputation and attracts students from around the world.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'On what street is Smurfit Business School located?',
      questionNumber: 28,
      options: [
        { id: 'A', text: 'Newtownpark Avenue' },
        { id: 'B', text: 'Rock Road' },
        { id: 'C', text: 'Carysfort Avenue' },
        { id: 'D', text: 'Avoca Avenue' }
      ],
      correctAnswer: 'C',
      explanation: 'Smurfit Business School (UCD Michael Smurfit Graduate Business School) is located on Carysfort Avenue in Blackrock, Dublin. This is Ireland\'s leading business school and is consistently ranked among the top business schools in Europe. The school offers MBA, executive education, and specialized master\'s programs. Carysfort Avenue is in the affluent area of Blackrock, in Dublin\'s southside, close to the coast. The school is part of University College Dublin (UCD) and is housed in a beautiful historic building, providing an excellent environment for business education and networking.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is St Patrick\'s College located?',
      questionNumber: 29,
      options: [
        { id: 'A', text: 'Collins Avenue' },
        { id: 'B', text: 'Dorset Street' },
        { id: 'C', text: 'Drumcondra Road Upper' },
        { id: 'D', text: 'Grace Park Road' }
      ],
      correctAnswer: 'C',
      explanation: 'St. Patrick\'s College is located on Drumcondra Road Upper in Drumcondra, Dublin 9. This is a college of Dublin City University (DCU), specializing in teacher education. The college was founded in 1875 and has a long tradition of excellence in teacher training. St. Patrick\'s College offers undergraduate and postgraduate programs in education, preparing students for careers as primary and post-primary teachers. Drumcondra Road Upper is in the historic area of Drumcondra, close to other educational institutions and easily accessible from the city center. The college is known for its strong academic programs and commitment to educational excellence.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street is Dun Laoghaire Institute of Art, Design and Technology (IADT)?',
      questionNumber: 30,
      options: [
        { id: 'A', text: 'Kill Avenue' },
        { id: 'B', text: 'Monkstown Avenue' },
        { id: 'C', text: 'Clonkeen Road' },
        { id: 'D', text: 'Deansgrange Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Dun Laoghaire Institute of Art, Design and Technology (IADT) is located on Kill Avenue in Dun Laoghaire, County Dublin. IADT is a specialized third-level institution focusing on creative arts, design, technology, and business. The institute offers programs in areas such as animation, film, photography, design, computing, and business. Kill Avenue is in the coastal town of Dun Laoghaire, providing students with a beautiful setting for their studies. The campus is modern and well-equipped with specialized facilities for creative and technical programs. Dun Laoghaire is easily accessible by DART and bus services, making it convenient for students from across Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is University College Dublin (UCD) located?',
      questionNumber: 31,
      options: [
        { id: 'A', text: 'Mount Merrion' },
        { id: 'B', text: 'Belfield' },
        { id: 'C', text: 'Goatstown' },
        { id: 'D', text: 'Stillorgan' }
      ],
      correctAnswer: 'B',
      explanation: 'University College Dublin (UCD) is located in Belfield, Dublin 4. UCD is Ireland\'s largest university and one of Europe\'s leading research-intensive universities. The main campus in Belfield is a beautiful, modern campus spanning 133 hectares, with state-of-the-art facilities, libraries, sports facilities, and student accommodation. UCD offers a wide range of undergraduate and postgraduate programs across all disciplines. Belfield is in the affluent area of Dublin 4, easily accessible by bus and close to the city center. The university has a strong international reputation and attracts students from around the world, contributing to its vibrant and diverse campus community.',
      points: 1,
      difficulty: 'easy'
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

  console.log(`✅ Created ${questions.length} questions for Schools, Libraries and Universities chapter`)
  
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
