import useSWR from "swr";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useRef } from "react";
import { fetchContentTypes } from "@/services/ContentTypeService";

export const useContentType = (currentPage: number, itemsPerPage: number) => {
  const { setLoading } = useLoading();
  const didSetLoading = useRef(false);
  const key = [`/content-type/user`, currentPage, itemsPerPage];

  const fetcher = async () => {
    const response = await fetchContentTypes();
    if (!response.success) {
      throw new Error(response.message || "Không thể lấy dữ liệu");
    }
    return response;
  };

  const { data, mutate, error, isLoading } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.message || "Không thể lấy dữ liệu");
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
    contentTypes: data?.data || [],
    total: data?.pagination?.total || 0,
    error,
    mutate,
  };
};
