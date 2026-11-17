-- CreateTable
CREATE TABLE "public"."UserPlanEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planSlug" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPlanEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPlanDayCompletion" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPlanDayCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserPlanEnrollment_userId_idx" ON "public"."UserPlanEnrollment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPlanEnrollment_userId_planSlug_durationDays_key" ON "public"."UserPlanEnrollment"("userId", "planSlug", "durationDays");

-- CreateIndex
CREATE UNIQUE INDEX "UserPlanDayCompletion_enrollmentId_day_key" ON "public"."UserPlanDayCompletion"("enrollmentId", "day");

-- AddForeignKey
ALTER TABLE "public"."UserPlanEnrollment" ADD CONSTRAINT "UserPlanEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPlanDayCompletion" ADD CONSTRAINT "UserPlanDayCompletion_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "public"."UserPlanEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
