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
  error?: any;
};

export type LoginType = {
  email: string;
  password: string;
};

export type RegisterType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};
