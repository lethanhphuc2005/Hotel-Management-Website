import { api, publicApi } from "@/lib/axiosInstance";
import { CreateCommentRequest, DeleteCommentRequest } from "@/types/comment";
import { UpdateCommentRequest } from "../types/comment";

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

export const createComment = async ({
  roomClassId,
  parentId,
  userId,
  content,
}: CreateCommentRequest) => {
  const response = await api.post("/comment", {
    room_class_id: roomClassId,
    parent_id: parentId,
    user_id: userId,
    content,
  });
  if (response.status !== 201) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { commentId, content, createdAt, ... }
};

export const updateComment = async ({
  commentId,
  userId,
  content,
}: UpdateCommentRequest) => {
  const response = await api.patch(`/comment/${commentId}`, {
    user_id: userId,
    content,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { commentId, content, updatedAt, ... }
};

export const deleteComment = async ({
  commentId,
  userId,
}: DeleteCommentRequest) => {
  const response = await api.patch(`/comment/toggle/${commentId}`, {
    user_id: userId,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { success: true }
};
