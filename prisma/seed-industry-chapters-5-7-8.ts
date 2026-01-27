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

  // Add remaining Chapter 5 questions (25 more to reach 42)
  const additionalChapter5Questions = [
    {
      questionText: 'What information must be displayed on the tamper-proof licence disc?',
      options: [
        { id: 'A', text: 'Driver name only' },
        { id: 'B', text: 'Vehicle registration and passenger capacity' },
        { id: 'C', text: 'Fare rates only' },
        { id: 'D', text: 'Insurance details' }
      ],
      correctAnswer: 'B',
      explanation: 'The tamper-proof licence disc must display the vehicle registration number and passenger capacity.'
    },
    {
      questionText: 'When must an SPSV driver carry their SPSV driver licence?',
      options: [
        { id: 'A', text: 'Only during night shifts' },
        { id: 'B', text: 'At all times when operating an SPSV' },
        { id: 'C', text: 'Only when requested by Gardaí' },
        { id: 'D', text: 'Only during inspections' }
      ],
      correctAnswer: 'B',
      explanation: 'SPSV drivers must carry their SPSV driver licence at all times when operating an SPSV.'
    },
    {
      questionText: 'What is the maximum age limit for an SPSV vehicle?',
      options: [
        { id: 'A', text: '10 years' },
        { id: 'B', text: '15 years' },
        { id: 'C', text: 'No maximum age limit' },
        { id: 'D', text: '20 years' }
      ],
      correctAnswer: 'C',
      explanation: 'There is no maximum age limit for SPSV vehicles, provided they meet all safety and compliance requirements.'
    },
    {
      questionText: 'What must a driver do if their SPSV vehicle licence is lost or stolen?',
      options: [
        { id: 'A', text: 'Continue operating and report later' },
        { id: 'B', text: 'Immediately notify NTA and apply for replacement' },
        { id: 'C', text: 'Wait for renewal' },
        { id: 'D', text: 'Use a photocopy' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers must immediately notify the NTA if their SPSV vehicle licence is lost or stolen and apply for a replacement.'
    },
    {
      questionText: 'What is required for a vehicle to be used as a Wheelchair Accessible Taxi?',
      options: [
        { id: 'A', text: 'Larger engine' },
        { id: 'B', text: 'Approved wheelchair accessibility modifications and certification' },
        { id: 'C', text: 'Extra insurance only' },
        { id: 'D', text: 'Special paint colour' }
      ],
      correctAnswer: 'B',
      explanation: 'A Wheelchair Accessible Taxi must have approved wheelchair accessibility modifications and proper certification.'
    },
    {
      questionText: 'Can an SPSV driver refuse to carry a passenger with a disability?',
      options: [
        { id: 'A', text: 'Yes, if it is inconvenient' },
        { id: 'B', text: 'Yes, if the vehicle is not wheelchair accessible' },
        { id: 'C', text: 'No, unless the vehicle is not suitable for the specific disability' },
        { id: 'D', text: 'Yes, at driver\'s discretion' }
      ],
      correctAnswer: 'C',
      explanation: 'SPSV drivers cannot refuse passengers with disabilities unless the vehicle is genuinely not suitable for the specific disability.'
    },
    {
      questionText: 'What must be displayed on a Hackney vehicle?',
      options: [
        { id: 'A', text: 'Taxi meter' },
        { id: 'B', text: 'Roof sign' },
        { id: 'C', text: 'Hackney plate and approved branding' },
        { id: 'D', text: 'Fare display only' }
      ],
      correctAnswer: 'C',
      explanation: 'Hackney vehicles must display a Hackney plate and approved branding, but not a roof sign or taxi meter.'
    },
    {
      questionText: 'What is the penalty for operating an SPSV without a valid licence?',
      options: [
        { id: 'A', text: 'Warning only' },
        { id: 'B', text: 'Fine and possible prosecution' },
        { id: 'C', text: 'Vehicle impoundment only' },
        { id: 'D', text: 'No penalty' }
      ],
      correctAnswer: 'B',
      explanation: 'Operating an SPSV without a valid licence can result in fines and possible prosecution.'
    },
    {
      questionText: 'How often must an SPSV vehicle undergo inspection?',
      options: [
        { id: 'A', text: 'Every 6 months' },
        { id: 'B', text: 'Annually' },
        { id: 'C', text: 'Every 2 years' },
        { id: 'D', text: 'Only when requested' }
      ],
      correctAnswer: 'B',
      explanation: 'SPSV vehicles must undergo annual inspections to ensure they meet all safety and compliance standards.'
    },
    {
      questionText: 'What must a driver do if they change their address?',
      options: [
        { id: 'A', text: 'Notify within 30 days' },
        { id: 'B', text: 'Notify NTA or Gardaí within 14 days' },
        { id: 'C', text: 'Wait until licence renewal' },
        { id: 'D', text: 'No notification required' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers must notify the NTA or An Garda Síochána within 14 days of changing their address.'
    },
    {
      questionText: 'Can an SPSV driver operate in any area of Ireland?',
      options: [
        { id: 'A', text: 'Yes, anywhere in Ireland' },
        { id: 'B', text: 'Only in their local authority area' },
        { id: 'C', text: 'Only in Dublin' },
        { id: 'D', text: 'Only in urban areas' }
      ],
      correctAnswer: 'A',
      explanation: 'SPSV drivers with a valid licence can operate anywhere in Ireland, as it is a national licensing system.'
    },
    {
      questionText: 'What must be done if an SPSV vehicle is involved in an accident?',
      options: [
        { id: 'A', text: 'Continue operating if minor' },
        { id: 'B', text: 'Report to NTA and ensure vehicle is roadworthy before continuing' },
        { id: 'C', text: 'Only report to insurance' },
        { id: 'D', text: 'No action required' }
      ],
      correctAnswer: 'B',
      explanation: 'If an SPSV is involved in an accident, the driver must report to the NTA and ensure the vehicle is roadworthy before continuing operations.'
    },
    {
      questionText: 'What is the minimum insurance requirement for an SPSV?',
      options: [
        { id: 'A', text: 'Third party only' },
        { id: 'B', text: 'Comprehensive insurance with public liability' },
        { id: 'C', text: 'No special requirement' },
        { id: 'D', text: 'Fire and theft only' }
      ],
      correctAnswer: 'B',
      explanation: 'SPSV vehicles must have comprehensive insurance with adequate public liability coverage.'
    },
    {
      questionText: 'Can a driver operate an SPSV if their driver licence is suspended?',
      options: [
        { id: 'A', text: 'Yes, if SPSV licence is valid' },
        { id: 'B', text: 'No, they cannot operate until suspension is lifted' },
        { id: 'C', text: 'Only during emergencies' },
        { id: 'D', text: 'Only with special permission' }
      ],
      correctAnswer: 'B',
      explanation: 'A driver cannot operate an SPSV if their driver licence is suspended, regardless of SPSV licence status.'
    },
    {
      questionText: 'What must be displayed in a Limousine vehicle?',
      options: [
        { id: 'A', text: 'Taxi meter' },
        { id: 'B', text: 'Roof sign' },
        { id: 'C', text: 'Limousine plate and approved branding' },
        { id: 'D', text: 'Fare display' }
      ],
      correctAnswer: 'C',
      explanation: 'Limousine vehicles must display a Limousine plate and approved branding, but not a roof sign or taxi meter.'
    },
    {
      questionText: 'What happens if a driver accumulates demerits?',
      options: [
        { id: 'A', text: 'Nothing' },
        { id: 'B', text: 'Warning letter only' },
        { id: 'C', text: 'Possible suspension or disqualification if threshold is reached' },
        { id: 'D', text: 'Fine only' }
      ],
      correctAnswer: 'C',
      explanation: 'Accumulating demerits can lead to suspension or disqualification if the threshold (8 demerits in 3 months) is reached.'
    },
    {
      questionText: 'Can an SPSV driver refuse a fare based on destination?',
      options: [
        { id: 'A', text: 'Yes, for any destination' },
        { id: 'B', text: 'Yes, if outside their area' },
        { id: 'C', text: 'No, unless there is a valid safety concern' },
        { id: 'D', text: 'Yes, if fare is too low' }
      ],
      correctAnswer: 'C',
      explanation: 'SPSV drivers cannot refuse fares based on destination unless there is a genuine safety concern.'
    },
    {
      questionText: 'What must a driver do if their vehicle fails an inspection?',
      options: [
        { id: 'A', text: 'Continue operating' },
        { id: 'B', text: 'Stop operating until defects are rectified and vehicle passes inspection' },
        { id: 'C', text: 'Only fix major issues' },
        { id: 'D', text: 'Get a second opinion' }
      ],
      correctAnswer: 'B',
      explanation: 'If a vehicle fails inspection, the driver must stop operating until all defects are rectified and the vehicle passes inspection.'
    },
    {
      questionText: 'What is the requirement for vehicle branding on an SPSV?',
      options: [
        { id: 'A', text: 'No branding required' },
        { id: 'B', text: 'Approved branding must be displayed as per NTA regulations' },
        { id: 'C', text: 'Any branding is acceptable' },
        { id: 'D', text: 'Branding optional' }
      ],
      correctAnswer: 'B',
      explanation: 'SPSV vehicles must display approved branding as specified by NTA regulations.'
    },
    {
      questionText: 'Can a driver operate multiple SPSV vehicles?',
      options: [
        { id: 'A', text: 'Yes, unlimited vehicles' },
        { id: 'B', text: 'Yes, but each vehicle must have its own valid licence' },
        { id: 'C', text: 'No, only one vehicle' },
        { id: 'D', text: 'Only with special permission' }
      ],
      correctAnswer: 'B',
      explanation: 'A driver can operate multiple SPSV vehicles, but each vehicle must have its own valid SPSV vehicle licence.'
    },
    {
      questionText: 'What must be done if an SPSV vehicle is sold?',
      options: [
        { id: 'A', text: 'Transfer licence automatically' },
        { id: 'B', text: 'Notify NTA and new owner must apply for new licence' },
        { id: 'C', text: 'No action required' },
        { id: 'D', text: 'Only notify insurance' }
      ],
      correctAnswer: 'B',
      explanation: 'If an SPSV vehicle is sold, the NTA must be notified and the new owner must apply for a new SPSV vehicle licence.'
    },
    {
      questionText: 'What is the requirement for vehicle cleanliness?',
      options: [
        { id: 'A', text: 'Clean when convenient' },
        { id: 'B', text: 'Vehicle must be maintained in clean and presentable condition' },
        { id: 'C', text: 'No specific requirement' },
        { id: 'D', text: 'Clean only for inspections' }
      ],
      correctAnswer: 'B',
      explanation: 'SPSV vehicles must be maintained in a clean and presentable condition at all times.'
    },
    {
      questionText: 'Can a driver operate an SPSV if they have been convicted of certain offences?',
      options: [
        { id: 'A', text: 'Yes, always' },
        { id: 'B', text: 'No, certain convictions disqualify from holding an SPSV licence' },
        { id: 'C', text: 'Only minor offences allowed' },
        { id: 'D', text: 'Depends on the area' }
      ],
      correctAnswer: 'B',
      explanation: 'Certain convictions, particularly serious criminal offences, can disqualify a person from holding an SPSV licence.'
    },
    {
      questionText: 'What must a driver do if they are involved in a complaint?',
      options: [
        { id: 'A', text: 'Ignore it' },
        { id: 'B', text: 'Cooperate with NTA investigation and provide accurate information' },
        { id: 'C', text: 'Only respond if required by court' },
        { id: 'D', text: 'Deny all allegations' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers must cooperate with NTA investigations into complaints and provide accurate information.'
    },
    {
      questionText: 'What is the requirement for vehicle maintenance records?',
      options: [
        { id: 'A', text: 'No records required' },
        { id: 'B', text: 'Maintain records of servicing and repairs as required' },
        { id: 'C', text: 'Records only for major repairs' },
        { id: 'D', text: 'Optional records' }
      ],
      correctAnswer: 'B',
      explanation: 'SPSV operators should maintain records of vehicle servicing and repairs as required for compliance and safety.'
    }
  ]

  // Add the additional questions to Chapter 5
  chapter5Questions.push(...additionalChapter5Questions)

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
  const additionalChapter8Questions = [
    {
      questionText: 'What should an SPSV driver do to ensure customer satisfaction?',
      options: [
        { id: 'A', text: 'Charge extra fees' },
        { id: 'B', text: 'Be polite, professional, and provide a safe, comfortable journey' },
        { id: 'C', text: 'Take the shortest route always' },
        { id: 'D', text: 'Only accept cash payments' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should be polite, professional, and provide a safe, comfortable journey to ensure customer satisfaction.'
    },
    {
      questionText: 'What is the driver\'s responsibility regarding vehicle temperature?',
      options: [
        { id: 'A', text: 'No responsibility' },
        { id: 'B', text: 'Maintain comfortable temperature for passengers' },
        { id: 'C', text: 'Keep it cold always' },
        { id: 'D', text: 'Passenger preference not important' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should maintain a comfortable temperature in the vehicle for passenger comfort.'
    },
    {
      questionText: 'How should a driver handle a customer complaint during a journey?',
      options: [
        { id: 'A', text: 'Ignore it' },
        { id: 'B', text: 'Listen politely, address concerns if possible, and provide NTA contact information' },
        { id: 'C', text: 'Argue with the customer' },
        { id: 'D', text: 'End the journey immediately' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should listen politely to complaints, address concerns if possible, and provide NTA contact information for formal complaints.'
    },
    {
      questionText: 'What should a driver do if a passenger appears unwell?',
      options: [
        { id: 'A', text: 'Continue the journey' },
        { id: 'B', text: 'Offer assistance and contact emergency services if necessary' },
        { id: 'C', text: 'Refuse the passenger' },
        { id: 'D', text: 'Charge extra' }
      ],
      correctAnswer: 'B',
      explanation: 'If a passenger appears unwell, drivers should offer assistance and contact emergency services if the situation requires it.'
    },
    {
      questionText: 'What is the driver\'s obligation regarding route selection?',
      options: [
        { id: 'A', text: 'Always take the longest route' },
        { id: 'B', text: 'Take the most direct or customer-preferred route' },
        { id: 'C', text: 'Take any route' },
        { id: 'D', text: 'Avoid main roads' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should take the most direct route or the route preferred by the customer, unless there are valid reasons (traffic, road closures) to take an alternative.'
    },
    {
      questionText: 'How should a driver handle luggage?',
      options: [
        { id: 'A', text: 'Charge extra for all luggage' },
        { id: 'B', text: 'Assist with loading and unloading luggage when appropriate' },
        { id: 'C', text: 'Refuse large luggage' },
        { id: 'D', text: 'Ignore luggage' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should assist passengers with loading and unloading luggage when appropriate, as part of good customer service.'
    },
    {
      questionText: 'What should a driver do if running late for a pre-booked journey?',
      options: [
        { id: 'A', text: 'No action needed' },
        { id: 'B', text: 'Contact the customer to inform them and provide updated arrival time' },
        { id: 'C', text: 'Cancel the booking' },
        { id: 'D', text: 'Charge extra for delay' }
      ],
      correctAnswer: 'B',
      explanation: 'If running late for a pre-booked journey, drivers should contact the customer to inform them and provide an updated arrival time.'
    },
    {
      questionText: 'What is the driver\'s responsibility regarding receipt provision?',
      options: [
        { id: 'A', text: 'Only if requested' },
        { id: 'B', text: 'Provide receipt when requested or for card payments' },
        { id: 'C', text: 'Never provide receipts' },
        { id: 'D', text: 'Charge extra for receipt' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should provide receipts when requested by customers or automatically for card payments.'
    },
    {
      questionText: 'How should a driver handle a passenger who is intoxicated?',
      options: [
        { id: 'A', text: 'Refuse immediately' },
        { id: 'B', text: 'Assess situation, ensure safety, and may refuse if passenger is disruptive or poses safety risk' },
        { id: 'C', text: 'Charge extra' },
        { id: 'D', text: 'Always accept' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should assess the situation, ensure safety, and may refuse service if an intoxicated passenger is disruptive or poses a safety risk.'
    },
    {
      questionText: 'What should a driver do if a passenger leaves belongings in the vehicle?',
      options: [
        { id: 'A', text: 'Keep them' },
        { id: 'B', text: 'Report to NTA or Gardaí and attempt to return if possible' },
        { id: 'C', text: 'Dispose of them' },
        { id: 'D', text: 'No action needed' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should report lost property to the NTA or Gardaí and attempt to return items to passengers when possible.'
    },
    {
      questionText: 'What is the driver\'s obligation regarding music or radio volume?',
      options: [
        { id: 'A', text: 'Play loud music always' },
        { id: 'B', text: 'Adjust volume to passenger preference or keep at reasonable level' },
        { id: 'C', text: 'No music allowed' },
        { id: 'D', text: 'Driver choice only' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should adjust music or radio volume to passenger preference or keep it at a reasonable, non-intrusive level.'
    },
    {
      questionText: 'How should a driver handle payment disputes?',
      options: [
        { id: 'A', text: 'Argue with customer' },
        { id: 'B', text: 'Remain calm, explain fare calculation, and provide receipt. If dispute continues, provide NTA contact information' },
        { id: 'C', text: 'Refuse payment' },
        { id: 'D', text: 'Call Gardaí immediately' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should remain calm during payment disputes, explain fare calculation, provide receipt, and give NTA contact information if needed.'
    },
    {
      questionText: 'What should a driver do if a passenger requests a specific route?',
      options: [
        { id: 'A', text: 'Refuse always' },
        { id: 'B', text: 'Accommodate reasonable route requests when possible' },
        { id: 'C', text: 'Charge extra' },
        { id: 'D', text: 'Ignore request' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should accommodate reasonable route requests from passengers when possible, as part of good customer service.'
    },
    {
      questionText: 'What is the driver\'s responsibility regarding vehicle cleanliness for customer comfort?',
      options: [
        { id: 'A', text: 'Clean only when dirty' },
        { id: 'B', text: 'Maintain clean interior and exterior for passenger comfort' },
        { id: 'C', text: 'No cleaning required' },
        { id: 'D', text: 'Customer should clean' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should maintain a clean vehicle interior and exterior to ensure passenger comfort and satisfaction.'
    },
    {
      questionText: 'How should a driver handle a passenger with mobility difficulties?',
      options: [
        { id: 'A', text: 'Refuse service' },
        { id: 'B', text: 'Provide assistance and ensure safe boarding and alighting' },
        { id: 'C', text: 'Charge extra' },
        { id: 'D', text: 'Ignore needs' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should provide appropriate assistance to passengers with mobility difficulties and ensure safe boarding and alighting.'
    },
    {
      questionText: 'What should a driver do if they make an error in fare calculation?',
      options: [
        { id: 'A', text: 'Ignore it' },
        { id: 'B', text: 'Correct the error and charge the accurate fare' },
        { id: 'C', text: 'Charge extra anyway' },
        { id: 'D', text: 'Blame the meter' }
      ],
      correctAnswer: 'B',
      explanation: 'If a driver makes an error in fare calculation, they should correct it and charge the accurate fare.'
    },
    {
      questionText: 'What is the driver\'s obligation regarding conversation with passengers?',
      options: [
        { id: 'A', text: 'Talk constantly' },
        { id: 'B', text: 'Be friendly but respect passenger preference for conversation or quiet' },
        { id: 'C', text: 'Never talk' },
        { id: 'D', text: 'Only discuss politics' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should be friendly but respect passenger preferences - some may want conversation while others prefer quiet.'
    },
    {
      questionText: 'How should a driver handle a passenger who is running late?',
      options: [
        { id: 'A', text: 'Leave immediately' },
        { id: 'B', text: 'Wait a reasonable time and communicate with passenger' },
        { id: 'C', text: 'Charge waiting fee immediately' },
        { id: 'D', text: 'Cancel booking' }
      ],
      correctAnswer: 'B',
      explanation: 'For pre-booked journeys, drivers should wait a reasonable time and communicate with passengers who are running late.'
    },
    {
      questionText: 'What should a driver do if a passenger requests to stop during a journey?',
      options: [
        { id: 'A', text: 'Refuse always' },
        { id: 'B', text: 'Accommodate reasonable stop requests when safe and practical' },
        { id: 'C', text: 'Charge extra immediately' },
        { id: 'D', text: 'End journey' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should accommodate reasonable stop requests from passengers when it is safe and practical to do so.'
    },
    {
      questionText: 'What is the driver\'s responsibility regarding child passengers?',
      options: [
        { id: 'A', text: 'No special responsibility' },
        { id: 'B', text: 'Ensure appropriate child restraints are used and children are safely seated' },
        { id: 'C', text: 'Refuse children' },
        { id: 'D', text: 'Charge extra for children' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should ensure that appropriate child restraints are used and children are safely seated according to regulations.'
    },
    {
      questionText: 'How should a driver handle a situation where a passenger becomes aggressive?',
      options: [
        { id: 'A', text: 'Respond aggressively' },
        { id: 'B', text: 'Remain calm, try to de-escalate, and if necessary, safely end the journey and contact authorities' },
        { id: 'C', text: 'Continue journey regardless' },
        { id: 'D', text: 'Charge extra' }
      ],
      correctAnswer: 'B',
      explanation: 'If a passenger becomes aggressive, drivers should remain calm, try to de-escalate, and if necessary, safely end the journey and contact authorities.'
    },
    {
      questionText: 'What should a driver do if they witness an accident while carrying a passenger?',
      options: [
        { id: 'A', text: 'Continue journey' },
        { id: 'B', text: 'Stop if safe to do so, offer assistance, and contact emergency services if needed' },
        { id: 'C', text: 'Ignore it' },
        { id: 'D', text: 'Charge extra for delay' }
      ],
      correctAnswer: 'B',
      explanation: 'If a driver witnesses an accident, they should stop if safe, offer assistance, and contact emergency services if needed, while considering passenger needs.'
    },
    {
      questionText: 'What is the driver\'s obligation regarding providing information about the journey?',
      options: [
        { id: 'A', text: 'No information needed' },
        { id: 'B', text: 'Provide estimated time and route information when requested' },
        { id: 'C', text: 'Always provide detailed route' },
        { id: 'D', text: 'Never provide information' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should provide estimated journey time and route information when requested by passengers.'
    },
    {
      questionText: 'How should a driver handle a passenger who wants to pay by card but the machine is not working?',
      options: [
        { id: 'A', text: 'Refuse service' },
        { id: 'B', text: 'Inform passenger before journey, offer alternative payment methods, or arrange alternative transport' },
        { id: 'C', text: 'Force cash payment' },
        { id: 'D', text: 'Charge extra' }
      ],
      correctAnswer: 'B',
      explanation: 'If card payment is not available, drivers should inform passengers before the journey, offer alternative payment methods, or help arrange alternative transport.'
    },
    {
      questionText: 'What should a driver do if they receive a complaint after a journey?',
      options: [
        { id: 'A', text: 'Ignore it' },
        { id: 'B', text: 'Take complaint seriously, provide NTA contact information, and cooperate with any investigation' },
        { id: 'C', text: 'Argue with customer' },
        { id: 'D', text: 'Block customer' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should take complaints seriously, provide NTA contact information, and cooperate fully with any investigation.'
    },
    {
      questionText: 'What is the driver\'s responsibility regarding smoking in the vehicle?',
      options: [
        { id: 'A', text: 'Allow if passenger requests' },
        { id: 'B', text: 'Smoking is prohibited in SPSV vehicles at all times' },
        { id: 'C', text: 'Allow with windows open' },
        { id: 'D', text: 'Driver choice' }
      ],
      correctAnswer: 'B',
      explanation: 'Smoking is prohibited in SPSV vehicles at all times, for both drivers and passengers.'
    },
    {
      questionText: 'How should a driver handle a passenger who appears distressed or upset?',
      options: [
        { id: 'A', text: 'Ignore them' },
        { id: 'B', text: 'Show empathy, offer assistance if appropriate, and ensure safe arrival at destination' },
        { id: 'C', text: 'Ask personal questions' },
        { id: 'D', text: 'Charge extra' }
      ],
      correctAnswer: 'B',
      explanation: 'If a passenger appears distressed, drivers should show empathy, offer appropriate assistance, and ensure their safe arrival at the destination.'
    },
    {
      questionText: 'What should a driver do if they are unsure of a destination location?',
      options: [
        { id: 'A', text: 'Guess the route' },
        { id: 'B', text: 'Use GPS or ask passenger for clarification to ensure correct destination' },
        { id: 'C', text: 'Refuse the journey' },
        { id: 'D', text: 'Take longest route' }
      ],
      correctAnswer: 'B',
      explanation: 'If unsure of a destination, drivers should use GPS navigation or ask the passenger for clarification to ensure they reach the correct location.'
    },
    {
      questionText: 'What is the driver\'s obligation regarding vehicle safety features?',
      options: [
        { id: 'A', text: 'No obligation' },
        { id: 'B', text: 'Ensure all safety features are working and vehicle is roadworthy' },
        { id: 'C', text: 'Only check brakes' },
        { id: 'D', text: 'Optional safety checks' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers must ensure all vehicle safety features are working properly and the vehicle is roadworthy before operating.'
    },
    {
      questionText: 'How should a driver handle a situation where a passenger needs medical attention?',
      options: [
        { id: 'A', text: 'Continue to destination' },
        { id: 'B', text: 'Assess situation, provide assistance, and contact emergency services if necessary' },
        { id: 'C', text: 'Refuse to help' },
        { id: 'D', text: 'Charge extra' }
      ],
      correctAnswer: 'B',
      explanation: 'If a passenger needs medical attention, drivers should assess the situation, provide appropriate assistance, and contact emergency services if necessary.'
    },
    {
      questionText: 'What should a driver do if they are running low on fuel during a journey?',
      options: [
        { id: 'A', text: 'Continue until empty' },
        { id: 'B', text: 'Refuel before journey if possible, or inform passenger and refuel if necessary' },
        { id: 'C', text: 'Charge passenger for fuel' },
        { id: 'D', text: 'End journey' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should ensure adequate fuel before journeys, or if running low, inform passengers and refuel when necessary, minimizing inconvenience.'
    },
    {
      questionText: 'What is the driver\'s responsibility regarding fare transparency?',
      options: [
        { id: 'A', text: 'Hide fare information' },
        { id: 'B', text: 'Display fare clearly, explain charges, and provide receipt when requested' },
        { id: 'C', text: 'Charge what driver wants' },
        { id: 'D', text: 'No transparency needed' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should display fares clearly, explain any charges, and provide receipts when requested to ensure transparency.'
    },
    {
      questionText: 'How should a driver handle a passenger who wants to make multiple stops?',
      options: [
        { id: 'A', text: 'Refuse always' },
        { id: 'B', text: 'Accommodate reasonable multiple stops when safe and practical, with meter running' },
        { id: 'C', text: 'Charge flat fee' },
        { id: 'D', text: 'End journey after first stop' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should accommodate reasonable multiple stops when safe and practical, with the meter running to calculate the accurate fare.'
    },
    {
      questionText: 'What should a driver do if a passenger requests to change destination during journey?',
      options: [
        { id: 'A', text: 'Refuse always' },
        { id: 'B', text: 'Accommodate destination change when safe and practical, with meter continuing' },
        { id: 'C', text: 'Charge extra fee' },
        { id: 'D', text: 'End current journey and start new' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should accommodate destination changes when safe and practical, with the meter continuing to run for the new destination.'
    },
    {
      questionText: 'What is the driver\'s obligation regarding vehicle accessibility?',
      options: [
        { id: 'A', text: 'No obligation' },
        { id: 'B', text: 'Ensure vehicle is accessible as per licence type and assist passengers with disabilities appropriately' },
        { id: 'C', text: 'Refuse disabled passengers' },
        { id: 'D', text: 'Charge extra for accessibility' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers must ensure their vehicle meets accessibility requirements for its licence type and provide appropriate assistance to passengers with disabilities.'
    },
    {
      questionText: 'How should a driver handle a passenger who wants to bring a pet?',
      options: [
        { id: 'A', text: 'Refuse all pets' },
        { id: 'B', text: 'Allow assistance animals, and may allow other pets at driver discretion if vehicle remains clean' },
        { id: 'C', text: 'Charge extra always' },
        { id: 'D', text: 'Only small pets' }
      ],
      correctAnswer: 'B',
      explanation: 'Assistance animals must always be allowed. Other pets may be allowed at driver discretion, provided the vehicle remains clean and safe.'
    },
    {
      questionText: 'What should a driver do if they receive incorrect directions from a passenger?',
      options: [
        { id: 'A', text: 'Follow blindly' },
        { id: 'B', text: 'Politely suggest alternative if driver knows a better route, but respect passenger preference' },
        { id: 'C', text: 'Ignore passenger' },
        { id: 'D', text: 'Charge extra for wrong route' }
      ],
      correctAnswer: 'B',
      explanation: 'If a passenger gives directions that seem incorrect, drivers should politely suggest alternatives if they know a better route, but respect passenger preference.'
    },
    {
      questionText: 'What is the driver\'s responsibility regarding journey time estimates?',
      options: [
        { id: 'A', text: 'No estimates needed' },
        { id: 'B', text: 'Provide realistic time estimates when asked, considering traffic conditions' },
        { id: 'C', text: 'Always underestimate' },
        { id: 'D', text: 'Never provide estimates' }
      ],
      correctAnswer: 'B',
      explanation: 'When asked, drivers should provide realistic journey time estimates, taking into account current traffic conditions.'
    },
    {
      questionText: 'How should a driver handle a passenger who wants to pay in foreign currency?',
      options: [
        { id: 'A', text: 'Refuse always' },
        { id: 'B', text: 'Accept Euro only, but may help passenger find currency exchange if needed' },
        { id: 'C', text: 'Accept any currency' },
        { id: 'D', text: 'Charge conversion fee' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should accept Euro payment only, but may help passengers find currency exchange facilities if needed.'
    },
    {
      questionText: 'What should a driver do if they are involved in a minor traffic incident with a passenger on board?',
      options: [
        { id: 'A', text: 'Continue journey' },
        { id: 'B', text: 'Stop safely, check passenger safety, exchange details with other party, and continue if safe' },
        { id: 'C', text: 'Leave scene' },
        { id: 'D', text: 'Blame passenger' }
      ],
      correctAnswer: 'B',
      explanation: 'In a minor incident, drivers should stop safely, check passenger safety, exchange details with the other party, and continue the journey if the vehicle is safe.'
    },
    {
      questionText: 'What is the driver\'s obligation regarding providing a comfortable journey?',
      options: [
        { id: 'A', text: 'No obligation' },
        { id: 'B', text: 'Drive smoothly, maintain comfortable temperature, and ensure passenger safety and comfort' },
        { id: 'C', text: 'Drive fast always' },
        { id: 'D', text: 'Passenger comfort not important' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should drive smoothly, maintain a comfortable vehicle temperature, and ensure passenger safety and comfort throughout the journey.'
    },
    {
      questionText: 'How should a driver handle a passenger who wants to make a phone call during the journey?',
      options: [
        { id: 'A', text: 'Refuse always' },
        { id: 'B', text: 'Allow phone calls, but may request lower volume if disruptive' },
        { id: 'C', text: 'Charge extra' },
        { id: 'D', text: 'End journey' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should allow passengers to make phone calls, but may politely request lower volume if the conversation is disruptive to driving.'
    },
    {
      questionText: 'What should a driver do if they notice a passenger has left the vehicle door open?',
      options: [
        { id: 'A', text: 'Ignore it' },
        { id: 'B', text: 'Politely remind passenger to close door for safety' },
        { id: 'C', text: 'Close it forcefully' },
        { id: 'D', text: 'Charge extra' }
      ],
      correctAnswer: 'B',
      explanation: 'If a passenger leaves a door open, drivers should politely remind them to close it for safety reasons.'
    },
    {
      questionText: 'What is the driver\'s responsibility regarding providing receipts for cash payments?',
      options: [
        { id: 'A', text: 'Never provide' },
        { id: 'B', text: 'Provide receipt when requested by passenger' },
        { id: 'C', text: 'Only for card payments' },
        { id: 'D', text: 'Charge for receipt' }
      ],
      correctAnswer: 'B',
      explanation: 'Drivers should provide receipts for cash payments when requested by passengers.'
    }
  ]

  // Add the additional questions to Chapter 8
  chapter8Questions.push(...additionalChapter8Questions)

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
  console.log(`\nSummary:`)
  console.log(`- Chapter 5: ${chapter5Questions.length} questions`)
  console.log(`- Chapter 7: ${chapter7Questions.length} questions`)
  console.log(`- Chapter 8: ${chapter8Questions.length} questions`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
