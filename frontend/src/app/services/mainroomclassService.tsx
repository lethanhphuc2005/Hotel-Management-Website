import { MainRoomClass } from "../types/mainroomclass";

export async function getMainRoomClass(url: string) {
  let res = await fetch(url);
  let data = await res.json();
  let mainroomclass: MainRoomClass[] = data.data.map((p: any) => {
    return {
      _id: p._id,
      name: p.name,
      description: p.description,
      room_class_list: p.room_class_list,
      images: p.images,
    };
  });
  return mainroomclass;
}