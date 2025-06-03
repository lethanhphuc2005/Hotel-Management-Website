import { Status } from "./status";

export interface TienNghi {
  _id: string;
  TenTN: string;
  MoTa: string;
  MaLP: string;
}

export interface LoaiPhong {
  _id: string;
  TenLP: string;
  SoGiuong: number;
  GiaPhong: number;
  MoTa: string;
  TienNghi: TienNghi[];
}

export interface Room {
  _id: string;
  Tang: number;
  TrangThai: Status;  // sửa thành Status (object)
  MaLP: LoaiPhong;
  TenPhong: string;
  isActive?: any;
  TenLP?: any;
}


