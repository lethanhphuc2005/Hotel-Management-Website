import useSWR from "swr";
import { toast } from "react-toastify";
import { getBookingsForUser } from "@/services/BookingService";
import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useRef } from "react";

export const useUserBookings = (
  userId: string,
  currentPage: number,
  itemsPerPage: number
) => {
  const { setLoading } = useLoading();
  const didSetLoading = useRef(false);
  const key = userId
    ? [`/booking/user`, userId, currentPage, itemsPerPage]
    : null;

  const fetcher = async () => {
    const response = await getBookingsForUser(userId, {
      page: currentPage,
      limit: itemsPerPage,
    });
    if (!response.success) {
      throw new Error(response.message || "Không thể lấy đặt phòng.");
    }
    return response;
  };

  const { data, mutate, error, isLoading } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.message || "Không thể lấy đặt phòng.");
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
    bookings: data?.data || [],
    total: data?.pagination?.total || 0,
    error,
    mutate,
  };
};
