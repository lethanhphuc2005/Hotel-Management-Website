import { Booking } from './booking';
import { FilterParams, PaginationResponse } from './common';

export interface BookingStatus {
  id: string;
  name: string;
  status: boolean;
  code: string;
  created_at?: Date;
  updated_at?: Date;
  bookings?: Booking[];
}

export interface BookingStatusResponse {
  message: string;
  data: BookingStatus[];
  pagination: PaginationResponse;
}

export interface BookingStatusDetailResponse {
  message: string;
  data: BookingStatus;
}

export interface BookingStatusRequest {
  name?: string;
  status?: boolean;
  code?: string;
}

export interface BookingStatusFilter extends FilterParams {
  status?: string;
}
