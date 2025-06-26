import { publicApi } from "@/lib/axiosInstance";

export const generateChatResponse = async (prompt: string, history: any[]) => {
  try {
    const response = await publicApi.post("/chat/generate-response", {
      prompt,
      history,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
};
