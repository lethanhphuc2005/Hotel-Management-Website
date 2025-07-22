export interface Image {
  id: string;
  room_class_id: string;
  url: string;
  target: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
