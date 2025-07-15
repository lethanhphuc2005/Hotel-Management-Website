import { Room } from "./room";

export interface RoomStatus {
  id: string;
  name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  rooms?: Room[];
}
