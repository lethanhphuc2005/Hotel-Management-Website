import useSWR from "swr";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useRef } from "react";
import { fetchSuggestionsFromGemini } from "@/services/ChatbotService";

export const useAISuggestions = (userId?: string) => {
  const { setLoading } = useLoading();
  const didSetLoading = useRef(false);
  const key = userId ? [`/suggestion`, userId] : null;

  const fetcher = async () => {
    const response = await fetchSuggestionsFromGemini();
    if (!response.success) {
      throw new Error(response.message || "Không thể lấy gợi ý.");
    }
    return response;
  };

  const { data, mutate, error, isLoading } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true, // giữ data cũ trong lúc fetch mới
    refreshInterval: 10 * 60 * 1000, // 10 phút
    onError: (error) => {
      toast.error(error.message || "Không thể lấy gợi ý.");
    },
  });

  useEffect(() => {
    if (isLoading && !didSetLoading.current) {
      setLoading(true);
      didSetLoading.current = true;
    }
    if (!isLoading && didSetLoading.current) {
      setLoading(false);
    }
  }, [isLoading, setLoading]);

  return {
    recommends: data?.data || [],
    error,
    mutate,
  };
};
