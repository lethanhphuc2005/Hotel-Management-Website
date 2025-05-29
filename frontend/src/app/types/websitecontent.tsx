export interface ContentType {
  _id: string;
  TenND: string;
  MoTa: string;
}
export interface WebsiteContent {
  _id: string;
  TieuDe: string;
  NoiDung: string;
  MaND: string;
  NgayDang: Date;
  HinhAnh: string;
  LoaiNoiDung: ContentType;
}