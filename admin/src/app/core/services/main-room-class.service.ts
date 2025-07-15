import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MainRoomClassRequest,
  MainRoomClassDetailResponse,
  MainRoomClassResponse,
  MainRoomClassFilter,
} from '../../types/main-room-class';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class MainRoomClassService {
  private readonly baseUrl = `${environment.apiUrl}/main-room-class`; // Lấy URL từ file cấu hình môi trường

  constructor(private httpClient: HttpClient) {}

  getAllMainRoomClasses({
    search = '',
    status = '',
    sort = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 10,
  }: MainRoomClassFilter): Observable<MainRoomClassResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);
    if (status) {
      params = params.set('status', status);
    }

    return this.httpClient.get<MainRoomClassResponse>(`${this.baseUrl}`, { params });
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
