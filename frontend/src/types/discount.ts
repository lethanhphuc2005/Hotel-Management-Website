export interface Discount {
  id: string;
  name: string;
  image: string;
  description: string;
  type: string;
  value: number;
  start_day: Date;
  end_day: Date;
  quantity: number;
  limit?: number;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
}
