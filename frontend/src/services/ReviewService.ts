import {
  getReviews as getReviewsApi,
  getReviewById as getReviewByIdApi,
  getReviewsByRoomClassId as getReviewsByRoomClassIdApi,
  createReview as createReviewApi,
  updateReview as updateReviewApi,
  deleteReview as deleteReviewApi,
} from "@/api/reviewApi";
import {
  Review,
  CreateReviewRequest,
  DeleteReviewRequest,
  ReviewListResponse,
  ReviewResponse,
  UpdateReviewRequest,
} from "@/types/review";

export const fetchReviews = async (
  userId: string,
  params = {}
): Promise<ReviewListResponse> => {
  try {
    const response = await getReviewsApi(userId, params);
    const data = response.data;
    const reviews: Review[] = data.map((item: any) => ({
      id: item._id || item.id,
      booking_id: item.booking_id || null,
      room_class_id: item.room_class_id,
      parent_id: item.parent_id || null,
      employee_id: item.employee_id || null,
      user_id: item.user_id || null,
      rating: item.rating || null,
      content: item.content,
      status: item.status || true,
      createdAt: new Date(item.createdAt || item.created_at),
      updatedAt: new Date(item.updatedAt || item.updated_at),
      employee: item.employee || null,
      user: item.user || null,
      booking: item.booking || null,
      room_class: item.room_class || null,
    }));
    return {
      success: true,
      message: response.message || "Reviews fetched successfully",
      data: reviews,
      pagination: response.pagination || undefined, // Include pagination if available
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
      pagination: undefined, // No pagination on error
    };
  }
};

export const fetchReviewsByRoomClassId = async (
  roomClassId: string,
  params = {}
): Promise<ReviewListResponse> => {
  try {
    const response = (await getReviewsByRoomClassIdApi(roomClassId, params)).data;
    const data = response.data;
    const reviews: Review[] = data.map((item: any) => ({
      id: item._id || item.id,
      booking_id: item.booking_id || null,
      room_class_id: item.room_class_id,
      parent_id: item.parent_id || null,
      employee_id: item.employee_id || null,
      user_id: item.user_id || null,
      rating: item.rating || null,
      content: item.content,
      status: item.status || true,
      createdAt: new Date(item.createdAt || item.created_at),
      updatedAt: new Date(item.updatedAt || item.updated_at),
      employee: item.employee || null,
      user: item.user || null,
      booking: item.booking || null,
      room_class: item.room_class || null,
    }));
    return {
      success: true,
      message: response.message || "Reviews fetched successfully",
      data: reviews,
      pagination: response.pagination || undefined, // Include pagination if available
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching reviews by room class ID";
    return {
      success: false,
      statusCode: error.response?.status || 500,
      message,
      data: [],
      pagination: undefined, // No pagination on error
    };
  }
};

export const fetchReviewById = async (
  reviewId: string
): Promise<ReviewResponse> => {
  try {
    const response = await getReviewByIdApi(reviewId);
    const data = response.data;
    const review: Review = {
      id: data._id || data.id,
      booking_id: data.booking_id || null, // booking_id may not be present in some reviews
      room_class_id: data.room_class_id,
      parent_id: data.parent_id || null,
      employee_id: data.employee_id || null,
      user_id: data.user_id || null,
      rating: data.rating || null, // Rating can be null if not provided
      content: data.content,
      status: data.status || true, // Default to true if status is not provided
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at),
      employee: data.employee || null, // Employee can be null if the review is not related to an employee
      user: data.user || null, // User can be null if the review is anonymous
      booking: data.booking || null, // Booking can be null if not provided
      room_class: data.room_class || null, // Room class can be null if not provided
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

export const createReview = async ({
  bookingId,
  roomClassId,
  parentId,
  userId,
  rating,
  content,
}: CreateReviewRequest): Promise<ReviewResponse> => {
  try {
    const response = await createReviewApi({
      bookingId,
      roomClassId,
      parentId,
      userId,
      rating,
      content,
    });
    const data = response.data;
    const review: Review = {
      id: data._id || data.id,
      booking_id: data.booking_id || null, // booking_id may not be present in some reviews
      room_class_id: data.room_class_id,
      parent_id: data.parent_id || null,
      employee_id: data.employee_id || null,
      user_id: data.user_id || null,
      rating: data.rating || null, // Rating can be null if not provided
      content: data.content,
      status: data.status || true, // Default to true if status is not provided
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at),
      employee: data.employee || null, // Employee can be null if the review is not related to an employee
      user: data.user || null, // User can be null if the review is anonymous
      booking: data.booking || null, // Booking can be null if not provided
      room_class: data.room_class || null, // Room class can be null if not provided
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

export const updateReview = async ({
  reviewId,
  userId,
  rating,
  content,
}: UpdateReviewRequest): Promise<ReviewResponse> => {
  try {
    const response = await updateReviewApi({
      reviewId,
      userId,
      rating,
      content,
    });
    const data = response.data;
    const review: Review = {
      id: data._id || data.id,
      booking_id: data.booking_id || null, // booking_id may not be present in some reviews
      room_class_id: data.room_class_id,
      parent_id: data.parent_id || null,
      employee_id: data.employee_id || null,
      user_id: data.user_id || null,
      rating: data.rating || null, // Rating can be null if not provided
      content: data.content,
      status: data.status || true, // Default to true if status is not provided
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at),
      employee: data.employee || null, // Employee can be null if the review is not related to an employee
      user: data.user || null, // User can be null if the review is anonymous
      booking: data.booking || null, // Booking can be null if not provided
      room_class: data.room_class || null, // Room class can be null if not provided
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

export const deleteReview = async ({
  reviewId,
  userId,
}: DeleteReviewRequest): Promise<ReviewResponse> => {
  try {
    const response = await deleteReviewApi({ reviewId, userId });
    return {
      success: true,
      message: response.message || "Review deleted successfully",
      data: null as any, // No data returned on delete
    }; // { success: true }
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while deleting the review";
    return {
      success: false,
      message,
      data: null as any, // No data returned on error
    }; // { success: false, message: string
  }
};
