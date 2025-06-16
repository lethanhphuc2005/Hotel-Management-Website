import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../models/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://127.0.0.1:8000/v1';

  constructor(private http: HttpClient) {}

  // Lấy tất cả phòng (không lọc)
  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/room`);
  }

  // Lọc phòng (trống, trạng thái, loại phòng, tìm kiếm, phân trang...)
  getRooms(params: {
    check_in_date?: string;
    check_out_date?: string;
    room_status_id?: string;
    room_class_id?: string;
    keyword?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Observable<any> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.apiUrl}/room`, { params: httpParams });
  }

  // Thêm phòng
  addRoom(roomData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/room`, roomData);
  }

  // Cập nhật phòng
  updateRoom(id: string, roomData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/room/${id}`, roomData);
  }
}
