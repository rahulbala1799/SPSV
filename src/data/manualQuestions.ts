// Questions data extracted from SPSV_MANUAL_QUESTIONS.md
// Format: Each chapter has 4 questions

export interface Question {
  id: string;
  question: string;
  options: { id: string; label: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface ChapterQuestions {
  chapterId: string;
  chapterTitle: string;
  questions: Question[];
}

export const manualQuestions: ChapterQuestions[] = [
  {
    chapterId: 'welcome',
    chapterTitle: 'Welcome',
    questions: [
      {
        id: 'welcome-1',
        question: 'What does SPSV stand for?',
        options: [
          { id: 'A', label: 'Special Public Service Vehicle' },
          { id: 'B', label: 'Small Public Service Vehicle' },
          { id: 'C', label: 'Standard Public Service Vehicle' },
          { id: 'D', label: 'State Public Service Vehicle' },
        ],
        correctAnswer: 'B',
        explanation: "SPSV is short for 'small public service vehicle' – vehicles that are used to carry up to eight passengers, excluding the driver, for hire or payment.",
      },
      {
        id: 'welcome-2',
        question: 'How many categories of SPSV are there?',
        options: [
          { id: 'A', label: '4' },
          { id: 'B', label: '5' },
          { id: 'C', label: '6' },
          { id: 'D', label: '7' },
        ],
        correctAnswer: 'C',
        explanation: 'The term SPSV includes: Taxis, Wheelchair accessible taxis, Hackneys, Wheelchair accessible hackneys, Local area hackneys, and Limousines.',
      },
      {
        id: 'welcome-3',
        question: 'What is the maximum passenger capacity (excluding driver) for an SPSV?',
        options: [
          { id: 'A', label: '6 passengers' },
          { id: 'B', label: '8 passengers' },
          { id: 'C', label: '10 passengers' },
          { id: 'D', label: '12 passengers' },
        ],
        correctAnswer: 'B',
        explanation: 'SPSVs are vehicles that are used to carry up to eight passengers, excluding the driver.',
      },
      {
        id: 'welcome-4',
        question: 'Who created the Official Manual for Operating in the SPSV Industry?',
        options: [
          { id: 'A', label: 'Department of Transport' },
          { id: 'B', label: 'National Transport Authority (NTA)' },
          { id: 'C', label: 'An Garda Síochána' },
          { id: 'D', label: 'Road Safety Authority' },
        ],
        correctAnswer: 'B',
        explanation: 'The Manual has been created by the National Transport Authority (NTA) to give SPSV operators the information they need to apply for and maintain licences.',
      },
    ],
  },
  {
    chapterId: 'terminology',
    chapterTitle: 'Terminology',
    questions: [
      {
        id: 'terminology-1',
        question: "What does 'adult size' refer to in terms of seatbelt usage?",
        options: [
          { id: 'A', label: 'Individuals over 140cm and weighing 30kg or more' },
          { id: 'B', label: 'Individuals over 150cm and weighing 36kg or more' },
          { id: 'C', label: 'Individuals over 160cm and weighing 40kg or more' },
          { id: 'D', label: 'Individuals over 170cm and weighing 50kg or more' },
        ],
        correctAnswer: 'B',
        explanation: "For seatbelt usage in a vehicle, 'adult size' refers to individuals over 150 centimetres and weighing 36 kilograms or more.",
      },
      {
        id: 'terminology-2',
        question: 'What does the initial charge on a taximeter cover?',
        options: [
          { id: 'A', label: 'First 300 meters or 60 seconds' },
          { id: 'B', label: 'First 400 meters or 75 seconds' },
          { id: 'C', label: 'First 500 meters or 85 seconds' },
          { id: 'D', label: 'First 600 meters or 90 seconds' },
        ],
        correctAnswer: 'C',
        explanation: 'When a journey begins, the initial (starting) fare charge is already on the taximeter. This covers the first 500 meters of a journey or a period of 85 seconds.',
      },
      {
        id: 'terminology-3',
        question: 'What does Tariff A cover?',
        options: [
          { id: 'A', label: 'Next 10 km or 30 minutes' },
          { id: 'B', label: 'Next 12 km or 35 minutes' },
          { id: 'C', label: 'Next 14.5 km or 42 minutes' },
          { id: 'D', label: 'Next 16 km or 45 minutes' },
        ],
        correctAnswer: 'C',
        explanation: 'Tariff A is the standard fare charge that applies after the initial charge. This covers the next 14.5 km or 42 minutes of a journey.',
      },
      {
        id: 'terminology-4',
        question: "What is a 'dispatch operator'?",
        options: [
          { id: 'A', label: 'A driver who operates their own SPSV' },
          { id: 'B', label: 'An individual or organisation that provides a booking service for SPSV journeys' },
          { id: 'C', label: 'A company that owns multiple SPSVs' },
          { id: 'D', label: 'A government agency that regulates SPSVs' },
        ],
        correctAnswer: 'B',
        explanation: 'An SPSV dispatch operator is an individual or organisation that provides a booking service/facility for SPSV journeys that are delivered by someone else.',
      },
    ],
  },
  {
    chapterId: 'chapter-1',
    chapterTitle: 'Chapter 1: The SPSV Industry',
    questions: [
      {
        id: 'ch1-1',
        question: 'When was the National Transport Authority (NTA) established?',
        options: [
          { id: 'A', label: '1 December 2007' },
          { id: 'B', label: '1 December 2009' },
          { id: 'C', label: '1 December 2011' },
          { id: 'D', label: '1 December 2013' },
        ],
        correctAnswer: 'B',
        explanation: 'Established by the Minister for Transport on 1 December 2009, the NTA is a statutory non-commercial body.',
      },
      {
        id: 'ch1-2',
        question: 'Which organization became part of NTA in 2011?',
        options: [
          { id: 'A', label: 'Road Safety Authority' },
          { id: 'B', label: 'Commission for Taxi Regulation' },
          { id: 'C', label: 'Department of Transport' },
          { id: 'D', label: 'Local Authorities' },
        ],
        correctAnswer: 'B',
        explanation: 'The NTA includes the previous regulatory organisation, the Commission for Taxi Regulation, which became part of NTA in 2011.',
      },
      {
        id: 'ch1-3',
        question: 'How many main areas of licensing are there in the SPSV industry?',
        options: [
          { id: 'A', label: '2' },
          { id: 'B', label: '3' },
          { id: 'C', label: '4' },
          { id: 'D', label: '5' },
        ],
        correctAnswer: 'B',
        explanation: 'There are three main areas of licensing: Driver licences (provided by An Garda Síochána), Vehicle licences (provided by NTA), and Dispatch operator licences (provided by NTA).',
      },
      {
        id: 'ch1-4',
        question: 'What must an SPSV driver have to drive an SPSV?',
        options: [
          { id: 'A', label: 'Only a valid SPSV driver licence' },
          { id: 'B', label: 'Only a licensed SPSV vehicle' },
          { id: 'C', label: 'A valid SPSV driver licence AND a licensed SPSV vehicle' },
          { id: 'D', label: 'Only a regular driving licence' },
        ],
        correctAnswer: 'C',
        explanation: 'To drive an SPSV, you must have: A valid SPSV driver licence in addition to your regular driving licence, AND a licensed SPSV vehicle.',
      },
    ],
  },
  {
    chapterId: 'chapter-2',
    chapterTitle: 'Chapter 2: SPSV Driver Licensing',
    questions: [
      {
        id: 'ch2-1',
        question: 'Which organization is the SPSV driver licensing authority?',
        options: [
          { id: 'A', label: 'National Transport Authority (NTA)' },
          { id: 'B', label: 'An Garda Síochána' },
          { id: 'C', label: 'Department of Transport' },
          { id: 'D', label: 'Road Safety Authority' },
        ],
        correctAnswer: 'B',
        explanation: 'An Garda Síochána, the national police service of Ireland, is the SPSV driver licensing authority.',
      },
      {
        id: 'ch2-2',
        question: "What is the fee for a new SPSV Driver's Licence?",
        options: [
          { id: 'A', label: '€200' },
          { id: 'B', label: '€250' },
          { id: 'C', label: '€300' },
          { id: 'D', label: '€350' },
        ],
        correctAnswer: 'B',
        explanation: "The fee for a new SPSV Driver's Licence is €250, payable to NTA using a credit or debit card.",
      },
      {
        id: 'ch2-3',
        question: 'What is the maximum validity period for a regular SPSV driver licence?',
        options: [
          { id: 'A', label: '3 years' },
          { id: 'B', label: '4 years' },
          { id: 'C', label: '5 years' },
          { id: 'D', label: '6 years' },
        ],
        correctAnswer: 'C',
        explanation: 'A regular SPSV driver licence can be valid for up to five years.',
      },
      {
        id: 'ch2-4',
        question: 'How many official photographs are required for an SPSV driver licence application?',
        options: [
          { id: 'A', label: '2' },
          { id: 'B', label: '3' },
          { id: 'C', label: '4' },
          { id: 'D', label: '5' },
        ],
        correctAnswer: 'B',
        explanation: 'Three official photographs of you, each measuring approximately 10 cm by 7 cm, are required. These should meet passport standards.',
      },
    ],
  },
  {
    chapterId: 'chapter-3',
    chapterTitle: 'Chapter 3: Choosing a Vehicle to Use as an SPSV',
    questions: [
      {
        id: 'ch3-1',
        question: 'What is the primary consideration when choosing a vehicle for SPSV use?',
        options: [
          { id: 'A', label: 'Vehicle color' },
          { id: 'B', label: 'Vehicle brand' },
          { id: 'C', label: 'Vehicle suitability for SPSV use' },
          { id: 'D', label: 'Vehicle price' },
        ],
        correctAnswer: 'C',
        explanation: 'Before buying a vehicle to use as an SPSV, make sure that it is suitable for use as an SPSV. NTA sets the minimum standards that must be met by all vehicles.',
      },
      {
        id: 'ch3-2',
        question: 'What certificate must a vehicle have to operate as an SPSV?',
        options: [
          { id: 'A', label: 'Insurance certificate only' },
          { id: 'B', label: 'NCT (National Car Test) certificate only' },
          { id: 'C', label: 'Both NCT and insurance certificates' },
          { id: 'D', label: 'Tax clearance certificate' },
        ],
        correctAnswer: 'C',
        explanation: 'The vehicle must have a valid roadworthiness certificate (current NCT certificate) and a valid insurance certificate to operate as an SPSV.',
      },
      {
        id: 'ch3-3',
        question: "What is a 'modified vehicle'?",
        options: [
          { id: 'A', label: 'A vehicle that has been repainted' },
          { id: 'B', label: 'A vehicle that has been changed or adapted for a specific use' },
          { id: 'C', label: 'A vehicle that has been serviced' },
          { id: 'D', label: 'A vehicle that has been imported' },
        ],
        correctAnswer: 'B',
        explanation: 'A modified vehicle refers to any vehicle that has been changed or adapted for a specific use. For example, a vehicle that has been modified to be wheelchair accessible.',
      },
      {
        id: 'ch3-4',
        question: "What does 'maximum age' refer to in SPSV regulations?",
        options: [
          { id: 'A', label: 'The age of the driver' },
          { id: 'B', label: 'A vehicle age limit set for an SPSV' },
          { id: 'C', label: 'The age of the company' },
          { id: 'D', label: 'The age of the licence' },
        ],
        correctAnswer: 'B',
        explanation: 'The maximum age refers to a vehicle age limit that is set for an SPSV. This is applied to ensure safety and environmental standards are met.',
      },
    ],
  },
  {
    chapterId: 'chapter-4',
    chapterTitle: 'Chapter 4: Vehicle Licensing',
    questions: [
      {
        id: 'ch4-1',
        question: 'Who provides and manages SPSV vehicle licences?',
        options: [
          { id: 'A', label: 'An Garda Síochána' },
          { id: 'B', label: 'National Transport Authority (NTA)' },
          { id: 'C', label: 'Department of Transport' },
          { id: 'D', label: 'Local Authorities' },
        ],
        correctAnswer: 'B',
        explanation: 'Vehicle licences are provided and managed by NTA.',
      },
      {
        id: 'ch4-2',
        question: 'How many SPSV vehicle licence categories are there?',
        options: [
          { id: 'A', label: '4' },
          { id: 'B', label: '5' },
          { id: 'C', label: '6' },
          { id: 'D', label: '7' },
        ],
        correctAnswer: 'C',
        explanation: 'Each SPSV category has its own vehicle licence: Taxi licence, Wheelchair accessible taxi licence, Limousine licence, Hackney licence, Wheelchair accessible hackney licence, and Local area hackney licence.',
      },
      {
        id: 'ch4-3',
        question: 'Can a vehicle be licensed in more than one category at the same time?',
        options: [
          { id: 'A', label: 'Yes, up to 2 categories' },
          { id: 'B', label: 'Yes, up to 3 categories' },
          { id: 'C', label: 'No, only one category at any time' },
          { id: 'D', label: 'Yes, all categories' },
        ],
        correctAnswer: 'C',
        explanation: 'A vehicle may only be licensed in one category at any time.',
      },
      {
        id: 'ch4-4',
        question: 'What happens if a vehicle licence expires?',
        options: [
          { id: 'A', label: 'It can be renewed immediately' },
          { id: 'B', label: 'It can be renewed within 12 months' },
          { id: 'C', label: 'It can be renewed within 6 months' },
          { id: 'D', label: 'It cannot be renewed' },
        ],
        correctAnswer: 'B',
        explanation: 'A vehicle licence can be renewed within 12 months of expiry, but there may be additional fees for late renewal.',
      },
    ],
  },
  {
    chapterId: 'chapter-5',
    chapterTitle: 'Chapter 5: Working as an SPSV Operator',
    questions: [
      {
        id: 'ch5-1',
        question: 'What must be displayed on the dashboard of an SPSV?',
        options: [
          { id: 'A', label: 'Insurance certificate' },
          { id: 'B', label: 'Driver display card' },
          { id: 'C', label: 'Vehicle registration' },
          { id: 'D', label: 'Tax clearance certificate' },
        ],
        correctAnswer: 'B',
        explanation: 'Your driver display card must be clearly shown on the dashboard whenever you are working as an SPSV driver.',
      },
      {
        id: 'ch5-2',
        question: 'What must taxi drivers have for cashless payments?',
        options: [
          { id: 'A', label: 'A mobile phone' },
          { id: 'B', label: 'An in-taxi point of sale payment device' },
          { id: 'C', label: 'A credit card reader' },
          { id: 'D', label: 'A bank account' },
        ],
        correctAnswer: 'B',
        explanation: 'Taxi drivers must have an in-taxi point of sale payment device and must accept cashless payments for taxi journeys when requested by customers.',
      },
      {
        id: 'ch5-3',
        question: 'When can an SPSV driver refuse service?',
        options: [
          { id: 'A', label: 'For short journeys' },
          { id: 'B', label: 'For any reason' },
          { id: 'C', label: 'Only for passengers who smoke, are intoxicated, or exceed capacity' },
          { id: 'D', label: 'Never' },
        ],
        correctAnswer: 'C',
        explanation: 'You may reasonably refuse service to carry passengers who smoke, act in an aggressive/intoxicated manner, are likely to damage the vehicle, request journeys over 30km in a taxi, or exceed the permitted number of people.',
      },
      {
        id: 'ch5-4',
        question: 'What must be provided to customers at the end of a taxi journey?',
        options: [
          { id: 'A', label: 'A business card' },
          { id: 'B', label: 'A receipt from the taximeter printer' },
          { id: 'C', label: 'A handwritten note' },
          { id: 'D', label: 'Nothing' },
        ],
        correctAnswer: 'B',
        explanation: 'A taxi driver must have the ability to print a receipt from the printer attached to the taximeter. They must offer it to the customer at the end of every journey.',
      },
    ],
  },
  {
    chapterId: 'chapter-6',
    chapterTitle: 'Chapter 6: Finding Your Way Around',
    questions: [
      {
        id: 'ch6-1',
        question: 'What does GPS stand for?',
        options: [
          { id: 'A', label: 'Global Positioning System' },
          { id: 'B', label: 'General Positioning System' },
          { id: 'C', label: 'Geographic Positioning System' },
          { id: 'D', label: 'Guided Positioning System' },
        ],
        correctAnswer: 'A',
        explanation: 'GPS is a highly accurate satellite-based navigation system that lets drivers know where they are and helps them navigate.',
      },
      {
        id: 'ch6-2',
        question: 'What is the main purpose of route planning?',
        options: [
          { id: 'A', label: 'To save time' },
          { id: 'B', label: 'To save fuel' },
          { id: 'C', label: 'To provide efficient and safe journeys' },
          { id: 'D', label: 'To avoid traffic' },
        ],
        correctAnswer: 'C',
        explanation: 'Route planning is important to provide efficient and safe journeys for passengers.',
      },
      {
        id: 'ch6-3',
        question: "What is a 'sat nav'?",
        options: [
          { id: 'A', label: 'A paper map' },
          { id: 'B', label: 'A system that uses satellites to provide geographical positioning information' },
          { id: 'C', label: 'A compass' },
          { id: 'D', label: 'A street directory' },
        ],
        correctAnswer: 'B',
        explanation: 'A sat nav is a system that uses satellites to provide geographical positioning information. For drivers it is an electronic system for route guidance.',
      },
      {
        id: 'ch6-4',
        question: 'Why is reading a map important for SPSV drivers?',
        options: [
          { id: 'A', label: 'GPS devices are unreliable' },
          { id: 'B', label: 'It helps understand the area and provides backup navigation' },
          { id: 'C', label: "It's required by law" },
          { id: 'D', label: "It's cheaper than GPS" },
        ],
        correctAnswer: 'B',
        explanation: 'Reading a map helps drivers understand the area layout and provides backup navigation when GPS devices fail or lose signal.',
      },
    ],
  },
  {
    chapterId: 'chapter-7',
    chapterTitle: 'Chapter 7: Fares',
    questions: [
      {
        id: 'ch7-1',
        question: 'What must taxi drivers use to calculate fares?',
        options: [
          { id: 'A', label: 'A calculator' },
          { id: 'B', label: 'A taximeter' },
          { id: 'C', label: 'A mobile app' },
          { id: 'D', label: 'Fixed rates' },
        ],
        correctAnswer: 'B',
        explanation: 'Taxis must have a working taximeter that is set properly and checked in line with the National Maximum Taxi Fare Order.',
      },
      {
        id: 'ch7-2',
        question: 'Can taxi drivers charge more than the National Maximum Taxi Fare?',
        options: [
          { id: 'A', label: 'Yes, always' },
          { id: 'B', label: 'Yes, for long journeys' },
          { id: 'C', label: 'No, they may charge less but not more' },
          { id: 'D', label: 'Yes, with customer agreement' },
        ],
        correctAnswer: 'C',
        explanation: 'Taxi drivers may not charge more than the National Maximum Taxi Fare for any journey. They may charge less if they wish.',
      },
      {
        id: 'ch7-3',
        question: 'What does Tariff B cover?',
        options: [
          { id: 'A', label: 'The distance after 10 km' },
          { id: 'B', label: 'The distance after 12 km' },
          { id: 'C', label: 'The distance after 14.5 km or 42 minutes' },
          { id: 'D', label: 'The distance after 16 km' },
        ],
        correctAnswer: 'C',
        explanation: 'Tariff B is the standard fare charge that applies after Tariff A. This covers the distance after 14.5 km or 42 minutes of the journey.',
      },
      {
        id: 'ch7-4',
        question: 'What must hackney and limousine drivers provide at the end of a journey?',
        options: [
          { id: 'A', label: 'A printed receipt from a taximeter' },
          { id: 'B', label: 'A written receipt' },
          { id: 'C', label: 'No receipt required' },
          { id: 'D', label: 'An electronic receipt only' },
        ],
        correctAnswer: 'B',
        explanation: 'A hackney or limousine driver must make a written receipt available to the customer at the end of the journey.',
      },
    ],
  },
  {
    chapterId: 'chapter-8',
    chapterTitle: 'Chapter 8: Delivering Customer Satisfaction',
    questions: [
      {
        id: 'ch8-1',
        question: "What is the NTA's role in customer service?",
        options: [
          { id: 'A', label: 'To handle all customer complaints directly' },
          { id: 'B', label: 'To set standards and monitor service quality' },
          { id: 'C', label: 'To provide customer service training' },
          { id: 'D', label: 'To operate SPSV services' },
        ],
        correctAnswer: 'B',
        explanation: 'NTA sets standards for customer service and monitors the industry to ensure high-quality service delivery.',
      },
      {
        id: 'ch8-2',
        question: 'What must SPSV drivers accept at no extra charge?',
        options: [
          { id: 'A', label: 'Extra luggage' },
          { id: 'B', label: 'Guide dogs, assistance animals, and mobility aids' },
          { id: 'C', label: 'Additional passengers' },
          { id: 'D', label: 'Long journeys' },
        ],
        correctAnswer: 'B',
        explanation: 'You must accept and carry guide dogs, assistance animals and mobility aids for passengers who need them, at no extra charge.',
      },
      {
        id: 'ch8-3',
        question: 'What should drivers do with lost property?',
        options: [
          { id: 'A', label: 'Keep it' },
          { id: 'B', label: 'Dispose of it' },
          { id: 'C', label: 'Report it and try to return it to the owner' },
          { id: 'D', label: 'Sell it' },
        ],
        correctAnswer: 'C',
        explanation: 'Drivers should report lost property and make reasonable efforts to return it to the owner.',
      },
      {
        id: 'ch8-4',
        question: 'What is good customer service?',
        options: [
          { id: 'A', label: 'Being friendly only' },
          { id: 'B', label: 'Providing safe, clean, and professional service' },
          { id: 'C', label: 'Charging low fares' },
          { id: 'D', label: 'Driving fast' },
        ],
        correctAnswer: 'B',
        explanation: 'Good customer service includes keeping the vehicle clean and roadworthy, having good knowledge of routes, following passenger directions, and offering help with luggage.',
      },
    ],
  },
  {
    chapterId: 'chapter-9',
    chapterTitle: 'Chapter 9: Your SPSV Business',
    questions: [
      {
        id: 'ch9-1',
        question: "What is a 'sole trader'?",
        options: [
          { id: 'A', label: 'A company with multiple owners' },
          { id: 'B', label: 'An individual who operates a business on their own' },
          { id: 'C', label: 'A partnership' },
          { id: 'D', label: 'A limited company' },
        ],
        correctAnswer: 'B',
        explanation: 'A sole trader is an individual who operates a business on their own without partners or a separate legal entity.',
      },
      {
        id: 'ch9-2',
        question: 'What is a Private Limited Company (PLC)?',
        options: [
          { id: 'A', label: 'A business owned by one person' },
          { id: 'B', label: 'A business owned by individuals or groups who hold shares' },
          { id: 'C', label: 'A government-owned business' },
          { id: 'D', label: 'A partnership' },
        ],
        correctAnswer: 'B',
        explanation: 'A private limited company is a business owned by individuals or groups who hold shares in the company. It is legally separate from the owners.',
      },
      {
        id: 'ch9-3',
        question: 'Why is creating a business plan important?',
        options: [
          { id: 'A', label: "It's required by law" },
          { id: 'B', label: 'It helps organize your business goals and operations' },
          { id: 'C', label: "It's only for large businesses" },
          { id: 'D', label: "It's optional" },
        ],
        correctAnswer: 'B',
        explanation: 'Creating a business plan helps you organize your business goals, understand your market, plan your finances, and set clear objectives.',
      },
      {
        id: 'ch9-4',
        question: 'What should SPSV operators invest in for business success?',
        options: [
          { id: 'A', label: 'Only the vehicle' },
          { id: 'B', label: 'Vehicle and marketing' },
          { id: 'C', label: 'Ongoing training and skills development' },
          { id: 'D', label: 'Only advertising' },
        ],
        correctAnswer: 'C',
        explanation: 'Every successful business invests in ongoing training and skills development. The SPSV business operates in a constantly changing world and relies heavily on personal skills.',
      },
    ],
  },
  {
    chapterId: 'chapter-10',
    chapterTitle: 'Chapter 10: Staying Safe',
    questions: [
      {
        id: 'ch10-1',
        question: "What is NTA's role in safety?",
        options: [
          { id: 'A', label: 'To provide insurance' },
          { id: 'B', label: 'To set safety standards and regulations' },
          { id: 'C', label: 'To respond to emergencies' },
          { id: 'D', label: 'To provide first aid training' },
        ],
        correctAnswer: 'B',
        explanation: "NTA's role in safety includes setting safety standards, regulations, and ensuring compliance across the SPSV industry.",
      },
      {
        id: 'ch10-2',
        question: 'What should drivers do in case of a collision or emergency?',
        options: [
          { id: 'A', label: 'Continue driving' },
          { id: 'B', label: 'Stop safely, ensure safety, and contact emergency services if needed' },
          { id: 'C', label: 'Leave the scene' },
          { id: 'D', label: 'Only call insurance' },
        ],
        correctAnswer: 'B',
        explanation: 'In a collision or emergency, drivers should stop safely, ensure the safety of all involved, and contact emergency services if necessary.',
      },
      {
        id: 'ch10-3',
        question: 'What should drivers do to look after their personal security?',
        options: [
          { id: 'A', label: 'Nothing' },
          { id: 'B', label: 'Be aware of their surroundings and take precautions' },
          { id: 'C', label: 'Only work during day time' },
          { id: 'D', label: 'Avoid certain areas' },
        ],
        correctAnswer: 'B',
        explanation: 'Drivers should be aware of their surroundings, take appropriate security precautions, and follow safety guidelines.',
      },
      {
        id: 'ch10-4',
        question: 'What must drivers comply with regarding regulations?',
        options: [
          { id: 'A', label: 'Only SPSV regulations' },
          { id: 'B', label: 'Only road traffic regulations' },
          { id: 'C', label: 'All relevant regulations including SPSV, road traffic, and safety regulations' },
          { id: 'D', label: 'Only safety regulations' },
        ],
        correctAnswer: 'C',
        explanation: 'Drivers must comply with all relevant regulations including SPSV regulations, Road Traffic Act, and other safety and compliance requirements.',
      },
    ],
  },
  {
    chapterId: 'chapter-11',
    chapterTitle: 'Chapter 11: Preparing for Your Test',
    questions: [
      {
        id: 'ch11-1',
        question: 'How many modules does the SPSV Driver Entry Test have?',
        options: [
          { id: 'A', label: '1' },
          { id: 'B', label: '2' },
          { id: 'C', label: '3' },
          { id: 'D', label: '4' },
        ],
        correctAnswer: 'B',
        explanation: 'The SPSV Driver Entry Test has two modules: Industry Knowledge Module and Area Knowledge Module (county-specific).',
      },
      {
        id: 'ch11-2',
        question: 'What must new SPSV driver licence applicants pass?',
        options: [
          { id: 'A', label: 'Only the Industry Knowledge module' },
          { id: 'B', label: 'Only the Area Knowledge module' },
          { id: 'C', label: 'Both parts of the SPSV Driver Entry Test' },
          { id: 'D', label: 'Only a practical driving test' },
        ],
        correctAnswer: 'C',
        explanation: 'If you are a new SPSV driver licence applicant, you must pass the SPSV Driver Entry Test, which has two modules.',
      },
      {
        id: 'ch11-3',
        question: 'What must be completed after passing the SPSV Driver Entry Test?',
        options: [
          { id: 'A', label: 'Nothing' },
          { id: 'B', label: 'Only Safeguarding module' },
          { id: 'C', label: 'Only Disability Awareness module' },
          { id: 'D', label: 'Both Safeguarding and Disability Awareness modules' },
        ],
        correctAnswer: 'D',
        explanation: 'Once you pass the SPSV Driver Entry Test, you must then complete the free, online eLearning modules: Safeguarding module and Disability Awareness module.',
      },
      {
        id: 'ch11-4',
        question: 'When might a driver be required to take the Area Knowledge Test?',
        options: [
          { id: 'A', label: 'Never, if already licensed' },
          { id: 'B', label: 'Only when renewing' },
          { id: 'C', label: 'When wanting to operate in an additional county, or if NTA receives 3+ complaints about area knowledge' },
          { id: 'D', label: 'Every year' },
        ],
        correctAnswer: 'C',
        explanation: 'If you already hold an SPSV driver licence and wish to stand or ply for hire in a county other than where you were originally licensed, you must pass the area knowledge module for the additional area. You may also be asked to sit the test if NTA receives three or more complaints relating to your area knowledge.',
      },
    ],
  },
  {
    chapterId: 'appendices',
    chapterTitle: 'Appendices',
    questions: [
      {
        id: 'appendices-1',
        question: 'What does Appendix A cover?',
        options: [
          { id: 'A', label: 'Local area hackneys' },
          { id: 'B', label: 'Dispatch operator licensing' },
          { id: 'C', label: 'Vehicle age rules' },
          { id: 'D', label: 'Test information' },
        ],
        correctAnswer: 'C',
        explanation: 'Appendix A covers Vehicle age rules, including rules for new licence transactions, licence renewal transactions, change of vehicle transactions, and exchange of licence category.',
      },
      {
        id: 'appendices-2',
        question: 'What is a local area hackney?',
        options: [
          { id: 'A', label: 'A regular hackney' },
          { id: 'B', label: 'A hackney with restricted operating area (usually 5-7 km radius)' },
          { id: 'C', label: 'A wheelchair accessible hackney' },
          { id: 'D', label: 'A limousine' },
        ],
        correctAnswer: 'B',
        explanation: 'A local area hackney driver licence specifies a restricted area where the holder can pick up passengers, usually within a radius of 5 to 7 km of an approved local area.',
      },
      {
        id: 'appendices-3',
        question: 'What does Appendix C cover?',
        options: [
          { id: 'A', label: 'Vehicle age rules' },
          { id: 'B', label: 'Local area hackneys' },
          { id: 'C', label: 'Dispatch operator licensing' },
          { id: 'D', label: 'Test procedures' },
        ],
        correctAnswer: 'C',
        explanation: 'Appendix C covers Dispatch operator licensing, including requirements for operating as an SPSV dispatch operator, drivers and vehicles, booking services, customer complaints, and applying for a licence.',
      },
      {
        id: 'appendices-4',
        question: 'What is required to apply for a local area hackney vehicle licence?',
        options: [
          { id: 'A', label: 'Same as regular hackney' },
          { id: 'B', label: 'Different requirements specific to local area hackneys' },
          { id: 'C', label: 'No special requirements' },
          { id: 'D', label: 'Only vehicle inspection' },
        ],
        correctAnswer: 'B',
        explanation: 'Local area hackney vehicle licences have different requirements specific to local area hackneys, as outlined in Appendix B.',
      },
    ],
  },
];
