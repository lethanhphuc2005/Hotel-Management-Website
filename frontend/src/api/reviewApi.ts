import { api, publicApi } from "@/lib/axiosInstance";

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

export const createReview = async (roomClassId: string, content: string) => {
  const response = await api.post("/review", {
    room_class_id: roomClassId,
    content,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { reviewId, content, createdAt, ... }
};

export const updateReview = async (
  reviewId: string,
  user_id: string,
  rating: number | null,
  content: string
) => {
  const response = await api.put(`/review/${reviewId}`, {
    user_id,
    rating,
    content,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { reviewId, content, updatedAt, ... }
};

export const deleteReview = async (reviewId: string, userId: string) => {
  const response = await api.put(`/review/toggle/${reviewId}`, {
    user_id: userId,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // { success: true }
};
