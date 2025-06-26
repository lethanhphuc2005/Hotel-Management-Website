import { api, publicApi } from "@/lib/axiosInstance";

export const getComments = async () => {
  const response = await publicApi.get(`/comment/user`);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // [{ commentId, content, createdAt, ... }, ...]
};

export const getCommentById = async (commentId: string) => {
  const response = await publicApi.get(`/comment/${commentId}`);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { commentId, content, createdAt, ... }
};

export const createComment = async (postId: string, content: string) => {
  const response = await api.post("/comment", { postId, content });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { commentId, content, createdAt, ... }
};

export const updateComment = async (
  commentId: string,
  user_id: string,
  content: string
) => {
  const response = await api.put(`/comment/${commentId}`, { user_id, content });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { commentId, content, updatedAt, ... }
};

export const deleteComment = async (commentId: string, user_id: string) => {
  const response = await api.put(`/comment/toggle/${commentId}`, {
    user_id,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { success: true }
};
