export interface MainRoomClass {
  _id: string;
  name: string;
  description: string;
  room_class_list: RoomClassList[];
  images: Image[];
}

export interface Image {
  _id: string;
  room_class_id: string;
  url: string;
  target: string;
}

export interface RoomClassList {
  price_discount: number;
  _id: string;
  bed_amount: number;
  description: string;
  view: string;
  name: string;
  main_room_class_id: string;
  capacity: number;
  price: number;
}