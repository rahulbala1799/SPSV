-- CreateTable
CREATE TABLE "website_leads" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "daysFreeFrom" TIMESTAMP(3),
    "daysFreeTo" TIMESTAMP(3),
    "whichDays" TEXT,
    "preferredTime" TEXT,
    "enrollmentType" TEXT,
    "preferredSchedule" TEXT,
    "hasAppliedForTest" BOOLEAN,
    "testDate" TIMESTAMP(3),
    "howDidYouHear" TEXT,
    "additionalNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "website_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "website_leads_email_idx" ON "website_leads"("email");

-- CreateIndex
CREATE INDEX "website_leads_source_idx" ON "website_leads"("source");

-- CreateIndex
CREATE INDEX "website_leads_status_idx" ON "website_leads"("status");

-- CreateIndex
CREATE INDEX "website_leads_createdAt_idx" ON "website_leads"("createdAt");
