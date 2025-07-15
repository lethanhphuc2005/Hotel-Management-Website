import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly baseUrl = `${environment.apiUrl}/comment`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  // Lấy toàn bộ bình luận (bao gồm replies)
  getAllComments(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // Xóa bình luận theo id
  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Cập nhật nội dung bình luận
  updateComment(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, data);
  }

  // Thêm mới bình luận
  addComment(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Lấy 1 bình luận cụ thể (nếu cần)
  getCommentById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  toggleStatus(id: string) {
  return this.http.put(`${this.baseUrl}/toggle/${id}`, {});
  }

}
