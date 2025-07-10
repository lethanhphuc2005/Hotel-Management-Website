import {
  generateChatResponse as generateChatResponseApi,
  fetchSuggestionsFromGemini as fetchSuggestionsFromGeminiApi,
} from "@/api/chatbotApi";
import { ChatMessageHistory } from "@/types/chatbot";
import { RoomClass } from "@/types/roomClass";

export const generateChatResponse = async (
  prompt: string,
  history: ChatMessageHistory[]
): Promise<{
  success: boolean;
  data: string;
  rooms?: RoomClass[];
  isBooking?: boolean;
  bookingData?: any;
  history?: ChatMessageHistory[];
}> => {
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

export const fetchSuggestionsFromGemini = async (): Promise<{
  success: boolean;
  data: RoomClass[];
}> => {
  try {
    const response = await fetchSuggestionsFromGeminiApi();
    return {
      success: true,
      data: response.roomClasses || [],
    };
  } catch (error) {
    console.error("Error fetching suggestions from Gemini:", error);
    return {
      success: false,
      data: [],
    };
  }
};
