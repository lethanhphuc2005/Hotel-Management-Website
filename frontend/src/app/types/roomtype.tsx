export interface RoomType {
  _id: string;
  TenLP: string;
  SoGiuong: number;
  GiaPhong: number;
  MoTa: string;
  HinhAnh?: RoomImage[];
}

export interface RoomImage {
  _id: string;
  HinhAnh: string; // tên file, ví dụ: "r1.jpg"
  MaLP: string;
}