import { PaginationResponse } from "./_common";
import { WebsiteContent } from "./websiteContent";

export interface ContentType {
  id: string;
  name: string;
  description?: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  website_content_list?: WebsiteContent[];
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
