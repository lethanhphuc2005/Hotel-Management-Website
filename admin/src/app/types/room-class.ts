import { FeatureMapping } from './feature';
import { MainRoomClass } from './main-room-class';

export interface RoomClass {
  _id: string;
  name: string;
  description: string;
  view: string;
  bed_amount: number;
  capacity: number;
  price: number;
  price_discount: number;
  status: boolean;
  main_room_class_id: string;
  main_room_class?: MainRoomClass[];
  features?: FeatureMapping[];
  images?: any[]; // nếu ảnh là mảng object thì bạn có thể tạo interface riêng cho ảnh
}
