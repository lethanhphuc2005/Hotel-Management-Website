export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  phone_number: string;
  request: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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
  updatedAt?: string;
}

export interface RoomClass {
  _id: string;
  name: string;
  bed_amount: number;
  view: string;
  capacity: number;
  price: number;
  price_discount: number;
  main_room_class_id: string;
  status: boolean;
}

export interface Comment {
  _id: string;
  room_class_id: RoomClass;
  parent_id: string | null;
  user_id: User | null;
  employee_id: Employee | null;
  content: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  replies: Comment[]; // lồng đệ quy
}
