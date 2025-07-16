export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceBooking {
  id: string;
  service_id: Service;
  amount: number;
  used_at: Date;
}
