import { publicApi } from "@/lib/axiosInstance";

export const getWebsiteContents = async () => {
  const response = await publicApi.get("/website-content/user");
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};

export const getWebsiteContentById = async (id: string) => {
  const response = await publicApi.get(`/website-content/${id}`);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};
