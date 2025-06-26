import { api, publicApi } from "@/lib/axiosInstance";

export const createBooking = async (data: any) => {
  try {
    const response = await publicApi.post("/booking", data);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const response = await api.get("/booking/user");
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const getBookingById = async (id: string, userId: string) => {
  try {
    const response = await api.get(`/booking/${id}`, {
      data: { user_id: userId },
    });
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    throw error;
  }
};

export const cancelBooking = async (
  id: string,
  userId: string,
  cancelReason: string
) => {
  try {
    const response = await api.put(`/booking/cancel/${id}`, {
      user_id: userId,
      cancel_reason: cancelReason,
    });
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error canceling booking with ID ${id}:`, error);
    throw error;
  }
};
