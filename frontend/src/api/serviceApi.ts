import { publicApi } from "@/lib/axiosInstance";

export const getServices = async (params = {}) => {
  try {
    const response = await publicApi.get("/service/user", {
      params,
    });
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServiceById = async (id: string) => {
  try {
    const response = await publicApi.get(`/service/${id}`);
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    throw error;
  }
};
