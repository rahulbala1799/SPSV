import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Industry Knowledge Chapters 5, 7, and 8...')

  // Chapter 5: Working as an SPSV Operator
  const chapter5 = await prisma.chapter.upsert({
    where: { id: 'chapter_industry_5' },
    update: {},
    create: {
      id: 'chapter_industry_5',
      title: 'Working as an SPSV Operator',
      description: 'SPSV vehicle licensing, equipment requirements, passenger regulations, and compliance',
      duration: 40,
      chapterNumber: 5,
      type: 'MCQ',
      isActive: true
    }
  })

  console.log('Created Chapter 5: Working as an SPSV Operator')

  // Chapter 5 Questions (42 questions)
  const chapter5Questions = [
    {
      questionText: 'If an SPSV is operated without a valid SPSV vehicle licence, who is legally liable?',
      options: [
        { id: 'A', text: 'The registered owner only' },
        { id: 'B', text: 'The driver operating the vehicle' },
        { id: 'C', text: 'The dispatch operator' },
        { id: 'D', text: 'The National Transport Authority' }
      ],
      correctAnswer: 'B',
      explanation: 'The driver operating the vehicle is legally liable if an SPSV is operated without a valid vehicle licence.'
    },
    {
      questionText: 'Who is responsible for ensuring that the SPSV they are driving complies with all SPSV regulations?',
      options: [
        { id: 'A', text: 'The vehicle owner' },
        { id: 'B', text: 'The dispatch operator' },
        { id: 'C', text: 'The SPSV driver' },
        { id: 'D', text: 'The local authority' }
      ],
      correctAnswer: 'C',
      explanation: 'The SPSV driver is responsible for ensuring their vehicle complies with all SPSV regulations.'
    },
    {
      questionText: 'Which of the following must an SPSV have in order to operate legally?',
      options: [
        { id: 'A', text: 'Taxi meter only' },
        { id: 'B', text: 'Valid and active SPSV vehicle licence' },
        { id: 'C', text: 'Roof sign only' },
        { id: 'D', text: 'Insurance certificate only' }
      ],
      correctAnswer: 'B',
      explanation: 'A valid and active SPSV vehicle licence is required for legal operation of an SPSV.'
    },
    {
      questionText: 'Where must the tamper-proof licence disc be displayed on an SPSV vehicle?',
      options: [
        { id: 'A', text: 'Dashboard' },
        { id: 'B', text: 'Rear window only' },
        { id: 'C', text: 'Front and rear windscreens' },
        { id: 'D', text: 'Driver side window' }
      ],
      correctAnswer: 'C',
      explanation: 'The tamper-proof licence disc must be displayed on both the front and rear windscreens of an SPSV vehicle.'
    },
    {
      questionText: 'What exemption applies to vintage limousines regarding tamper-proof discs?',
      options: [
        { id: 'A', text: 'No exemption applies' },
        { id: 'B', text: 'Exempt if over 20 years old' },
        { id: 'C', text: 'Exempt if over 30 years old from rear windscreen display' },
        { id: 'D', text: 'Exempt only during private hire' }
      ],
      correctAnswer: 'C',
      explanation: 'Vintage limousines over 30 years old are exempt from displaying the tamper-proof disc on the rear windscreen.'
    },
    {
      questionText: 'What must an SPSV passenger NOT do?',
      options: [
        { id: 'A', text: 'Wear a seatbelt' },
        { id: 'B', text: 'Pay by card' },
        { id: 'C', text: 'Carry more passengers than stated on the tamper-proof disc' },
        { id: 'D', text: 'Ask for a receipt' }
      ],
      correctAnswer: 'C',
      explanation: 'Passengers must not exceed the passenger capacity stated on the tamper-proof licence disc.'
    },
    {
      questionText: 'Which equipment must a Taxi or Wheelchair Accessible Taxi have?',
      options: [
        { id: 'A', text: 'Roof sign only' },
        { id: 'B', text: 'Taxi meter, printer, approved branding and regulation roof sign' },
        { id: 'C', text: 'Fire extinguisher only' },
        { id: 'D', text: 'First aid kit only' }
      ],
      correctAnswer: 'B',
      explanation: 'Taxis and Wheelchair Accessible Taxis must have a taxi meter, printer, approved branding, and regulation roof sign.'
    },
    {
      questionText: 'What is the purpose of placing the roof sign lengthwise?',
      options: [
        { id: 'A', text: 'Advertising' },
        { id: 'B', text: 'Fuel efficiency' },
        { id: 'C', text: 'Visibility' },
        { id: 'D', text: 'Fare reduction' }
      ],
      correctAnswer: 'B',
      explanation: 'Placing the roof sign lengthwise improves fuel efficiency by reducing wind resistance.'
    },
    {
      questionText: 'Which group of passengers may a driver lawfully refuse?',
      options: [
        { id: 'A', text: 'Tourists' },
        { id: 'B', text: 'People with luggage' },
        { id: 'C', text: 'Group exceeding vehicle capacity' },
        { id: 'D', text: 'Card-paying passengers' }
      ],
      correctAnswer: 'C',
      explanation: 'A driver may lawfully refuse passengers if the group exceeds the vehicle\'s legal capacity.'
    },
    {
      questionText: 'Which passenger may a driver refuse?',
      options: [
        { id: 'A', text: 'Passenger with guide dog' },
        { id: 'B', text: 'Passenger refusing to extinguish a cigarette' },
        { id: 'C', text: 'Passenger paying cash' },
        { id: 'D', text: 'Passenger requesting receipt' }
      ],
      correctAnswer: 'B',
      explanation: 'A driver may refuse a passenger who refuses to extinguish a cigarette, as smoking is prohibited in SPSVs.'
    },
    {
      questionText: 'Who issues on-the-spot fines for SPSV offences?',
      options: [
        { id: 'A', text: 'Gardaí' },
        { id: 'B', text: 'Local Authority' },
        { id: 'C', text: 'Compliance Officer' },
        { id: 'D', text: 'NTA Director' }
      ],
      correctAnswer: 'C',
      explanation: 'Compliance Officers are authorized to issue on-the-spot fines for SPSV offences.'
    },
    {
      questionText: 'What are fixed payment offences?',
      options: [
        { id: 'A', text: 'Verbal warnings' },
        { id: 'B', text: 'On-the-spot fines' },
        { id: 'C', text: 'Court summons only' },
        { id: 'D', text: 'Licence suspensions' }
      ],
      correctAnswer: 'B',
      explanation: 'Fixed payment offences are on-the-spot fines that can be paid immediately to avoid court proceedings.'
    },
    {
      questionText: 'What should you expect when approached by a compliance officer?',
      options: [
        { id: 'A', text: 'Immediate fine' },
        { id: 'B', text: 'Rude behaviour' },
        { id: 'C', text: 'Identification, professionalism and vehicle checks' },
        { id: 'D', text: 'Vehicle seizure' }
      ],
      correctAnswer: 'C',
      explanation: 'Compliance officers should identify themselves, act professionally, and conduct proper vehicle checks.'
    },
    {
      questionText: 'Who must notify NTA or An Garda Síochána of a change of address?',
      options: [
        { id: 'A', text: 'Vehicle owner' },
        { id: 'B', text: 'Dispatch operator' },
        { id: 'C', text: 'SPSV driver' },
        { id: 'D', text: 'Local Authority' }
      ],
      correctAnswer: 'C',
      explanation: 'SPSV drivers must notify the NTA or An Garda Síochána of any change of address.'
    },
    {
      questionText: 'How many demerits result in disqualification over a three-month period?',
      options: [
        { id: 'A', text: '5' },
        { id: 'B', text: '6' },
        { id: 'C', text: '8' },
        { id: 'D', text: '10' }
      ],
      correctAnswer: 'C',
      explanation: 'Accumulating 8 demerits over a three-month period results in disqualification from operating an SPSV.'
    },
    {
      questionText: 'What additional penalty may be imposed alongside monetary penalties?',
      options: [
        { id: 'A', text: 'Suspension only' },
        { id: 'B', text: 'Demerits' },
        { id: 'C', text: 'Warning letter' },
        { id: 'D', text: 'Extra inspection' }
      ],
      correctAnswer: 'B',
      explanation: 'Demerits may be imposed alongside monetary penalties as an additional disciplinary measure.'
    },
    {
      questionText: 'Within how many days must a taximeter be reprogrammed after a fare change?',
      options: [
        { id: 'A', text: '30 days' },
        { id: 'B', text: '60 days' },
        { id: 'C', text: '90 days' },
        { id: 'D', text: '120 days' }
      ],
      correctAnswer: 'C',
      explanation: 'Taximeters must be reprogrammed within 90 days after a fare change comes into effect.'
    }
  ]

  // Add remaining Chapter 5 questions (18 more to reach 42)
  // For now, I'll add placeholder questions that need to be filled with actual content
  for (let i = chapter5Questions.length; i < 42; i++) {
    chapter5Questions.push({
      questionText: `Chapter 5 Question ${i + 1}: Working as an SPSV Operator - This question needs to be completed with actual content from the PDF.`,
      options: [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' },
        { id: 'C', text: 'Option C' },
        { id: 'D', text: 'Option D' }
      ],
      correctAnswer: 'C',
      explanation: 'This is a placeholder question that needs to be replaced with actual content.'
    })
  }

  // Create questions for Chapter 5
  for (let i = 0; i < chapter5Questions.length; i++) {
    const q = chapter5Questions[i]
    const questionNumber = i + 1
    
    await prisma.question.upsert({
      where: {
        chapterId_questionNumber: {
          chapterId: chapter5.id,
          questionNumber: questionNumber
        }
      },
      update: {
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: 1,
        difficulty: 'medium'
      },
      create: {
        chapterId: chapter5.id,
        questionText: q.questionText,
        questionNumber: questionNumber,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: 1,
        difficulty: 'medium'
      }
    })
  }

  console.log(`Created ${chapter5Questions.length} questions for Chapter 5`)

  // Chapter 7: Taximeter Fares
  const chapter7 = await prisma.chapter.upsert({
    where: { id: 'chapter_industry_7' },
    update: {},
    create: {
      id: 'chapter_industry_7',
      title: 'Taximeter Fares',
      description: 'National Maximum Taxi Fare, tariff rates, booking fees, and fare regulations',
      duration: 30,
      chapterNumber: 7,
      type: 'MCQ',
      isActive: true
    }
  })

  console.log('Created Chapter 7: Taximeter Fares')

  // Chapter 7 Questions (22 questions)
  const chapter7Questions = [
    {
      questionText: 'In what year was Ireland designated as a single national taximeter area?',
      options: [
        { id: 'A', text: '2004' },
        { id: 'B', text: '2005' },
        { id: 'C', text: '2006' },
        { id: 'D', text: '2008' }
      ],
      correctAnswer: 'C',
      explanation: 'Ireland was designated as a single national taximeter area in 2006.'
    },
    {
      questionText: 'On what date did the most recent National Maximum Taxi Fare come into effect?',
      options: [
        { id: 'A', text: '1 January 2022' },
        { id: 'B', text: '1 September 2022' },
        { id: 'C', text: '1 July 2023' },
        { id: 'D', text: '1 March 2021' }
      ],
      correctAnswer: 'B',
      explanation: 'The most recent National Maximum Taxi Fare came into effect on 1 September 2022.'
    },
    {
      questionText: 'When should a taxi driver start the taximeter when picking up a passenger from the street?',
      options: [
        { id: 'A', text: 'After luggage is loaded' },
        { id: 'B', text: 'When agreeing to take the passenger' },
        { id: 'C', text: 'After the journey starts' },
        { id: 'D', text: 'When the vehicle moves' }
      ],
      correctAnswer: 'B',
      explanation: 'The taximeter should be started when the driver agrees to take the passenger, not when the journey begins.'
    },
    {
      questionText: 'When should the taximeter be started for a pre-booked journey?',
      options: [
        { id: 'A', text: 'When vehicle arrives' },
        { id: 'B', text: 'At agreed time and place' },
        { id: 'C', text: 'When passenger enters' },
        { id: 'D', text: 'After 5 minutes' }
      ],
      correctAnswer: 'B',
      explanation: 'For pre-booked journeys, the taximeter should be started at the agreed time and place.'
    },
    {
      questionText: 'What is the taximeter changeover speed between distance and time charging?',
      options: [
        { id: 'A', text: '18 km/h' },
        { id: 'B', text: '20 km/h' },
        { id: 'C', text: '21.2 km/h' },
        { id: 'D', text: '25 km/h' }
      ],
      correctAnswer: 'C',
      explanation: 'The taximeter switches from distance to time charging at 21.2 km/h.'
    },
    {
      questionText: 'What is the standard initial charge based on distance or time?',
      options: [
        { id: 'A', text: '300m or 60 sec' },
        { id: 'B', text: '400m or 75 sec' },
        { id: 'C', text: '500m or 85 sec' },
        { id: 'D', text: '600m or 90 sec' }
      ],
      correctAnswer: 'C',
      explanation: 'The standard initial charge is based on 500m distance or 85 seconds of time.'
    },
    {
      questionText: 'For how long does Tariff A apply?',
      options: [
        { id: 'A', text: '10 km or 30 min' },
        { id: 'B', text: '12 km or 35 min' },
        { id: 'C', text: '14.5 km or 42 min' },
        { id: 'D', text: '15 km or 45 min' }
      ],
      correctAnswer: 'C',
      explanation: 'Tariff A applies for the first 14.5 km or 42 minutes of the journey.'
    },
    {
      questionText: 'When does Tariff B begin?',
      options: [
        { id: 'A', text: 'After 12 km' },
        { id: 'B', text: 'After 14.5 km' },
        { id: 'C', text: 'After 15 km or 43 min' },
        { id: 'D', text: 'After 20 km' }
      ],
      correctAnswer: 'C',
      explanation: 'Tariff B begins after 15 km or 43 minutes of journey time.'
    },
    {
      questionText: 'What is the standard booking fee for picking up a passenger?',
      options: [
        { id: 'A', text: '€1' },
        { id: 'B', text: '€2' },
        { id: 'C', text: '€3' },
        { id: 'D', text: '€5' }
      ],
      correctAnswer: 'B',
      explanation: 'The standard booking fee for picking up a passenger is €2.'
    },
    {
      questionText: 'What additional charge applies per extra passenger?',
      options: [
        { id: 'A', text: 'No charge' },
        { id: 'B', text: '€0.50' },
        { id: 'C', text: '€1' },
        { id: 'D', text: '€2' }
      ],
      correctAnswer: 'C',
      explanation: 'An additional charge of €1 applies for each extra passenger beyond the standard capacity.'
    },
    {
      questionText: 'At what speed does the taximeter switch from distance to time charging?',
      options: [
        { id: 'A', text: '15 km/h' },
        { id: 'B', text: '18 km/h' },
        { id: 'C', text: '20 km/h' },
        { id: 'D', text: '21.2 km/h' }
      ],
      correctAnswer: 'D',
      explanation: 'The taximeter switches from distance to time charging at 21.2 km/h.'
    },
    {
      questionText: 'When does the standard rate apply?',
      options: [
        { id: 'A', text: '24 hours' },
        { id: 'B', text: '8am–8pm Mon–Sun' },
        { id: 'C', text: '8am–8pm Mon–Sat' },
        { id: 'D', text: '9am–5pm Mon–Fri' }
      ],
      correctAnswer: 'C',
      explanation: 'The standard rate applies from 8am to 8pm, Monday to Saturday.'
    },
    {
      questionText: 'When does the premium rate apply?',
      options: [
        { id: 'A', text: 'Weekends only' },
        { id: 'B', text: '8pm–8am daily, Sundays and Bank Holidays' },
        { id: 'C', text: 'Bank Holidays only' },
        { id: 'D', text: 'Night time only' }
      ],
      correctAnswer: 'B',
      explanation: 'The premium rate applies from 8pm to 8am daily, and all day on Sundays and Bank Holidays.'
    },
    {
      questionText: 'When does the special premium rate apply?',
      options: [
        { id: 'A', text: 'Christmas Eve only' },
        { id: 'B', text: '24–26 Dec and 31 Dec–1 Jan (8pm–8am)' },
        { id: 'C', text: 'All December' },
        { id: 'D', text: 'New Year\'s Eve only' }
      ],
      correctAnswer: 'B',
      explanation: 'The special premium rate applies from 8pm to 8am on 24–26 December and 31 December–1 January.'
    },
    {
      questionText: 'What is the standard initial charge?',
      options: [
        { id: 'A', text: '€3.80' },
        { id: 'B', text: '€4.00' },
        { id: 'C', text: '€4.20' },
        { id: 'D', text: '€4.50' }
      ],
      correctAnswer: 'C',
      explanation: 'The standard initial charge is €4.20.'
    },
    {
      questionText: 'What is the premium initial charge?',
      options: [
        { id: 'A', text: '€4.20' },
        { id: 'B', text: '€4.50' },
        { id: 'C', text: '€4.80' },
        { id: 'D', text: '€5.00' }
      ],
      correctAnswer: 'C',
      explanation: 'The premium initial charge is €4.80.'
    },
    {
      questionText: 'What is the fixed charge for soiling the vehicle?',
      options: [
        { id: 'A', text: '€100' },
        { id: 'B', text: '€120' },
        { id: 'C', text: '€140' },
        { id: 'D', text: '€160' }
      ],
      correctAnswer: 'C',
      explanation: 'The fixed charge for soiling the vehicle is €140.'
    },
    {
      questionText: 'Where must the fare sticker or information card be displayed?',
      options: [
        { id: 'A', text: 'Rear window' },
        { id: 'B', text: 'Driver door' },
        { id: 'C', text: 'Front passenger area or sun visor' },
        { id: 'D', text: 'Dashboard' }
      ],
      correctAnswer: 'C',
      explanation: 'The fare sticker or information card must be displayed in the front passenger area or on the sun visor.'
    },
    {
      questionText: 'Where must the In-Vehicle Information Card be displayed?',
      options: [
        { id: 'A', text: 'Boot area' },
        { id: 'B', text: 'Rear seat' },
        { id: 'C', text: 'Clear view of customer' },
        { id: 'D', text: 'Glove box' }
      ],
      correctAnswer: 'C',
      explanation: 'The In-Vehicle Information Card must be displayed in a clear view of the customer.'
    },
    {
      questionText: 'Who is responsible for paying toll charges?',
      options: [
        { id: 'A', text: 'Driver' },
        { id: 'B', text: 'Operator' },
        { id: 'C', text: 'Dispatch' },
        { id: 'D', text: 'Customer' }
      ],
      correctAnswer: 'D',
      explanation: 'The customer is responsible for paying toll charges incurred during their journey.'
    },
    {
      questionText: 'What charge applies for one child under 12 years of age?',
      options: [
        { id: 'A', text: '€1' },
        { id: 'B', text: '€2' },
        { id: 'C', text: '€3' },
        { id: 'D', text: 'No charge' }
      ],
      correctAnswer: 'D',
      explanation: 'No charge applies for one child under 12 years of age.'
    },
    {
      questionText: 'What is the difference between Hackney and Limousine receipts?',
      options: [
        { id: 'A', text: 'Both show kilometres' },
        { id: 'B', text: 'Only Hackney shows kilometres' },
        { id: 'C', text: 'Only Limousine shows kilometres' },
        { id: 'D', text: 'Neither shows kilometres' }
      ],
      correctAnswer: 'B',
      explanation: 'Only Hackney receipts show kilometres travelled, while Limousine receipts do not.'
    }
  ]

  // Create questions for Chapter 7
  for (let i = 0; i < chapter7Questions.length; i++) {
    const q = chapter7Questions[i]
    const questionNumber = i + 1
    
    await prisma.question.upsert({
      where: {
        chapterId_questionNumber: {
          chapterId: chapter7.id,
          questionNumber: questionNumber
        }
      },
      update: {
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: 1,
        difficulty: 'medium'
      },
      create: {
        chapterId: chapter7.id,
        questionText: q.questionText,
        questionNumber: questionNumber,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: 1,
        difficulty: 'medium'
      }
    })
  }

  console.log(`Created ${chapter7Questions.length} questions for Chapter 7`)

  // Chapter 8: Delivering Customer Satisfaction
  const chapter8 = await prisma.chapter.upsert({
    where: { id: 'chapter_industry_8' },
    update: {},
    create: {
      id: 'chapter_industry_8',
      title: 'Delivering Customer Satisfaction',
      description: 'Customer service standards, fare regulations, complaint procedures, and passenger rights',
      duration: 45,
      chapterNumber: 8,
      type: 'MCQ',
      isActive: true
    }
  })

  console.log('Created Chapter 8: Delivering Customer Satisfaction')

  // Chapter 8 Questions (46 questions - first 5 are real, rest are placeholders)
  const chapter8Questions = [
    {
      questionText: 'What is the main impact of providing good customer service as an SPSV driver?',
      options: [
        { id: 'A', text: 'Higher fuel efficiency' },
        { id: 'B', text: 'Repeat business and customer loyalty' },
        { id: 'C', text: 'Lower licence fees' },
        { id: 'D', text: 'Shorter journeys' }
      ],
      correctAnswer: 'B',
      explanation: 'Good customer service leads to repeat business and customer loyalty, which is essential for a successful SPSV operation.'
    },
    {
      questionText: 'What fare may an SPSV driver legally charge a customer?',
      options: [
        { id: 'A', text: 'Any agreed fare' },
        { id: 'B', text: 'Estimated fare' },
        { id: 'C', text: 'Metered fare not exceeding the National Maximum Taxi Fare' },
        { id: 'D', text: 'Flat night fare' }
      ],
      correctAnswer: 'C',
      explanation: 'SPSV drivers may only charge a metered fare that does not exceed the National Maximum Taxi Fare.'
    },
    {
      questionText: 'May an SPSV driver charge extra for carrying guide dogs or assistance dogs?',
      options: [
        { id: 'A', text: 'Yes, at peak times' },
        { id: 'B', text: 'Yes, with customer consent' },
        { id: 'C', text: 'Only for long journeys' },
        { id: 'D', text: 'No' }
      ],
      correctAnswer: 'D',
      explanation: 'SPSV drivers may not charge extra for carrying guide dogs or assistance dogs under any circumstances.'
    },
    {
      questionText: 'What must customers comply with when using an SPSV?',
      options: [
        { id: 'A', text: 'Driver\'s personal rules' },
        { id: 'B', text: 'Any reasonable request made by the driver' },
        { id: 'C', text: 'Vehicle owner instructions' },
        { id: 'D', text: 'Company policy only' }
      ],
      correctAnswer: 'B',
      explanation: 'Customers must comply with any reasonable request made by the driver when using an SPSV.'
    },
    {
      questionText: 'How can a customer make a complaint about an SPSV service?',
      options: [
        { id: 'A', text: 'Through Gardaí' },
        { id: 'B', text: 'Through local authority' },
        { id: 'C', text: 'Via the National Transport Authority website' },
        { id: 'D', text: 'Through the taximeter provider' }
      ],
      correctAnswer: 'C',
      explanation: 'Customers can make complaints about SPSV services via the National Transport Authority website.'
    }
  ]

  // Add remaining Chapter 8 questions (41 more to reach 46)
  // These are placeholders that need actual content from the PDF
  for (let i = chapter8Questions.length; i < 46; i++) {
    chapter8Questions.push({
      questionText: `Chapter 8 Question ${i + 1}: Delivering Customer Satisfaction - This question needs to be completed with actual content from the PDF.`,
      options: [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' },
        { id: 'C', text: 'Option C' },
        { id: 'D', text: 'Option D' }
      ],
      correctAnswer: 'C',
      explanation: 'This is a placeholder question that needs to be replaced with actual content.'
    })
  }

  // Create questions for Chapter 8
  for (let i = 0; i < chapter8Questions.length; i++) {
    const q = chapter8Questions[i]
    const questionNumber = i + 1
    
    await prisma.question.upsert({
      where: {
        chapterId_questionNumber: {
          chapterId: chapter8.id,
          questionNumber: questionNumber
        }
      },
      update: {
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: 1,
        difficulty: 'medium'
      },
      create: {
        chapterId: chapter8.id,
        questionText: q.questionText,
        questionNumber: questionNumber,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: 1,
        difficulty: 'medium'
      }
    })
  }

  console.log(`Created ${chapter8Questions.length} questions for Chapter 8`)
  console.log('Seed completed successfully!')
  console.log('\nNOTE: Some questions are placeholders and need to be filled with actual content from the PDFs.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
