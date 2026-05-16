/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId,type]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('NEW_COMMENT', 'NEW_REACTION', 'NEW_FOLLOWER', 'NEW_REPLY', 'COMMUNITY_INVITE', 'POST_REMOVED');

-- AlterEnum
ALTER TYPE "public"."PostStatus" ADD VALUE 'REMOVED';

-- DropForeignKey
ALTER TABLE "public"."Bookmark" DROP CONSTRAINT "Bookmark_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reaction" DROP CONSTRAINT "Reaction_commentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reaction" DROP CONSTRAINT "Reaction_postId_fkey";

-- AlterTable
ALTER TABLE "public"."Community" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rules" TEXT;

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "readingTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "removalReason" TEXT,
ADD COLUMN     "removedBy" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."PostView" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT,
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostView_postId_createdAt_idx" ON "public"."PostView"("postId", "createdAt");

-- CreateIndex
CREATE INDEX "PostView_userId_postId_idx" ON "public"."PostView"("userId", "postId");

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "public"."Notification"("userId", "read");

-- CreateIndex
CREATE INDEX "Post_status_createdAt_idx" ON "public"."Post"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "public"."Post"("authorId");

-- CreateIndex
CREATE INDEX "Post_communityId_idx" ON "public"."Post"("communityId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_postId_type_key" ON "public"."Reaction"("userId", "postId", "type");

-- AddForeignKey
ALTER TABLE "public"."PostView" ADD CONSTRAINT "PostView_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostView" ADD CONSTRAINT "PostView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reaction" ADD CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reaction" ADD CONSTRAINT "Reaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bookmark" ADD CONSTRAINT "Bookmark_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
