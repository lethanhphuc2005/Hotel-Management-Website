import useSWR from "swr";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useRef } from "react";
import { fetchWebsiteContents } from "@/services/WebsiteContentService";

export const useWebsiteContent = (
  currentPage: number,
  itemsPerPage: number
) => {
  const { setLoading } = useLoading();
  const didSetLoading = useRef(false);
  const key = [`/website-content/user`, currentPage, itemsPerPage];

  const fetcher = async () => {
    const response = await fetchWebsiteContents();
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
    websiteContents: data?.data || [],
    total: data?.pagination?.total || 0,
    error,
    mutate,
  };
};
