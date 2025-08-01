import { publicApi } from "@/lib/axiosInstance";

export const getContentTypes = async () => {
  const response = await publicApi.get("/content-type/user");
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};

export const getContentTypeById = async (id: string) => {
  const response = await publicApi.get(`/content-type/${id}`);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};
