import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { Employee } from './employee';
import { RoomClass } from './room-class';
import { User } from './user';
import { FilterParams } from './common';

export interface Comment {
  id: string;
  room_class_id: RoomClass;
  parent_id?: string;
  employee_id?: Employee;
  user_id?: User;
  content: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  children: Comment[]; // For nested comments
}

export interface CommentResponse {
  message: string;
  data: Comment[];
  pagination: PaginationComponent;
}

export interface CommentDetailResponse {
  message: string;
  data: Comment;
}

export interface CommentRequest {
  room_class_id?: string;
  parent_id?: string;
  employee_id?: string;
  user_id?: string;
  content?: string;
  status?: boolean;
}

export interface CommentFilter extends FilterParams {
  status?: string;
  room_class?: string;
}
