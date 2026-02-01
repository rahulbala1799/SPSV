/**
 * Chapter Utility Functions
 * 
 * Helper functions for working with chapter IDs and slugs
 */

/**
 * Convert chapter ID to slug
 * Example: "chapter_dublin_city_center" -> "dublin-city-center"
 */
export function chapterIdToSlug(chapterId: string): string {
  // Remove "chapter_" prefix if present
  let slug = chapterId.replace(/^chapter_/, '')
  
  // Replace underscores with hyphens
  slug = slug.replace(/_/g, '-')
  
  // Convert to lowercase
  slug = slug.toLowerCase()
  
  return slug
}

/**
 * Convert slug to chapter ID
 * Example: "dublin-city-center" -> "chapter_dublin_city_center"
 */
export function slugToChapterId(slug: string): string {
  // Replace hyphens with underscores
  let chapterId = slug.replace(/-/g, '_')
  
  // Add "chapter_" prefix if not present
  if (!chapterId.startsWith('chapter_')) {
    chapterId = `chapter_${chapterId}`
  }
  
  return chapterId
}

/**
 * Get chapter route path
 */
export function getChapterRoute(chapterId: string, path: 'main' | 'quiz' | 'results' | 'analytics' | 'chapter-mode' = 'main'): string {
  const slug = chapterIdToSlug(chapterId)
  
  const routes = {
    main: `/dashboard/chapters/${slug}`,
    quiz: `/dashboard/chapters/${slug}/quiz`,
    results: `/dashboard/chapters/${slug}/results`,
    analytics: `/dashboard/chapters/${slug}/analytics`,
    'chapter-mode': `/dashboard/chapters/${slug}/chapter-mode`,
  }
  
  return routes[path]
}

/**
 * Standard chapter ID to slug mapping
 * This should match the mapping in chapters/page.tsx
 */
export const CHAPTER_ID_MAP: Record<string, string> = {
  'chapter_industry_part1': 'industry-part1',
  'chapter_industry_part2': 'industry-part2',
  'chapter_industry_part3': 'industry-part3',
  'chapter_industry_5': 'industry-5',
  'chapter_industry_7': 'industry-7',
  'chapter_industry_8': 'industry-8',
  'chapter_southside_full': 'southside-full',
  'chapter_dublin_one_way_streets': 'dublin-one-way-streets',
  'chapter_southside_streets_2': 'southside-streets-2',
  'chapter_northside_routes': 'northside-routes',
  'chapter_churches_cemeteries': 'churches-cemeteries',
  'chapter_embassies': 'embassies',
  'chapter_tourist_attractions': 'tourist-attractions',
  'chapter_hospitals': 'hospitals',
  'chapter_schools_libraries_universities': 'schools-libraries-universities',
  'chapter_dublin_roads_navigation': 'dublin-roads-navigation',
  'chapter_routes': 'routes',
  'chapter_areas_and_roads': 'areas-and-roads',
}

/**
 * Get chapter slug from ID (with fallback to auto-generation)
 */
export function getChapterSlug(chapterId: string): string {
  // Check if we have a manual mapping
  if (CHAPTER_ID_MAP[chapterId]) {
    return CHAPTER_ID_MAP[chapterId]
  }
  
  // Fallback to auto-generation
  return chapterIdToSlug(chapterId)
}

/**
 * Get chapter ID from slug (with fallback to auto-generation)
 */
export function getChapterId(slug: string): string {
  // Check if we have a manual mapping (reverse lookup)
  const entry = Object.entries(CHAPTER_ID_MAP).find(([_, s]) => s === slug)
  if (entry) {
    return entry[0]
  }
  
  // Fallback to auto-generation
  return slugToChapterId(slug)
}

/**
 * Industry Knowledge chapter IDs
 */
export const INDUSTRY_CHAPTER_IDS = [
  'chapter_industry_part1',
  'chapter_industry_part2',
  'chapter_industry_part3',
  'chapter_industry_5',
  'chapter_industry_7',
  'chapter_industry_8',
]

/**
 * Check if a chapter is Industry Knowledge
 */
export function isIndustryChapter(chapterId: string): boolean {
  return INDUSTRY_CHAPTER_IDS.includes(chapterId)
}
