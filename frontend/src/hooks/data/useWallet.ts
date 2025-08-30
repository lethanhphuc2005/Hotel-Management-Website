import useSWR from "swr";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { fetchWalletByUserId } from "@/services/WalletService";
import { useEffect, useRef } from "react";

export const useUserWallet = (userId: string) => {
  const { setLoading } = useLoading();
  const didSetLoading = useRef(false);

  const key = userId?.trim() ? [`/wallet/`, userId] : null;

  const fetcher = async () => {
    const response = await fetchWalletByUserId(userId);
    if (!response.success) {
      throw new Error(response.message || "Không thể lấy đặt phòng.");
    }
    return response.data;
  };

  const { data, mutate, isLoading, error } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    onError: (error) => {},
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
    wallet: userId?.trim() ? data : null,
    error,
    mutate,
  };
};
