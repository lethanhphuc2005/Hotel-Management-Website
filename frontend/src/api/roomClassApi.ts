import { publicApi } from "@/lib/axiosInstance";

export const getRoomClasses = async ({
  search = "",
  page = 1,
  limit = 10,
  sort = "createdAt",
  order = "desc",
  check_in_date,
  check_out_date,
}: {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  check_in_date?: string;
  check_out_date?: string;
}) => {
  try {
    const response = await publicApi.get("/room-class/user", {
      params: {
        search,
        page,
        limit,
        sort,
        order,
        check_in_date,
        check_out_date,
      },
    });
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
