import {
  createUserFavorite as createUserFavoriteApi,
  getUserFavorites as getUserFavoritesApi,
  deleteUserFavorite as deleteUserFavoriteApi,
} from "@/api/userFavoriteApi";
import { UserFavorite } from "@/types/userFavorite";

export const createUserFavorite = async (
  userId: string,
  roomClassId: string
): Promise<{
  success: boolean;
  message?: string;
  data: UserFavorite;
}> => {
  try {
    const response = await createUserFavoriteApi(userId, roomClassId);
    const data = response.data;
    const userFavorite: UserFavorite = {
      id: data._id || data.id,
      user_id: data.user_id,
      room_class_id: data.room_class_id,
      created_at: new Date(data.createdAt || data.created_at),
      updated_at: new Date(data.updatedAt || data.updated_at),
    };
    return {
      success: true,
      message: response.message || "User favorite created successfully",
      data: userFavorite,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while creating the user favorite";
    return {
      success: false,
      message,
      data: {} as UserFavorite, // Return an empty UserFavorite object on error
    };
  }
};

export const getUserFavorites = async (
  userId: string
): Promise<{
  success: boolean;
  message?: string;
  data: UserFavorite[];
}> => {
  try {
    const response = await getUserFavoritesApi(userId);
    const data = response.data;
    const userFavorites: UserFavorite[] = data.map((item: any) => ({
      id: item._id || item.id,
      user_id: item.user_id,
      room_class_id: item.room_class_id,
      created_at: new Date(item.createdAt || item.created_at),
      updated_at: new Date(item.updatedAt || item.updated_at),
    }));
    return {
      success: true,
      message: response.message || "User favorites fetched successfully",
      data: userFavorites,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching user favorites";
    return {
      success: false,
      message,
      data: [], // Return an empty array on error
    };
  }
};

export const deleteUserFavorite = async (
  userId: string,
  favoriteId: string
): Promise<{
  success: boolean;
  message?: string;
  data?: UserFavorite;
}> => {
  try {
    const response = await deleteUserFavoriteApi(userId, favoriteId);

    return {
      success: true,
      message: response.message || "User favorite deleted successfully",
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while deleting the user favorite";
    return {
      success: false,
      message,
      data: {} as UserFavorite, // Return an empty UserFavorite object on error
    };
  }
};
