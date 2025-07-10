// Raw data from API
export interface UserRaw {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  request: string;
  status: boolean;
}

// UI-friendly format
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  requestNote: string;
  isActive: boolean;
}
