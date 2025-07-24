import {
  getProfile as getProfileApi,
  updateProfile as updateProfileApi,
} from "@/api/profileApi";
import {
  User,
  UserProfileResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
} from "@/types/user";
import { Wallet } from "@/types/wallet";

export const fetchProfile = async (): Promise<UserProfileResponse> => {
  try {
    const response = await getProfileApi();
    const data = response.data;

    const wallet = data.wallet;

    const sortedWallet: Wallet = {
      ...wallet,
      transactions: wallet.transactions.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    };

    const profile: User = {
      id: data.id || data._id,
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      address: data.address || "",
      email: data.email,
      phone_number: data.phone_number || "",
      request: data.request || "",
      level: data.level || "",
      total_spent: data.total_spent || 0,
      total_nights: data.total_nights || 0,
      total_bookings: data.total_bookings || 0,
      status: data.status || false,
      is_verified: data.is_verified || false,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      bookings: data.bookings || [],
      comments: data.comments || [],
      reviews: data.reviews || [],
      favorites: data.favorites || [],
      wallet: sortedWallet, // Chỉ lấy ví đầu tiên đã sắp xếp
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
      data: {} as User, // Return an empty User object on error
    };
  }
};

export const saveProfile = async (
  userId: string,
  profileData: Partial<User>
): Promise<UpdateUserProfileResponse> => {
  try {
    const response = await updateProfileApi(userId, profileData);
    const data = response.data;
    const updatedProfile: UpdateUserProfileRequest = {
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
      data: {} as User, // Return an empty User object on error
    };
  }
};
