import { Room } from "./room";

export interface RoomStatus {
  id: string;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  rooms?: Room[];
}
