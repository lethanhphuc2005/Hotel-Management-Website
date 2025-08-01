import {
  generateChatResponse as generateChatResponseApi,
  fetchSuggestionsFromGemini as fetchSuggestionsFromGeminiApi,
} from "@/api/chatbotApi";
import {
  ChatbotResponse,
  ChatbotSuggestionResponse,
  ChatMessageHistory,
  ChatMessageRequest,
} from "@/types/chatbot";
import { RoomClass } from "@/types/roomClass";

export const generateChatResponse = async ({
  prompt,
  history,
}: ChatMessageRequest): Promise<ChatbotResponse> => {
  try {
    const response = await generateChatResponseApi(prompt, history);

    return {
      success: true,
      data: response.response || "Không có phản hồi từ mô hình.",
      rooms: response.rooms || [],
      isBooking: response.isBooking || false,
      bookingData: response.bookingData || null,
      history: response.history || [],
    };
  } catch (error) {
    console.error("Error generating chat response:", error);
    return {
      success: false,
      data: "Đã xảy ra lỗi khi kết nối đến mô hình AI.",
    };
  }
};

export const fetchSuggestionsFromGemini =
  async (): Promise<ChatbotSuggestionResponse> => {
    try {
      const response = await fetchSuggestionsFromGeminiApi();
      return {
        success: true,
        message: response.message || "Lấy gợi ý thành công.",
        data: response.roomClasses || [],
      };
    } catch (error: any) {
      const errorMessage = error.message || "Đã xảy ra lỗi khi lấy gợi ý.";
      console.error("Error fetching suggestions:", errorMessage);
      return {
        success: false,
        message: errorMessage,
        data: [],
      };
    }
  };
