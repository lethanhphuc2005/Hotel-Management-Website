import api from "@/lib/axiosInstance";

export const getReviews = async () => {
  const res = await api.get(`/review/`);
  if (res.status !== 200) {
    throw new Error("Failed to fetch reviews");
  }
  return res.data; // [{ reviewId, content, createdAt, ... }, ...]
};

export const getReviewById = async (reviewId: string) => {
  const res = await api.get(`/review/${reviewId}`);
  if (res.status !== 200) {
    throw new Error("Failed to fetch review");
  }
  return res.data; // { reviewId, content, createdAt, ... }
};

export const createReview = async (roomClassId: string, content: string) => {
  const res = await api.post("/review", {
    room_class_id: roomClassId,
    content,
  });
  if (res.status !== 201) {
    throw new Error("Failed to create review");
  }
  return res.data; // { reviewId, content, createdAt, ... }
};

export const updateReview = async (
  reviewId: string,
  user_id: string,
  content: string
) => {
  const res = await api.put(`/review/${reviewId}`, { user_id, content });
  if (res.status !== 200) {
    throw new Error("Failed to update review");
  }
  return res.data; // { reviewId, content, updatedAt, ... }
};

export const deleteReview = async (reviewId: string, userId: string) => {
  const res = await api.put(`/review/toggle/${reviewId}`, { user_id: userId });
  if (res.status !== 200) {
    throw new Error("Failed to delete review");
  }
  return res.data; // { success: true }
};
