// export interface TienNghi {
//   _id: string;
//   TenTN: string;
//   MoTa: string;
//   MaLP: string;
// }

// export interface HinhAnh {
//   _id: string;
//   HinhAnh: string;
//   MaLP: string;
// }

// export interface RoomType {
//   isActive: any;
//   _id: string;
//   TenLP: string;
//   SoGiuong: number;
//   GiaPhong: number;
//   MoTa: string;
//   View: string; // ✅ Thêm trường views
//   TienNghi: TienNghi[];
//   HinhAnh: HinhAnh[];
// }

export interface TienNghi {
  _id: string;
  TenTN: string;
  MoTa: string;
  MaLP: string; // id loại phòng hoặc kiểu tham chiếu
}

export interface HinhAnh {
  _id: string;
  HinhAnh: string; // tên file ảnh hoặc url
  MaLP: string;
}

export interface RoomType {
DanhSachLoaiPhong: any;
HoatDong: any;
  _id: string;
  TenLPCT: string;    // đổi TenLP thành TenLPCT theo data mới
  SoGiuong: number;
  GiaPhong: number;
  MoTa: string;
  View: string;       // trường View tồn tại
  TrangThai: boolean; // thêm trường trạng thái nếu có trong data
  MaLP: string;       // id loại phòng (nếu cần)
  TienNghi: TienNghi[];
  HinhAnh: HinhAnh[];
}
