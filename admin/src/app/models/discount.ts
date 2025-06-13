export interface Discount {
  _id?: string;
  id?: string; // nếu dùng id riêng
  name: string;
  image?: string;
  description: string;
  type: 'Percentage' | 'Fixed' | 'Service Discount';
  value: number;
  start_day: string;
  end_day: string;
  quantity?: number;
  status: boolean;
  limit: 'limited' | 'unlimited';
}
