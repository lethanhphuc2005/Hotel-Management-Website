import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  RoomBookingCalendarResponse,
  RoomDetailResponse,
  RoomFilter,
  RoomRequest,
  RoomResponse,
} from '../../types/room';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly baseUrl = `${environment.apiUrl}/room`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  // Lấy tất cả phòng (không lọc)
  getAllRooms({
    search = '',
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    type = '',
    status = '',
    check_in_date,
    check_out_date,
  }: RoomFilter): Observable<RoomResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order)
      .set('check_in_date', check_in_date || '')
      .set('check_out_date', check_out_date || '')
      .set('type', type)
      .set('status', status);

    return this.http.get<RoomResponse>(`${this.baseUrl}`, { params });
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
