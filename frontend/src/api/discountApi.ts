import { publicApi } from "@/lib/axiosInstance";

export const getDiscounts = async () => {
  try {
    const response = await publicApi.get("/discount/user");
    if (response.status !== 200) {
      throw new Error(`Error fetching discounts: ${response.statusText}`);
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
      throw new Error(
        `Error fetching discount with ID ${id}: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching discount with ID ${id}:`, error);
    throw error;
  }
};
