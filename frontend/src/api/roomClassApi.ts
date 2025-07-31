import { publicApi } from "@/lib/axiosInstance";
import qs from "qs";

export const getRoomClasses = async (memoizedParams = {}) => {
  const response = await publicApi.get("/room-class/user", {
    params: memoizedParams,
    paramsSerializer: (params) =>
      qs.stringify(params, {
        arrayFormat: "repeat",
        skipNulls: true,
      }),
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};

export const getRoomClassById = async (id: string) => {
  const response = await publicApi.get(`/room-class/${id}`);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};
