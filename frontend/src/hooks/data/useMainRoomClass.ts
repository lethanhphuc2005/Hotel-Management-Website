import useSWR from "swr";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useMemo, useRef } from "react";
import { fetchMainRoomClasses } from "@/services/MainRoomClassService";

export const useMainRoomClass = (
  params?: Partial<Parameters<typeof fetchMainRoomClasses>[0]>
) => {
  const { setLoading } = useLoading();
  const didSetLoading = useRef(false);
  const stableParams = useMemo(() => params || {}, [JSON.stringify(params)]);
  const keyParams = JSON.stringify(stableParams); // for SWR key
  const key = [`/main-room-class/user`, keyParams];

  const fetcher = async () => {
    const response = await fetchMainRoomClasses(stableParams);
    if (!response.success) {
      throw new Error(response.message || "Không thể lấy loại phòng chính.");
    }
    return response;
  };

  const { data, mutate, error, isLoading } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.message || "Không thể lấy loại phòng chính.");
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
    mainRoomClasses: data?.data || [],
    total: data?.pagination?.total || 0,
    error,
    mutate,
  };
};
