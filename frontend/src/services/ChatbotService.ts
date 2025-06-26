import { generateChatResponse as generateChatResponseApi } from "@/api/chatbotApi";
import { ChatMessageRequest } from "@/types/chatbot";

export const generateChatResponse = async (
  prompt: string,
  history: ChatMessageRequest[]
): Promise<{ response: string; rooms: any[]; history: any[] }> => {
  try {
    const response = await generateChatResponseApi(prompt, history);
    
    return response;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
};
