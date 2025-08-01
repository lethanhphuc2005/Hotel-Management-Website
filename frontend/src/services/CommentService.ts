import {
  getComments as getCommnetsApi,
  getCommentById as getCommentByIdApi,
  getCommentsByRoomClassId as getCommentsByRoomClassIdApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "@/api/commentApi";
import {
  Comment,
  CommentListResponse,
  CommentResponse,
  CreateCommentRequest,
  DeleteCommentRequest,
  UpdateCommentRequest,
} from "@/types/comment";

export const fetchComments = async (
  userId: string,
  params = {}
): Promise<CommentListResponse> => {
  try {
    const response = await getCommnetsApi(userId, params);
    const data = response.data;
    const comments: Comment[] = data.map((comment: any) => ({
      id: comment.id,
      room_class_id: comment.room_class_id,
      parent_id: comment.parent_id || null,
      employee_id: comment.employee_id || null,
      user_id: comment.user_id || null,
      content: comment.content,
      status: comment.status || true, // Default to true if status is not provided
      createdAt: new Date(comment.createdAt || comment.created_at),
      updatedAt: new Date(comment.updatedAt || comment.updated_at),
      employee: comment.employee || null, // Assuming employee is included in the response
      user: comment.user || null, // Assuming user is included in the response
      room_class: comment.room_class || null, // Assuming room_class is included
    }));
    return {
      success: true,
      message: response.message || "Comments fetched successfully",
      data: comments,
      pagination: response.pagination, // Assuming pagination is included in the response
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
      pagination: undefined, // Return null for pagination in case of error
    };
  }
};

export const fetchCommentsByRoomClassId = async (
  roomClassId: string,
  params = {}
): Promise<CommentListResponse> => {
  try {
    const response = (await getCommentsByRoomClassIdApi(roomClassId, params))
      .data;
    console.log("Response from fetchCommentsByRoomClassId:", response);
    const data = response.data;
    const comments: Comment[] = data.map((comment: any) => ({
      id: comment.id,
      room_class_id: comment.room_class_id,
      parent_id: comment.parent_id || null,
      employee_id: comment.employee_id || null,
      user_id: comment.user_id || null,
      content: comment.content,
      status: comment.status || true, // Default to true if status is not provided
      createdAt: new Date(comment.createdAt || comment.created_at),
      updatedAt: new Date(comment.updatedAt || comment.updated_at),
      employee: comment.employee || null, // Assuming employee is included in the response
      user: comment.user || null, // Assuming user is included in the response
      room_class: comment.room_class || null, // Assuming room_class is included
    }));
    return {
      success: true,
      message: response.message || "Comments fetched successfully",
      data: comments,
      pagination: response.pagination, // Assuming pagination is included in the response
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching comments by room class ID";
    return {
      success: false,
      statusCode: error.response?.status || 500,
      message,
      data: [],
      pagination: undefined, // Return null for pagination in case of error
    };
  }
};

export const fetchCommentById = async (
  commentId: string
): Promise<CommentResponse> => {
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
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at),
      employee: data.employee || null, // Assuming employee is included in the response
      user: data.user || null, // Assuming user is included in the response
      room_class: data.room_class || null, // Assuming room_class is included
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
      data: null as any, // Return null if comment not found
    };
  }
};

export const createComment = async ({
  roomClassId,
  parentId,
  userId,
  content,
}: CreateCommentRequest): Promise<CommentResponse> => {
  try {
    const response = await createCommentApi({
      roomClassId,
      parentId,
      userId,
      content,
    });
    const data = response.data;
    const comment: Comment = {
      id: data.id,
      room_class_id: data.room_class_id,
      parent_id: data.parent_id || null,
      employee_id: data.employee_id || null,
      user_id: data.user_id || null,
      content: data.content,
      status: data.status || true, // Default to true if status is not provided
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at),
      employee: data.employee || null, // Assuming employee is included in the response
      user: data.user || null, // Assuming user is included in the response
      room_class: data.room_class || null, // Assuming room_class is included
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
      data: null as any, // Return null if creation fails
    };
  }
};

export const updateComment = async ({
  commentId,
  userId,
  content,
}: UpdateCommentRequest): Promise<CommentResponse> => {
  try {
    const response = await updateCommentApi({ commentId, userId, content }); // Assuming this API can also handle updates
    const data = response.data;
    const comment: Comment = {
      id: data.id,
      room_class_id: data.room_class_id,
      parent_id: data.parent_id || null,
      employee_id: data.employee_id || null,
      user_id: data.user_id || null,
      content: data.content,
      status: data.status || true, // Default to true if status is not provided
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at),
      employee: data.employee || null, // Assuming employee is included in the response
      user: data.user || null, // Assuming user is included in the response
      room_class: data.room_class || null, // Assuming room_class is included
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
      data: null as any, // Return null if update fails
    };
  }
};

export const deleteComment = async ({
  commentId,
  userId,
}: DeleteCommentRequest): Promise<CommentResponse> => {
  try {
    const response = await deleteCommentApi({ commentId, userId });

    return {
      success: true,
      message: response.message || "Comment deleted successfully",
      data: null as any, // Return null as there's no data to return after deletion
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while deleting the comment";
    return {
      success: false,
      message,
      data: null as any, // Return null if deletion fails
    };
  }
};
