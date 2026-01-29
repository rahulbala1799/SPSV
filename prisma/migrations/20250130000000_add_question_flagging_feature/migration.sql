-- CreateEnum
CREATE TYPE "FlaggedFrom" AS ENUM ('CHAPTER', 'TIMED_TEST', 'UNTIMED_TEST', 'ASSIGNED_TEST');

-- CreateTable
CREATE TABLE "flagged_questions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" TEXT,
    "questionBankId" TEXT,
    "flaggedFrom" "FlaggedFrom" NOT NULL DEFAULT 'CHAPTER',
    "flaggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unflaggedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "flagged_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flagged_questions_studentId_isActive_idx" ON "flagged_questions"("studentId", "isActive");

-- CreateIndex
CREATE INDEX "flagged_questions_questionId_idx" ON "flagged_questions"("questionId");

-- CreateIndex
CREATE INDEX "flagged_questions_questionBankId_idx" ON "flagged_questions"("questionBankId");

-- CreateUniqueConstraint
-- Note: PostgreSQL unique constraints treat NULLs specially (multiple NULLs allowed)
-- We need separate partial unique indexes for Question and QuestionBank
-- This ensures one active flag per student per question

-- Unique index for Question model (questionId is NOT NULL, questionBankId IS NULL)
CREATE UNIQUE INDEX "flagged_questions_student_question_unique_idx" 
ON "flagged_questions"("studentId", "questionId") 
WHERE "isActive" = true AND "questionId" IS NOT NULL;

-- Unique index for QuestionBank model (questionBankId is NOT NULL, questionId IS NULL)
CREATE UNIQUE INDEX "flagged_questions_student_questionbank_unique_idx" 
ON "flagged_questions"("studentId", "questionBankId") 
WHERE "isActive" = true AND "questionBankId" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "flagged_questions" ADD CONSTRAINT "flagged_questions_studentId_fkey" 
FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flagged_questions" ADD CONSTRAINT "flagged_questions_questionId_fkey" 
FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flagged_questions" ADD CONSTRAINT "flagged_questions_questionBankId_fkey" 
FOREIGN KEY ("questionBankId") REFERENCES "question_bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add Check Constraint: Ensure only one of questionId or questionBankId is set
ALTER TABLE "flagged_questions" 
ADD CONSTRAINT "flagged_questions_question_xor_check" 
CHECK (
  ("questionId" IS NOT NULL AND "questionBankId" IS NULL) OR
  ("questionId" IS NULL AND "questionBankId" IS NOT NULL)
);
