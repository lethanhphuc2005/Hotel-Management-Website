export interface ContentType {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  updatedAt: string;
}

export interface ContentTypeResponse {
  message: string;
  data: ContentType[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
