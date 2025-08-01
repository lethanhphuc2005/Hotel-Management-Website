import { publicApi } from "@/lib/axiosInstance";

export const getMainRoomClasses = async (params = {}) => {
  const response = await publicApi.get("/main-room-class/user", { params });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};

export const getMainRoomClassById = async (id: string) => {
  const response = await publicApi.get(`/main-room-class/${id}`);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};
