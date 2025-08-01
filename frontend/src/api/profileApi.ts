import { api } from "@/lib/axiosInstance";
import { UpdateUserProfileRequest } from "@/types/user";

export const getProfile = async () => {
  const response = await api.get("/user/me");
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};

export const updateProfile = async (
  userId: string,
  data: UpdateUserProfileRequest
) => {
  const response = await api.patch("/user/update/" + userId, data);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};
