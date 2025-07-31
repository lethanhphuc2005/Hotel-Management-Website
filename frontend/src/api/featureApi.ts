import { publicApi } from "@/lib/axiosInstance";

export const getFeatures = async (params = {}) => {
  try {
    const response = await publicApi.get(`/feature/user`, {
      params,
    });
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching features:", error);
    throw error;
  }
};

export const getFeatureById = async (featureId: string) => {
  try {
    const response = await publicApi.get(`/feature/${featureId}`);
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching feature:", error);
    throw error;
  }
};
