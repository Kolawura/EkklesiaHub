export const generateSlug = (title: string) =>
  `${title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 180)}-${Date.now().toString(36)}`;

export const SERIES_SELECT = {
  id: true,
  title: true,
  description: true,
  coverImage: true,
  slug: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      profileImg: true,
    },
  },
  community: {
    select: { id: true, name: true, isPrivate: true },
  },
  posts: {
    orderBy: { position: "asc" as const },
    select: {
      id: true,
      position: true,
      post: {
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          readingTime: true,
          viewCount: true,
          publishedAt: true,
          status: true,
          author: {
            select: { id: true, username: true, profileImg: true },
          },
          _count: {
            select: { reactions: true, comments: true },
          },
        },
      },
    },
  },
  _count: {
    select: { posts: true },
  },
};
