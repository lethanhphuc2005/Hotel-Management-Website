import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomClass } from '../../types/main-room-class';

@Injectable({
  providedIn: 'root'
})
export class RoomClassService {
  private apiUrl = 'http://127.0.0.1:8000/v1';
  httpClient: any;
  url: any;

  constructor(private http: HttpClient) { }

  // Lấy danh sách tất cả các loại phòng
  getAllRoomClass(): Observable<{ message: string, data: RoomClass[] }> {
    return this.http.get<{ message: string, data: RoomClass[] }>(
      `${this.apiUrl}/room-class?limit=1000`
    );
  }

  // Thêm một loại phòng mới
  addRoomClass(roomClassData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/room-class`, roomClassData);
  }

  // Lấy loại phòng theo ID
  getRoomClassById(id: string): Observable<{ message: string, data: RoomClass }> {
    return this.http.get<{ message: string, data: RoomClass }>(
      `${this.apiUrl}/room-class/${id}`
    );
  }

  // Cập nhật trạng thái loại phòng
  updateRoomClass(id: string, body: { status: boolean }): Observable<any> {
    return this.http.put(`${this.apiUrl}/room-class/toggle/${id}`, body);
  }
  // sửa phòng
  updateFullRoomClass(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/room-class/${id}`, data);
  }

}
