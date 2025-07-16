import { RoomClass } from "./room-class";
import { User } from "./user";

export interface Comment {
  id: string;
  room_class_id: RoomClass;
  parent_id?: string;
  employee_id?: string;
  user_id?: User;
  content: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  parent_comment?: Comment;
}
