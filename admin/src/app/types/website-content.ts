import { ContentType } from './content-type';

export interface WebsiteContent {
  id: string;
  title: string;
  content: string;
  content_type_id: string;
  image: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  content_type: ContentType[];
}
