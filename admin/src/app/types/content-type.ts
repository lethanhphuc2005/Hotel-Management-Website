import { FilterParams, PaginationResponse } from './_common';
import { WebsiteContent } from './website-content';

export interface ContentType {
  id: string;
  name: string;
  description: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  website_content_list?: WebsiteContent[];
}

export interface ContentTypeResponse {
  message: string;
  data: ContentType[];
  pagination: PaginationResponse;
}

export interface ContentTypeDetailResponse {
  message: string;
  data: ContentType;
}

export interface ContentTypeRequest {
  name?: string;
  description?: string;
  status?: boolean;
}

export interface ContentTypeFilter extends FilterParams {
  status?: string;
}
