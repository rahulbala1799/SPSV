-- Update the question "Which road runs from Drumcondra to Fairview?"
-- This script updates both the Question table and QuestionBank table

-- First, update the Question table
UPDATE questions
SET 
  options = '[
    {"id": "A", "text": "Griffith Avenue"},
    {"id": "B", "text": "Richmond Road"},
    {"id": "C", "text": "Drumcondra Road"},
    {"id": "D", "text": "Ballybough Road"}
  ]'::jsonb,
  "correctAnswer" = 'B',
  explanation = 'Richmond Road runs from Drumcondra to Fairview in Dublin.',
  "updatedAt" = NOW()
WHERE 
  "chapterId" = 'chapter_northside_routes'
  AND "questionNumber" = 55
  AND "questionText" = 'Which road runs from Drumcondra to Fairview?';

-- Then, update the QuestionBank table
-- Find the question by text and update it
UPDATE question_bank
SET 
  "optionB" = 'Richmond Road',
  "correctAnswer" = 'B',
  explanation = 'Richmond Road runs from Drumcondra to Fairview in Dublin.',
  "updatedAt" = NOW()
WHERE 
  "questionText" = 'Which road runs from Drumcondra to Fairview?'
  AND category = 'AREA_KNOWLEDGE';

-- Verify the update
SELECT 
  id,
  "questionText",
  options,
  "correctAnswer",
  explanation
FROM questions
WHERE 
  "chapterId" = 'chapter_northside_routes'
  AND "questionNumber" = 55;

SELECT 
  id,
  "questionText",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctAnswer",
  explanation
FROM question_bank
WHERE 
  "questionText" = 'Which road runs from Drumcondra to Fairview?';
