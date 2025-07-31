import { PaginationResponse } from "./_common";
import { Employee } from "./employee";
import { RoomClass } from "./roomClass";
import { User } from "./user";

export interface Comment {
  id: string;
  room_class_id: string;
  parent_id: string | null;
  employee_id: string | null;
  user_id: string | null;
  content: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  employee: Employee | null;
  user: User | null;
  room_class: RoomClass; // Room class can be null if the comment is not related to a room class
}

export interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[];
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

export interface CommentListResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: CommentWithReplies[];
  pagination?: PaginationResponse;
}

export interface CreateCommentRequest {
  roomClassId: string;
  parentId: string | null;
  userId: string | null;
  content: string;
}

export interface DeleteCommentRequest {
  commentId: string;
  userId: string;
}

export interface UpdateCommentRequest extends DeleteCommentRequest {
  content: string;
}
