import { api, publicApi } from "@/lib/axiosInstance";
import {
  CreateReviewRequest,
  DeleteReviewRequest,
  UpdateReviewRequest,
} from "@/types/review";

export const getReviews = async () => {
  const response = await publicApi.get(`/review/user`);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // [{ reviewId, content, createdAt, ... }, ...]
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
  const response = await api.put(`/review/${reviewId}`, {
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
  const response = await api.put(`/review/toggle/${reviewId}`, {
    user_id: userId,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { success: true }
};
