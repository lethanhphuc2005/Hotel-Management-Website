import { Amenity } from "./amenity";

export interface RoomType {
  TenLP: string;
  SoGiuong: number;
  GiaPhong: number;
  MoTa: string;
  TienNghi: Amenity[];
}
