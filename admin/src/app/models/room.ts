import { RoomType } from "./roomtype";

export interface Room {
  _id: string;
  name:string;
  description: string;
  price: number|string;
  image:string;
}
