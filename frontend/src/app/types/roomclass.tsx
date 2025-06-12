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
}