export interface BookingMethod {
  id: string;
  name: string;
  description?: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
