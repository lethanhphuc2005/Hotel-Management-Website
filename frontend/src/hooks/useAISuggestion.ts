// hooks/useAISuggestions.ts
import { useState, useEffect } from "react";
import { fetchSuggestionsFromGemini } from "@/services/ChatbotService";
import { useAuth } from "@/contexts/AuthContext";
import { RoomClass } from "@/types/roomClass";

export const useAISuggestions = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [suggestions, setSuggestions] = useState<RoomClass[]>([]);
  const [didFetch, setDidFetch] = useState(false);

  useEffect(() => {
    const fetchGemini = async () => {
      if (!user || isAuthLoading || didFetch) return;

      setDidFetch(true);
      try {
        const recommenedData = await fetchSuggestionsFromGemini();
        if (recommenedData.success) {
          setSuggestions(recommenedData.data);
        }
      } catch (err) {
        console.error("Lỗi khi lấy đề xuất từ Gemini:", err);
      }
    };

    fetchGemini();
  }, [user, isAuthLoading, didFetch]);

  return suggestions;
};
