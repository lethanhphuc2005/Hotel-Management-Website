import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly API_URL = 'http://127.0.0.1:8000/v1/comment';

  constructor(private http: HttpClient) {}

  // Lấy toàn bộ bình luận (bao gồm replies)
  getAllComments(): Observable<any> {
    return this.http.get(this.API_URL);
  }

  // Xóa bình luận theo id
  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  // Cập nhật nội dung bình luận
  updateComment(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}`, data);
  }

  // Thêm mới bình luận
  addComment(data: any): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  // Lấy 1 bình luận cụ thể (nếu cần)
  getCommentById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  toggleStatus(id: string) {
  return this.http.put(`${this.API_URL}/toggle/${id}`, {});
  }

}
