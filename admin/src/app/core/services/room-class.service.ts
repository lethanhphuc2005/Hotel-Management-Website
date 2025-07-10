import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomClass } from '../../types/main-room-class';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root'
})
export class RoomClassService {
  private readonly baseUrl = `${environment.apiUrl}/room-class`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) { }

  // Lấy danh sách tất cả các loại phòng
  getAllRoomClass(): Observable<{ message: string, data: RoomClass[] }> {
    return this.http.get<{ message: string, data: RoomClass[] }>(
      `${this.baseUrl}`
    );
  }

  // Thêm một loại phòng mới
  addRoomClass(roomClassData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, roomClassData);
  }

  // Lấy loại phòng theo ID
  getRoomClassById(id: string): Observable<{ message: string, data: RoomClass }> {
    return this.http.get<{ message: string, data: RoomClass }>(
      `${this.baseUrl}/${id}`
    );
  }

  // Cập nhật trạng thái loại phòng
  updateRoomClass(id: string, body: { status: boolean }): Observable<any> {
    return this.http.put(`${this.baseUrl}/toggle/${id}`, body);
  }
  // sửa phòng
  updateFullRoomClass(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

}
