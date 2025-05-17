import { Room } from "../types/room";

export async function getRooms(url: string) {
  let res = await fetch(url);
  let data = await res.json();
  let rooms: Room[] = data.map((p: any) => {
    return {
      _id: p._id,
      TenPhong: p.TenPhong,
      Tang: p.Tang,
      TrangThai: p.TrangThai,
      MaLP: p.MaLP
    };
  });
  return rooms;
}