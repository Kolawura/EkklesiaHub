import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "./service";

export const createPost = async (data: object) => {
  const res = await postRequest("/posts", data);
  return res;
};

export const getPosts = async () => {
  const res = await getRequest("/posts");
  return res;
};

export const getPostBySlug = async (slug: string) => {
  const res = await getRequest(`/posts/slug/${slug}`);
  return res;
};

export const getPostsByAuthor = async (authorId: string) => {
  const res = await getRequest(`/posts/author/${authorId}`);
  return res;
};

export const getPostsByCommunity = async (communityId: string) => {
  const res = await getRequest(`/posts/community/${communityId}`);
  return res;
};

export const publishPost = async (id: string) => {
  const res = await patchRequest(`/posts/publish/${id}`, {});
  return res;
};

export const archivePost = async (id: string) => {
  const res = await patchRequest(`/posts/archive/${id}`, {});
  return res;
};

export const updatePost = async (id: string, data: object) => {
  const res = await putRequest(`/posts/update/${id}`, data);
  return res;
};

export const deletePost = async (id: string) => {
  const res = await deleteRequest(`/posts/delete/${id}`);
  return res;
};
