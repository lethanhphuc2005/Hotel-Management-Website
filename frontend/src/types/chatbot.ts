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
}
