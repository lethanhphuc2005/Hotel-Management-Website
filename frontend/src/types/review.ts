import { PaginationResponse } from "./_common";
import { Booking } from "./booking";
import { Employee } from "./employee";
import { RoomClass } from "./roomClass";
import { User } from "./user";

export interface Review {
  id: string;
  booking_id: string;
  room_class_id: string;
  parent_id: string | null;
  employee_id: string | null;
  user_id: string | null;
  rating: number | null;
  content: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  employee: Employee | null; // Employee can be null if the review is not related to an employee
  user: User | null; // User can be null if the review is anonymous
  booking: Booking;
  room_class: RoomClass;
}

export interface ReviewWithReplies extends Review {
  replies?: Review[];
}

export interface ReviewResponse {
  success: boolean;
  message?: string;
  data: Review; // Can be a single review, a review with replies, or an array of reviews
}

export interface ReviewListResponse {
  success: boolean;
  message: string;
  data: ReviewWithReplies[];
  pagination?: PaginationResponse;
}

export interface CreateReviewRequest {
  bookingId: string;
  roomClassId: string;
  parentId: string | null;
  userId: string;
  rating: number | null;
  content: string;
}

export interface UpdateReviewRequest {
  reviewId: string;
  userId: string;
  rating: number | null;
  content: string;
}

export interface DeleteReviewRequest {
  reviewId: string;
  userId: string;
}
