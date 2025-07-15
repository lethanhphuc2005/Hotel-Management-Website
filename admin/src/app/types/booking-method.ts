import { Booking } from './booking';
import { FilterParams, PaginationResponse } from './common';

export interface BookingMethod {
  id: string;
  name: string;
  description: string;
  status: boolean;
  bookings: Booking[];
}

export interface BookingMethodResponse {
  message: string;
  data: BookingMethod[];
  pagination: PaginationResponse;
}

export interface BookingMethodDetailResponse {
  message: string;
  data: BookingMethod;
}

export interface BookingMethodFilter extends FilterParams {
  status?: string;
}

export interface BookingMethodRequest {
  name?: string;
  description?: string;
  status?: boolean;
}
