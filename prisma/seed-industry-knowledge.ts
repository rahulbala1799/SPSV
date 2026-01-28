import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { syncToQuestionBank } from './sync-to-question-bank'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Industry Knowledge chapters...')

  // Create Industry Knowledge Part 1 Chapter
  const industryPart1 = await prisma.chapter.upsert({
    where: { id: 'chapter_industry_part1' },
    update: {},
    create: {
      id: 'chapter_industry_part1',
      title: 'Industry Knowledge - Part 1',
      description: 'SPSV regulations, National Transport Authority, licensing basics and vehicle requirements',
      duration: 25,
      chapterNumber: 1,
      type: 'MCQ',
      isActive: true
    }
  })

  console.log('Created Industry Knowledge Part 1 chapter')

  // Industry Knowledge Part 1 Questions (21 questions)
  const part1Questions = [
    {
      questionText: 'What does the acronym SPSV stand for?',
      options: [
        { id: 'A', text: 'Small Public Service Vehicle' },
        { id: 'B', text: 'Special Public Service Vehicle' },
        { id: 'C', text: 'State Passenger Service Vehicle' },
        { id: 'D', text: 'Small Passenger Service Vehicle' }
      ],
      correctAnswer: 'A',
      explanation: 'SPSV stands for Small Public Service Vehicle, which is the official designation for taxis, hackneys, and limousines in Ireland.'
    },
    {
      questionText: 'What type of licence is an SPSV licence?',
      options: [
        { id: 'A', text: 'SPSV vehicle licence' },
        { id: 'B', text: 'Public bus licence' },
        { id: 'C', text: 'Private hire licence' },
        { id: 'D', text: 'Commercial goods licence' }
      ],
      correctAnswer: 'A',
      explanation: 'An SPSV licence is specifically a vehicle licence that permits the operation of a vehicle as a taxi, hackney, or limousine.'
    },
    {
      questionText: 'How many SPSV vehicle categories operate in Ireland?',
      options: [
        { id: 'A', text: 'Six' },
        { id: 'B', text: 'Four' },
        { id: 'C', text: 'Five' },
        { id: 'D', text: 'Seven' }
      ],
      correctAnswer: 'A',
      explanation: 'There are six SPSV vehicle categories operating in Ireland, covering different types of taxi and hackney services.'
    },
    {
      questionText: 'In which year was the National Transport Authority established?',
      options: [
        { id: 'A', text: '2003' },
        { id: 'B', text: '2000' },
        { id: 'C', text: '2005' },
        { id: 'D', text: '2010' }
      ],
      correctAnswer: 'A',
      explanation: 'The National Transport Authority was established in 2003 to regulate public transport services including SPSV operations.'
    },
    {
      questionText: 'How is the National Transport Authority commonly referred to in SPSV legislation?',
      options: [
        { id: 'A', text: 'The Authority' },
        { id: 'B', text: 'The Department' },
        { id: 'C', text: 'The Commission' },
        { id: 'D', text: 'The Agency' }
      ],
      correctAnswer: 'A',
      explanation: 'In SPSV legislation, the National Transport Authority is commonly referred to simply as "The Authority".'
    },
    {
      questionText: 'What was the previous name of the SPSV regulatory body?',
      options: [
        { id: 'A', text: 'Commission for Taxi Regulation' },
        { id: 'B', text: 'Taxi Regulation Authority' },
        { id: 'C', text: 'Public Transport Commission' },
        { id: 'D', text: 'National Taxi Board' }
      ],
      correctAnswer: 'A',
      explanation: 'Before the National Transport Authority, the regulatory body was known as the Commission for Taxi Regulation.'
    },
    {
      questionText: 'Which of the following is NOT a responsibility of the National Transport Authority?',
      options: [
        { id: 'A', text: 'Issuing driving licences' },
        { id: 'B', text: 'Regulating industry standards' },
        { id: 'C', text: 'Licensing vehicles and dispatch operators' },
        { id: 'D', text: 'Conducting skill development tests' }
      ],
      correctAnswer: 'A',
      explanation: 'The NTA does not issue driving licences - that is the responsibility of the Road Safety Authority (RSA). The NTA issues SPSV driver licences and vehicle licences.'
    },
    {
      questionText: 'Who works closely with the Authority to develop national and regional SPSV policies?',
      options: [
        { id: 'A', text: 'Local Authorities and An Garda Síochána' },
        { id: 'B', text: 'Road Safety Authority' },
        { id: 'C', text: 'Revenue Commissioners' },
        { id: 'D', text: 'Department of Justice' }
      ],
      correctAnswer: 'A',
      explanation: 'Local Authorities and An Garda Síochána work closely with the NTA to develop and implement SPSV policies at national and regional levels.'
    },
    {
      questionText: 'Who appoints the Taxi Advisory Committee?',
      options: [
        { id: 'A', text: 'Minister for Transport, Tourism and Sport' },
        { id: 'B', text: 'National Transport Authority' },
        { id: 'C', text: 'An Garda Síochána' },
        { id: 'D', text: 'Local Authorities' }
      ],
      correctAnswer: 'A',
      explanation: 'The Taxi Advisory Committee is appointed by the Minister for Transport, Tourism and Sport to provide advice on SPSV matters.'
    },
    {
      questionText: 'What is the primary function of the Taxi Advisory Committee?',
      options: [
        { id: 'A', text: 'To advise the Authority' },
        { id: 'B', text: 'To issue licences' },
        { id: 'C', text: 'To conduct inspections' },
        { id: 'D', text: 'To prosecute offences' }
      ],
      correctAnswer: 'A',
      explanation: 'The primary function of the Taxi Advisory Committee is to provide advice and recommendations to the Authority on SPSV-related matters.'
    },
    {
      questionText: 'Is the Authority legally bound to act on the advice of the Taxi Advisory Committee?',
      options: [
        { id: 'A', text: 'No' },
        { id: 'B', text: 'Yes' },
        { id: 'C', text: 'Only in emergencies' },
        { id: 'D', text: 'Only with ministerial approval' }
      ],
      correctAnswer: 'A',
      explanation: 'The Authority is not legally bound to act on the advice of the Taxi Advisory Committee, but considers their recommendations in decision-making.'
    },
    {
      questionText: 'Which groups are represented as stakeholders on the Taxi Advisory Committee?',
      options: [
        { id: 'A', text: 'Operators, local authorities, Gardaí, consumers and people with disabilities' },
        { id: 'B', text: 'Only drivers and operators' },
        { id: 'C', text: 'Government departments only' },
        { id: 'D', text: 'Vehicle manufacturers' }
      ],
      correctAnswer: 'A',
      explanation: 'The Taxi Advisory Committee includes diverse stakeholder representation including operators, local authorities, Gardaí, consumers, and people with disabilities.'
    },
    {
      questionText: 'Who issues SPSV vehicle licences?',
      options: [
        { id: 'A', text: 'The National Transport Authority' },
        { id: 'B', text: 'An Garda Síochána' },
        { id: 'C', text: 'Road Safety Authority' },
        { id: 'D', text: 'Local Authorities' }
      ],
      correctAnswer: 'A',
      explanation: 'The National Transport Authority is responsible for issuing SPSV vehicle licences for taxis, hackneys, and limousines.'
    },
    {
      questionText: 'What best describes a dispatch operator?',
      options: [
        { id: 'A', text: 'An individual or organisation providing booking services to the public' },
        { id: 'B', text: 'A vehicle inspector' },
        { id: 'C', text: 'A driver training provider' },
        { id: 'D', text: 'A licensing authority' }
      ],
      correctAnswer: 'A',
      explanation: 'A dispatch operator is an individual or organisation that provides booking and dispatch services to connect customers with SPSV drivers.'
    },
    {
      questionText: 'What must a driver do to operate an SPSV in more than one county?',
      options: [
        { id: 'A', text: 'Pass the area knowledge test for each county' },
        { id: 'B', text: 'Apply for a national licence' },
        { id: 'C', text: 'Register with local authorities' },
        { id: 'D', text: 'Seek Garda approval' }
      ],
      correctAnswer: 'A',
      explanation: 'To operate in multiple counties, a driver must pass the area knowledge test for each county they wish to work in.'
    },
    {
      questionText: 'Who grants and administers dispatch operator licences?',
      options: [
        { id: 'A', text: 'The National Transport Authority' },
        { id: 'B', text: 'An Garda Síochána' },
        { id: 'C', text: 'Local Authorities' },
        { id: 'D', text: 'Department of Transport' }
      ],
      correctAnswer: 'A',
      explanation: 'The National Transport Authority grants and administers licences for dispatch operators.'
    },
    {
      questionText: 'Which bodies, other than the NTA, have regulatory roles within the SPSV sector?',
      options: [
        { id: 'A', text: 'Gardaí, RSA, local authorities, NSAI and HSE' },
        { id: 'B', text: 'Revenue Commissioners only' },
        { id: 'C', text: 'Department of Finance' },
        { id: 'D', text: 'Courts Service' }
      ],
      correctAnswer: 'A',
      explanation: 'Multiple bodies have regulatory roles including An Garda Síochána, Road Safety Authority, local authorities, NSAI (standards), and HSE (health).'
    },
    {
      questionText: 'What information is contained in the National SPSV Register?',
      options: [
        { id: 'A', text: 'Personal details of the driver' },
        { id: 'B', text: 'Only vehicle details' },
        { id: 'C', text: 'Licence expiry dates only' },
        { id: 'D', text: 'Insurance details only' }
      ],
      correctAnswer: 'A',
      explanation: 'The National SPSV Register contains comprehensive personal details of licensed drivers along with their licensing information.'
    },
    {
      questionText: 'What information is available on the public SPSV register?',
      options: [
        { id: 'A', text: 'Driver name, licence number and vehicle details' },
        { id: 'B', text: 'Full personal details' },
        { id: 'C', text: 'Medical records' },
        { id: 'D', text: 'Home address' }
      ],
      correctAnswer: 'A',
      explanation: 'The public SPSV register shows driver name, licence number, and vehicle details but protects sensitive personal information.'
    },
    {
      questionText: 'For how long is an SPSV driver licence normally valid?',
      options: [
        { id: 'A', text: 'Five years' },
        { id: 'B', text: 'One year' },
        { id: 'C', text: 'Three years' },
        { id: 'D', text: 'Ten years' }
      ],
      correctAnswer: 'A',
      explanation: 'An SPSV driver licence is normally valid for five years before it needs to be renewed.'
    },
    {
      questionText: 'For how long is an SPSV licence valid for taxis?',
      options: [
        { id: 'A', text: 'One year or six months' },
        { id: 'B', text: 'Two years' },
        { id: 'C', text: 'Five years' },
        { id: 'D', text: 'Indefinitely' }
      ],
      correctAnswer: 'A',
      explanation: 'SPSV vehicle licences for taxis are valid for either one year or six months, depending on the vehicle age and type.'
    }
  ]

  // Create questions for Part 1
  for (let i = 0; i < part1Questions.length; i++) {
    const q = part1Questions[i]
    const questionNumber = i + 1
    
    await prisma.question.upsert({
      where: {
        chapterId_questionNumber: {
          chapterId: industryPart1.id,
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
        chapterId: industryPart1.id,
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

  console.log(`Created ${part1Questions.length} questions for Industry Knowledge Part 1`)

  // Create Industry Knowledge Part 2 Chapter
  const industryPart2 = await prisma.chapter.upsert({
    where: { id: 'chapter_industry_part2' },
    update: {},
    create: {
      id: 'chapter_industry_part2',
      title: 'Industry Knowledge - Part 2',
      description: 'Driver licence applications, vetting process, vehicle specifications and safety requirements',
      duration: 30,
      chapterNumber: 2,
      type: 'MCQ',
      isActive: true
    }
  })

  console.log('Created Industry Knowledge Part 2 chapter')

  // Industry Knowledge Part 2 Questions (24 questions)
  const part2Questions = [
    {
      questionText: 'Who is responsible for vetting applicants for an SPSV driver licence?',
      options: [
        { id: 'A', text: 'An Garda Síochána' },
        { id: 'B', text: 'National Transport Authority' },
        { id: 'C', text: 'Revenue Commissioners' },
        { id: 'D', text: 'Department of Transport' }
      ],
      correctAnswer: 'A',
      explanation: 'An Garda Síochána is responsible for vetting all applicants for SPSV driver licences to ensure they meet character and criminal record requirements.'
    },
    {
      questionText: 'Which forms must be completed for an SPSV driver licence application?',
      options: [
        { id: 'A', text: 'Forms 15 and 18' },
        { id: 'B', text: 'Forms 10 and 12' },
        { id: 'C', text: 'Forms 21 and 22' },
        { id: 'D', text: 'Forms 5 and 7' }
      ],
      correctAnswer: 'A',
      explanation: 'Forms 15 and 18 are the required application forms for an SPSV driver licence.'
    },
    {
      questionText: 'Which body grants and renews SPSV driver licences?',
      options: [
        { id: 'A', text: 'An Garda Síochána' },
        { id: 'B', text: 'National Transport Authority' },
        { id: 'C', text: 'Local Authority' },
        { id: 'D', text: 'Road Safety Authority' }
      ],
      correctAnswer: 'A',
      explanation: 'An Garda Síochána grants and renews SPSV driver licences after completing the vetting process.'
    },
    {
      questionText: 'Which organisation administers the SPSV Skills Development Test and driver ID processing?',
      options: [
        { id: 'A', text: 'The National Transport Authority' },
        { id: 'B', text: 'An Garda Síochána' },
        { id: 'C', text: 'RSA' },
        { id: 'D', text: 'Revenue Commissioners' }
      ],
      correctAnswer: 'A',
      explanation: 'The National Transport Authority administers the Skills Development Test and processes driver IDs.'
    },
    {
      questionText: 'From what date were students prohibited from working as SPSV drivers?',
      options: [
        { id: 'A', text: '1 January 2015' },
        { id: 'B', text: '1 January 2013' },
        { id: 'C', text: '1 January 2016' },
        { id: 'D', text: '1 January 2014' }
      ],
      correctAnswer: 'A',
      explanation: 'From 1 January 2015, students were prohibited from working as SPSV drivers to ensure full-time professional standards.'
    },
    {
      questionText: 'Which document is essential with an SPSV driver application?',
      options: [
        { id: 'A', text: 'Tax Clearance Certificate' },
        { id: 'B', text: 'Proof of address' },
        { id: 'C', text: 'Utility bill' },
        { id: 'D', text: 'Vehicle logbook' }
      ],
      correctAnswer: 'A',
      explanation: 'A Tax Clearance Certificate is an essential document required with every SPSV driver licence application.'
    },
    {
      questionText: 'Which SPSV fee is non-refundable?',
      options: [
        { id: 'A', text: 'SPSV driver licence fee' },
        { id: 'B', text: 'Skills test fee' },
        { id: 'C', text: 'Vetting fee' },
        { id: 'D', text: 'Medical assessment fee' }
      ],
      correctAnswer: 'A',
      explanation: 'The SPSV driver licence fee is non-refundable once the application is submitted.'
    },
    {
      questionText: 'Where must SPSV applications be submitted by applicants living outside Dublin?',
      options: [
        { id: 'A', text: 'Local Garda Station' },
        { id: 'B', text: 'Carriage Office Santry' },
        { id: 'C', text: 'NTA Office' },
        { id: 'D', text: 'City Hall' }
      ],
      correctAnswer: 'A',
      explanation: 'Applicants living outside Dublin must submit their SPSV applications at their local Garda Station.'
    },
    {
      questionText: 'Where must SPSV applications be submitted by applicants living in Dublin?',
      options: [
        { id: 'A', text: 'Carriage Office, Santry' },
        { id: 'B', text: 'Garda Headquarters' },
        { id: 'C', text: 'City Hall' },
        { id: 'D', text: 'Local Garda Station' }
      ],
      correctAnswer: 'A',
      explanation: 'Applicants living in Dublin must submit their applications at the Carriage Office in Santry.'
    },
    {
      questionText: 'What written undertaking must accompany an SPSV application?',
      options: [
        { id: 'A', text: 'Not working more than 11 hours on three consecutive days' },
        { id: 'B', text: 'Not exceeding 8 hours daily' },
        { id: 'C', text: 'No night work' },
        { id: 'D', text: 'No weekend work' }
      ],
      correctAnswer: 'A',
      explanation: 'Applicants must give a written undertaking not to work more than 11 hours on three consecutive days to ensure driver and passenger safety.'
    },
    {
      questionText: 'How long does Garda vetting typically take?',
      options: [
        { id: 'A', text: '12 weeks' },
        { id: 'B', text: '4 weeks' },
        { id: 'C', text: '6 weeks' },
        { id: 'D', text: '8 weeks' }
      ],
      correctAnswer: 'A',
      explanation: 'The Garda vetting process typically takes approximately 12 weeks to complete.'
    },
    {
      questionText: 'Which offences result in lifetime disqualification from SPSV licensing?',
      options: [
        { id: 'A', text: 'Part 1 Schedule offences (murder, rape, sexual offences)' },
        { id: 'B', text: 'Traffic offences' },
        { id: 'C', text: 'Tax offences' },
        { id: 'D', text: 'Insurance offences' }
      ],
      correctAnswer: 'A',
      explanation: 'Part 1 Schedule offences, which include serious crimes like murder, rape, and sexual offences, result in lifetime disqualification.'
    },
    {
      questionText: 'What colour is the driver ID for a local area hackney driver?',
      options: [
        { id: 'A', text: 'Green' },
        { id: 'B', text: 'Purple' },
        { id: 'C', text: 'Blue' },
        { id: 'D', text: 'Yellow' }
      ],
      correctAnswer: 'A',
      explanation: 'Local area hackney drivers have green driver ID cards to distinguish them from other SPSV categories.'
    },
    {
      questionText: 'What is the maximum passenger capacity of an SPSV?',
      options: [
        { id: 'A', text: '8 passengers excluding driver' },
        { id: 'B', text: '6 passengers' },
        { id: 'C', text: '10 passengers' },
        { id: 'D', text: '12 passengers' }
      ],
      correctAnswer: 'A',
      explanation: 'An SPSV can carry a maximum of 8 passengers, excluding the driver.'
    },
    {
      questionText: 'What is the maximum permitted vehicle weight for an SPSV?',
      options: [
        { id: 'A', text: '3500 kg' },
        { id: 'B', text: '3000 kg' },
        { id: 'C', text: '4000 kg' },
        { id: 'D', text: '4500 kg' }
      ],
      correctAnswer: 'A',
      explanation: 'The maximum permitted vehicle weight for an SPSV is 3500 kg (3.5 tonnes).'
    },
    {
      questionText: 'What boot capacity is required for an SPSV vehicle?',
      options: [
        { id: 'A', text: '420 litres' },
        { id: 'B', text: '350 litres' },
        { id: 'C', text: '500 litres' },
        { id: 'D', text: '600 litres' }
      ],
      correctAnswer: 'A',
      explanation: 'An SPSV vehicle must have a minimum boot capacity of 420 litres to accommodate passenger luggage.'
    },
    {
      questionText: 'What percentage of visible light must the front windscreen allow?',
      options: [
        { id: 'A', text: '70%' },
        { id: 'B', text: '50%' },
        { id: 'C', text: '60%' },
        { id: 'D', text: '80%' }
      ],
      correctAnswer: 'A',
      explanation: 'The front windscreen must allow at least 70% of visible light transmission to ensure adequate visibility for safe driving.'
    },
    {
      questionText: 'What roof type is permitted in SPSV vehicles?',
      options: [
        { id: 'A', text: 'Permanent rigid roof' },
        { id: 'B', text: 'Convertible roof' },
        { id: 'C', text: 'Soft-top roof' },
        { id: 'D', text: 'Detachable roof' }
      ],
      correctAnswer: 'A',
      explanation: 'Only permanent rigid roofs are permitted in SPSV vehicles for safety and structural integrity.'
    },
    {
      questionText: 'What seating configuration is prohibited in SPSV vehicles?',
      options: [
        { id: 'A', text: 'Side-facing seats' },
        { id: 'B', text: 'Forward-facing seats' },
        { id: 'C', text: 'Rear-facing seats' },
        { id: 'D', text: 'Fold-down seats' }
      ],
      correctAnswer: 'A',
      explanation: 'Side-facing seats are prohibited in SPSV vehicles for passenger safety reasons.'
    },
    {
      questionText: 'Which regulation must bull bars comply with if fitted to an SPSV?',
      options: [
        { id: 'A', text: 'EC Regulation 78/2009/EC' },
        { id: 'B', text: 'EU Regulation 45/2011' },
        { id: 'C', text: 'ISO 9001' },
        { id: 'D', text: 'RSA Standard 2015' }
      ],
      correctAnswer: 'A',
      explanation: 'Bull bars must comply with EC Regulation 78/2009/EC if fitted to an SPSV to ensure pedestrian safety.'
    },
    {
      questionText: 'What is the maximum slope permitted for a wheelchair ramp?',
      options: [
        { id: 'A', text: '16 degrees' },
        { id: 'B', text: '10 degrees' },
        { id: 'C', text: '12 degrees' },
        { id: 'D', text: '20 degrees' }
      ],
      correctAnswer: 'A',
      explanation: 'A wheelchair ramp must not exceed a slope of 16 degrees to ensure safe and manageable access.'
    },
    {
      questionText: 'What weight must a wheelchair ramp support?',
      options: [
        { id: 'A', text: '300 kg' },
        { id: 'B', text: '200 kg' },
        { id: 'C', text: '250 kg' },
        { id: 'D', text: '400 kg' }
      ],
      correctAnswer: 'A',
      explanation: 'A wheelchair ramp must be capable of supporting a weight of at least 300 kg to accommodate wheelchair users safely.'
    },
    {
      questionText: 'What headroom must be provided in a wheelchair-accessible SPSV?',
      options: [
        { id: 'A', text: '1350 mm' },
        { id: 'B', text: '1200 mm' },
        { id: 'C', text: '1400 mm' },
        { id: 'D', text: '1500 mm' }
      ],
      correctAnswer: 'A',
      explanation: 'A wheelchair-accessible SPSV must provide a minimum headroom of 1350 mm for wheelchair users.'
    },
    {
      questionText: 'Who sends out SPSV driver ID cards?',
      options: [
        { id: 'A', text: 'The Authority (NTA)' },
        { id: 'B', text: 'An Garda Síochána' },
        { id: 'C', text: 'Local Authority' },
        { id: 'D', text: 'RSA' }
      ],
      correctAnswer: 'A',
      explanation: 'The National Transport Authority (NTA) is responsible for sending out SPSV driver ID cards after successful application.'
    }
  ]

  // Create questions for Part 2
  for (let i = 0; i < part2Questions.length; i++) {
    const q = part2Questions[i]
    const questionNumber = i + 1
    
    await prisma.question.upsert({
      where: {
        chapterId_questionNumber: {
          chapterId: industryPart2.id,
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
        chapterId: industryPart2.id,
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

  console.log(`Created ${part2Questions.length} questions for Industry Knowledge Part 2`)

  // Create Industry Knowledge Part 3 Chapter
  const industryPart3 = await prisma.chapter.upsert({
    where: { id: 'chapter_industry_part3' },
    update: {},
    create: {
      id: 'chapter_industry_part3',
      title: 'Industry Knowledge - Part 3',
      description: 'SPSV licensing procedures, vehicle requirements and advertising regulations',
      duration: 25,
      chapterNumber: 3,
      type: 'MCQ',
      isActive: true
    }
  })

  console.log('Created Industry Knowledge Part 3 chapter')

  // Industry Knowledge Part 3 Questions (20 questions)
  const part3Questions = [
    {
      questionText: 'Which body issues SPSV vehicle licences?',
      options: [
        { id: 'A', text: 'The National Transport Authority' },
        { id: 'B', text: 'An Garda Síochána' },
        { id: 'C', text: 'Road Safety Authority' },
        { id: 'D', text: 'Local Authorities' }
      ],
      correctAnswer: 'A',
      explanation: 'The National Transport Authority is responsible for issuing all SPSV vehicle licences.'
    },
    {
      questionText: 'What does an SPSV vehicle licence permit?',
      options: [
        { id: 'A', text: 'Operation of a vehicle in an SPSV category' },
        { id: 'B', text: 'Private use only' },
        { id: 'C', text: 'Commercial goods transport' },
        { id: 'D', text: 'Public bus service' }
      ],
      correctAnswer: 'A',
      explanation: 'An SPSV vehicle licence permits the operation of a vehicle as a taxi, hackney, or limousine.'
    },
    {
      questionText: 'How long is an SPSV vehicle licence valid?',
      options: [
        { id: 'A', text: '12 months, 6 months or until maximum age limit' },
        { id: 'B', text: 'Five years' },
        { id: 'C', text: 'Three years' },
        { id: 'D', text: 'Until sold' }
      ],
      correctAnswer: 'A',
      explanation: 'SPSV vehicle licences are valid for 12 months, 6 months, or until the vehicle reaches its maximum age limit, whichever comes first.'
    },
    {
      questionText: 'Can more than one vehicle be associated with a single SPSV licence?',
      options: [
        { id: 'A', text: 'No' },
        { id: 'B', text: 'Yes' },
        { id: 'C', text: 'Only temporarily' },
        { id: 'D', text: 'Only with approval' }
      ],
      correctAnswer: 'A',
      explanation: 'Each SPSV licence is specific to one vehicle only. Multiple vehicles require multiple licences.'
    },
    {
      questionText: 'Which SPSV vehicle licence applications are currently accepted by the Authority?',
      options: [
        { id: 'A', text: 'Wheelchair accessible taxis, wheelchair accessible hackneys, local area hackneys and limousines' },
        { id: 'B', text: 'All taxi types' },
        { id: 'C', text: 'Private hire vehicles' },
        { id: 'D', text: 'Buses' }
      ],
      correctAnswer: 'A',
      explanation: 'The Authority currently accepts applications for wheelchair accessible taxis, wheelchair accessible hackneys, local area hackneys, and limousines.'
    },
    {
      questionText: 'What document must be attached for a wheelchair-accessible vehicle application?',
      options: [
        { id: 'A', text: 'Technical Assessor\'s full report' },
        { id: 'B', text: 'Insurance certificate' },
        { id: 'C', text: 'Tax clearance' },
        { id: 'D', text: 'NCT only' }
      ],
      correctAnswer: 'A',
      explanation: 'A wheelchair-accessible vehicle application must include a full Technical Assessor\'s report verifying compliance with accessibility standards.'
    },
    {
      questionText: 'What document must accompany a modified limousine licence application?',
      options: [
        { id: 'A', text: 'Technical Assessor\'s basic report' },
        { id: 'B', text: 'Full assessor report' },
        { id: 'C', text: 'Insurance certificate' },
        { id: 'D', text: 'Tax clearance' }
      ],
      correctAnswer: 'A',
      explanation: 'A modified limousine application requires a basic Technical Assessor\'s report confirming the modifications meet standards.'
    },
    {
      questionText: 'After approval of a vehicle licence application, what does the Authority issue?',
      options: [
        { id: 'A', text: 'Conditional offer letter' },
        { id: 'B', text: 'Vehicle licence disc' },
        { id: 'C', text: 'Insurance certificate' },
        { id: 'D', text: 'Tax clearance' }
      ],
      correctAnswer: 'A',
      explanation: 'After approving a vehicle licence application, the Authority first issues a conditional offer letter.'
    },
    {
      questionText: 'How long is a conditional offer letter valid?',
      options: [
        { id: 'A', text: '90 days' },
        { id: 'B', text: '30 days' },
        { id: 'C', text: '60 days' },
        { id: 'D', text: '120 days' }
      ],
      correctAnswer: 'A',
      explanation: 'A conditional offer letter is valid for 90 days, during which the applicant must complete the final requirements.'
    },
    {
      questionText: 'What fire extinguisher capacity is required in an SPSV?',
      options: [
        { id: 'A', text: 'At least 2 kg dry powder (EN3 standard)' },
        { id: 'B', text: '1 kg CO2' },
        { id: 'C', text: '3 kg foam' },
        { id: 'D', text: '5 kg water' }
      ],
      correctAnswer: 'A',
      explanation: 'An SPSV must carry a fire extinguisher with at least 2 kg capacity of dry powder meeting the EN3 standard.'
    },
    {
      questionText: 'What standard must an SPSV first aid kit comply with?',
      options: [
        { id: 'A', text: 'DIN 13164 or H&S recommended' },
        { id: 'B', text: 'ISO 9001' },
        { id: 'C', text: 'EN471' },
        { id: 'D', text: 'EU Type Approval' }
      ],
      correctAnswer: 'A',
      explanation: 'First aid kits in SPSVs must comply with DIN 13164 standard or be Health & Safety recommended.'
    },
    {
      questionText: 'Which card must be displayed in an SPSV to inform customers of their rights?',
      options: [
        { id: 'A', text: 'In-vehicle information card' },
        { id: 'B', text: 'Driver ID card' },
        { id: 'C', text: 'Vehicle licence disc' },
        { id: 'D', text: 'Insurance certificate' }
      ],
      correctAnswer: 'A',
      explanation: 'An in-vehicle information card must be displayed to inform customers of their rights and the complaints process.'
    },
    {
      questionText: 'Where is the correct location to install a taxi meter?',
      options: [
        { id: 'A', text: 'Centrally above the dashboard and visible to passengers' },
        { id: 'B', text: 'Under the dashboard' },
        { id: 'C', text: 'On the windscreen' },
        { id: 'D', text: 'In the glove box' }
      ],
      correctAnswer: 'A',
      explanation: 'The taxi meter must be installed centrally above the dashboard where it is clearly visible to passengers at all times.'
    },
    {
      questionText: 'How many days before a suitability appointment can it be rescheduled without penalty?',
      options: [
        { id: 'A', text: 'At least two days' },
        { id: 'B', text: 'One day' },
        { id: 'C', text: 'Three days' },
        { id: 'D', text: 'Five days' }
      ],
      correctAnswer: 'A',
      explanation: 'A suitability appointment can be rescheduled without penalty if notice is given at least two days in advance.'
    },
    {
      questionText: 'Who may make an appointment for vehicle licence renewal?',
      options: [
        { id: 'A', text: 'Only the vehicle licence holder' },
        { id: 'B', text: 'Any driver' },
        { id: 'C', text: 'Dispatch operator' },
        { id: 'D', text: 'Local authority' }
      ],
      correctAnswer: 'A',
      explanation: 'Only the registered vehicle licence holder may make an appointment for vehicle licence renewal.'
    },
    {
      questionText: 'What must be done to surrender an SPSV vehicle licence?',
      options: [
        { id: 'A', text: 'Complete surrender section, sign declaration and return disc to licensing section' },
        { id: 'B', text: 'Destroy licence disc' },
        { id: 'C', text: 'Notify Gardai only' },
        { id: 'D', text: 'Email the Authority' }
      ],
      correctAnswer: 'A',
      explanation: 'To surrender an SPSV vehicle licence, you must complete the surrender section, sign the declaration, and return the disc to the licensing section.'
    },
    {
      questionText: 'What document is required to appoint a nominee for a vehicle licence?',
      options: [
        { id: 'A', text: 'Form S15N' },
        { id: 'B', text: 'Form VL1' },
        { id: 'C', text: 'Form SPSV1' },
        { id: 'D', text: 'Form NTA4' }
      ],
      correctAnswer: 'A',
      explanation: 'Form S15N is the required document to appoint a nominee to operate under a vehicle licence.'
    },
    {
      questionText: 'How long before expiry can a vehicle licence be renewed?',
      options: [
        { id: 'A', text: '60 days' },
        { id: 'B', text: '30 days' },
        { id: 'C', text: '90 days' },
        { id: 'D', text: '120 days' }
      ],
      correctAnswer: 'A',
      explanation: 'A vehicle licence can be renewed up to 60 days before its expiry date.'
    },
    {
      questionText: 'What is the maximum advertising area permitted on SPSV rear doors?',
      options: [
        { id: 'A', text: '1600 square centimetres' },
        { id: 'B', text: '1000 sq cm' },
        { id: 'C', text: '1200 sq cm' },
        { id: 'D', text: '2000 sq cm' }
      ],
      correctAnswer: 'A',
      explanation: 'The maximum advertising area permitted on each rear door of an SPSV is 1600 square centimetres.'
    },
    {
      questionText: 'Can advertising be displayed on hackneys and limousines?',
      options: [
        { id: 'A', text: 'Only if individually approved in writing by the Authority' },
        { id: 'B', text: 'Yes without restriction' },
        { id: 'C', text: 'No under any circumstances' },
        { id: 'D', text: 'Only at rear' }
      ],
      correctAnswer: 'A',
      explanation: 'Advertising on hackneys and limousines is only permitted if individually approved in writing by the Authority.'
    }
  ]

  // Create questions for Part 3
  for (let i = 0; i < part3Questions.length; i++) {
    const q = part3Questions[i]
    const questionNumber = i + 1
    
    await prisma.question.upsert({
      where: {
        chapterId_questionNumber: {
          chapterId: industryPart3.id,
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
        chapterId: industryPart3.id,
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

  console.log(`Created ${part3Questions.length} questions for Industry Knowledge Part 3`)
  
  // Auto-sync all three parts to QuestionBank for timed tests
  await syncToQuestionBank(prisma, [industryPart1.id, industryPart2.id, industryPart3.id])
  
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
