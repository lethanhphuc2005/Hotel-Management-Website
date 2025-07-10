import { Booking } from "./booking";
import { Room } from "./room";

export interface RoomStatus {
  id: string;
  name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  rooms?: Room[];
}

export interface BookingStatus {
  id: string;
  name: string;
  status: boolean;
  code: string;
  created_at: Date;
  updated_at: Date;
  bookings?: Booking[];
}
