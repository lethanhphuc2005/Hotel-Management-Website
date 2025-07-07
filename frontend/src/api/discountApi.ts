import { publicApi, api } from "@/lib/axiosInstance";

export const getDiscounts = async () => {
  try {
    const response = await publicApi.get("/discount/user");
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
};

export const getDiscountById = async (id: string) => {
  try {
    const response = await publicApi.get(`/discount/${id}`);
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching discount with ID ${id}:`, error);
    throw error;
  }
};

export const getPreviewDiscountBookingPrice = async (bookingInfo: {
  baseTotal: number;
  checkInDate: string;
  checkOutDate: string;
  roomClassId: string;
  totalRooms: number;
}) => {
  try {
    const response = await api.post(`/discount/preview`, {
      bookingInfo,
    });
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching preview discount booking price:", error);
    throw error;
  }
};
