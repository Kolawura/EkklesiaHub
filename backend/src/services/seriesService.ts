import { prisma } from "../db/prisma";
import { generateSlug, SERIES_SELECT } from "../utils/serviceUtils";

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────
// Create a new series
// ─────────────────────────────────────────────────────────────────
export async function createSeries(
  authorId: string,
  data: {
    title: string;
    description?: string;
    coverImage?: string;
    communityId?: string;
  },
) {
  if (!data.title?.trim()) throw new Error("Series title is required.");

  return prisma.series.create({
    data: {
      title: data.title.trim(),
      description: data.description?.trim(),
      coverImage: data.coverImage,
      communityId: data.communityId,
      slug: generateSlug(data.title),
      authorId,
    },
    select: SERIES_SELECT,
  });
}

// ─────────────────────────────────────────────────────────────────
// Get a series by slug (public — returns published only for non-authors)
// ─────────────────────────────────────────────────────────────────
export async function getSeriesBySlug(slug: string, requestingUserId?: string) {
  const series = await prisma.series.findUnique({
    where: { slug },
    select: SERIES_SELECT,
  });

  if (!series)
    throw Object.assign(new Error("Series not found."), { status: 404 });

  // Non-authors can only see published series
  if (!series.published && series.author.id !== requestingUserId) {
    throw Object.assign(new Error("Series not found."), { status: 404 });
  }

  return series;
}

// ─────────────────────────────────────────────────────────────────
// List all series — optionally filter by author or community
// ─────────────────────────────────────────────────────────────────
export async function listSeries(params: {
  authorId?: string;
  communityId?: string;
  page?: number;
  limit?: number;
  requestingUserId?: string;
}) {
  const {
    authorId,
    communityId,
    page = 1,
    limit = 12,
    requestingUserId,
  } = params;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (authorId) where.authorId = authorId;
  if (communityId) where.communityId = communityId;

  // Only show unpublished series to their own author
  if (!requestingUserId || requestingUserId !== authorId) {
    where.published = true;
  }

  const [series, total] = await Promise.all([
    prisma.series.findMany({
      where,
      select: SERIES_SELECT,
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.series.count({ where }),
  ]);

  return {
    series,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ─────────────────────────────────────────────────────────────────
// Update series metadata
// ─────────────────────────────────────────────────────────────────
export async function updateSeries(
  id: string,
  authorId: string,
  data: {
    title?: string;
    description?: string;
    coverImage?: string;
    published?: boolean;
  },
) {
  const series = await prisma.series.findUnique({ where: { id } });
  if (!series)
    throw Object.assign(new Error("Series not found."), { status: 404 });
  if (series.authorId !== authorId)
    throw Object.assign(new Error("Forbidden."), { status: 403 });

  return prisma.series.update({
    where: { id },
    data: { ...data, updatedAt: new Date() },
    select: SERIES_SELECT,
  });
}

// ─────────────────────────────────────────────────────────────────
// Delete a series (does NOT delete the posts themselves)
// ─────────────────────────────────────────────────────────────────
export async function deleteSeries(id: string, authorId: string) {
  const series = await prisma.series.findUnique({ where: { id } });
  if (!series)
    throw Object.assign(new Error("Series not found."), { status: 404 });
  if (series.authorId !== authorId)
    throw Object.assign(new Error("Forbidden."), { status: 403 });

  await prisma.series.delete({ where: { id } });
}

// ─────────────────────────────────────────────────────────────────
// Add a post to a series
// ─────────────────────────────────────────────────────────────────
export async function addPostToSeries(
  seriesId: string,
  postId: string,
  authorId: string,
) {
  const series = await prisma.series.findUnique({ where: { id: seriesId } });
  if (!series)
    throw Object.assign(new Error("Series not found."), { status: 404 });
  if (series.authorId !== authorId)
    throw Object.assign(new Error("Forbidden."), { status: 403 });

  // Check post exists and belongs to this author
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw Object.assign(new Error("Post not found."), { status: 404 });
  if (post.authorId !== authorId)
    throw Object.assign(new Error("You can only add your own posts."), {
      status: 403,
    });

  // Already in series?
  const existing = await prisma.seriesPost.findUnique({
    where: { seriesId_postId: { seriesId, postId } },
  });
  if (existing) throw new Error("Post is already in this series.");

  // Find next position
  const lastEntry = await prisma.seriesPost.findFirst({
    where: { seriesId },
    orderBy: { position: "desc" },
  });
  const position = (lastEntry?.position ?? 0) + 1;

  return prisma.seriesPost.create({
    data: { seriesId, postId, position },
  });
}

// ─────────────────────────────────────────────────────────────────
// Remove a post from a series
// ─────────────────────────────────────────────────────────────────
export async function removePostFromSeries(
  seriesId: string,
  postId: string,
  authorId: string,
) {
  const series = await prisma.series.findUnique({ where: { id: seriesId } });
  if (!series)
    throw Object.assign(new Error("Series not found."), { status: 404 });
  if (series.authorId !== authorId)
    throw Object.assign(new Error("Forbidden."), { status: 403 });

  await prisma.seriesPost.delete({
    where: { seriesId_postId: { seriesId, postId } },
  });

  // Re-number positions to stay contiguous
  const remaining = await prisma.seriesPost.findMany({
    where: { seriesId },
    orderBy: { position: "asc" },
  });
  await Promise.all(
    remaining.map((sp, i) =>
      prisma.seriesPost.update({
        where: { id: sp.id },
        data: { position: i + 1 },
      }),
    ),
  );
}

// ─────────────────────────────────────────────────────────────────
// Reorder posts within a series
// postIds: array of post IDs in the desired order
// ─────────────────────────────────────────────────────────────────
export async function reorderSeriesPosts(
  seriesId: string,
  postIds: string[],
  authorId: string,
) {
  const series = await prisma.series.findUnique({ where: { id: seriesId } });
  if (!series)
    throw Object.assign(new Error("Series not found."), { status: 404 });
  if (series.authorId !== authorId)
    throw Object.assign(new Error("Forbidden."), { status: 403 });

  await Promise.all(
    postIds.map((postId, i) =>
      prisma.seriesPost.updateMany({
        where: { seriesId, postId },
        data: { position: i + 1 },
      }),
    ),
  );
}

// ─────────────────────────────────────────────────────────────────
// Get the series a post belongs to (for the post detail page nav)
// ─────────────────────────────────────────────────────────────────
export async function getSeriesForPost(postId: string) {
  return prisma.seriesPost.findMany({
    where: { postId },
    include: {
      series: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          published: true,
          author: {
            select: { id: true, username: true },
          },
          posts: {
            orderBy: { position: "asc" },
            select: {
              position: true,
              post: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  status: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
