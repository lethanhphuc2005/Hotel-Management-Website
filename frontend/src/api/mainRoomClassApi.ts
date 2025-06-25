import { publicApi } from "@/lib/axiosInstance";

export const getMainRoomClasses = async () => {
  try {
    const response = await publicApi.get("/main-room-class/user");
    if (response.status !== 200) {
      throw new Error(
        `Error fetching main room classes: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching main room classes:", error);
    throw error;
  }
};

export const getMainRoomClassById = async (id: string) => {
  try {
    const response = await publicApi.get(`/main-room-class/${id}`);
    if (response.status !== 200) {
      throw new Error(
        `Error fetching main room class with ID ${id}: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching main room class with ID ${id}:`, error);
    throw error;
  }
};