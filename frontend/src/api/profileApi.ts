import api from "@/lib/axiosInstance";

export const getProfile = async (userId: string) => {
  try {
    const response = await api.get("/user/user-info/" + userId);
    if (response.status !== 200) {
      throw new Error("Failed to fetch profile data");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (userId: string, data: any) => {
  try {
    const response = await api.put("/user/update/" + userId, data);
    if (response.status !== 200) {
      throw new Error("Failed to update profile");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const changePassword = async (
  userId: string,
  password: string,
  newPassword: string
) => {
  try {
    const response = await api.put("/user/change-password/" + userId, {
      password,
      newPassword,
    });
    
    return {
      error: false,
      message: response.data.message || "Đổi mật khẩu thành công",
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "Đã xảy ra lỗi khi đổi mật khẩu";
    return {
      error: true,
      message,
    };
  }
};
