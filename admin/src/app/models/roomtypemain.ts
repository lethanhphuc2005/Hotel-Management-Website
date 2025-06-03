import { TienNghi } from "./roomtype";

export interface RoomTypeDetail {
  _id: string;
  SoGiuong: number;
  GiaPhong: number;
  MoTa: string;
  View: string;
  TenLPCT: string;
  TrangThai: boolean;
  MaLP: string;
  TienNghi?: TienNghi[];
  HinhAnh?: string[];
}

export interface RoomTypeMain {
  // roomTypeMains: any;
  _id: string;
  TenLP: string;
  MoTa: string;
  TrangThai: boolean;
  DanhSachLoaiPhong: RoomTypeDetail[];
  HinhAnh: { _id: string; HinhAnh: string; MaLP: string }[];
}
