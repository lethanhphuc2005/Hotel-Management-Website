export interface Review {
  id: string;
  room_class_id: string;
  parent_id: string | null;
  employee_id: string | null;
  user_id: string | null;
  rating: number | null; // Rating can be null if not provided
  content: string;
  created_at: Date;
  updated_at: Date;
  parent_review?: Review[]; // Optional field for parent comment
}
