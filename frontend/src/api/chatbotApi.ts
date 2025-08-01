import { publicApi, api } from "@/lib/axiosInstance";
import { ChatMessageHistory } from "@/types/chatbot";

export const generateChatResponse = async (
  prompt: string,
  history: ChatMessageHistory[]
) => {
  const response = await publicApi.post("/chat/generate-response", {
    prompt,
    history,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // Assuming the response contains the chat response
};

export const fetchSuggestionsFromGemini = async () => {
  const response = await api.get("/chat/suggestion");
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data; // Assuming the response contains the suggestions
};
