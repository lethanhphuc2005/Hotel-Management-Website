export interface ContentType {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  updatedAt: Date;
}

export interface WebsiteContent {
  _id: string;
  title: string;
  content: string;
  content_type_id: string;
  image: string | string[];
  content_type: ContentType[];
  status: boolean;
  updatedAt: Date;
}