import { publicApi } from "@/lib/axiosInstance";

export const getServices = async (params = {}) => {
  const response = await publicApi.get("/service/user", {
    params,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};

export const getServiceById = async (id: string) => {
  const response = await publicApi.get(`/service/${id}`);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};
