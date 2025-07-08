import { publicApi } from "@/lib/axiosInstance";

export const getSuggestions = async (q: string) => {
  try {
    const response = await publicApi.get("/suggestion", {
      params: { q },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw error;
  }
};
