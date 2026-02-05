-- AlterTable
-- Add optional studentPointsId to points_history (schema was updated but this column was never migrated)
ALTER TABLE "points_history" ADD COLUMN "studentPointsId" TEXT;

-- CreateIndex
CREATE INDEX "points_history_studentPointsId_idx" ON "points_history"("studentPointsId");

-- AddForeignKey
ALTER TABLE "points_history" ADD CONSTRAINT "points_history_studentPointsId_fkey" FOREIGN KEY ("studentPointsId") REFERENCES "student_points"("id") ON DELETE SET NULL ON UPDATE CASCADE;
