// services/roomService.ts
import { Room } from "../types/room";

export async function getRooms(url: string): Promise<Room[]> {
  const res = await fetch(url);
  const data = await res.json();

  const rooms: Room[] = data.map((p: any) => {
    return {
      _id: p._id,
      TenPhong: p.TenPhong,
      Tang: p.Tang,
      TrangThai: {
        _id: p.TrangThai._id,
        TenTT: p.TrangThai.TenTT,
        LoaiTT: p.TrangThai.LoaiTT
      },
      MaLP: {
        _id: p.MaLP._id,
        TenLP: p.MaLP.TenLP,
        SoGiuong: p.MaLP.SoGiuong,
        GiaPhong: p.MaLP.GiaPhong,
        MoTa: p.MaLP.MoTa,
        TienNghi: p.MaLP.TienNghi.map((tn: any) => ({
          _id: tn._id,
          TenTN: tn.TenTN,
          MoTa: tn.MoTa
        }))
      }
    };
  });

  return rooms;
}
