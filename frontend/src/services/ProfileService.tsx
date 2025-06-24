import { changePassword, getProfile, updateProfile } from "@/api/profileApi";
import { IUser } from "@/types/user";

export const fetchProfile = async (userId: string) => {
  try {
    const response = await getProfile(userId);
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
    };
    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const saveProfile = async (
  userId: string,
  profileData: Partial<IUser>
) => {
  try {
    const response = await updateProfile(userId, profileData);
    const data = response.data;
    const updatedProfile: IUser = {
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
    };
    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const savePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  try {
    const response = await changePassword(userId, currentPassword, newPassword);
    if (response.error) {
      throw new Error(response.message);
    }
    return response;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
