import {
  createUserFavorite as createUserFavoriteApi,
  getUserFavorites as getUserFavoritesApi,
  deleteUserFavorite as deleteUserFavoriteApi,
} from "@/api/userFavoriteApi";
import { UserFavorite } from "@/types/userFavorite";

export const createUserFavorite = async (
  userId: string,
  roomClassId: string
): Promise<UserFavorite> => {
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
    return userFavorite;
  } catch (error) {
    console.error("Error creating user favorite:", error);
    throw error;
  }
};

export const getUserFavorites = async (
  userId: string
): Promise<UserFavorite[]> => {
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
    return userFavorites;
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    throw error;
  }
};

export const deleteUserFavorite = async (
  userId: string,
  favoriteId: string
): Promise<void> => {
  try {
    const response = await deleteUserFavoriteApi(userId, favoriteId);

    return response.data;
  } catch (error) {
    console.error("Error deleting user favorite:", error);
    throw error;
  }
};
