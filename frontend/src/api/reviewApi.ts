import { api, publicApi } from "@/lib/axiosInstance";
import {
  CreateReviewRequest,
  DeleteReviewRequest,
  UpdateReviewRequest,
} from "@/types/review";

export const getReviews = async (userId: string, params = {}) => {
  const response = await publicApi.get(`/review/user/${userId}`, { params });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // [{ reviewId, content, createdAt, ... }, ...]
};

export const getReviewsByRoomClassId = async (
  roomClassId: string,
  params = {}
) => {
  const response = await publicApi.get(`/review/room/${roomClassId}`, {
    params,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return {
    data: response.data, // [{ reviewId, content, createdAt, ... }, ...]
    status: response.status,
  }; // [{ reviewId, content, createdAt, ... }, ...]
};

export const getReviewById = async (reviewId: string) => {
  const response = await publicApi.get(`/review/${reviewId}`);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { reviewId, content, createdAt, ... }
};

export const createReview = async ({
  bookingId,
  roomClassId,
  parentId,
  userId,
  rating,
  content,
}: CreateReviewRequest) => {
  const response = await api.post("/review", {
    booking_id: bookingId,
    room_class_id: roomClassId,
    parent_id: parentId,
    user_id: userId,
    rating,
    content,
  });
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { reviewId, content, createdAt, ... }
};

export const updateReview = async ({
  reviewId,
  userId,
  rating,
  content,
}: UpdateReviewRequest) => {
  const response = await api.patch(`/review/${reviewId}`, {
    user_id: userId,
    rating,
    content,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { reviewId, content, updatedAt, ... }
};

export const deleteReview = async ({
  reviewId,
  userId,
}: DeleteReviewRequest) => {
  const response = await api.patch(`/review/toggle/${reviewId}`, {
    user_id: userId,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { success: true }
};
