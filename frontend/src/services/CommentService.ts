import {
  getComments as getCommnetsApi,
  getCommentById as getCommentByIdApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "@/api/commentApi";
import { Comment } from "@/types/comment";

export const fetchComments = async (): Promise<{
  success: boolean;
  message?: string;
  data: Comment[];
}> => {
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
      status: c.status || true, // Default to true if status is not provided
      created_at: new Date(c.createdAt || c.created_at),
      updated_at: new Date(c.updatedAt || c.updated_at),
    }));
    return {
      success: true,
      message: response.message || "Comments fetched successfully",
      data: comments,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching comments";
    return {
      success: false,
      message,
      data: [],
    };
  }
};

export const fetchCommentById = async (
  commentId: string
): Promise<{
  success: boolean;
  message?: string;
  data: Comment | null;
}> => {
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
      status: data.status || true, // Default to true if status is not provided
      created_at: new Date(data.createdAt || data.created_at),
      updated_at: new Date(data.updatedAt || data.updated_at),
    };
    return {
      success: true,
      message: response.message || "Comment fetched successfully",
      data: comment,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching the comment";
    return {
      success: false,
      message,
      data: null, // Return null if fetching fails
    };
  }
};

export const createComment = async (
  room_class_id: string,
  parent_id: string | null,
  user_id: string | null,
  content: string
): Promise<{
  success: boolean;
  message?: string;
  data: Comment;
}> => {
  try {
    const response = await createCommentApi(
      room_class_id,
      parent_id,
      user_id,
      content
    );
    const data = response.data;
    console.log("Comment created:", data);
    const comment: Comment = {
      id: data.id,
      room_class_id: data.room_class_id,
      parent_id: data.parent_id || null,
      employee_id: data.employee_id || null,
      user_id: data.user_id || null,
      content: data.content,
      status: data.status || true, // Default to true if status is not provided
      created_at: new Date(data.createdAt || data.created_at),
      updated_at: new Date(data.updatedAt || data.updated_at),
    };
    return {
      success: true,
      message: response.message || "Comment created successfully",
      data: comment, // Return as an array for consistency
    };
  } catch (error: any) {
    console.error("Error creating comment:", error);
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while creating the comment";
    return {
      success: false,
      message,
      data: {} as Comment, // Return null if creation fails
    };
  }
};

export const updateComment = async (
  commentId: string,
  userId: string,
  content: string
): Promise<{
  success: boolean;
  message?: string;
  data: Comment | null;
}> => {
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
      status: data.status || true, // Default to true if status is not provided
      created_at: new Date(data.createdAt || data.created_at),
      updated_at: new Date(data.updatedAt || data.updated_at),
    };
    return {
      success: true,
      message: response.message || "Comment updated successfully",
      data: comment, // Return the updated comment
    };
  } catch (error: any) {
    console.error("Error updating comment:", error);
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while updating the comment";
    return {
      success: false,
      message,
      data: null, // Return null if update fails
    };
  }
};

export const deleteComment = async (
  commentId: string,
  userId: string
): Promise<{
  success: boolean;
  message: string | null;
}> => {
  try {
    const response = await deleteCommentApi(commentId, userId);

    return {
      success: true,
      message: response.message || "Comment deleted successfully",
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while deleting the comment";
    return {
      success: false,
      message,
    };
  }
};
