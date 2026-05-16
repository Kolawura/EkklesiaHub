export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio?: string;
  profileImg?: string;
  bannerImg?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Community {
  id: string;
  name: string;
  description?: string;
  rules?: string;
  avatar?: string;
  coverImage?: string;
  isPrivate: boolean;
  isMember?: boolean;
  memberRole?: "ADMIN" | "MEMBER" | "CURATED_WRITER";
  createdAt: string;
  _count: { memberships: number; posts: number };
}

export type Tag = {
  id: string;
  name: string;
};

export interface Comment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  authorId: string;
  postId: string;
  parentId: string | null;
  author: { id: string; username: string; profileImg?: string };
  replies: Comment[];
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REMOVED";
  isPinned: boolean;
  readingTime: number;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; username: string; profileImg?: string };
  comments: Comment[];
  community?: {
    id: string;
    name: string;
    isPrivate: boolean;
    avatar?: string;
  } | null;
  tags: Tag[];
  _count: {
    comments: number;
    reactions: number;
    bookmarks: number;
    views: number;
  };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserPost {
  posts: Post[];
  pagination: Pagination;
}

export interface PostCardProps {
  post: Post;
  showAdminActions?: boolean;
  onRemove?: (postId: string) => void;
  onPin?: (postId: string) => void;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginType {
  email: string;
  password: string;
}

export interface RegisterType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PostAnalytics {
  summary: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
    totalReactions: number;
    totalComments: number;
    totalBookmarks: number;
    avgReadingTime: number;
  };
  topPosts: {
    id: string;
    title: string;
    slug: string;
    viewCount: number;
    reactions: number;
    comments: number;
    bookmarks: number;
  }[];
  dailyViews: {
    date: string;
    count: number;
  }[];
  reactionBreakdown: {
    type: "LIKE" | "LOVE" | "INSIGHTFUL" | "CURIOUS";
    count: number;
  }[];
  posts: Post[];
}
export interface Bookmark {
  id: string;
  postId: string;
  userId: string;
  post: Post;
  createdAt: string;
}

export type Tab = "posts" | "members" | "about" | "analytics" | "settings";

export interface CommunityAnalytics {
  community: string | undefined;
  summary: {
    totalPosts: number;
    totalMembers: number;
    newMembers: number;
  };
  topPosts: {
    title: string;
    id: string;
    slug: string;
    viewCount: number;
    publishedAt: Date | null;
    author: {
      username: string;
    };
    _count: {
      comments: number;
      reactions: number;
    };
  }[];
  dailyViews: {
    date: string;
    count: number;
  }[];
}
export interface Members {
  role: "ADMIN" | "MEMBER" | "CURATED_WRITER";
  joinedAt: Date;
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profileImg: string | null;
}

export interface TiptapEditorRef {
  insertScripture: (text: string, reference: string, version?: string) => void;
}

export interface TiptapEditorProps {
  content?: string;
  title?: string;
  onChange?: (data: { title: string; content: string }) => void;
  editable?: boolean;
  placeholder?: string;
}

export type EditorData = {
  title: string;
  slug?: string;
  content: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  excerpt?: string | undefined;
  coverImage?: string | undefined;
  communityId?: string | undefined;
  tagIds?: string[] | undefined;
};

export type UsernameState =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid"
  | "unchanged";

export interface Following {
  id: string;
  createdAt: Date;
  followerId: string;
  followingId: string;
  following: Following;
}
