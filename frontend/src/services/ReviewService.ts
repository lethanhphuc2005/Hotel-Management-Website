import {
  getReviews as getReviewsApi,
  getReviewById as getReviewByIdApi,
  createReview as createReviewApi,
  updateReview as updateReviewApi,
  deleteReview as deleteReviewApi,
} from "@/api/reviewApi";
import { Review } from "@/types/review";

export const fetchReviews = async () => {
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
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const fetchReviewById = async (reviewId: string) => {
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
    return review;
  } catch (error) {
    console.error("Error fetching review by ID:", error);
    throw error;
  }
};

export const createReview = async (roomClassId: string, content: string) => {
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
    return review;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const updateReview = async (
  reviewId: string,
  userId: string,
  rating: number | null,
  content: string
) => {
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
    return review;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string, userId: string) => {
  try {
    const response = await deleteReviewApi(reviewId, userId);
    return response.data; // { success: true }
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};
