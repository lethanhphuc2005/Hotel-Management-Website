import {
  getMainRoomClasses as getMainRoomClassesApi,
  getMainRoomClassById as getMainRoomClassByIdApi,
} from "@/api/mainRoomClassApi";
import { MainRoomClass } from "@/types/mainRoomClass";

export const fetchMainRoomClasses = async (): Promise<MainRoomClass[]> => {
  try {
    const response = await getMainRoomClassesApi();
    const data = response.data;
    const mainRoomClasses: MainRoomClass[] = data.map((mrc: any) => ({
      id: mrc.id,
      name: mrc.name,
      description: mrc.description || "",
      status: mrc.status || false,
      created_at: new Date(mrc.createdAt),
      updated_at: new Date(mrc.updatedAt),
      room_class_list: mrc.room_class_list
        ? mrc.room_class_list.map((rc: any) => ({
            id: rc.id,
            name: rc.name,
            description: rc.description || "",
            status: rc.status || false,
            created_at: new Date(rc.createdAt),
            updated_at: new Date(rc.updatedAt),
          }))
        : [],
      images: mrc.images
        ? mrc.images.map((img: any) => ({
            id: img.id,
            url: img.url,
            target: img.target || "",
            created_at: new Date(img.createdAt),
            updated_at: new Date(img.updatedAt),
          }))
        : [],
    }));
    return mainRoomClasses;
  } catch (error) {
    console.error("Error fetching main room classes:", error);
    throw error;
  }
};

export const fetchMainRoomClassById = async (
  id: string
): Promise<MainRoomClass> => {
  try {
    const response = await getMainRoomClassByIdApi(id);
    const data = response.data;
    const mainRoomClass: MainRoomClass = {
      id: data.id,
      name: data.name,
      description: data.description || "",
      status: data.status || false,
      created_at: new Date(data.createdAt),
      updated_at: new Date(data.updatedAt),
      room_class_list: data.room_class_list
        ? data.room_class_list.map((rc: any) => ({
            id: rc.id,
            name: rc.name,
            description: rc.description || "",
            status: rc.status || false,
            created_at: new Date(rc.createdAt),
            updated_at: new Date(rc.updatedAt),
          }))
        : [],
      images: data.images
        ? data.images.map((img: any) => ({
            id: img.id,
            url: img.url,
            target: img.target || "",
            created_at: new Date(img.createdAt),
            updated_at: new Date(img.updatedAt),
          }))
        : [],
    };

    return mainRoomClass;
  } catch (error) {
    console.error(`Error fetching main room class with ID ${id}:`, error);
    throw error;
  }
};
