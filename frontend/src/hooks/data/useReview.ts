import useSWR from "swr";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import {
  fetchReviews,
  fetchReviewsByRoomClassId,
} from "@/services/ReviewService";
import { useEffect, useRef } from "react";

export const useUserReviews = (
  userId: string,
  currentPage: number,
  itemsPerPage: number
) => {
  const { setLoading } = useLoading();
  const didSetLoading = useRef(false);

  const key = userId
    ? [`/review/user`, userId, currentPage, itemsPerPage]
    : null;

  const fetcher = async () => {
    const response = await fetchReviews(userId, {
      page: currentPage,
      limit: itemsPerPage,
    });
    if (!response.success) {
      throw new Error(response.message || "Không thể lấy đánh giá.");
    }
    return response;
  };

  const { data, mutate, error, isLoading } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.message || "Không thể lấy đánh giá.");
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
    reviews: data?.data || [],
    total: data?.pagination?.total || 0,
    error,
    mutate,
  };
};

export const useRoomReviews = (
  roomId: string,
  currentPage: number,
  itemsPerPage: number
) => {
  const { setLoading } = useLoading();
  const didSetLoading = useRef(false);

  const key = roomId
    ? [`/review/room`, roomId, currentPage, itemsPerPage]
    : null;

  const fetcher = async () => {
    const response = await fetchReviewsByRoomClassId(roomId, {
      page: currentPage,
      limit: itemsPerPage,
    });
    if (!response.success) {
      const error = new Error(response.message || "Không thể lấy bình luận.");
      // Gắn thêm code vào error để dùng ở onErrorRetry
      (error as any).status = response.statusCode || 500;
      throw error;
    }
    return response;
  };

  const { data, mutate, error, isLoading } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    onErrorRetry: (err, key, config, revalidate, { retryCount }) => {
      if ((err as any).status === 404) return; // Không retry nếu là 404
      if (retryCount >= 3) return; // Không retry quá 3 lần
      setTimeout(() => revalidate({ retryCount }), 3000); // Retry sau 3s
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
    reviews: data?.data || [],
    total: data?.pagination?.total || 0,
    averageRating: data?.pagination?.averageRating || 0,
    error,
    mutate,
  };
};
