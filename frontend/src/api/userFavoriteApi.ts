import { api } from "@/lib/axiosInstance";
import {
  CreateUserFavoriteRequest,
  DeleteUserFavoriteRequest,
} from "@/types/userFavorite";

export const createUserFavorite = async ({
  userId,
  roomClassId,
}: CreateUserFavoriteRequest) => {
  try {
    const response = await api.post("/user-favorite", {
      user_id: userId,
      room_class_id: roomClassId,
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error creating user favorite:", error);
    throw error;
  }
};

export const getUserFavorites = async (userId: string) => {
  try {
    const response = await api.get(`/user-favorite/${userId}`);
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    throw error;
  }
};

export const deleteUserFavorite = async ({
  userId,
  favoriteId,
}: DeleteUserFavoriteRequest) => {
  try {
    const response = await api.delete(`/user-favorite/${favoriteId}`, {
      data: { user_id: userId },
    });
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting user favorite:", error);
    throw error;
  }
};
