import { BookingStatus } from './booking-status';
import { PaginationResponse, FilterParams } from './_common';
import { RoomClass } from './room-class';
import { RoomStatus } from './status';

export interface Room {
  id: string;
  name: string;
  floor: number;
  room_class_id: string;
  room_status_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  room_class?: RoomClass;
  room_status?: RoomStatus;
  booking_count?: number;
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

export interface RoomFilter extends FilterParams {
  status?: string;
  type?: string;
  check_in_date?: string;
  check_out_date?: string;
}
