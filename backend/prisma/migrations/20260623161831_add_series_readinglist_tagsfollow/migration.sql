-- CreateTable
CREATE TABLE "public"."Series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "slug" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "communityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SeriesPost" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "seriesId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "SeriesPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReadingListItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserTagFollow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTagFollow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Series_slug_key" ON "public"."Series"("slug");

-- CreateIndex
CREATE INDEX "Series_authorId_idx" ON "public"."Series"("authorId");

-- CreateIndex
CREATE INDEX "Series_communityId_idx" ON "public"."Series"("communityId");

-- CreateIndex
CREATE INDEX "SeriesPost_postId_idx" ON "public"."SeriesPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "SeriesPost_seriesId_postId_key" ON "public"."SeriesPost"("seriesId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "SeriesPost_seriesId_position_key" ON "public"."SeriesPost"("seriesId", "position");

-- CreateIndex
CREATE INDEX "ReadingListItem_userId_readAt_idx" ON "public"."ReadingListItem"("userId", "readAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingListItem_userId_postId_key" ON "public"."ReadingListItem"("userId", "postId");

-- CreateIndex
CREATE INDEX "UserTagFollow_userId_idx" ON "public"."UserTagFollow"("userId");

-- CreateIndex
CREATE INDEX "UserTagFollow_tagId_idx" ON "public"."UserTagFollow"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTagFollow_userId_tagId_key" ON "public"."UserTagFollow"("userId", "tagId");

-- AddForeignKey
ALTER TABLE "public"."Series" ADD CONSTRAINT "Series_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Series" ADD CONSTRAINT "Series_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeriesPost" ADD CONSTRAINT "SeriesPost_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeriesPost" ADD CONSTRAINT "SeriesPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReadingListItem" ADD CONSTRAINT "ReadingListItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReadingListItem" ADD CONSTRAINT "ReadingListItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserTagFollow" ADD CONSTRAINT "UserTagFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserTagFollow" ADD CONSTRAINT "UserTagFollow_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
