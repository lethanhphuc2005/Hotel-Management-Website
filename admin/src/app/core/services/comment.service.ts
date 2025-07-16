import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  CommentDetailResponse,
  CommentFilter,
  CommentRequest,
  CommentResponse,
} from '@/types/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly baseUrl = `${environment.apiUrl}/comment`;

  constructor(private http: HttpClient) {}

  // Lấy toàn bộ bình luận (bao gồm replies)
  getAllComments({
    search = '',
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    status,
    room_class,
  }: CommentFilter): Observable<CommentResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);
    if (status) {
      params = params.set('status', status);
    }
    if (room_class) {
      params = params.set('room_class', room_class);
    }
    return this.http.get<CommentResponse>(this.baseUrl, { params });
  }

  // Lấy bình luận theo ID
  getCommentById(id: string): Observable<CommentDetailResponse> {
    return this.http.get<CommentDetailResponse>(`${this.baseUrl}/${id}`);
  }

  // Thêm bình luận mới
  createComment(
    data: FormData | CommentRequest
  ): Observable<CommentDetailResponse> {
    return this.http.post<CommentDetailResponse>(this.baseUrl, data);
  }

  // Cập nhật trạng thái bình luận
  toggleCommentStatus(id: string): Observable<CommentDetailResponse> {
    return this.http.put<CommentDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {}
    );
  }

  // Cập nhật bình luận
  updateComment(
    id: string,
    data: FormData | CommentRequest
  ): Observable<CommentDetailResponse> {
    return this.http.put<CommentDetailResponse>(`${this.baseUrl}/${id}`, data);
  }

  // Xóa bình luận
  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
