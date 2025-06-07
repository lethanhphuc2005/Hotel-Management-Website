export interface IContent {
  _id: string;
  title: string;
  content: string;
  content_type_id: string;
  image: string;
  status: boolean;
  updatedAt: string;
  content_type: {
    _id: string;
    name: string;
    description: string;
    status: boolean;
    updatedAt: string;
  }[];
  
}
