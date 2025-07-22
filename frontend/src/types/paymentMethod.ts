export interface PaymentMethod {
  id: string;
  name: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
