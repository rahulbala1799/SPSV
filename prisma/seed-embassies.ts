import { PrismaClient, QuestionCategory } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Embassies chapter...')

  // Create chapter
  const chapter = await prisma.chapter.upsert({
    where: { id: 'chapter_embassies' },
    update: {},
    create: {
      id: 'chapter_embassies',
      title: 'Embassies',
      description: 'Test your knowledge of embassy locations in Dublin',
      chapterNumber: 6,
      type: 'MCQ',
      duration: 35,
      isActive: true,
      category: QuestionCategory.AREA_KNOWLEDGE
    }
  })

  console.log('✅ Chapter created:', chapter.title)

  // Define all 41 questions with detailed explanations
  const questions = [
    {
      questionText: 'Where is the Embassy of Israel located?',
      questionNumber: 1,
      options: [
        { id: 'A', text: 'Anglesea Road' },
        { id: 'B', text: 'Shelbourne Road' },
        { id: 'C', text: 'Adelaide Road' },
        { id: 'D', text: 'Merrion Square' }
      ],
      correctAnswer: 'B',
      explanation: 'The Embassy of Israel is located on Shelbourne Road in Ballsbridge, Dublin 4. Shelbourne Road runs parallel to Merrion Road and is in the prestigious Ballsbridge area, known for its diplomatic presence and proximity to the RDS (Royal Dublin Society).',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Australian Embassy located?',
      questionNumber: 2,
      options: [
        { id: 'A', text: 'Wilton Terrace' },
        { id: 'B', text: 'St Stephens Green 47 - 49 St Stephen\'s Green, Dublin 2' },
        { id: 'C', text: 'Burlington Road' },
        { id: 'D', text: 'Pembroke Row' }
      ],
      correctAnswer: 'B',
      explanation: 'The Australian Embassy is located at 47-49 St. Stephen\'s Green, Dublin 2. This is in the heart of Dublin\'s city center, on the prestigious St. Stephen\'s Green, one of Dublin\'s most famous Georgian squares. The embassy is easily accessible from Grafton Street and is near many of Dublin\'s cultural and historical landmarks.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is the Belgian Embassy located?',
      questionNumber: 3,
      options: [
        { id: 'A', text: 'Shelbourne Road' },
        { id: 'B', text: 'Elgin Road' },
        { id: 'C', text: 'Wellington Road' },
        { id: 'D', text: 'Herbert Park' }
      ],
      correctAnswer: 'B',
      explanation: 'The Belgian Embassy is located on Elgin Road in Ballsbridge, Dublin 4. Elgin Road is a residential street in the Ballsbridge area, running between Merrion Road and Anglesea Road. This area is known for its diplomatic missions and is close to the RDS and Herbert Park.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Finnish Embassy located?',
      questionNumber: 4,
      options: [
        { id: 'A', text: 'Long Lane' },
        { id: 'B', text: 'Charlemont Place' },
        { id: 'C', text: 'Grove Road' },
        { id: 'D', text: 'Stokes Place' }
      ],
      correctAnswer: 'D',
      explanation: 'The Finnish Embassy is located on Stokes Place in Dublin. Stokes Place is a small street in the city center, connecting to the Grand Canal area. This location provides easy access to the city center while being in a quieter residential area.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Argentine Embassy located?',
      questionNumber: 5,
      options: [
        { id: 'A', text: 'Stillorgan Park' },
        { id: 'B', text: 'Ailesbury Drive' },
        { id: 'C', text: 'Anglesea Road' },
        { id: 'D', text: 'Shrewsbury Road' }
      ],
      correctAnswer: 'B',
      explanation: 'The Argentine Embassy is located on Ailesbury Drive in Ballsbridge, Dublin 4. Ailesbury Drive is in the prestigious Ballsbridge area, running parallel to Ailesbury Road. This area is known for its diplomatic presence and is close to the RDS, making it a prime location for embassies.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Embassy of Lithuania located?',
      questionNumber: 6,
      options: [
        { id: 'A', text: 'Merrion Road' },
        { id: 'B', text: 'Stillorgan Road' },
        { id: 'C', text: 'Nutley Road' },
        { id: 'D', text: 'Ailesbury Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Embassy of Lithuania is located on Ailesbury Road in Ballsbridge, Dublin 4. Ailesbury Road is one of the most prestigious addresses in Dublin, running through Ballsbridge and Donnybrook. This road is home to many diplomatic missions and is known for its elegant Georgian and Victorian architecture.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Nigerian Embassy located?',
      questionNumber: 7,
      options: [
        { id: 'A', text: 'Appian Way' },
        { id: 'B', text: 'Leeson Street' },
        { id: 'C', text: 'Winton Road' },
        { id: 'D', text: 'Leeson Park' }
      ],
      correctAnswer: 'D',
      explanation: 'The Nigerian Embassy is located on Leeson Park in Dublin 6. Leeson Park is a residential area in the south inner city, running parallel to Leeson Street. This location is close to the Grand Canal and provides easy access to the city center while being in a quieter residential setting.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Portuguese Embassy located?',
      questionNumber: 8,
      options: [
        { id: 'A', text: 'Upper Leeson Street' },
        { id: 'B', text: 'Ailesbury Road' },
        { id: 'C', text: 'Clyde Road' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'A',
      explanation: 'The Portuguese Embassy is located on Upper Leeson Street in Dublin 4. Upper Leeson Street is part of the main Leeson Street thoroughfare that runs from the city center towards Ballsbridge. This area is known for its mix of commercial and residential properties and is well-connected to the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Egyptian Embassy located?',
      questionNumber: 9,
      options: [
        { id: 'A', text: 'Appian Way' },
        { id: 'B', text: 'Waterloo Road' },
        { id: 'C', text: 'Clyde Road' },
        { id: 'D', text: 'Burlington Road' }
      ],
      correctAnswer: 'C',
      explanation: 'The Egyptian Embassy is located on Clyde Road in Ballsbridge, Dublin 4. Clyde Road is a residential street in the Ballsbridge area, running between Merrion Road and Pembroke Road. This prestigious location is in the heart of Dublin\'s diplomatic quarter, close to the RDS and many other embassies.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Chinese Embassy located?',
      questionNumber: 10,
      options: [
        { id: 'A', text: 'Merrion Road' },
        { id: 'B', text: 'Ailesbury Road' },
        { id: 'C', text: 'Ailesbury Drive' },
        { id: 'D', text: 'Shrewsbury Road' }
      ],
      correctAnswer: 'A',
      explanation: 'The Chinese Embassy is located on Merrion Road in Ballsbridge, Dublin 4. Merrion Road is a major thoroughfare running from Ballsbridge towards Donnybrook and is one of the most prestigious addresses in Dublin. This road is home to many diplomatic missions and is close to the RDS, Herbert Park, and the Aviva Stadium.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Polish Embassy located?',
      questionNumber: 11,
      options: [
        { id: 'A', text: 'Nutley Avenue' },
        { id: 'B', text: 'Merrion Road' },
        { id: 'C', text: 'Nutley Lane' },
        { id: 'D', text: 'Ailesbury Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Polish Embassy is located on Ailesbury Road in Ballsbridge, Dublin 4. Ailesbury Road is one of Dublin\'s most prestigious addresses, running through Ballsbridge and Donnybrook. This road is renowned for its diplomatic presence, with many embassies located along its length, and features elegant Georgian and Victorian architecture.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Algerian Embassy located?',
      questionNumber: 12,
      options: [
        { id: 'A', text: 'Clyde Road' },
        { id: 'B', text: 'Shelbourne Road' },
        { id: 'C', text: 'Sandymount Road' },
        { id: 'D', text: 'Lansdowne Road' }
      ],
      correctAnswer: 'A',
      explanation: 'The Algerian Embassy is located on Clyde Road in Ballsbridge, Dublin 4. Clyde Road is a residential street in the prestigious Ballsbridge area, running between Merrion Road and Pembroke Road. This location is in the heart of Dublin\'s diplomatic quarter, close to the RDS and many other embassies, making it an ideal location for diplomatic missions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Italian Embassy located?',
      questionNumber: 13,
      options: [
        { id: 'A', text: 'Baggot Street' },
        { id: 'B', text: 'Northumberland Road' },
        { id: 'C', text: 'Pembroke Gardens' },
        { id: 'D', text: 'Lansdowne Park' }
      ],
      correctAnswer: 'B',
      explanation: 'The Italian Embassy is located on Northumberland Road in Ballsbridge, Dublin 4. Northumberland Road runs from Ballsbridge towards the city center and is a major route connecting the diplomatic quarter to the city. This road is close to the RDS, the Aviva Stadium, and many other diplomatic missions, making it a prime location for embassies.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the French Embassy located?',
      questionNumber: 14,
      options: [
        { id: 'A', text: 'Merrion Square South' },
        { id: 'B', text: 'Fitzwilliam Lane' },
        { id: 'C', text: 'Ailesbury Road' },
        { id: 'D', text: 'Pembroke Lane' }
      ],
      correctAnswer: 'B',
      explanation: 'The French Embassy is located on Fitzwilliam Lane in Dublin 2. Fitzwilliam Lane is a small street in the city center, connecting to the prestigious Fitzwilliam Square area. This location provides easy access to the city center, St. Stephen\'s Green, and is in the heart of Dublin\'s Georgian quarter.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Brazilian Embassy located?',
      questionNumber: 15,
      options: [
        { id: 'A', text: 'Harcourt Street' },
        { id: 'B', text: 'Camden Street' },
        { id: 'C', text: 'Hatch Street' },
        { id: 'D', text: 'Charlotte Way' }
      ],
      correctAnswer: 'D',
      explanation: 'The Brazilian Embassy is located on Charlotte Way in Dublin 2. Charlotte Way is a small street in the city center, connecting Harcourt Street to the Grand Canal area. This location provides easy access to the city center, St. Stephen\'s Green, and is close to many of Dublin\'s cultural and historical landmarks.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Austrian Embassy located?',
      questionNumber: 16,
      options: [
        { id: 'A', text: 'Adelaide Road' },
        { id: 'B', text: 'Ailesbury Road' },
        { id: 'C', text: 'Shrewsbury Square' },
        { id: 'D', text: 'Merrion Square' }
      ],
      correctAnswer: 'B',
      explanation: 'The Austrian Embassy is located on Ailesbury Road in Ballsbridge, Dublin 4. Ailesbury Road is one of Dublin\'s most prestigious addresses, running through Ballsbridge and Donnybrook. This road is renowned for its diplomatic presence, with many embassies located along its length, and is close to the RDS and Herbert Park.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Latvian Embassy located?',
      questionNumber: 17,
      options: [
        { id: 'A', text: 'Upper Pembroke Street' },
        { id: 'B', text: 'Adelaide Road' },
        { id: 'C', text: 'Earlsfort Terrace' },
        { id: 'D', text: 'Fitzwilliam Place' }
      ],
      correctAnswer: 'D',
      explanation: 'The Latvian Embassy is located on Fitzwilliam Place in Dublin 2. Fitzwilliam Place is part of the prestigious Fitzwilliam Square area in the city center, one of Dublin\'s most famous Georgian squares. This location provides easy access to St. Stephen\'s Green, the National Concert Hall, and is in the heart of Dublin\'s cultural and diplomatic quarter.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Czech Embassy located?',
      questionNumber: 18,
      options: [
        { id: 'A', text: 'Pembroke Gardens' },
        { id: 'B', text: 'Northumberland Road' },
        { id: 'C', text: 'Lansdowne Road' },
        { id: 'D', text: 'Baggot Lane' }
      ],
      correctAnswer: 'B',
      explanation: 'The Czech Embassy is located on Northumberland Road in Ballsbridge, Dublin 4. Northumberland Road is a major thoroughfare running from Ballsbridge towards the city center. This road is in the heart of Dublin\'s diplomatic quarter, close to the RDS, the Aviva Stadium, and many other embassies, making it an ideal location for diplomatic missions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the European Parliament Liaison Office located?',
      questionNumber: 19,
      options: [
        { id: 'A', text: 'Molesworth Street' },
        { id: 'B', text: 'Lower Mount Street' },
        { id: 'C', text: 'Merrion Square' },
        { id: 'D', text: 'Dawson Street' }
      ],
      correctAnswer: 'B',
      explanation: 'The European Parliament Liaison Office is located on Lower Mount Street in Dublin 2. Lower Mount Street is in the city center, connecting Merrion Square to the Grand Canal area. This location provides easy access to the city center, St. Stephen\'s Green, and is close to many government buildings and diplomatic missions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Embassy of Slovakia located?',
      questionNumber: 20,
      options: [
        { id: 'A', text: 'Adelaide Road' },
        { id: 'B', text: 'Mespil Road' },
        { id: 'C', text: 'Fitzwilliam Square' },
        { id: 'D', text: 'Merrion Square South' }
      ],
      correctAnswer: 'D',
      explanation: 'The Embassy of Slovakia is located on Merrion Square South in Dublin 2. Merrion Square is one of Dublin\'s most famous Georgian squares, located in the city center. This prestigious location is close to the National Gallery, the Natural History Museum, and many government buildings, making it an ideal location for diplomatic missions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Mexican Embassy located?',
      questionNumber: 21,
      options: [
        { id: 'A', text: 'Elgin Road' },
        { id: 'B', text: 'Clyde Road' },
        { id: 'C', text: 'Leeson Street' },
        { id: 'D', text: 'Raglan Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Mexican Embassy is located on Raglan Road in Ballsbridge, Dublin 4. Raglan Road is a residential street in the prestigious Ballsbridge area, running between Pembroke Road and Anglesea Road. This location is close to the RDS, Herbert Park, and many other embassies, making it part of Dublin\'s diplomatic quarter.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Embassy of Switzerland located?',
      questionNumber: 22,
      options: [
        { id: 'A', text: 'Merlyn Park' },
        { id: 'B', text: 'Shrewsbury Road' },
        { id: 'C', text: 'Merrion Road' },
        { id: 'D', text: 'Ailesbury Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Embassy of Switzerland is located on Ailesbury Road in Ballsbridge, Dublin 4. Ailesbury Road is one of Dublin\'s most prestigious addresses, running through Ballsbridge and Donnybrook. This road is renowned for its diplomatic presence, with many embassies located along its length, and is close to the RDS and Herbert Park.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Russian Embassy located?',
      questionNumber: 23,
      options: [
        { id: 'A', text: 'Churchtown Road Lower' },
        { id: 'B', text: 'Braemor Park' },
        { id: 'C', text: 'Dundrum Road' },
        { id: 'D', text: 'Orwell Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Russian Embassy is located on Orwell Road in Rathgar, Dublin 6. Orwell Road is a residential street in the south Dublin suburb of Rathgar, running between Terenure and Rathgar. This location is in a quieter residential area, away from the main diplomatic quarter, but still easily accessible from the city center.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Croatian Embassy located?',
      questionNumber: 24,
      options: [
        { id: 'A', text: 'Harcourt Street' },
        { id: 'B', text: 'Cook Street' },
        { id: 'C', text: 'Peter Street' },
        { id: 'D', text: 'Brabazon Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The Croatian Embassy is located on Peter Street in Dublin 8. Peter Street is in the south inner city, close to the Liberties area and St. Patrick\'s Cathedral. This location provides easy access to the city center and is in a historic part of Dublin, known for its cultural and historical significance.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Japanese Embassy located?',
      questionNumber: 25,
      options: [
        { id: 'A', text: 'Park Avenue' },
        { id: 'B', text: 'Nutley Lane' },
        { id: 'C', text: 'Ailesbury Drive' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'B',
      explanation: 'The Japanese Embassy is located on Nutley Lane in Donnybrook, Dublin 4. Nutley Lane is a residential street in the Donnybrook area, running between Merrion Road and Stillorgan Road. This location is close to the RDS, UCD (University College Dublin), and is in a prestigious residential area known for its diplomatic presence.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the US Embassy located?',
      questionNumber: 26,
      options: [
        { id: 'A', text: 'Clyde Road' },
        { id: 'B', text: 'Shelbourne Road' },
        { id: 'C', text: 'Elgin Road' },
        { id: 'D', text: 'Anglesea Road' }
      ],
      correctAnswer: 'C',
      explanation: 'The US Embassy is located on Elgin Road in Ballsbridge, Dublin 4. Elgin Road is a residential street in the prestigious Ballsbridge area, running between Merrion Road and Anglesea Road. This location is in the heart of Dublin\'s diplomatic quarter, close to the RDS, Herbert Park, and many other embassies, making it one of the most important diplomatic addresses in Dublin.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is the Spanish Embassy located?',
      questionNumber: 27,
      options: [
        { id: 'A', text: 'Park Avenue' },
        { id: 'B', text: 'Sydney Parade Avenue' },
        { id: 'C', text: 'Merrion Road' },
        { id: 'D', text: 'Merlyn Park' }
      ],
      correctAnswer: 'D',
      explanation: 'The Spanish Embassy is located on Merlyn Park in Ballsbridge, Dublin 4. Merlyn Park is a residential street in the prestigious Ballsbridge area, running between Merrion Road and Anglesea Road. This location is close to the RDS, Herbert Park, and is in the heart of Dublin\'s diplomatic quarter, making it an ideal location for diplomatic missions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Indian Embassy located?',
      questionNumber: 28,
      options: [
        { id: 'A', text: 'Merrion Road' },
        { id: 'B', text: 'Sandymount Avenue' },
        { id: 'C', text: 'Ailesbury Road' },
        { id: 'D', text: 'Leeson Street' }
      ],
      correctAnswer: 'A',
      explanation: 'The Indian Embassy is located on Merrion Road in Ballsbridge, Dublin 4. Merrion Road is a major thoroughfare running from Ballsbridge towards Donnybrook and is one of the most prestigious addresses in Dublin. This road is home to many diplomatic missions and is close to the RDS, Herbert Park, and the Aviva Stadium, making it a prime location for embassies.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Greek Embassy located?',
      questionNumber: 29,
      options: [
        { id: 'A', text: 'Molesworth Street' },
        { id: 'B', text: 'Fitzwilliam Lane' },
        { id: 'C', text: 'Pembroke Street Upper' },
        { id: 'D', text: 'Leeson Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The Greek Embassy is located on Pembroke Street Upper in Dublin 2. Pembroke Street Upper is in the city center, connecting Baggot Street to the Grand Canal area. This location provides easy access to the city center, St. Stephen\'s Green, and is close to many government buildings and diplomatic missions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Bulgarian Embassy located?',
      questionNumber: 30,
      options: [
        { id: 'A', text: 'Earlsfort Terrace' },
        { id: 'B', text: 'Burlington Road' },
        { id: 'C', text: 'Dorset Street' },
        { id: 'D', text: 'Fitzwilliam Square' }
      ],
      correctAnswer: 'B',
      explanation: 'The Bulgarian Embassy is located on Burlington Road in Ballsbridge, Dublin 4. Burlington Road is a major thoroughfare in the Ballsbridge area, running between Ballsbridge and the city center. This location is close to the RDS, the Aviva Stadium, and many other embassies, making it part of Dublin\'s diplomatic quarter.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Norwegian Embassy located?',
      questionNumber: 31,
      options: [
        { id: 'A', text: 'Dawson Street' },
        { id: 'B', text: 'Ailesbury Road' },
        { id: 'C', text: 'Mount Street Lower' },
        { id: 'D', text: 'Kildare Street' }
      ],
      correctAnswer: 'C',
      explanation: 'The Norwegian Embassy is located on Mount Street Lower in Dublin 2. Mount Street Lower is in the city center, connecting Merrion Square to the Grand Canal area. This location provides easy access to the city center, St. Stephen\'s Green, and is close to many government buildings and diplomatic missions, making it an ideal location for embassies.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Hungarian Embassy located?',
      questionNumber: 32,
      options: [
        { id: 'A', text: 'Pembroke Lane' },
        { id: 'B', text: 'Fitzwilliam Place' },
        { id: 'C', text: 'Mespil Road' },
        { id: 'D', text: 'Wilton Terrace' }
      ],
      correctAnswer: 'B',
      explanation: 'The Hungarian Embassy is located on Fitzwilliam Place in Dublin 2. Fitzwilliam Place is part of the prestigious Fitzwilliam Square area in the city center, one of Dublin\'s most famous Georgian squares. This location provides easy access to St. Stephen\'s Green, the National Concert Hall, and is in the heart of Dublin\'s cultural and diplomatic quarter.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Estonian Embassy located?',
      questionNumber: 33,
      options: [
        { id: 'A', text: 'Harcourt Road' },
        { id: 'B', text: 'Nutley Road' },
        { id: 'C', text: 'New Row S' },
        { id: 'D', text: 'Pleasants Street' }
      ],
      correctAnswer: 'A',
      explanation: 'The Estonian Embassy is located on Harcourt Road in Dublin 2. Harcourt Road is a major thoroughfare in the city center, connecting the Grand Canal area to St. Stephen\'s Green. This location provides easy access to the city center, the National Concert Hall, and is close to many government buildings and diplomatic missions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Danish Embassy located?',
      questionNumber: 34,
      options: [
        { id: 'A', text: 'Daniel Street' },
        { id: 'B', text: 'Portobello Road' },
        { id: 'C', text: 'Pleasants Street' },
        { id: 'D', text: 'Harcourt Road' }
      ],
      correctAnswer: 'D',
      explanation: 'The Danish Embassy is located on Harcourt Road in Dublin 2. Harcourt Road is a major thoroughfare in the city center, connecting the Grand Canal area to St. Stephen\'s Green. This location provides easy access to the city center, the National Concert Hall, and is close to many government buildings and diplomatic missions, making it an ideal location for embassies.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the British Embassy located?',
      questionNumber: 35,
      options: [
        { id: 'A', text: 'Merrion Road' },
        { id: 'B', text: 'Ailesbury Road' },
        { id: 'C', text: 'Elgin Road' },
        { id: 'D', text: 'Simmonscourt Road' }
      ],
      correctAnswer: 'A',
      explanation: 'The British Embassy is located on Merrion Road in Ballsbridge, Dublin 4. Merrion Road is a major thoroughfare running from Ballsbridge towards Donnybrook and is one of the most prestigious addresses in Dublin. This road is home to many diplomatic missions and is close to the RDS, Herbert Park, and the Aviva Stadium, making it one of the most important diplomatic addresses in Dublin.',
      points: 1,
      difficulty: 'easy'
    },
    {
      questionText: 'Where is the Georgian Embassy located?',
      questionNumber: 36,
      options: [
        { id: 'A', text: 'Morehampton Road' },
        { id: 'B', text: 'Ailesbury Road' },
        { id: 'C', text: 'Upper Baggot Street' },
        { id: 'D', text: 'Mespil Road' }
      ],
      correctAnswer: 'A',
      explanation: 'The Georgian Embassy is located on Morehampton Road in Donnybrook, Dublin 4. Morehampton Road is a residential street in the Donnybrook area, running between Donnybrook and Ballsbridge. This location is close to the RDS, UCD, and is in a prestigious residential area known for its diplomatic presence.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Canadian Embassy located?',
      questionNumber: 37,
      options: [
        { id: 'A', text: 'Mespil Road' },
        { id: 'B', text: 'Percy Place' },
        { id: 'C', text: 'Leeson Street' },
        { id: 'D', text: 'Wilton Terrace' }
      ],
      correctAnswer: 'D',
      explanation: 'The Canadian Embassy is located on Wilton Terrace in Dublin 2. Wilton Terrace is in the city center, connecting the Grand Canal area to Baggot Street. This location provides easy access to the city center, St. Stephen\'s Green, and is close to many government buildings and diplomatic missions, making it an ideal location for embassies.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the South African Embassy located?',
      questionNumber: 38,
      options: [
        { id: 'A', text: 'Adelaide Road' },
        { id: 'B', text: 'Earlsfort Terrace' },
        { id: 'C', text: 'Leeson Street Upper' },
        { id: 'D', text: 'Harcourt Terrace' }
      ],
      correctAnswer: 'B',
      explanation: 'The South African Embassy is located on Earlsfort Terrace in Dublin 2. Earlsfort Terrace is in the city center, connecting St. Stephen\'s Green to the Grand Canal area. This location is close to the National Concert Hall, St. Stephen\'s Green, and many government buildings, making it an ideal location for diplomatic missions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the German Embassy located?',
      questionNumber: 39,
      options: [
        { id: 'A', text: 'Trimleston Avenue' },
        { id: 'B', text: 'Rock Road' },
        { id: 'C', text: 'Mount Merrion Avenue' },
        { id: 'D', text: 'Booterstown Avenue' }
      ],
      correctAnswer: 'A',
      explanation: 'The German Embassy is located on Trimleston Avenue in Booterstown, County Dublin. Trimleston Avenue is a residential street in the Booterstown area, running between Booterstown and Blackrock. This location is close to the coast, the DART line, and is in a prestigious residential area, making it an ideal location for diplomatic missions.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Embassy of Pakistan located?',
      questionNumber: 40,
      options: [
        { id: 'A', text: 'Ailesbury Road' },
        { id: 'B', text: 'Eglinton Road' },
        { id: 'C', text: 'Anglesea Road' },
        { id: 'D', text: 'Merrion Road' }
      ],
      correctAnswer: 'A',
      explanation: 'The Embassy of Pakistan is located on Ailesbury Road in Ballsbridge, Dublin 4. Ailesbury Road is one of Dublin\'s most prestigious addresses, running through Ballsbridge and Donnybrook. This road is renowned for its diplomatic presence, with many embassies located along its length, and is close to the RDS and Herbert Park, making it one of the most important diplomatic addresses in Dublin.',
      points: 1,
      difficulty: 'medium'
    },
    {
      questionText: 'Where is the Embassy of Cyprus located?',
      questionNumber: 41,
      options: [
        { id: 'A', text: 'Leeson Street Lower' },
        { id: 'B', text: 'Herbert Street' },
        { id: 'C', text: 'Merrion Street Upper' },
        { id: 'D', text: 'Pembroke Row' }
      ],
      correctAnswer: 'A',
      explanation: 'The Embassy of Cyprus is located on Leeson Street Lower in Dublin 2. Leeson Street Lower is part of the main Leeson Street thoroughfare that runs from the city center towards Ballsbridge. This area is known for its mix of commercial and residential properties, is well-connected to the city center, and is close to the Grand Canal, making it an ideal location for diplomatic missions.',
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

  console.log(`✅ Created ${questions.length} questions for Embassies chapter`)
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
