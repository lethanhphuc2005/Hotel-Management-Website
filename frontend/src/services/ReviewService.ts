import {
  getReviews as getReviewsApi,
  getReviewById as getReviewByIdApi,
  createReview as createReviewApi,
  updateReview as updateReviewApi,
  deleteReview as deleteReviewApi,
} from "@/api/reviewApi";
import { Review } from "@/types/review";

export const fetchReviews = async (): Promise<{
  success: boolean;
  message?: string;
  data: Review[];
}> => {
  try {
    const response = await getReviewsApi();
    const data = response.data;
    const reviews: Review[] = data.map((r: any) => ({
      id: r.id || r.id,
      room_class_id: r.room_class_id,
      parent_id: r.parent_id || null,
      employee_id: r.employee_id || null,
      user_id: r.user_id || null,
      rating: r.rating || null, // Rating can be null if not provided
      content: r.content,
      status: r.status || true, // Default to true if status is not provided
      created_at: new Date(r.createdAt || r.created_at),
      updated_at: new Date(r.updatedAt || r.updated_at),
      parent_review: r.parent_review
        ? r.parent_review.map((pr: any) => ({
            id: pr._id || pr.id,
            room_class_id: pr.room_class_id,
            parent_id: pr.parent_id || null,
            employee_id: pr.employee_id || null,
            user_id: pr.user_id || null,
            content: pr.content,
            created_at: new Date(pr.createdAt || pr.created_at),
            updated_at: new Date(pr.updatedAt || pr.updated_at),
          }))
        : [],
    }));
    return {
      success: true,
      message: response.message || "Reviews fetched successfully",
      data: reviews,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching reviews";
    return {
      success: false,
      message,
      data: [],
    };
  }
};

export const fetchReviewById = async (
  reviewId: string
): Promise<{
  success: boolean;
  message?: string;
  data: Review;
}> => {
  try {
    const response = await getReviewByIdApi(reviewId);
    const data = response.data;
    const review: Review = {
      id: data._id || data.id,
      room_class_id: data.room_class_id,
      parent_id: data.parent_id || null,
      employee_id: data.employee_id || null,
      user_id: data.user_id || null,
      rating: data.rating || null, // Rating can be null if not provided
      content: data.content,
      status: data.status || true, // Default to true if status is not provided
      created_at: new Date(data.createdAt || data.created_at),
      updated_at: new Date(data.updatedAt || data.updated_at),
    };
    return {
      success: true,
      message: response.message || "Review fetched successfully",
      data: review,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching the review";
    return {
      success: false,
      message,
      data: {} as Review, // Return an empty Review object on error
    };
  }
};

export const createReview = async (
  roomClassId: string,
  content: string
): Promise<{
  success: boolean;
  message?: string;
  data: Review;
}> => {
  try {
    const response = await createReviewApi(roomClassId, content);
    const data = response.data;
    const review: Review = {
      id: data._id || data.id,
      room_class_id: data.room_class_id,
      parent_id: data.parent_id || null,
      employee_id: data.employee_id || null,
      user_id: data.user_id || null,
      rating: data.rating || null,
      content: data.content,
      status: data.status || true, // Default to true if status is not provided
      created_at: new Date(data.createdAt || data.created_at),
      updated_at: new Date(data.updatedAt || data.updated_at),
    };
    return {
      success: true,
      message: response.message || "Review created successfully",
      data: review,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while creating the review";
    return {
      success: false,
      message,
      data: {} as Review, // Return an empty Review object on error
    };
  }
};

export const updateReview = async (
  reviewId: string,
  userId: string,
  rating: number | null,
  content: string
): Promise<{
  success: boolean;
  message?: string;
  data: Review;
}> => {
  try {
    const response = await updateReviewApi(reviewId, userId, rating, content);
    const data = response.data;
    const review: Review = {
      id: data._id || data.id,
      room_class_id: data.room_class_id,
      parent_id: data.parent_id || null,
      employee_id: data.employee_id || null,
      user_id: data.user_id || null,
      rating: data.rating || null,
      content: data.content,
      status: data.status || true, // Default to true if status is not provided
      created_at: new Date(data.createdAt || data.created_at),
      updated_at: new Date(data.updatedAt || data.updated_at),
    };
    return {
      success: true,
      message: response.message || "Review updated successfully",
      data: review,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while updating the review";
    return {
      success: false,
      message,
      data: {} as Review, // Return an empty Review object on error
    };
  }
};

export const deleteReview = async (
  reviewId: string,
  userId: string
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const response = await deleteReviewApi(reviewId, userId);
    return {
      success: true,
      message: response.message || "Review deleted successfully",
    }; // { success: true }
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while deleting the review";
    return {
      success: false,
      message,
    }; // { success: false, message: string
  }
};
