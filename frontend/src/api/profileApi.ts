import { api } from "@/lib/axiosInstance";
import { UpdateUserProfileRequest } from "@/types/user";

export const getProfile = async () => {
  try {
    const response = await api.get("/user/me");
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (
  userId: string,
  data: UpdateUserProfileRequest
) => {
  try {
    const response = await api.patch("/user/update/" + userId, data);
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
