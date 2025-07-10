import { WebsiteContent } from "./website-content";

export interface ContentType {
  id: string;
  name: string;
  description: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  website_content_list?: WebsiteContent[];
}
