import { HinhAnh } from "./roomtype";

export interface ILoaiNoiDung {
  _id: string;
  TenND: string;
  MoTa: string;
  id: string;
}

export interface IContent {
Active: any;
  _id: string;
  TieuDe: string;
  NoiDung: string;
  MaND: string;
  NgayDang: string; // hoặc Date nếu bạn convert
  HinhAnh: string;
  TrangThai: boolean;
  LoaiNoiDung: ILoaiNoiDung;
  id: string;
}
