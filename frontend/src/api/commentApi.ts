import { api, publicApi } from "@/lib/axiosInstance";

export const getComments = async () => {
  const res = await publicApi.get(`/comment/user`);
  if (res.status !== 200) {
    throw new Error("Failed to fetch comments");
  }
  return res.data; // [{ commentId, content, createdAt, ... }, ...]
};

export const getCommentById = async (commentId: string) => {
  const res = await publicApi.get(`/comment/${commentId}`);
  if (res.status !== 200) {
    throw new Error("Failed to fetch comment");
  }
  return res.data; // { commentId, content, createdAt, ... }
};

export const createComment = async (postId: string, content: string) => {
  const res = await api.post("/comment", { postId, content });
  if (res.status !== 201) {
    throw new Error("Failed to create comment");
  }
  return res.data; // { commentId, content, createdAt, ... }
};

export const updateComment = async (
  commentId: string,
  user_id: string,
  content: string
) => {
  const res = await api.put(`/comment/${commentId}`, { user_id, content });
  if (res.status !== 200) {
    throw new Error("Failed to update comment");
  }
  return res.data; // { commentId, content, updatedAt, ... }
};

export const deleteComment = async (commentId: string, user_id: string) => {
  const res = await api.put(`/comment/toggle/${commentId}`, {
    user_id,
  });
  if (res.status !== 200) {
    throw new Error("Failed to delete comment");
  }
  return res.data; // { success: true }
};
