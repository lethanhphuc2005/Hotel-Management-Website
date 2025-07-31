import useSWR from "swr";
import { useLoading } from "@/contexts/LoadingContext";
import {
  fetchRoomClassById,
  fetchRoomClasses,
} from "@/services/RoomClassService";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";

export const useRoomClass = (
  params?: Partial<Parameters<typeof fetchRoomClasses>[0]>
) => {
  const { setLoading } = useLoading();

  const stableParams = useMemo(() => params || {}, [JSON.stringify(params)]);
  const keyParams = JSON.stringify(stableParams); // for SWR key

  const key = [`/room-class`, keyParams];
  const fetcher = async () => {
    try {
      setLoading(true);
      const response = await fetchRoomClasses(stableParams);
      if (!response.success) {
        throw new Error(response.message || "Không thể lấy danh sách phòng.");
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const { data, error, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.message || "Không thể lấy danh sách phòng.");
    },
  });

  return {
    roomClasses: data?.data || [],
    total: data?.pagination?.total || 0,
    error,
    mutate,
  };
};

export const useRoomClassDetail = (roomId: string) => {
  const { setLoading } = useLoading();
  const didSetLoading = useRef(false);

  const key = roomId ? [`/room-class/${roomId}`] : null;

  const fetcher = async () => {
    try {
      setLoading(true);
      const response = await fetchRoomClassById(roomId);
      if (!response.success) {
        throw new Error(response.message || "Không thể lấy chi tiết phòng.");
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const { data, error, mutate, isLoading } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.message || "Không thể lấy chi tiết phòng.");
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
    roomClass: data?.data || null,
    error,
    mutate,
  };
};
