import { RoomClass } from "./roomClass";

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export interface ChatMessageRequest {
  prompt: string;
  history: ChatMessageHistory[];
}

export interface ChatMessageHistory {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface ChatMessageResponse {
  response: string;
  rooms: any[];
  history: ChatMessageHistory[];
  bookingData?: any;     // Nếu đã xác nhận đặt phòng
  isBooking?: boolean;   // Để biết có nhảy sang thanh toán không
}

export interface ChatbotResponse {
  success: boolean;
  data: string;
  rooms?: RoomClass[];
  isBooking?: boolean;
  bookingData?: any;
  history?: ChatMessageHistory[];
}

export interface ChatbotSuggestionResponse {
  success: boolean;
  data: RoomClass[];
}