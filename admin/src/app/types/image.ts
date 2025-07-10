export interface RoomClassImage {
  _id?: string;
  url: string;
  room_class_id?: string;
  target: 'main_room_class' | 'room_class';
  status: boolean;
}
