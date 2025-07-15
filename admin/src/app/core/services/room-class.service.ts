import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RoomClassDetailResponse,
  RoomClassRequest,
  RoomClassResponse,
  RoomClassFilter,
} from '../../types/room-class';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class RoomClassService {
  private readonly baseUrl = `${environment.apiUrl}/room-class`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  // Lấy danh sách tất cả các loại phòng
  getAllRoomClass({
    search = '',
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    status = '',
    feature = '',
    type = '',
    minBed = 0,
    maxBed = 100,
    minCapacity = 0,
    maxCapacity = 100,
  }: RoomClassFilter): Observable<RoomClassResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order)
      .set('status', status)
      .set('feature', feature)
      .set('type', type)
      .set('minBed', minBed.toString())
      .set('maxBed', maxBed.toString())
      .set('minCapacity', minCapacity.toString())
      .set('maxCapacity', maxCapacity.toString());
    return this.http.get<RoomClassResponse>(`${this.baseUrl}`, { params });
  }

  // Lấy loại phòng theo ID
  getRoomClassById(id: string): Observable<RoomClassDetailResponse> {
    return this.http.get<RoomClassDetailResponse>(`${this.baseUrl}/${id}`);
  }

  // Thêm một loại phòng mới
  addRoomClass(
    data: FormData | RoomClassRequest
  ): Observable<RoomClassDetailResponse> {
    return this.http.post<RoomClassDetailResponse>(`${this.baseUrl}`, data);
  }

  // Cập nhật trạng thái loại phòng
  toggleRoomClassStatus(id: string): Observable<RoomClassDetailResponse> {
    return this.http.put<RoomClassDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {
        status: true,
      }
    );
  }

  // sửa phòng
  updateRoomClass(
    id: string,
    data: FormData | RoomClassRequest
  ): Observable<RoomClassDetailResponse> {
    return this.http.put<RoomClassDetailResponse>(
      `${this.baseUrl}/${id}`,
      data
    );
  }
}
