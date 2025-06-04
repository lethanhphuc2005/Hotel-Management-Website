export interface User {
  [x: string]: any;
  id: string;
  TenKH: string;
  Email: string;
  SoDT: string;
  DiaChi: string;
  YeuCau_DB?: string;
  isActive: boolean;  // đổi từ TrangThai sang isActive
}
