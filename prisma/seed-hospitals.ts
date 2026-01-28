import { PrismaClient, QuestionCategory } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Hospitals chapter...')

  // Create chapter
  const chapter = await prisma.chapter.upsert({
    where: { id: 'chapter_hospitals' },
    update: {},
    create: {
      id: 'chapter_hospitals',
      title: 'Hospitals',
      description: 'Test your knowledge of hospital locations in Dublin',
      chapterNumber: 8,
      type: 'MCQ',
      duration: 35,
      isActive: true,
      category: QuestionCategory.AREA_KNOWLEDGE
    }
  })

  console.log('✅ Chapter created:', chapter.title)

  // Define all 56 questions with detailed explanations
  const questions = [
    {
      questionText: 'On what street do you find Clonskeagh Hospital?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'Bird Avenue' },
        { id: 'B', text: 'Roebuck Road' },
        { id: 'C', text: 'Beaver Row' },
        { id: 'D', text: 'Clonskeagh Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Clonskeagh Hospital is located on Clonskeagh Road in Clonskeagh, Dublin 14. Clonskeagh Road is in the south Dublin suburb of Clonskeagh, running between the city center and the Dublin Mountains. This location is close to UCD (University College Dublin) and is easily accessible from the city center via the N11 and Stillorgan Road.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find Saint John of God Hospital?',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Rock Road' },
        { id: 'B', text: 'Castle Avenue' },
        { id: 'C', text: 'Stillorgan Road' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Saint John of God Hospital is located on Stillorgan Road in Stillorgan, County Dublin. Stillorgan Road is a major thoroughfare in south Dublin, running from the city center through Ballsbridge, Donnybrook, and Stillorgan. The hospital is a major psychiatric facility and is easily accessible from the city center and the M50 motorway.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find Beaumont Hospital?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Beaumont Road' },
        { id: 'B', text: 'George\'s Street Lower' },
        { id: 'C', text: 'Sandyford Road' },
        { id: 'D', text: 'James\'s Street' }
      ],
      correctAnswer: 'A',
      explanation: 'Beaumont Hospital is located on Beaumont Road in Beaumont, Dublin 9. Beaumont Road is in the north Dublin suburb of Beaumont, and the hospital is one of Ireland\'s largest teaching hospitals. This location is easily accessible from the city center via the M50 and is close to Dublin Airport, making it a major healthcare facility serving north Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find Cheeverstown?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'Georges Street Lower' },
        { id: 'B', text: 'Eccles Street' },
        { id: 'C', text: 'Templeogue Road' },
        { id: 'D', text: 'Dundrum Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Cheeverstown is located on Templeogue Road in Templeogue, Dublin 6W. Templeogue Road is in the south Dublin suburb of Templeogue, and Cheeverstown is a residential care facility for people with intellectual disabilities. This location is close to the M50 and is easily accessible from the city center and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find the Cappagh National Orthopaedic Hospital?',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'Templeogue Road' },
        { id: 'B', text: 'Cappagh Road' },
        { id: 'C', text: 'Merrion Road' },
        { id: 'D', text: 'Phoenix Park' }
      ],
      correctAnswer: 'B',
      explanation: 'The Cappagh National Orthopaedic Hospital is located on Cappagh Road in Finglas, Dublin 11. Cappagh Road is in the north Dublin suburb of Finglas, and the hospital is Ireland\'s leading orthopaedic hospital. This location is easily accessible from the city center and the M50, and the hospital specializes in orthopaedic surgery and rehabilitation.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Incorporated Orthopaedic Hospital of Ireland located?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'Clontarf Road' },
        { id: 'B', text: 'Howth Road' },
        { id: 'C', text: 'Castle Avenue' },
        { id: 'D', text: 'Vernon Avenue' }
      ],
      correctAnswer: 'C',
      explanation: 'The Incorporated Orthopaedic Hospital of Ireland is located on Castle Avenue in Clontarf, Dublin 3. Castle Avenue is in the north Dublin suburb of Clontarf, running between Clontarf Road and Howth Road. This location is close to the coast and is easily accessible from the city center, making it a convenient location for patients from north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what area is the Bon Secours Hospital located?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'Finglas' },
        { id: 'B', text: 'Drumcondra' },
        { id: 'C', text: 'Glasnevin' },
        { id: 'D', text: 'Whitehall' }
      ],
      correctAnswer: 'C',
      explanation: 'The Bon Secours Hospital is located in Glasnevin, Dublin 9. Glasnevin is a north Dublin suburb, and the hospital is on Glasnevin Hill, close to the Botanic Gardens and Glasnevin Cemetery. This location is easily accessible from the city center and is a major private hospital serving north Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Royal College of Physicians located?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Molesworth Street' },
        { id: 'B', text: 'York Street' },
        { id: 'C', text: 'Dawson Street' },
        { id: 'D', text: 'Frederick Street South' }
      ],
      correctAnswer: 'D',
      explanation: 'The Royal College of Physicians is located on Frederick Street South in Dublin 2. Frederick Street South is in the city center, connecting Baggot Street to the Grand Canal area. This prestigious location is close to many medical institutions and government buildings, making it an ideal location for the professional body representing physicians in Ireland.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find St. Edmundsbury Hospital OR St. Patrick\'s Hospital?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Clonsilla Road' },
        { id: 'B', text: 'Old Lucan Road' },
        { id: 'C', text: 'Stocking Lane' },
        { id: 'D', text: 'James\'s Street' }
      ],
      correctAnswer: 'B',
      explanation: 'St. Edmundsbury Hospital and St. Patrick\'s Hospital are located on Old Lucan Road in Lucan, County Dublin. Old Lucan Road is in the west Dublin suburb of Lucan, and these hospitals are psychiatric facilities. This location is easily accessible from the city center via the N4 and is close to the M50, making it convenient for patients and visitors from west Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In which area is St. Michael\'s Hospital located?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'Foxrock' },
        { id: 'B', text: 'Dun Laoghaire' },
        { id: 'C', text: 'Blackrock' },
        { id: 'D', text: 'Monkstown' }
      ],
      correctAnswer: 'B',
      explanation: 'St. Michael\'s Hospital is located in Dun Laoghaire, County Dublin. Dun Laoghaire is a coastal town south of Dublin, and the hospital is a private hospital serving the south Dublin area. This location is easily accessible from the city center via the DART and is close to the harbor, making it a convenient location for patients from south Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find Our Lady\'s Hospice?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'Cork Street' },
        { id: 'B', text: 'Stillorgan Road' },
        { id: 'C', text: 'Lincoln Place' },
        { id: 'D', text: 'Harold\'s Cross Road' }
      ],
      correctAnswer: 'D',
      explanation: 'Our Lady\'s Hospice is located on Harold\'s Cross Road in Harold\'s Cross, Dublin 6W. Harold\'s Cross Road is in the south inner city, and the hospice is a specialist palliative care facility. This location is easily accessible from the city center and is close to Mount Jerome Cemetery, making it a peaceful and accessible location for patients and their families.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where do you find St. Columcille\'s Hospital?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Loughlinstown' },
        { id: 'B', text: 'Lincoln Place' },
        { id: 'C', text: 'Cork Street' },
        { id: 'D', text: 'Stillorgan Road' }
      ],
      correctAnswer: 'A',
      explanation: 'St. Columcille\'s Hospital is located in Loughlinstown, County Dublin. Loughlinstown is a south Dublin suburb, and the hospital is a major public hospital serving south Dublin and Wicklow. This location is easily accessible from the city center via the N11 and is close to the M50, making it a key healthcare facility for the south Dublin area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the National Rehabilitation Hospital located?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'Kill Avenue' },
        { id: 'B', text: 'Clonkeen Road' },
        { id: 'C', text: 'Rock Road' },
        { id: 'D', text: 'Rochestown Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'The National Rehabilitation Hospital is located on Rochestown Avenue in Dún Laoghaire, County Dublin. Rochestown Avenue is in the south Dublin suburb of Dún Laoghaire, and the hospital is Ireland\'s leading rehabilitation facility. This location is easily accessible from the city center and provides specialized rehabilitation services for patients with spinal cord injuries, brain injuries, and other complex conditions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find Stewart\'s Hospital?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Cork Street' },
        { id: 'B', text: 'Mill Lane' },
        { id: 'C', text: 'Eccles Street' },
        { id: 'D', text: 'Old Lucan Road' }
      ],
      correctAnswer: 'B',
      explanation: 'Stewart\'s Hospital is located on Mill Lane in Palmerstown, Dublin 20. Mill Lane is in the west Dublin suburb of Palmerstown, and the hospital is a residential care facility for people with intellectual disabilities. This location is easily accessible from the city center and is close to the Liffey Valley Shopping Centre, making it convenient for patients and visitors.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find St. Joseph\'s Hospital?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'Rock Road' },
        { id: 'B', text: 'Beaumont Road' },
        { id: 'C', text: 'Newtownpark Avenue' },
        { id: 'D', text: 'Springdale Road' }
      ],
      correctAnswer: 'D',
      explanation: 'St. Joseph\'s Hospital is located on Springdale Road in Raheny, Dublin 5. Springdale Road is in the north Dublin suburb of Raheny, and the hospital is a residential care facility. This location is easily accessible from the city center and is close to St. Anne\'s Park and the coast, making it a pleasant and accessible location for patients.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find the Hermitage Medical Clinic?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'Fonthill Road' },
        { id: 'B', text: 'Coldcut Road' },
        { id: 'C', text: 'Ballyowen Road' },
        { id: 'D', text: 'Old Lucan Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Hermitage Medical Clinic is located on Old Lucan Road in Lucan, County Dublin. Old Lucan Road is in the west Dublin suburb of Lucan, and the clinic is a major private hospital. This location is easily accessible from the city center via the N4 and is close to the M50, making it a convenient location for patients from west Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find the Cherry Orchard Hospital?',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'Ballyfermot Road Upper' },
        { id: 'B', text: 'Kennelsfort Road Upper' },
        { id: 'C', text: 'Bracken Road' },
        { id: 'D', text: 'Mill Lane' }
      ],
      correctAnswer: 'A',
      explanation: 'The Cherry Orchard Hospital is located on Ballyfermot Road Upper in Ballyfermot, Dublin 10. Ballyfermot Road Upper is in the west Dublin suburb of Ballyfermot, and the hospital is a public hospital serving the west Dublin area. This location is easily accessible from the city center and is close to Phoenix Park, making it a key healthcare facility for west Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find the Central Mental Hospital?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'Parnell Street' },
        { id: 'B', text: 'Glasnevin Hill' },
        { id: 'C', text: 'Sandyford Road' },
        { id: 'D', text: 'Dundrum Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Central Mental Hospital is located on Dundrum Road in Dundrum, Dublin 14. Dundrum Road is in the south Dublin suburb of Dundrum, and the hospital is Ireland\'s national forensic mental health facility. This location is easily accessible from the city center via the M50 and is close to the Dundrum Town Centre, making it a key facility for mental health services.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Saint Bricin\'s Military Hospital located?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Arbour Hill' },
        { id: 'B', text: 'Infirmary Road' },
        { id: 'C', text: 'Benburb Street' },
        { id: 'D', text: 'North Circular Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Saint Bricin\'s Military Hospital is located in Arbour Hill in Dublin 7. Arbour Hill is in the north inner city, close to Phoenix Park and the Four Courts. The hospital is a military medical facility serving the Irish Defence Forces and is easily accessible from the city center, making it a key facility for military healthcare services.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Saint Ita\'s Hospital located?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'Lusk' },
        { id: 'B', text: 'Donabate' },
        { id: 'C', text: 'Portrane' },
        { id: 'D', text: 'Rush' }
      ],
      correctAnswer: 'C',
      explanation: 'Saint Ita\'s Hospital is located in Portrane, County Dublin. Portrane is a coastal town north of Dublin, and the hospital is a psychiatric facility. This location is easily accessible from the city center and is close to the coast, making it a peaceful and accessible location for patients from north Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Dublin Dental Hospital?',
      questionNumber: 21,
      options: [
        { id: 'A', text: 'Lincoln Place' },
        { id: 'B', text: 'Eccles Street' },
        { id: 'C', text: 'Adelaide Road' },
        { id: 'D', text: 'Nassau Street' }
      ],
      correctAnswer: 'A',
      explanation: 'The Dublin Dental Hospital is located on Lincoln Place in Dublin 2. Lincoln Place is in the city center, close to Trinity College and the National Gallery. The hospital is Ireland\'s leading dental teaching hospital and is easily accessible from the main tourist attractions, making it a key facility for dental education and patient care.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which street is the Coombe Hospital located?',
      questionNumber: 22,
      options: [
        { id: 'A', text: 'Cork Street' },
        { id: 'B', text: 'Suir Road' },
        { id: 'C', text: 'Dolphin\'s Barn Street' },
        { id: 'D', text: 'Parnell Road' }
      ],
      correctAnswer: 'C',
      explanation: 'The Coombe Hospital is located on Dolphin\'s Barn Street in Dublin 8. Dolphin\'s Barn Street is in the south inner city, and the hospital is one of Ireland\'s leading maternity hospitals. This location is easily accessible from the city center and is close to the Grand Canal, making it a key facility for maternity and women\'s health services.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find The National Maternity Hospital?',
      questionNumber: 23,
      options: [
        { id: 'A', text: 'Rock Road' },
        { id: 'B', text: 'Merrion Square North' },
        { id: 'C', text: 'Cooley Road' },
        { id: 'D', text: 'Holles Street' }
      ],
      correctAnswer: 'D',
      explanation: 'The National Maternity Hospital is located on Holles Street in Dublin 2. Holles Street is in the city center, close to St. Stephen\'s Green and the Grand Canal. The hospital is one of Ireland\'s leading maternity hospitals and is easily accessible from the main tourist attractions, making it a key facility for maternity and women\'s health services.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is the National Blood Centre located?',
      questionNumber: 24,
      options: [
        { id: 'A', text: 'D\'Olier Street' },
        { id: 'B', text: 'Dame Street' },
        { id: 'C', text: 'Cork Street' },
        { id: 'D', text: 'James\'s Street' }
      ],
      correctAnswer: 'D',
      explanation: 'The National Blood Centre is located on James\'s Street in Dublin 8. James\'s Street is in the south inner city, close to St. James\'s Hospital and the Guinness Storehouse. The center is responsible for collecting, testing, and distributing blood products throughout Ireland, making it a critical healthcare facility easily accessible from the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what area is St. Luke\'s Hospital located?',
      questionNumber: 25,
      options: [
        { id: 'A', text: 'Dundrum' },
        { id: 'B', text: 'Rathgar' },
        { id: 'C', text: 'Kimmage' },
        { id: 'D', text: 'Terenure' }
      ],
      correctAnswer: 'B',
      explanation: 'St. Luke\'s Hospital is located in Rathgar, Dublin 6. Rathgar is a south Dublin suburb, and the hospital is a specialist cancer treatment facility. This location is easily accessible from the city center and is close to the Grand Canal, making it a key facility for cancer care and treatment in Ireland.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what area is the National Spine Institute located?',
      questionNumber: 26,
      options: [
        { id: 'A', text: 'Tallaght' },
        { id: 'B', text: 'Sandyford' },
        { id: 'C', text: 'Dundrum' },
        { id: 'D', text: 'Blackrock' }
      ],
      correctAnswer: 'B',
      explanation: 'The National Spine Institute is located in Sandyford, County Dublin. Sandyford is a south Dublin suburb, and the institute is a specialist facility for spinal surgery and treatment. This location is easily accessible from the city center via the M50 and is close to the Sandyford Business District, making it a key facility for specialized spinal care.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find the Royal City of Dublin Hospital?',
      questionNumber: 27,
      options: [
        { id: 'A', text: 'Mespil Road' },
        { id: 'B', text: 'James\'s Street' },
        { id: 'C', text: 'Loughlinstown' },
        { id: 'D', text: 'Baggot Street' }
      ],
      correctAnswer: 'D',
      explanation: 'The Royal City of Dublin Hospital is located on Baggot Street in Dublin 2. Baggot Street is in the city center, running from the Grand Canal to Merrion Square. The hospital is a private hospital and is easily accessible from the main tourist attractions, making it a convenient location for patients from the city center and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what area is Connolly Hospital located?',
      questionNumber: 28,
      options: [
        { id: 'A', text: 'Castleknock' },
        { id: 'B', text: 'Lucan' },
        { id: 'C', text: 'Blanchardstown' },
        { id: 'D', text: 'Glasnevin' }
      ],
      correctAnswer: 'C',
      explanation: 'Connolly Hospital is located in Blanchardstown, Dublin 15. Blanchardstown is a west Dublin suburb, and the hospital is one of Ireland\'s largest public hospitals. This location is easily accessible from the city center via the M50 and is close to Dublin Airport, making it a key healthcare facility serving west Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'The entrance to the Mater Misericordiae is on what street?',
      questionNumber: 29,
      options: [
        { id: 'A', text: 'North Circular Road' },
        { id: 'B', text: 'Eccles Street' },
        { id: 'C', text: 'Phibsborough Road' },
        { id: 'D', text: 'Mountjoy Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The entrance to the Mater Misericordiae University Hospital is on Eccles Street in Dublin 7. Eccles Street is in the north inner city, and the hospital is one of Ireland\'s largest teaching hospitals. This location is easily accessible from the city center and is close to Phoenix Park, making it a key facility for healthcare services in north Dublin.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'On what street do you find St. Vincent\'s Fairview?',
      questionNumber: 30,
      options: [
        { id: 'A', text: 'Richmond Road' },
        { id: 'B', text: 'Newtownpark Avenue' },
        { id: 'C', text: 'Merrion Road' },
        { id: 'D', text: 'Rock Road' }
      ],
      correctAnswer: 'A',
      explanation: 'St. Vincent\'s Fairview is located on Richmond Road in Fairview, Dublin 3. Richmond Road is in the north inner city, and the hospital is a private hospital serving the north Dublin area. This location is easily accessible from the city center and is close to Fairview Park and the coast, making it a convenient location for patients from north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find Our Lady\'s Hospital for Sick Children?',
      questionNumber: 31,
      options: [
        { id: 'A', text: 'Dundrum Road' },
        { id: 'B', text: 'Cooley Road' },
        { id: 'C', text: 'James Street' },
        { id: 'D', text: 'Cork Street' }
      ],
      correctAnswer: 'B',
      explanation: 'Our Lady\'s Hospital for Sick Children is located on Cooley Road in Crumlin, Dublin 12. Cooley Road is in the south inner city, and the hospital is Ireland\'s leading pediatric hospital. This location is easily accessible from the city center and is close to the M50, making it a key facility for children\'s healthcare services throughout Ireland.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Hampstead Private Hospital located?',
      questionNumber: 32,
      options: [
        { id: 'A', text: 'Whitehall Road' },
        { id: 'B', text: 'Ballymun Road' },
        { id: 'C', text: 'Swords Road' },
        { id: 'D', text: 'Hampstead Avenue' }
      ],
      correctAnswer: 'D',
      explanation: 'Hampstead Private Hospital is located on Hampstead Avenue in Whitehall, Dublin 9. Hampstead Avenue is in the north Dublin suburb of Whitehall, and the hospital is a private hospital. This location is easily accessible from the city center and is close to the M50 and Dublin Airport, making it a convenient location for patients from north Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find St. Mary\'s Hospital?',
      questionNumber: 33,
      options: [
        { id: 'A', text: 'Phoenix Park' },
        { id: 'B', text: 'Highfield Road' },
        { id: 'C', text: 'Adelaide Road' },
        { id: 'D', text: 'James\'s Street' }
      ],
      correctAnswer: 'A',
      explanation: 'St. Mary\'s Hospital is located in Phoenix Park, Dublin 8. Phoenix Park is one of Europe\'s largest city parks, and the hospital is a psychiatric facility. This location provides a peaceful and therapeutic environment for patients, and is easily accessible from the city center, making it a key facility for mental health services.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find St. Joseph\'s Clonsilla?',
      questionNumber: 34,
      options: [
        { id: 'A', text: 'Old Lucan Road' },
        { id: 'B', text: 'Clonsilla Road' },
        { id: 'C', text: 'Baggot Street' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'B',
      explanation: 'St. Joseph\'s Clonsilla is located on Clonsilla Road in Clonsilla, Dublin 15. Clonsilla Road is in the west Dublin suburb of Clonsilla, and the hospital is a residential care facility. This location is easily accessible from the city center via the N4 and is close to the M50, making it convenient for patients and visitors from west Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find the Blackrock Clinic?',
      questionNumber: 35,
      options: [
        { id: 'A', text: 'Merrion Road' },
        { id: 'B', text: 'Temple Street' },
        { id: 'C', text: 'Rock Road' },
        { id: 'D', text: 'James\'s Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The Blackrock Clinic is located on Rock Road in Blackrock, County Dublin. Rock Road is in the south Dublin suburb of Blackrock, and the clinic is a major private hospital. This location is easily accessible from the city center via the DART and is close to the coast, making it a convenient and pleasant location for patients from south Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Tallaght Hospital located?',
      questionNumber: 36,
      options: [
        { id: 'A', text: 'Whitestown Way' },
        { id: 'B', text: 'Firhouse Road W' },
        { id: 'C', text: 'Mayberry Road' },
        { id: 'D', text: 'Belgard Square North' }
      ],
      correctAnswer: 'D',
      explanation: 'Tallaght Hospital is located on Belgard Square North in Tallaght, Dublin 24. Belgard Square North is in the west Dublin suburb of Tallaght, and the hospital is one of Ireland\'s largest teaching hospitals. This location is easily accessible from the city center via the M50 and is close to the Tallaght Town Centre, making it a key healthcare facility serving west Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find the Temple Street Children\'s University Hospital?',
      questionNumber: 37,
      options: [
        { id: 'A', text: 'Bloomfield Avenue' },
        { id: 'B', text: 'Holles Street' },
        { id: 'C', text: 'Temple Street' },
        { id: 'D', text: 'Mill Lane' }
      ],
      correctAnswer: 'C',
      explanation: 'The Temple Street Children\'s University Hospital is located on Temple Street in Dublin 1. Temple Street is in the north inner city, close to Parnell Square and the Rotunda Hospital. The hospital is Ireland\'s leading pediatric hospital and is easily accessible from the city center, making it a key facility for children\'s healthcare services.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Mater Private Day Hospital, Northern Cross located?',
      questionNumber: 38,
      options: [
        { id: 'A', text: 'Malahide Road' },
        { id: 'B', text: 'Clongriffin Road' },
        { id: 'C', text: 'Adelaide Road' },
        { id: 'D', text: 'Railway Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Mater Private Day Hospital, Northern Cross is located on Malahide Road in Northern Cross, Dublin 17. Malahide Road is in the north Dublin suburb of Northern Cross, and the hospital is a private day hospital. This location is easily accessible from the city center and is close to the M50 and Dublin Airport, making it a convenient location for patients from north Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On which road is the Royal Victoria Eye and Ear Hospital?',
      questionNumber: 39,
      options: [
        { id: 'A', text: 'Hatch Street' },
        { id: 'B', text: 'Leeson Street Lower' },
        { id: 'C', text: 'Adelaide Road' },
        { id: 'D', text: 'Fitzwilliam Place' }
      ],
      correctAnswer: 'C',
      explanation: 'The Royal Victoria Eye and Ear Hospital is located on Adelaide Road in Dublin 2. Adelaide Road is in the city center, connecting the Grand Canal to St. Stephen\'s Green. The hospital is Ireland\'s leading eye and ear hospital and is easily accessible from the main tourist attractions, making it a key facility for specialized eye and ear care.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is Clontarf Hospital located?',
      questionNumber: 40,
      options: [
        { id: 'A', text: 'Blackheath Park' },
        { id: 'B', text: 'Mount Prospect Avenue' },
        { id: 'C', text: 'Howth Road' },
        { id: 'D', text: 'Vernon Avenue' }
      ],
      correctAnswer: 'A',
      explanation: 'Clontarf Hospital is located on Blackheath Park in Clontarf, Dublin 3. Blackheath Park is in the north Dublin suburb of Clontarf, and the hospital is a private hospital. This location is easily accessible from the city center and is close to the coast and St. Anne\'s Park, making it a pleasant and convenient location for patients from north Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Rotunda Hospital located?',
      questionNumber: 41,
      options: [
        { id: 'A', text: 'Merrion Square' },
        { id: 'B', text: 'Parnell Street' },
        { id: 'C', text: 'Cathal Brugha Street' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'B',
      explanation: 'The Rotunda Hospital is located on Parnell Street in Dublin 1. Parnell Street is in the north inner city, close to O\'Connell Street and Parnell Square. The hospital is one of Ireland\'s leading maternity hospitals and is easily accessible from the city center, making it a key facility for maternity and women\'s health services.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is Mount Carmel Community Hospital located?',
      questionNumber: 42,
      options: [
        { id: 'A', text: 'Churchtown Road Lower' },
        { id: 'B', text: 'Orwell Road' },
        { id: 'C', text: 'Braemor Park' },
        { id: 'D', text: 'Dodder Road Lower' }
      ],
      correctAnswer: 'C',
      explanation: 'Mount Carmel Community Hospital is located on Braemor Park in Churchtown, Dublin 14. Braemor Park is in the south Dublin suburb of Churchtown, and the hospital is a private hospital. This location is easily accessible from the city center via the M50 and is close to the Dundrum Town Centre, making it a convenient location for patients from south Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Connolly Hospital is situated off which main road?',
      questionNumber: 43,
      options: [
        { id: 'A', text: 'Naas Road' },
        { id: 'B', text: 'Navan Road' },
        { id: 'C', text: 'Cooley Road' },
        { id: 'D', text: 'Ratoath Road' }
      ],
      correctAnswer: 'A',
      explanation: 'Connolly Hospital is situated off the Naas Road in Blanchardstown, Dublin 15. The Naas Road (N7) is a major route connecting Dublin to Naas and the south of Ireland, and the hospital is easily accessible from this main road. This location is close to the M50 and Dublin Airport, making it a key healthcare facility serving west Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find St. Patrick\'s University Hospital?',
      questionNumber: 44,
      options: [
        { id: 'A', text: 'Nutley Lane' },
        { id: 'B', text: 'James\'s Street' },
        { id: 'C', text: 'Bloomfield Avenue' },
        { id: 'D', text: 'Glasnevin Hill' }
      ],
      correctAnswer: 'B',
      explanation: 'St. Patrick\'s University Hospital is located on James\'s Street in Dublin 8. James\'s Street is in the south inner city, close to St. James\'s Hospital and the Guinness Storehouse. The hospital is Ireland\'s leading mental health facility and is easily accessible from the city center, making it a key facility for mental health services throughout Ireland.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find St. James\'s Hospital?',
      questionNumber: 45,
      options: [
        { id: 'A', text: 'Cork Street' },
        { id: 'B', text: 'James\'s Street' },
        { id: 'C', text: 'Temple Street' },
        { id: 'D', text: 'Clonskeagh Road' }
      ],
      correctAnswer: 'B',
      explanation: 'St. James\'s Hospital is located on James\'s Street in Dublin 8. James\'s Street is in the south inner city, and the hospital is one of Ireland\'s largest teaching hospitals. This location is easily accessible from the city center and is close to the Guinness Storehouse, making it a key healthcare facility serving south Dublin and surrounding areas.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'On what street do you find Peamount Healthcare?',
      questionNumber: 46,
      options: [
        { id: 'A', text: 'Peamount Road' },
        { id: 'B', text: 'Sandyford Road' },
        { id: 'C', text: 'Templeogue Road' },
        { id: 'D', text: 'Phoenix Park' }
      ],
      correctAnswer: 'A',
      explanation: 'Peamount Healthcare is located on Peamount Road in Newcastle, County Dublin. Peamount Road is in the south Dublin suburb of Newcastle, and the facility is a specialist rehabilitation and long-term care facility. This location is easily accessible from the city center via the M50 and is set in parkland, making it a peaceful and therapeutic environment for patients.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Beacon Hospital located?',
      questionNumber: 47,
      options: [
        { id: 'A', text: 'Sandyford' },
        { id: 'B', text: 'Tallaght' },
        { id: 'C', text: 'Stillorgan' },
        { id: 'D', text: 'Dundrum' }
      ],
      correctAnswer: 'A',
      explanation: 'The Beacon Hospital is located in Sandyford, County Dublin. Sandyford is a south Dublin suburb, and the hospital is a major private hospital. This location is easily accessible from the city center via the M50 and is close to the Sandyford Business District, making it a convenient location for patients from south Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what area is Sports Surgery Clinic located?',
      questionNumber: 48,
      options: [
        { id: 'A', text: 'Santry' },
        { id: 'B', text: 'Raheny' },
        { id: 'C', text: 'Dundrum' },
        { id: 'D', text: 'Finglas' }
      ],
      correctAnswer: 'A',
      explanation: 'Sports Surgery Clinic is located in Santry, Dublin 9. Santry is a north Dublin suburb, and the clinic is a specialist orthopedic and sports medicine facility. This location is easily accessible from the city center and is close to Dublin Airport and the M50, making it a convenient location for patients from north Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find St. Vincent\'s University Hospital?',
      questionNumber: 49,
      options: [
        { id: 'A', text: 'Merrion Road' },
        { id: 'B', text: 'Cork Street' },
        { id: 'C', text: 'Adelaide Road' },
        { id: 'D', text: 'Rock Road' }
      ],
      correctAnswer: 'A',
      explanation: 'St. Vincent\'s University Hospital is located on Merrion Road in Ballsbridge, Dublin 4. Merrion Road is one of Dublin\'s most prestigious addresses, running from Ballsbridge towards Donnybrook. The hospital is one of Ireland\'s largest teaching hospitals and is easily accessible from the city center, making it a key healthcare facility serving south Dublin and surrounding areas.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'On what street do you find Bloomfield Health Services?',
      questionNumber: 50,
      options: [
        { id: 'A', text: 'Springdale Road' },
        { id: 'B', text: 'Merrion Road' },
        { id: 'C', text: 'Stocking Lane' },
        { id: 'D', text: 'Peamount Road' }
      ],
      correctAnswer: 'C',
      explanation: 'Bloomfield Health Services is located on Stocking Lane in Rathfarnham, Dublin 16. Stocking Lane is in the south Dublin suburb of Rathfarnham, and the facility is a specialist mental health facility. This location is easily accessible from the city center via the M50 and is set in parkland, making it a peaceful and therapeutic environment for patients.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In what area is Highfield Healthcare located?',
      questionNumber: 51,
      options: [
        { id: 'A', text: 'East Wall' },
        { id: 'B', text: 'Whitehall' },
        { id: 'C', text: 'Blackrock' },
        { id: 'D', text: 'Tallaght' }
      ],
      correctAnswer: 'B',
      explanation: 'Highfield Healthcare is located in Whitehall, Dublin 9. Whitehall is a north Dublin suburb, and the facility is a specialist mental health and addiction treatment facility. This location is easily accessible from the city center and is close to the M50 and Dublin Airport, making it a convenient location for patients from north Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'In which area is Cappagh National Orthopaedic Hospital located?',
      questionNumber: 52,
      options: [
        { id: 'A', text: 'Cabra' },
        { id: 'B', text: 'Ballymun' },
        { id: 'C', text: 'Finglas' },
        { id: 'D', text: 'Glasnevin' }
      ],
      correctAnswer: 'C',
      explanation: 'Cappagh National Orthopaedic Hospital is located in Finglas, Dublin 11. Finglas is a north Dublin suburb, and the hospital is Ireland\'s leading orthopaedic hospital. This location is easily accessible from the city center and the M50, and the hospital specializes in orthopaedic surgery and rehabilitation, making it a key facility for orthopaedic care throughout Ireland.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find the National Children\'s Hospital?',
      questionNumber: 53,
      options: [
        { id: 'A', text: 'Bracken Road' },
        { id: 'B', text: 'Cookstown Way' },
        { id: 'C', text: 'Belgard Square North' },
        { id: 'D', text: 'Dundrum Road' }
      ],
      correctAnswer: 'C',
      explanation: 'The National Children\'s Hospital is located on Belgard Square North in Tallaght, Dublin 24. Belgard Square North is in the west Dublin suburb of Tallaght, and the hospital is Ireland\'s leading pediatric hospital. This location is easily accessible from the city center via the M50 and is close to Tallaght Hospital, making it a key facility for children\'s healthcare services throughout Ireland.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'On what street do you find the Royal Hospital Donnybrook?',
      questionNumber: 54,
      options: [
        { id: 'A', text: 'Castle Avenue' },
        { id: 'B', text: 'Morehampton Road' },
        { id: 'C', text: 'Harold\'s Cross Road' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'B',
      explanation: 'The Royal Hospital Donnybrook is located on Morehampton Road in Donnybrook, Dublin 4. Morehampton Road is in the south Dublin suburb of Donnybrook, and the hospital is a private hospital. This location is easily accessible from the city center and is close to the RDS and UCD, making it a convenient location for patients from south Dublin and surrounding areas.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Central Remedial Clinic Located?',
      questionNumber: 55,
      options: [
        { id: 'A', text: 'Vernon Avenue' },
        { id: 'B', text: 'Clontarf Road' },
        { id: 'C', text: 'Castle Avenue' },
        { id: 'D', text: 'Howth Road' }
      ],
      correctAnswer: 'A',
      explanation: 'The Central Remedial Clinic is located on Vernon Avenue in Clontarf, Dublin 3. Vernon Avenue is in the north Dublin suburb of Clontarf, and the clinic is a specialist facility for people with physical disabilities. This location is easily accessible from the city center and is close to the coast and St. Anne\'s Park, making it a pleasant and accessible location for patients and their families.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Royal College of Surgeons located?',
      questionNumber: 56,
      options: [
        { id: 'A', text: 'Dawson Street' },
        { id: 'B', text: 'St Stephen\'s Green' },
        { id: 'C', text: 'Molesworth Street' },
        { id: 'D', text: 'Kildare Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The Royal College of Surgeons is located on St. Stephen\'s Green in Dublin 2. St. Stephen\'s Green is one of Dublin\'s most famous Georgian squares, located in the city center. The college is one of Ireland\'s leading medical education institutions and is easily accessible from the main tourist attractions, making it a prestigious location for medical education and training.',
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

  console.log(`✅ Created ${questions.length} questions for Hospitals chapter`)

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
