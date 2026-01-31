-- AlterTable
ALTER TABLE "question_bank" ADD COLUMN "sourceQuestionId" TEXT;

-- CreateIndex
CREATE INDEX "question_bank_sourceQuestionId_idx" ON "question_bank"("sourceQuestionId");
