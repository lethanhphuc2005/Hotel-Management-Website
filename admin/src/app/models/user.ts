export interface User {
  id: string;
  TenKH: string;
  Email: string;
  SoDT: string;
  DiaChi: string;
  YeuCau_DB?: string;
  isActive: boolean;
  status?: boolean; // <- Thêm dòng này
  [key: string]: any; // Nếu bạn vẫn cần linh hoạt
}
