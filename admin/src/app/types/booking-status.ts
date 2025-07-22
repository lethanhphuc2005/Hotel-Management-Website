import { Booking } from './booking';
import { FilterParams, PaginationResponse } from './_common';

export interface BookingStatus {
  id: string;
  name: string;
  status: boolean;
  code: string;
  bookings?: Booking[];
  createdAt?: Date;
  updatedAt?: Date;
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
