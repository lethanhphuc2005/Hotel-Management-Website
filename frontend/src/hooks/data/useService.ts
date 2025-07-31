import useSWR from "swr";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useMemo, useRef } from "react";
import { fetchServices } from "@/services/ServiceService";

export const useServices = (
  params?: Partial<Parameters<typeof fetchServices>[0]>
) => {
  const { setLoading } = useLoading();
  const didSetLoading = useRef(false);
  const stableParams = useMemo(() => params || {}, [JSON.stringify(params)]);
  const keyParams = JSON.stringify(stableParams); // for SWR key
  const key = [`/service`, keyParams];

  const fetcher = async () => {
    const response = await fetchServices(stableParams);
    if (!response.success) {
      throw new Error(response.message || "Không thể lấy dịch vụ.");
    }
    return response;
  };

  

  const { data, mutate, error, isLoading } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.message || "Không thể lấy dịch vụ.");
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
    services: data?.data || [],
    total: data?.pagination?.total || 0,
    error,
    mutate,
  };
};
