import { generateChatResponse as generateChatResponseApi } from "@/api/chatbotApi";
import { ChatMessageHistory } from "@/types/chatbot";

export const generateChatResponse = async (
  prompt: string,
  history: ChatMessageHistory[]
): Promise<{ success: boolean; data: string }> => {
  try {
    const response = await generateChatResponseApi(prompt, history);

    return {
      success: true,
      data: response.response || "Không có phản hồi từ mô hình.",
    };
  } catch (error) {
    console.error("Error generating chat response:", error);
    return {
      success: false,
      data: "Đã xảy ra lỗi khi kết nối đến mô hình AI.",
    };
  }
};
