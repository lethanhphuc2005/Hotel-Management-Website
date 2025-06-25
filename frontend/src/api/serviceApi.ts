import { publicApi } from "@/lib/axiosInstance";

export const getServices = async () => {
  try {
    const response = await publicApi.get("/service/user");
    if (response.status !== 200) {
      throw new Error(`Error fetching services: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getServiceById = async (id: string) => {
  try {
    const response = await publicApi.get(`/service/${id}`);
    if (response.status !== 200) {
      throw new Error(
        `Error fetching service with ID ${id}: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    throw error;
  }
};
