import { FilterParams, PaginationResponse } from './common';

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceBooking {
  id: string;
  service_id: Service;
  amount: number;
  used_at: Date;
}

export interface ServiceResponse {
  message: string;
  data: Service[];
  pagination: PaginationResponse;
}

export interface ServiceDetailResponse {
  message: string;
  data: Service;
}

export interface ServiceRequest {
  name?: string;
  price?: number;
  description?: string;
  status?: boolean;
  image?: File | null; // Optional for file upload
}

export interface ServiceFilter extends FilterParams {
  status?: string
}
