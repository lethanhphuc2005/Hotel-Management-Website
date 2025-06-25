import { ContentType } from "./contentType";

export interface WebsiteContent {
  id: string;
  content_type_id: string;
  title: string;
  content: string;
  image: string;
  content_type: ContentType[];
  status: boolean;
  created_at?: Date;
  updated_at?: Date;
}
