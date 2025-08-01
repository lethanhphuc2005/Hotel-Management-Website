import { publicApi } from "@/lib/axiosInstance";

export const getFeatures = async (params = {}) => {
  const response = await publicApi.get(`/feature/user`, {
    params,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};

export const getFeatureById = async (featureId: string) => {
  const response = await publicApi.get(`/feature/${featureId}`);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};
