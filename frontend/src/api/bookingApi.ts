import { api, publicApi } from "@/lib/axiosInstance";
import {
  CancelBookingRequest,
  CreateBookingRequest,
  PreviewCancellationFeeRequest,
} from "@/types/booking";

export const createBooking = async (data: CreateBookingRequest) => {
  const response = await publicApi.post("/booking", data);
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data;
};

export const getBookings = async () => {
  const response = await api.get("/booking/user");
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data;
};

export const getBookingById = async (id: string) => {
  const response = await api.get(`/booking/${id}`);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data;
};

export const getBookingForUser = async (userId: string, params = {}) => {
  const response = await api.get(`/booking/user/${userId}`, {
    params,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data;
};

export const previewCancellationFee = async ({
  bookingId,
  userId,
}: PreviewCancellationFeeRequest) => {
  const response = await api.get(`/booking/cancellation-fee/${bookingId}`, {
    params: { user_id: userId },
  });

  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data;
};

export const cancelBooking = async ({
  bookingId,
  userId,
  cancelReason,
}: CancelBookingRequest) => {
  const response = await api.patch(`/booking/cancel/${bookingId}`, {
    user_id: userId,
    cancel_reason: cancelReason,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data;
};
