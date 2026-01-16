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

export const manualChapters: ManualChapter[] = [
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
  // For now, return the structure
  return manualChapters;
}
