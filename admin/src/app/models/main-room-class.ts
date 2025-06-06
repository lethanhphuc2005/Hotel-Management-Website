export interface MainRoomClass {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  room_class_list: RoomClass[];
  images: RoomClassImage[];
}

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
}

export interface RoomClassImage {
  _id: string;
  room_class_id: string;
  url: string;
  target: 'main_room_class';
  status: boolean;
}
