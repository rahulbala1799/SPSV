# Update Instructions: Drumcondra to Fairview Question

## Summary
Updated the question "Which road runs from Drumcondra to Fairview?" to have the correct answer as **Richmond Road** (option B) instead of Malahide Road.

## Changes Made

### 1. Seed File Updated ✅
- **File:** `prisma/seed-northside-routes.ts`
- **Question Number:** 55
- **Changes:**
  - Option B changed from "Malahide Road" to "Richmond Road"
  - Correct answer remains "B" (now Richmond Road)
  - Explanation updated to: "Richmond Road runs from Drumcondra to Fairview in Dublin."

### 2. Database Update Options

You have two options to update the live database:

#### Option A: Run the SQL Script (Recommended - Direct Update)
Run the SQL script directly against your database:

```bash
# Using psql
psql $DATABASE_URL -f scripts/update-drumcondra-fairview-question.sql

# Or if DATABASE_URL is not set, use:
psql "your-database-url" -f scripts/update-drumcondra-fairview-question.sql
```

This will:
- Update the question in the `questions` table
- Update the corresponding entry in the `question_bank` table
- Show verification queries to confirm the update

#### Option B: Re-run the Seed Script
Since the seed file has been updated, you can re-run the seed script:

```bash
npx tsx prisma/seed-northside-routes.ts
```

**Note:** This will delete ALL questions in the Northside Routes chapter and recreate them. This is safe if you want to ensure all questions are in sync with the seed file.

#### Option C: Use the TypeScript Update Script
If database connection issues are resolved:

```bash
npx tsx scripts/update-drumcondra-fairview-question.ts
```

This script will:
- Update the question in the `questions` table
- Automatically sync to `question_bank` table

## Verification

After updating, verify the changes:

```sql
-- Check Question table
SELECT 
  "questionText",
  options->1 as option_b,
  "correctAnswer",
  explanation
FROM questions
WHERE 
  "chapterId" = 'chapter_northside_routes'
  AND "questionNumber" = 55;

-- Check QuestionBank table
SELECT 
  "questionText",
  "optionB",
  "correctAnswer",
  explanation
FROM question_bank
WHERE 
  "questionText" = 'Which road runs from Drumcondra to Fairview?';
```

Expected results:
- Option B should be "Richmond Road"
- Correct answer should be "B"
- Explanation should mention "Richmond Road"

## Files Modified

1. ✅ `prisma/seed-northside-routes.ts` - Updated question data
2. ✅ `scripts/update-drumcondra-fairview-question.ts` - TypeScript update script
3. ✅ `scripts/update-drumcondra-fairview-question.sql` - SQL update script
