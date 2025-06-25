export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  status?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
