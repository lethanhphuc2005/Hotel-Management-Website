import api from "@/lib/axiosInstance";

export const getProfile = async (userId: string) => {
  try {
    const response = await api.get("/user/user-info/" + userId);
    if (response.status !== 200) {
      throw new Error("Failed to fetch profile data");
    }
    console.log("Profile data:", response.data.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
