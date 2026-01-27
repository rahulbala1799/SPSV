-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('FULL_TIMED', 'MOCK');

-- CreateEnum
CREATE TYPE "TestSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "TimedQuestionCategory" AS ENUM ('INDUSTRY', 'AREA_KNOWLEDGE');

-- CreateTable
CREATE TABLE "question_bank" (
    "id" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "category" "TimedQuestionCategory" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "timesUsed" INTEGER NOT NULL DEFAULT 0,
    "timesCorrect" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testType" "TestType" NOT NULL,
    "status" "TestSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "totalQuestions" INTEGER NOT NULL,
    "industryQuestions" INTEGER NOT NULL DEFAULT 0,
    "areaQuestions" INTEGER NOT NULL DEFAULT 0,
    "timeAllotted" INTEGER NOT NULL,
    "timeRemaining" INTEGER NOT NULL,
    "score" INTEGER,
    "scorePercentage" DECIMAL(65,30),
    "industryScore" INTEGER NOT NULL DEFAULT 0,
    "areaScore" INTEGER NOT NULL DEFAULT 0,
    "industryPercentage" DECIMAL(65,30),
    "areaPercentage" DECIMAL(65,30),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timed_test_questions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionBankId" TEXT NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "category" "TimedQuestionCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timed_test_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_answers" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedAnswer" TEXT,
    "isCorrect" BOOLEAN,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "answeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "question_bank_category_idx" ON "question_bank"("category");

-- CreateIndex
CREATE INDEX "question_bank_category_isActive_idx" ON "question_bank"("category", "isActive");

-- CreateIndex
CREATE INDEX "test_sessions_userId_idx" ON "test_sessions"("userId");

-- CreateIndex
CREATE INDEX "test_sessions_userId_status_idx" ON "test_sessions"("userId", "status");

-- CreateIndex
CREATE INDEX "test_sessions_userId_completedAt_idx" ON "test_sessions"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "test_sessions_testType_idx" ON "test_sessions"("testType");

-- CreateIndex
CREATE INDEX "timed_test_questions_sessionId_idx" ON "timed_test_questions"("sessionId");

-- CreateIndex
CREATE INDEX "timed_test_questions_sessionId_orderNumber_idx" ON "timed_test_questions"("sessionId", "orderNumber");

-- CreateIndex
CREATE INDEX "test_answers_sessionId_idx" ON "test_answers"("sessionId");

-- CreateIndex
CREATE INDEX "test_answers_sessionId_questionId_idx" ON "test_answers"("sessionId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "test_answers_questionId_key" ON "test_answers"("questionId");

-- AddForeignKey
ALTER TABLE "test_sessions" ADD CONSTRAINT "test_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timed_test_questions" ADD CONSTRAINT "timed_test_questions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "test_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timed_test_questions" ADD CONSTRAINT "timed_test_questions_questionBankId_fkey" FOREIGN KEY ("questionBankId") REFERENCES "question_bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_answers" ADD CONSTRAINT "test_answers_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "test_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_answers" ADD CONSTRAINT "test_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "timed_test_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
