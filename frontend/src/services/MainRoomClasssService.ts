import {
  getMainRoomClasses as getMainRoomClassesApi,
  getMainRoomClassById as getMainRoomClassByIdApi,
} from "@/api/mainRoomClassApi";
import {
  MainRoomClass,
  MainRoomClassListResponse,
  MainRoomClassResponse,
} from "@/types/mainRoomClass";

export const fetchMainRoomClasses =
  async (): Promise<MainRoomClassListResponse> => {
    try {
      const response = await getMainRoomClassesApi();
      const data = response.data;
      const mainRoomClasses: MainRoomClass[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        status: item.status || false,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        room_class_list: item.room_class_list
          ? item.room_class_list.map((rc: any) => ({
              id: rc.id,
              name: rc.name,
              description: rc.description || "",
              status: rc.status || false,
            }))
          : [],
        image: item.image,
      }));
      return {
        success: true,
        message: response.message || "Main room classes fetched successfully",
        data: mainRoomClasses,
        pagination: response.pagination || undefined,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "An error occurred while fetching main room classes";
      return {
        success: false,
        message,
        data: [],
        pagination: undefined,
      };
    }
  };

export const fetchMainRoomClassById = async (
  id: string
): Promise<MainRoomClassResponse> => {
  try {
    const response = await getMainRoomClassByIdApi(id);
    const data = response.data;
    const mainRoomClass: MainRoomClass = {
      id: data.id,
      name: data.name,
      description: data.description || "",
      status: data.status || false,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      room_class_list: data.room_class_list
        ? data.room_class_list.map((rc: any) => ({
            id: rc.id,
            name: rc.name,
            description: rc.description || "",
            status: rc.status || false,
          }))
        : [],
      image: data.image,
    };

    return {
      success: true,
      message: response.message || "Main room class fetched successfully",
      data: mainRoomClass,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching main room class";
    return {
      success: false,
      message,
      data: null as any, // Adjust type as necessary
    };
  }
};
