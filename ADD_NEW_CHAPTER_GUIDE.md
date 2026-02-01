# 📚 Complete Guide: Adding a New Chapter

This guide walks you through adding a new chapter that is **fully integrated** with:
- ✅ Quizzes (interactive practice)
- ✅ Tests (untimed tests pull questions from chapters)
- ✅ Admin Dashboard (results and analytics)
- ✅ Answer Explanations (learning descriptions shown everywhere)

---

## 🎯 Overview

When you add a new chapter, it automatically:
1. Appears in the student chapters list
2. Works with quizzes and practice sessions
3. Questions appear in untimed tests (if category matches)
4. Shows up in admin dashboard analytics
5. Displays answer explanations for learning

---

## 📋 Step-by-Step Process

### **Step 1: Create the Chapter in Admin Dashboard**

1. Go to `/admin/content`
2. Click **"New Chapter"** button
3. Fill in the form:
   - **Title**: e.g., "Dublin City Center"
   - **Description**: Brief description of what the chapter covers
   - **Chapter Number**: Next available number (check existing chapters)
   - **Category**: 
     - `INDUSTRY_KNOWLEDGE` - For SPSV regulations, licensing, etc.
     - `AREA_KNOWLEDGE` - For Dublin routes, landmarks, navigation
   - **Type**: `MCQ` (default)
   - **Duration**: Estimated minutes (e.g., 30)
   - **Visible to Students**: ✅ Check this to make it live immediately
4. Click **"Save Chapter"**

**Result**: Chapter is created in the database with a unique ID (e.g., `chapter_dublin_city_center`)

---

### **Step 2: Add Questions to the Chapter**

1. In the admin dashboard, expand your new chapter
2. Click **"Add Question"**
3. Fill in the question form:
   - **Question Text**: The actual question
   - **Options**: 4 answer choices (A, B, C, D)
   - **Correct Answer**: Select which option is correct
   - **Explanation**: ⭐ **IMPORTANT** - Add a detailed explanation here!
     - This explanation appears:
       - After students answer in quizzes
       - In test results pages
       - In admin dashboard when reviewing answers
     - Example: "Merrion Road is the main road connecting Merrion to Ballsbridge. It runs parallel to the coast and is a key route for accessing the RDS and Aviva Stadium."
   - **Difficulty**: Easy, Medium, or Hard
   - **Points**: Usually 1
4. Click **"Save Question"**
5. Repeat for all questions in the chapter

**Result**: Questions are automatically synced to QuestionBank (if chapter is active) and available for timed tests.

---

### **Step 3: Create Chapter Route Files**

You need to create 4 route files for the chapter. Use the chapter slug (derived from chapter ID).

**Chapter Slug Format**: Convert `chapter_dublin_city_center` → `dublin-city-center`
- Remove `chapter_` prefix
- Replace underscores with hyphens
- Make lowercase

#### **File 1: Chapter Main Page**
Create: `src/app/dashboard/chapters/[slug]/page.tsx`

Use the template from `southside-full/page.tsx` and update:
- Chapter ID in API calls
- Chapter title/description
- Route paths

#### **File 2: Quiz Page**
Create: `src/app/dashboard/chapters/[slug]/quiz/page.tsx`

Use the template from `southside-full/quiz/page.tsx` and update:
- Chapter ID in API calls
- Route paths

#### **File 3: Results Page**
Create: `src/app/dashboard/chapters/[slug]/results/page.tsx`

Use the template from `southside-full/results/page.tsx` and update:
- Chapter ID in API calls
- Route paths

#### **File 4: Analytics Page**
Create: `src/app/dashboard/chapters/[slug]/analytics/page.tsx`

Use the template from `southside-full/analytics/page.tsx` and update:
- Chapter ID in API calls
- Route paths

**Note**: We're working on making this fully dynamic so you don't need to create these files manually.

---

### **Step 4: Update Chapter ID Mapping**

Add your chapter to the mapping in these files:

1. **`src/app/dashboard/chapters/page.tsx`**
   - Add to `chapterIdMap` object
   - Add to `industryIds` array if it's Industry Knowledge

2. **`src/app/dashboard/progress/page.tsx`**
   - Add to `routeMap` object

3. **`src/app/dashboard/flagged-questions/page.tsx`**
   - Add to `slugMap` in `getChapterSlug` function

