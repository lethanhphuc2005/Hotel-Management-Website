import { publicApi } from "@/lib/axiosInstance";

export const getRoomClasses = async () => {
  try {
    const response = await publicApi.get("/room-class/user");
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching room classes:", error);
    throw error;
  }
};

export const getRoomClassById = async (id: string) => {
  try {
    const response = await publicApi.get(`/room-class/${id}`);
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching room class with ID ${id}:`, error);
    throw error;
  }
};
