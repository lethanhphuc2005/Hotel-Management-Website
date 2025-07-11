import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RoomClassDetailResponse,
  RoomClassRequest,
  RoomClassResponse,
} from '../../types/room-class';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class RoomClassService {
  private readonly baseUrl = `${environment.apiUrl}/room-class`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  // Lấy danh sách tất cả các loại phòng
  getAllRoomClass(): Observable<RoomClassResponse> {
    return this.http.get<RoomClassResponse>(`${this.baseUrl}`);
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
