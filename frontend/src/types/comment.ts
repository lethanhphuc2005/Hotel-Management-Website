export interface Comment {
  id: string;
  room_class_id: string;
  parent_id?: string | null;
  employee_id?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    is_verified?: boolean; // Optional field for employee verification status
  } | null;
  user_id: any; // User can be null if the review is anonymous
  content: string;
  status?: boolean;
  created_at?: Date;
  updated_at?: Date;
  parent_comment?: Comment[]; // Optional field for parent comment
}

export interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[];
}
