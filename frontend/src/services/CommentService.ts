import {
  getComments as getCommnetsApi,
  getCommentById as getCommentByIdApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "@/api/commentApi";
import { Comment } from "@/types/comment";

export const fetchComments = async () => {
  try {
    const response = await getCommnetsApi();
    const data = response.data;
    const comments: Comment[] = data.map((c: any) => ({
      id: c.id,
      room_class_id: c.room_class_id,
      parent_id: c.parent_id || null,
      employee_id: c.employee_id || null,
      user_id: c.user_id || null,
      content: c.content,
      created_at: new Date(c.createdAt || c.created_at),
      updated_at: new Date(c.updatedAt || c.updated_at),
      parent_comment: c.parent_comment
        ? c.parent_comment.map((pc: any) => ({
            id: pc.id,
            room_class_id: pc.room_class_id,
            parent_id: pc.parent_id || null,
            employee_id: pc.employee_id || null,
            user_id: pc.user_id || null,
            content: pc.content,
            created_at: new Date(pc.createdAt || pc.created_at),
            updated_at: new Date(pc.updatedAt || pc.updated_at),
          }))
        : [],
    }));
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const fetchCommentById = async (commentId: string) => {
  try {
    const response = await getCommentByIdApi(commentId);
    const data = response.data;
    const comment: Comment = {
      id: data.id,
      room_class_id: data.room_class_id,
      parent_id: data.parent_id || null,
      employee_id: data.employee_id || null,
      user_id: data.user_id || null,
      content: data.content,
      created_at: new Date(data.createdAt || data.created_at),
      updated_at: new Date(data.updatedAt || data.updated_at),
    };
    return comment;
  } catch (error) {
    console.error("Error fetching comment by ID:", error);
    throw error;
  }
};

export const createComment = async (postId: string, content: string) => {
  try {
    const response = await createCommentApi(postId, content);
    const data = response;
    const comment: Comment = {
      id: data.id,
      room_class_id: data.room_class_id,
      parent_id: data.parent_id || null,
      employee_id: data.employee_id || null,
      user_id: data.user_id || null,
      content: data.content,
      created_at: new Date(data.createdAt || data.created_at),
      updated_at: new Date(data.updatedAt || data.updated_at),
    };
    return comment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const updateComment = async (
  commentId: string,
  userId: string,
  content: string
) => {
  try {
    const response = await updateCommentApi(commentId, userId, content); // Assuming this API can also handle updates
    const data = response.data;
    const comment: Comment = {
      id: data.id,
      room_class_id: data.room_class_id,
      parent_id: data.parent_id || null,
      employee_id: data.employee_id || null,
      user_id: data.user_id || null,
      content: data.content,
      created_at: new Date(data.createdAt || data.created_at),
      updated_at: new Date(data.updatedAt || data.updated_at),
    };
    return comment;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

export const deleteComment = async (commentId: string, userId: string) => {
  try {
    const response = await deleteCommentApi(commentId, userId);

    return response.data; // Assuming the API returns some confirmation data
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
