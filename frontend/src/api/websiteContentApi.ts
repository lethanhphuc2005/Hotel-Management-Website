import { publicApi } from "@/lib/axiosInstance";

export const getWebsiteContents = async () => {
  try {
    const response = await publicApi.get("/website-content/user");
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching website content:", error);
    throw error;
  }
};

export const getWebsiteContentById = async (id: string) => {
  try {
    const response = await publicApi.get(`/website-content/${id}`);
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching website content by ID:", error);
    throw error;
  }
};