**Example**:
```typescript
const chapterIdMap: Record<string, string> = {
  // ... existing chapters
  'chapter_dublin_city_center': 'dublin-city-center',
}
```

---

### **Step 5: Verify Integration**

#### **Student View**
1. Go to `/dashboard/chapters`
2. Your new chapter should appear in the appropriate section (Industry/Area)
3. Click on it → Should show chapter details
4. Start practice → Should load questions
5. Answer a question → Should show explanation immediately
6. Complete chapter → Should show results with explanations

#### **Admin Dashboard**
1. Go to `/admin/students/[studentId]`
2. Click "Chapters" tab
3. Your new chapter should appear with student progress
4. Click on it → Should show detailed analytics

#### **Tests**
1. Go to `/dashboard/tests/untimed`
2. Create a test with the same category as your chapter
3. Questions from your chapter should appear in the test
4. After completing test → Results should show explanations

---

## 🔑 Key Points

### **Answer Explanations**

Explanations are displayed in:
1. ✅ **Quiz Interface** - After submitting each answer
2. ✅ **Chapter Results** - Review page after completing chapter
3. ✅ **Test Results** - After completing untimed/timed tests
4. ✅ **Admin Dashboard** - When reviewing student answers
5. ✅ **Flagged Questions** - When students review flagged questions

**Best Practices for Explanations**:
- Be clear and educational
- Explain WHY the answer is correct
- Mention common mistakes if relevant
- Include context or additional information
- Keep it concise but informative

### **Chapter Categories**

- **INDUSTRY_KNOWLEDGE**: 
  - SPSV regulations
  - Licensing requirements
  - Vehicle specifications
  - Industry rules

- **AREA_KNOWLEDGE**:
  - Dublin routes and roads
  - Landmarks and locations
  - Navigation
  - Geography

### **Chapter Visibility**

- **isActive = true**: Chapter visible to students, questions in tests
- **isActive = false**: Hidden from students, questions not in tests (draft mode)

---

## 🚀 Quick Start Template

Here's a quick template for adding a new chapter:

```typescript
// 1. Chapter ID (from database)
const chapterId = 'chapter_your_new_chapter'

// 2. Chapter Slug (for routes)
const chapterSlug = 'your-new-chapter' // lowercase, hyphens

// 3. Add to chapterIdMap
const chapterIdMap: Record<string, string> = {
  // ... existing
  [chapterId]: chapterSlug,
}

// 4. API Endpoints (all use chapterId)
GET /api/chapters/${chapterId}
GET /api/chapters/${chapterId}/questions
POST /api/chapters/${chapterId}/questions/${questionId}/answer
GET /api/chapters/${chapterId}/progress
GET /api/analytics/chapter/${chapterId}

// 5. Routes (all use chapterSlug)
/dashboard/chapters/${chapterSlug}
/dashboard/chapters/${chapterSlug}/quiz
/dashboard/chapters/${chapterSlug}/results
/dashboard/chapters/${chapterSlug}/analytics
```

---

## ✅ Checklist

Before considering a chapter complete:

- [ ] Chapter created in admin dashboard
- [ ] Chapter is active (visible to students)
- [ ] At least 5 questions added
- [ ] All questions have explanations
- [ ] Chapter route files created (or using dynamic routes)
- [ ] Chapter ID mapping updated in all files
- [ ] Chapter appears in student chapters list
- [ ] Quiz functionality works
- [ ] Results page shows explanations
- [ ] Questions appear in untimed tests (if category matches)
- [ ] Admin dashboard shows chapter analytics
- [ ] Tested with a student account

---

## 🐛 Troubleshooting

### Chapter not appearing in student view
- Check `isActive` is `true` in database
- Verify chapter ID mapping is correct
- Check API endpoint returns chapter data

### Questions not showing in tests
- Verify chapter category matches test category
- Check questions are synced to QuestionBank
- Ensure chapter is active

### Explanations not showing
- Verify `explanation` field is filled in database
- Check results page includes explanation display
- Ensure API returns explanation field

### Routes not working
- Verify chapter slug matches route folder name
- Check chapter ID mapping is correct
- Ensure route files exist (or dynamic routes are set up)

---

## 📞 Need Help?

If you encounter issues:
1. Check the database directly (Prisma Studio)
2. Verify API endpoints return expected data
3. Check browser console for errors
4. Review existing chapter implementations for reference

---

## 🎉 You're Done!

Once all steps are complete, your new chapter is fully integrated and ready for students to use!
