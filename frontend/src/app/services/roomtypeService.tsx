import { RoomType } from "../types/roomtype";

export async function getRoomTypes(url: string) {
  let res = await fetch(url);
  let data = await res.json();
  let roomtypes: RoomType[] = data.map((p: any) => {
    return {
      _id: p._id,
      TenLP: p.TenLP,
      SoGiuong: p.SoGiuong,
      GiaPhong: p.GiaPhong,
      MoTa: p.MoTa,
      View: p.View,
      HinhAnh: p.HinhAnh
    };
  });
  return roomtypes;
}