export interface Comment {
  id: string;
  room_class_id: string;
  parent_id: string | null;
  employee_id: string | null;
  user_id: string | null;
  content: string;
  created_at: Date;
  updated_at: Date;
  parent_comment?: Comment[]; // Optional field for parent comment
}
