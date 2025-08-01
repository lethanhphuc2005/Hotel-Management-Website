import useSWR from "swr";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { getUserFavorites } from "@/services/UserFavoriteService";
import { useEffect, useRef } from "react";

export const useUserFavorites = (
  userId: string,
  currentPage: number,
  itemsPerPage: number
) => {
  const { setLoading } = useLoading();
  const didSetLoading = useRef(false);

  const key = userId
    ? [`/user-favorite`, userId, currentPage, itemsPerPage]
    : null;

  const fetcher = async () => {
    const response = await getUserFavorites(userId, {
      page: currentPage,
      limit: itemsPerPage,
    });
    if (!response.success) {
      throw new Error(response.message || "Không thể lấy yêu thích.");
    }
    return response;
  };

  const { data, mutate, error, isLoading } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.message || "Không thể lấy yêu thích.");
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
    favorites: data?.data || [],
    total: data?.pagination?.total || 0,
    error,
    mutate,
  };
};
