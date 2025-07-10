export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  address: string;
  email: string;
  phone_number: string;
  role: string;
  status: boolean;
  updatedAt?: string; // Có thể không có nếu chưa cập nhật
}
