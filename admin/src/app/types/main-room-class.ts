export interface MainRoomClass {
room_classes: any;
  _id: string;
  name: string;
  description: string;
  status: boolean;
  room_class_list: RoomClass[];
  images: RoomClassImage[];
  [key: string]: any;
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
  [key: string]: any;
}

export interface RoomClassImage {
  _id: string;
  room_class_id: string;
  url: string;
  target: 'main_room_class';
  status: boolean;
}
