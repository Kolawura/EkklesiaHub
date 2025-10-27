export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string | null;
  profileImg: string | null;
  bannerImg: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: never;
};

export type LoginType = {
  email: string;
  password: string;
};

export type RegisterType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string | null;
  tags: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  authorId: string;
  communityId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Error = {
  error: boolean;
  message: string;
};
