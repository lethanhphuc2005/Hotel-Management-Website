export interface RoomClassFeature {
  _id: string;
  room_class_id: string;
  feature_id: Feature;
}

export interface Feature {
  _id: string;
  name: string;
  description: string;
  image: string;
}

export interface MainRoomClass {
  _id: string;
  name: string;
  description: string;
}

export interface Images {
  _id: string;
  room_class_id: string;
  url: string;
}

// Thêm interface cho comment
export interface RoomComment {
  _id: string;
  room_class_id: string;
  parent_id?: string | null;
  user_id?: any; // Có thể khai báo rõ hơn nếu biết cấu trúc user
  content: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
}

export interface RoomClass {
  price_discount: number;
  _id: string;
  bed_amount: number;
  description: string;
  view: string;
  name: string;
  status: boolean;
  main_room_class_id: string;
  capacity: number;
  price: number;
  main_room_class: MainRoomClass[];
  features: RoomClassFeature[];
  images: Images[];
  comments?: RoomComment[]; // Thêm dòng này để có comments trong RoomClass
}