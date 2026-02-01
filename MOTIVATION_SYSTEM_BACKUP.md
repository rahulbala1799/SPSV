# Motivation System Backup

This file contains references to the motivation/achievements system that was developed but needs to be re-implemented correctly.

## Backup Location
All files are saved in: `/tmp/motivation_system_backup/`

## Files Backed Up

### API Routes
- `src/app/api/student/achievements/route.ts` - Main achievements API endpoint
- `src/app/api/student/achievements/mark-seen/route.ts` - Mark achievements as seen

### Data Files
- `src/data/achievements.ts` - Achievement definitions and logic
- `src/data/motivationalQuotes.ts` - Motivational quotes data

### Components
- `src/components/motivation/MedalsDisplay.tsx` - Display medals
- `src/components/motivation/MotivationalQuote.tsx` - Display quotes
- `src/components/motivation/TrophyShowcase.tsx` - Display trophies
- `src/components/motivation/LevelProgress.tsx` - Level progress bar
- `src/components/motivation/AchievementNotification.tsx` - Achievement notifications
- `src/components/motivation/index.ts` - Component exports

### Database Migration
- `prisma/migrations/20260201_add_achievements_system/migration.sql` - Database schema changes

## Important Notes

1. **Schema Mismatch**: The motivation system was built when the schema used plural model names (`users`, `students`, etc.), but the working commit (5dc54bb) uses singular names (`User`, `Student`, etc.)

2. **Relation Names**: Many relation names changed:
   - `studentProfile` → `students` (but in 5dc54bb it might be different)
   - `test` → `assigned_mcq_tests`
   - `questions` → `timed_test_questions` (for timed tests)
   - `test_questions` (for untimed tests)
   - `answer` → `test_answers`

3. **When Re-implementing**:
   - Check the current schema at 5dc54bb first
   - Update all Prisma queries to match the schema
   - Test each component individually
   - Ensure all relation names match the schema

## To Restore Files

```bash
# Copy files from backup
cp /tmp/motivation_system_backup/*.ts src/data/
cp /tmp/motivation_system_backup/*.tsx src/components/motivation/
cp /tmp/motivation_system_backup/achievements_route.ts src/app/api/student/achievements/route.ts
```

## Migration to Apply (when ready)

The achievements system migration adds:
- `achievements` table
- `student_achievements` table  
- `student_points` table
- `points_history` table
- `student_activities` table

Apply this migration only after ensuring the code matches the current schema structure.
