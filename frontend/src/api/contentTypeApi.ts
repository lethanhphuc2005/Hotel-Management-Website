import { publicApi } from "@/lib/axiosInstance";

export const getContentTypes = async () => {
  try {
    const response = await publicApi.get("/content-type/user");
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching website content types:", error);
    throw error;
  }
};

export const getContentTypeById = async (id: string) => {
  try {
    const response = await publicApi.get(`/content-type/${id}`);
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching website content type by ID:", error);
    throw error;
  }
};
