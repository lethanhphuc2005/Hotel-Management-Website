import { PaginationResponse, PaginationParams } from './common';
import { RoomClass } from './room-class';
import { BookingStatus, RoomStatus } from './status';

export interface Room {
  id: string;
  name: string;
  floor: number;
  room_class_id: string;
  room_status_id?: string;
  created_at?: Date;
  updated_at?: Date;
  room_class?: RoomClass[];
  status?: RoomStatus[];
}

export interface RoomResponse {
  message: string;
  data: Room[];
  pagination?: PaginationResponse;
}

export interface RoomDetailResponse {
  message: string;
  data: Room;
}

export interface RoomCalenderEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: BookingStatus;
}

export interface RoomBookingCalendarResponse {
  events: RoomCalenderEvent[];
}

export interface RoomRequest {
  name?: string;
  floor?: number;
  room_class_id?: string;
  room_status_id?: string;
}

export interface RoomFilter extends PaginationParams {
  status?: string;
  type?: string;
  check_in_date?: string;
  check_out_date?: string;
}
