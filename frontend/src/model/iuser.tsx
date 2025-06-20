// src/model/iuser.ts

export interface IUser {
  _id: string;              // ID chính, bắt buộc
  id?: string;              // ID phụ (nếu backend dùng id thay vì _id)
  first_name: string;       // Tên, bắt buộc
  last_name?: string;       // Họ, tùy chọn
  email?: string;           // Email, tùy chọn
  password?: string;        // Mật khẩu, tùy chọn (thường không trả về từ API)
  address?: string;         // Địa chỉ, tùy chọn
  phone_number?: string;    // Số điện thoại, tùy chọn
  request?: string;         // Yêu cầu, tùy chọn
  status?: boolean;         // Trạng thái, tùy chọn
  role?: string | number;   // Vai trò, tùy chọn
  subscribed?: boolean;     // Đăng ký nhận tin, tùy chọn
}

export interface IAuthContextType {
  user: IUser | null;         // Thông tin user, có thể null
  token: string | null;       // Token xác thực, có thể null
  login: (email: string, password: string) => Promise<boolean>; // Hàm đăng nhập
  logout: () => void;         // Hàm đăng xuất
  loading: boolean;           // Trạng thái tải, bắt buộc
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>; // Đảm bảo type của setUser

}