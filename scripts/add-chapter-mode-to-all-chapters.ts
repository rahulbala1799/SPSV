/**
 * Script to add Chapter Mode pages and buttons to all chapters
 * 
 * This script:
 * 1. Creates chapter-mode/page.tsx for each chapter
 * 2. Adds ChapterModeButton to each chapter's main page.tsx
 * 
 * Run with: npx tsx scripts/add-chapter-mode-to-all-chapters.ts
 */

import fs from 'fs'
import path from 'path'

const CHAPTER_CONFIGS = [
  { slug: 'routes', chapterId: 'chapter_routes', title: 'Routes' },
  { slug: 'northside-routes', chapterId: 'chapter_northside_routes', title: 'Northside Routes' },
  { slug: 'southside-full', chapterId: 'chapter_southside_full', title: 'Southside Full' },
  { slug: 'southside-streets-2', chapterId: 'chapter_southside_streets_2', title: 'Southside Streets 2' },
  { slug: 'dublin-one-way-streets', chapterId: 'chapter_dublin_one_way_streets', title: 'Dublin One Way Streets' },
  { slug: 'churches-cemeteries', chapterId: 'chapter_churches_cemeteries', title: 'Churches & Cemeteries' },
  { slug: 'embassies', chapterId: 'chapter_embassies', title: 'Embassies' },
  { slug: 'tourist-attractions', chapterId: 'chapter_tourist_attractions', title: 'Tourist Attractions' },
  { slug: 'hospitals', chapterId: 'chapter_hospitals', title: 'Hospitals' },
  { slug: 'schools-libraries-universities', chapterId: 'chapter_schools_libraries_universities', title: 'Schools, Libraries & Universities' },
  { slug: 'dublin-roads-navigation', chapterId: 'chapter_dublin_roads_navigation', title: 'Dublin Roads Navigation' },
  { slug: 'areas-and-roads', chapterId: 'chapter_areas_and_roads', title: 'Areas and Roads' },
  { slug: 'industry-part1', chapterId: 'chapter_industry_part1', title: 'Industry Knowledge Part 1' },
  { slug: 'industry-part2', chapterId: 'chapter_industry_part2', title: 'Industry Knowledge Part 2' },
  { slug: 'industry-part3', chapterId: 'chapter_industry_part3', title: 'Industry Knowledge Part 3' },
  { slug: 'industry-5', chapterId: 'chapter_industry_5', title: 'Industry Knowledge 5' },
  { slug: 'industry-7', chapterId: 'chapter_industry_7', title: 'Industry Knowledge 7' },
  { slug: 'industry-8', chapterId: 'chapter_industry_8', title: 'Industry Knowledge 8' },
]

const CHAPTER_MODE_PAGE_TEMPLATE = (slug: string, chapterId: string, title: string) => {
  // Generate function name from slug (capitalize each word)
  const functionName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'ChapterModePage'
  
  return `'use client'

import { ChapterModePage } from '@/components/chapters/ChapterModePage'

export default function ${functionName}() {
  return (
    <ChapterModePage
      chapterId="${chapterId}"
      chapterSlug="${slug}"
      chapterTitle="${title}"
    />
  )
}
`
}

function createChapterModePage(slug: string, chapterId: string, title: string) {
  const dirPath = path.join(process.cwd(), 'src/app/dashboard/chapters', slug, 'chapter-mode')
  const filePath = path.join(dirPath, 'page.tsx')
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${slug}/chapter-mode/page.tsx (already exists)`)
    return false
  }
  
  // Write file
  fs.writeFileSync(filePath, CHAPTER_MODE_PAGE_TEMPLATE(slug, chapterId, title))
  console.log(`✅ Created ${slug}/chapter-mode/page.tsx`)
  return true
}

function addButtonToChapterPage(slug: string) {
  const filePath = path.join(process.cwd(), 'src/app/dashboard/chapters', slug, 'page.tsx')
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${slug}/page.tsx (file not found)`)
    return false
  }
  
  let content = fs.readFileSync(filePath, 'utf-8')
  
  // Check if button already exists
  if (content.includes('ChapterModeButton') || content.includes('chapter-mode')) {
    console.log(`⏭️  Skipping ${slug}/page.tsx (button already exists)`)
    return false
  }
  
  // Add import
  if (!content.includes("from '@/components/chapters/ChapterModeButton'")) {
    // Find the last import line
    const importMatch = content.match(/(import.*from.*['"]@\/components.*['"];?\s*\n)/g)
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1]
      const importIndex = content.lastIndexOf(lastImport) + lastImport.length
      content = content.slice(0, importIndex) + 
        "import { ChapterModeButton } from '@/components/chapters/ChapterModeButton'\n" +
        content.slice(importIndex)
    } else {
      // Add after first import
      const firstImportEnd = content.indexOf('\n', content.indexOf('import'))
      content = content.slice(0, firstImportEnd + 1) + 
        "import { ChapterModeButton } from '@/components/chapters/ChapterModeButton'\n" +
        content.slice(firstImportEnd + 1)
    }
  }
  
  // Find where to insert button (after chapter info card, before question count selector)
  const questionCountPattern = /(\s*)(\{\/\* Question Count Selector)/g
  const match = questionCountPattern.exec(content)
  
  if (match) {
    const insertIndex = match.index
    const indent = match[1]
    const buttonCode = `${indent}{/* Chapter Mode Button */}\n${indent}<ChapterModeButton chapterSlug="${slug}" />\n\n`
    content = content.slice(0, insertIndex) + buttonCode + content.slice(insertIndex)
    fs.writeFileSync(filePath, content)
    console.log(`✅ Added button to ${slug}/page.tsx`)
    return true
  } else {
    console.log(`⚠️  Could not find insertion point in ${slug}/page.tsx`)
    return false
  }
}

function main() {
  console.log('🚀 Adding Chapter Mode to all chapters...\n')
  
  let pagesCreated = 0
  let buttonsAdded = 0
  
  for (const config of CHAPTER_CONFIGS) {
    console.log(`\n📚 Processing: ${config.title}`)
    
    if (createChapterModePage(config.slug, config.chapterId, config.title)) {
      pagesCreated++
    }
    
    if (addButtonToChapterPage(config.slug)) {
      buttonsAdded++
    }
  }
  
  console.log(`\n✨ Done!`)
  console.log(`   - Created ${pagesCreated} chapter-mode pages`)
  console.log(`   - Added ${buttonsAdded} buttons to chapter pages`)
}

main()
