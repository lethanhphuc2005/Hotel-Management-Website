import {
  getProfile as getProfileApi,
  updateProfile as updateProfileApi,
} from "@/api/profileApi";
import { IUser } from "@/types/user";

export const fetchProfile = async (
  userId: string
): Promise<{
  success: boolean;
  message?: string;
  data: IUser;
}> => {
  try {
    const response = await getProfileApi(userId);
    const data = response.data;
    const profile: IUser = {
      id: data.id || data._id,
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      address: data.address || "",
      email: data.email,
      phone_number: data.phone_number || "",
      request: data.request || "",
      status: data.status,
      is_verified: data.is_verified,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      bookings: data.bookings || [],
      comments: data.comments || [],
      reviews: data.reviews || [],
      favorites: data.favorites || [],
    };
    return {
      success: true,
      message: response.message || "Profile fetched successfully",
      data: profile,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching profile";
    return {
      success: false,
      message,
      data: {} as IUser, // Return an empty IUser object on error
    };
  }
};

export const saveProfile = async (
  userId: string,
  profileData: Partial<IUser>
): Promise<{
  success: boolean;
  message?: string;
  data: IUser;
}> => {
  try {
    const response = await updateProfileApi(userId, profileData);
    const data = response.data;
    const updatedProfile: IUser = {
      id: data.id || data._id,
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      address: data.address || "",
      email: data.email,
      phone_number: data.phone_number || "",
      request: data.request || "",
    };
    return {
      success: true,
      message: response.message || "Profile updated successfully",
      data: updatedProfile,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while updating profile";
    return {
      success: false,
      message,
      data: {} as IUser, // Return an empty IUser object on error
    };
  }
};
