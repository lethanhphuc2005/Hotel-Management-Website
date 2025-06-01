import { RoomTypeMain } from "../types/roomtypemain";

export async function getRoomTypeMain(url: string) {
  let res = await fetch(url);
  let data = await res.json();
  let roomtypemains: RoomTypeMain[] = data.roomTypeMains.map((p: any) => {
    return {
      _id: p._id,
      TenLP: p.TenLP,
      MoTa: p.MoTa,
      TrangThai: p.TrangThai,
      HinhAnh: p.HinhAnh,
      DanhSachLoaiPhong: p.DanhSachLoaiPhong
    };
  });
  return roomtypemains;
}