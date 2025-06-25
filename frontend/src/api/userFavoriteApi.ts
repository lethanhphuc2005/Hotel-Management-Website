import { api } from "@/lib/axiosInstance";

export const createUserFavorite = async (
  userId: string,
  roomClassId: string
) => {
  try {
    const response = await api.post("/user-favorite", {
      user_id: userId,
      room_class_id: roomClassId,
    });
    if (response.status !== 201) {
      throw new Error("Failed to create user favorite");
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
      throw new Error("Failed to fetch user favorites");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    throw error;
  }
};

export const deleteUserFavorite = async (
  userId: string,
  favoriteId: string
) => {
  try {
    const response = await api.delete(`/user-favorite/${favoriteId}`, {
      data: { user_id: userId },
    });
    if (response.status !== 200) {
      throw new Error("Failed to delete user favorite");
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting user favorite:", error);
    throw error;
  }
};
