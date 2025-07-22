import { PaginationResponse } from "./_common";

export interface ContentType {
  id: string;
  name: string;
  description?: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContentTypeResponse {
  success: boolean;
  message: string;
  data: ContentType;
}

export interface ContentTypeListResponse {
  success: boolean;
  message: string;
  data: ContentType[];
  pagination?: PaginationResponse;
}
