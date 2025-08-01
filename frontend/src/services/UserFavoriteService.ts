import {
  DeleteUserFavoriteRequest,
  UserFavoriteListResponse,
} from "../types/userFavorite";
import {
  createUserFavorite as createUserFavoriteApi,
  getUserFavorites as getUserFavoritesApi,
  deleteUserFavorite as deleteUserFavoriteApi,
} from "@/api/userFavoriteApi";
import {
  CreateUserFavoriteRequest,
  UserFavorite,
  UserFavoriteResponse,
} from "@/types/userFavorite";

export const createUserFavorite = async ({
  userId,
  roomClassId,
}: CreateUserFavoriteRequest): Promise<UserFavoriteResponse> => {
  try {
    const response = await createUserFavoriteApi({ userId, roomClassId });
    const data = response.data;
    const userFavorite: UserFavorite = {
      id: data._id || data.id,
      user_id: data.user_id,
      room_class_id: data.room_class_id,
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at),
      room_class: data.room_class, // Assuming room_class is already in the correct format
      user: data.user, // Assuming user is already in the correct format
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
  userId: string,
  params = {}
): Promise<UserFavoriteListResponse> => {
  try {
    const response = await getUserFavoritesApi(userId, params);
    const data = response.data;
    const userFavorites: UserFavorite[] = data.map((item: any) => ({
      id: item._id || item.id,
      user_id: item.user_id,
      room_class_id: item.room_class_id,
      createdAt: new Date(item.createdAt || item.created_at),
      updatedAt: new Date(item.updatedAt || item.updated_at),
      room_class: item.room_class, // Assuming room_class is already in the correct format
      user: item.user, // Assuming user is already in the correct format
    }));
    return {
      success: true,
      message: response.message || "User favorites fetched successfully",
      data: userFavorites,
      pagination: response.pagination,
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

export const deleteUserFavorite = async ({
  userId,
  favoriteId,
}: DeleteUserFavoriteRequest): Promise<UserFavoriteResponse> => {
  try {
    const response = await deleteUserFavoriteApi({ userId, favoriteId });

    return {
      success: true,
      message: response.message || "User favorite deleted successfully",
      data: null as any, // No data returned on delete
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while deleting the user favorite";
    return {
      success: false,
      message,
      data: null as any, // Return an empty UserFavorite object on error
    };
  }
};
