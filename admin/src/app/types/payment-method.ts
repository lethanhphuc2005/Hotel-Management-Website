import { FilterParams, PaginationResponse } from './_common';
import { Booking } from './booking';

export interface PaymentMethod {
  id: string;
  name: string;
  status: boolean;
  payments: Booking[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentMethodResponse {
  message: string;
  data: PaymentMethod[];
  pagination?: PaginationResponse;
}

export interface PaymentMethodDetailResponse {
  message: string;
  data: PaymentMethod;
}

export interface PaymentMethodRequest {
  name?: string;
  status?: boolean;
}

export interface PaymentMethodFilter extends FilterParams {
  status?: string;
}
