-- CreateEnum
CREATE TYPE "TestState" AS ENUM ('CREATED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('INDUSTRY_KNOWLEDGE', 'AREA_KNOWLEDGE');

-- AlterTable: Add category to Chapter
ALTER TABLE "chapters" ADD COLUMN "category" "QuestionCategory";

-- AlterTable: Add category to Question
ALTER TABLE "questions" ADD COLUMN "category" "QuestionCategory";

-- CreateIndex for Question category
CREATE INDEX "questions_category_idx" ON "questions"("category");

-- CreateTable: UntimedTestAttempt
CREATE TABLE "untimed_test_attempts" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "state" "TestState" NOT NULL DEFAULT 'CREATED',
    "score" INTEGER,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "totalAnswered" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastQuestionAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "untimed_test_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable: TestQuestion
CREATE TABLE "test_questions" (
    "id" TEXT NOT NULL,
    "testAttemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionOrder" INTEGER NOT NULL,
    "selectedAnswer" TEXT,
    "isCorrect" BOOLEAN,
    "answeredAt" TIMESTAMP(3),
    "idempotencyKey" TEXT,

    CONSTRAINT "test_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "untimed_test_attempts_studentId_state_idx" ON "untimed_test_attempts"("studentId", "state");

-- CreateIndex
CREATE INDEX "untimed_test_attempts_studentId_createdAt_idx" ON "untimed_test_attempts"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "untimed_test_attempts_expiresAt_idx" ON "untimed_test_attempts"("expiresAt");

-- CreateIndex
CREATE INDEX "test_questions_idempotencyKey_idx" ON "test_questions"("idempotencyKey");

-- CreateIndex: Unique constraints for TestQuestion
CREATE UNIQUE INDEX "test_questions_testAttemptId_questionOrder_key" ON "test_questions"("testAttemptId", "questionOrder");

-- CreateIndex: Unique constraints for TestQuestion
CREATE UNIQUE INDEX "test_questions_testAttemptId_questionId_key" ON "test_questions"("testAttemptId", "questionId");

-- AddForeignKey
ALTER TABLE "untimed_test_attempts" ADD CONSTRAINT "untimed_test_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_questions" ADD CONSTRAINT "test_questions_testAttemptId_fkey" FOREIGN KEY ("testAttemptId") REFERENCES "untimed_test_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_questions" ADD CONSTRAINT "test_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
