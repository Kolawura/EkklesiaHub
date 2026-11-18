/*
  Warnings:

  - You are about to drop the `UserPlanDayCompletion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserPlanDayCompletion" DROP CONSTRAINT "UserPlanDayCompletion_enrollmentId_fkey";

-- DropTable
DROP TABLE "public"."UserPlanDayCompletion";

-- CreateTable
CREATE TABLE "public"."UserChapterRead" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookNumber" INTEGER NOT NULL,
    "chapter" INTEGER NOT NULL,
    "firstReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChapterRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserChapterRead_userId_idx" ON "public"."UserChapterRead"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChapterRead_userId_bookNumber_chapter_key" ON "public"."UserChapterRead"("userId", "bookNumber", "chapter");

-- AddForeignKey
ALTER TABLE "public"."UserChapterRead" ADD CONSTRAINT "UserChapterRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
