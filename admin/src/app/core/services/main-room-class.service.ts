import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MainRoomClassRequest,
  MainRoomClassDetailResponse,
  MainRoomClassResponse,
} from '../../types/main-room-class';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class MainRoomClassService {
  private readonly baseUrl = `${environment.apiUrl}/main-room-class`; // Lấy URL từ file cấu hình môi trường

  constructor(private httpClient: HttpClient) {}

  getAllMainRoomClasses(): Observable<MainRoomClassResponse> {
    return this.httpClient.get<MainRoomClassResponse>(`${this.baseUrl}`);
  }

  getMainRoomClassById(id: string): Observable<MainRoomClassDetailResponse> {
    return this.httpClient.get<MainRoomClassDetailResponse>(
      `${this.baseUrl}/${id}`
    );
  }

  addMainRoomClass(
    data: FormData | MainRoomClassRequest
  ): Observable<MainRoomClassDetailResponse> {
    return this.httpClient.post<MainRoomClassDetailResponse>(
      `${this.baseUrl}`,
      data
    );
  }

  toggleMainRoomClassStatus(
    id: string
  ): Observable<MainRoomClassDetailResponse> {
    return this.httpClient.put<MainRoomClassDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {
        status: true,
      }
    );
  }
  // sửa
  updateMainRoomClass(
    id: string,
    data: FormData | MainRoomClassRequest
  ): Observable<MainRoomClassDetailResponse> {
    return this.httpClient.put<MainRoomClassDetailResponse>(
      `${this.baseUrl}/${id}`,
      data
    );
  }
}
