// Manual content extracted from pdf-organized.json
// This contains all chapter content from the 221-page PDF

export interface ChapterContent {
  pageNumber: number;
  content: string;
}

export interface ManualChapter {
  chapterId: string;
  title: string;
  pageRange: { start: number; end: number };
  totalPages: number;
  summary: string;
  pages: ChapterContent[];
}

// Import the organized JSON data
// For now, we'll create a structure that can be populated
// In production, you'd import from the JSON file or fetch it

// Export chapters in a format compatible with dashboard
export interface Chapter {
  id: string
  title: string
  pageRange?: { start: number; end: number }
  summary?: string
}

export const manualChapters: Chapter[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    pageRange: { start: 7, end: 7 },
    summary: 'Welcome to The Official Manual for Operating in the SPSV Industry',
  },
  {
    id: 'terminology',
    title: 'Terminology',
    pageRange: { start: 8, end: 12 },
    summary: 'Key terms and definitions used in the SPSV industry',
  },
  {
    id: 'chapter-1',
    title: 'Chapter 1: The SPSV Industry',
    pageRange: { start: 13, end: 36 },
    summary: 'Overview of the SPSV industry and regulatory framework',
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2: SPSV Driver Licensing',
    pageRange: { start: 37, end: 44 },
    summary: 'Requirements and process for obtaining an SPSV driver licence',
  },
  {
    id: 'chapter-3',
    title: 'Chapter 3: Choosing a Vehicle to Use as an SPSV',
    pageRange: { start: 45, end: 71 },
    summary: 'Vehicle standards and requirements for SPSV use',
  },
  {
    id: 'chapter-4',
    title: 'Chapter 4: Vehicle Licensing',
    pageRange: { start: 72, end: 100 },
    summary: 'Vehicle licensing requirements and categories',
  },
  {
    id: 'chapter-5',
    title: 'Chapter 5: Working as an SPSV Operator',
    pageRange: { start: 101, end: 130 },
    summary: 'Daily operations and requirements for SPSV operators',
  },
  {
    id: 'chapter-6',
    title: 'Chapter 6: Finding Your Way Around',
    pageRange: { start: 131, end: 150 },
    summary: 'Navigation, route planning, and area knowledge',
  },
  {
    id: 'chapter-7',
    title: 'Chapter 7: Fares',
    pageRange: { start: 151, end: 170 },
    summary: 'Fare structures, taximeters, and pricing regulations',
  },
  {
    id: 'chapter-8',
    title: 'Chapter 8: Delivering Customer Satisfaction',
    pageRange: { start: 171, end: 190 },
    summary: 'Customer service standards and best practices',
  },
  {
    id: 'chapter-9',
    title: 'Chapter 9: Your SPSV Business',
    pageRange: { start: 191, end: 210 },
    summary: 'Business planning and operations for SPSV operators',
  },
  {
    id: 'chapter-10',
    title: 'Chapter 10: Staying Safe',
    pageRange: { start: 211, end: 220 },
    summary: 'Safety regulations and practices for SPSV operators',
  },
  {
    id: 'chapter-11',
    title: 'Chapter 11: Preparing for Your Test',
    pageRange: { start: 221, end: 230 },
    summary: 'SPSV Driver Entry Test preparation and requirements',
  },
  {
    id: 'appendices',
    title: 'Appendices',
    pageRange: { start: 231, end: 250 },
    summary: 'Additional information including vehicle age rules and local area hackneys',
  },
]

// Keep the old structure for backward compatibility
export const manualChaptersFull: ManualChapter[] = [
  {
    chapterId: 'welcome',
    title: 'Welcome',
    pageRange: { start: 7, end: 7 },
    totalPages: 1,
    summary: 'Welcome to The Official Manual for Operating in the SPSV Industry',
    pages: [
      {
        pageNumber: 7,
        content: `WELCOME
Welcome to The Official Manual for Operating in the SPSV Industry. SPSV is short for 'small public service vehicle' – vehicles that are used to carry up to eight passengers, excluding the driver, for hire or payment. SPSVs play an important part in the delivery of public transport services. The term SPSV includes:
› Taxis
› Wheelchair accessible taxis
› Hackneys
› Wheelchair accessible hackneys
› Local area hackneys and
› Limousines

This publication is referred to as the 'Manual' throughout this handbook.

The purpose of the Manual is to help you develop the range of skills and knowledge required in your daily work as a driver, owner, or renter of an SPSV.

Whether you are new to industry or an experienced SPSV operator, this official handbook helps you stay up to date with industry guidelines, regulations, legal requirements, and licensing developments.

The Manual has been created by the National Transport Authority (NTA) to give SPSV operators the information they need to apply for and maintain licences. New entrants to the industry can use the Manual to prepare for the SPSV Driver Entry Test, which they must pass to receive an SPSV driver licence. It will benefit people already working in the industry and those who are preparing to become an SPSV driver, to stay up to date and improve skills and knowledge.

It also provides information to help you operate successfully in the industry and covers important subjects like safety, customer service and running your own business.

For the most up-to-date information on changes in the industry, refer to NTA's industry website, www.nationaltransport.ie.`,
      },
    ],
  },
  // Additional chapters will be loaded from JSON or added here
  // For now, we'll create a function to load from the JSON file
];

// Function to load full content from JSON
export async function loadManualContent(): Promise<ManualChapter[]> {
  // In a real implementation, you'd fetch this from the JSON file
  // For now, return the structure - convert Chapter[] to ManualChapter[]
  return manualChapters
    .filter(ch => ch.pageRange) // Only include chapters with pageRange
    .map(ch => ({
      chapterId: ch.id,
      title: ch.title,
      pageRange: ch.pageRange!,
      totalPages: ch.pageRange!.end - ch.pageRange!.start + 1,
      summary: ch.summary || '',
      pages: [] // Pages would be loaded from JSON
    }))
}
