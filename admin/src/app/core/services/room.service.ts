import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../../types/room';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly baseUrl = `${environment.apiUrl}/room`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  // Lấy tất cả phòng (không lọc)
  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}`);
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

    return this.http.get<any>(`${this.baseUrl}`, { params: httpParams });
  }

  getBookingCalendar(roomId: string, year: number, month: number) {
    return this.http.get<any>(`${this.baseUrl}/booking-calendar`, {
      params: { room_id: roomId, year, month },
    });
  }

  // Thêm phòng
  addRoom(roomData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, roomData);
  }

  // Cập nhật phòng
  updateRoom(id: string, roomData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, roomData);
  }
}
