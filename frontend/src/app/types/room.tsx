export interface TienNghi {
  _id: string;
  TenTN: string;
  MoTa: string;
}
export interface Status {
  _id: string;
  TenTT: string;
  LoaiTT: string;
}
export interface RoomType {
  _id: string;
  TenLP: string;
  SoGiuong: number;
  GiaPhong: number;
  MoTa: string;
  TienNghi: TienNghi[];
}

export interface Room {
  _id: string;
  TenPhong: string;
  Tang: number;
  TrangThai: Status;
  MaLP: RoomType; // kiểu đầy đủ, không phải string nữa
}