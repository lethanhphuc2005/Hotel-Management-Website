import { PaginationResponse } from "./_common";
import { Image } from "./image";

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  image: Image;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceBooking {
  id: string;
  amount: number;
  service_id: string;
  used_at: Date;
  service: Service;
}
export interface ServiceResponse {
  success: boolean;
  message?: string;
  data: Service;
}

export interface ServiceListResponse {
  success: boolean;
  message?: string;
  data: Service[];
  pagination?: PaginationResponse;
}