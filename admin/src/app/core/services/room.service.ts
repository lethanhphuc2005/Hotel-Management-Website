import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Room,
  RoomBookingCalendarResponse,
  RoomDetailResponse,
  RoomFilterParams,
  RoomRequest,
  RoomResponse,
} from '../../types/room';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly baseUrl = `${environment.apiUrl}/room`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  // Lấy tất cả phòng (không lọc)
  getAllRooms(): Observable<RoomResponse> {
    return this.http.get<RoomResponse>(`${this.baseUrl}`);
  }

  // Lọc phòng (trống, trạng thái, loại phòng, tìm kiếm, phân trang...)
  getRooms(params: RoomFilterParams): Observable<RoomResponse> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<RoomResponse>(`${this.baseUrl}`, {
      params: httpParams,
    });
  }

  getBookingCalendar(
    roomId: string,
    year: number,
    month: number
  ): Observable<RoomBookingCalendarResponse> {
    return this.http.get<RoomBookingCalendarResponse>(
      `${this.baseUrl}/booking-calendar`,
      {
        params: { room_id: roomId, year, month },
      }
    );
  }

  // Thêm phòng
  addRoom(roomData: FormData | RoomRequest): Observable<RoomDetailResponse> {
    return this.http.post<RoomDetailResponse>(`${this.baseUrl}`, roomData);
  }

  // Cập nhật phòng
  updateRoom(
    id: string,
    roomData: FormData | RoomRequest
  ): Observable<RoomDetailResponse> {
    return this.http.put<RoomDetailResponse>(`${this.baseUrl}/${id}`, roomData);
  }
}
