export interface RoomTypeMain {
  _id: string;
  TenLP: string;
  MoTa: string;
  TrangThai: boolean;
  HinhAnh?: RoomImage[];
  DanhSachLoaiPhong?: RoomTypeList[];
}

export interface RoomImage {
  _id: string;
  HinhAnh: string; // tên file, ví dụ: "r1.jpg"
  MaLP: string;
}

export interface RoomTypeList {
  _id: string;
  SoGiuong: number;
  GiaPhong: number;
  MoTa: string;
  View: string;
  TenLPCT: string;
  TrangThai: boolean;
  MaLP: string;
}