# Industry Knowledge Chapters - Implementation Guide

This document outlines the Industry Knowledge chapters for the SPSV Taxi License training system.

## Chapter Structure

### Industry Knowledge - Part 1 (21 Questions)
- **Chapter ID**: `chapter_industry_part1`
- **Duration**: 25 minutes
- **Topics Covered**:
  - SPSV acronym and definitions
  - National Transport Authority (NTA)
  - Regulatory bodies and their roles
  - Licensing basics
  - Vehicle categories
  - Taxi Advisory Committee
  - SPSV Register

### Industry Knowledge - Part 2 (24 Questions)
- **Chapter ID**: `chapter_industry_part2`
- **Duration**: 30 minutes
- **Topics Covered**:
  - SPSV driver licence applications
  - Garda vetting process
  - Tax clearance requirements
  - Driver ID cards and colors
  - Vehicle specifications (capacity, weight, boot space)
  - Window tinting regulations
  - Wheelchair accessibility requirements
  - Safety equipment (ramps, headroom)

### Industry Knowledge - Part 3 (20 Questions)
- **Chapter ID**: `chapter_industry_part3`
- **Duration**: 25 minutes  
- **Topics Covered**:
  - SPSV vehicle licensing
  - Conditional offer letters
  - Fire extinguishers and first aid kits
  - In-vehicle information cards
  - Taxi meter installation
  - Appointment and renewal procedures
  - Nominee appointments
  - Advertising regulations

## Total Question Count
- **Part 1**: 21 questions
- **Part 2**: 24 questions
- **Part 3**: 20 questions
- **Total**: 65 Industry Knowledge questions

## Database Seeding

The seed script `prisma/seed-industry-knowledge.ts` contains Part 1 questions (21).
Parts 2 and 3 need to be added following the same structure.

### Running the Seed Script

```bash
# Generate Prisma client
npx prisma generate

# Run the seed script
npx ts-node prisma/seed-industry-knowledge.ts
```

## Chapter Organization

The chapters page now shows two categories:

1. **Industry Knowledge** (3 chapters)
   - Part 1, Part 2, Part 3
   
2. **Area Knowledge** (1+ chapters)
   - Southside Full
   - (More area chapters to be added)

## Question Format

All questions follow the standard MCQ format:
- Question text
- 4 options (A, B, C, D)
- 1 correct answer
- Explanation for learning

## Navigation Structure

```
/dashboard/chapters
├── Industry Knowledge
│   ├── /dashboard/chapters/industry-part1
│   ├── /dashboard/chapters/industry-part2
│   └── /dashboard/chapters/industry-part3
└── Area Knowledge
    └── /dashboard/chapters/southside-full
```

## Implementation Status

- [x] Chapter structure defined
- [x] Chapters page updated with categories  
- [x] Complete seed script with all 3 parts (65 questions total)
- [x] Database seeded successfully
- [x] Individual chapter detail pages (Part 1, 2, 3)
- [x] API routes working (`/api/chapters/[chapterId]`)
- [ ] Quiz pages for each part
- [ ] Results pages for each part
- [ ] Analytics pages for each part

## Next Steps

1. Complete seed scripts for Parts 2 and 3
2. Run database seeding
3. Create chapter detail pages (copy pattern from southside-full)
4. Create quiz pages for each part
5. Test the complete flow
6. Deploy to production

## Notes

- All Industry Knowledge questions are from official SPSV examination materials
- Questions test regulatory knowledge, not geographical knowledge
- Students must complete all 3 parts for comprehensive industry knowledge
- Each part can be practiced independently
- Progress tracking works across all parts
