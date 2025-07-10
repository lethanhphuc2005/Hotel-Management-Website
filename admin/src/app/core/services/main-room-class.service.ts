import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainRoomClass } from '../../types/main-room-class';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root'
})
export class MainRoomClassService {
  private readonly baseUrl = `${environment.apiUrl}/main-room-class`; // Lấy URL từ file cấu hình môi trường

  constructor(private httpClient: HttpClient) { }


getAllMainRoomClasses(
  search: string = '',
  status?: boolean,
  sort: string = 'createdAt',
  order: 'asc' | 'desc' = 'asc'
): Observable<{ message: string, data: MainRoomClass[] }> {
  const params: any = { search, sort, order };
  if (status !== undefined) {
    params.status = status.toString();
  }

  return this.httpClient.get<{ message: string, data: MainRoomClass[] }>(
    `${this.baseUrl}`,
    { params }
  );
}

  getMainRoomClassById(id: string): Observable<{ message: string, data: MainRoomClass }> {
    return this.httpClient.get<{ message: string, data: MainRoomClass }>(
      `${this.baseUrl}/${id}`
    );
  }
  addMainRoomClass(data: any): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}`,
      data
    );
  }
  toggleMainRoomClassStatus(id: string, body: { status: boolean }): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/toggle/${id}`, body);
  }
  // sửa
  updateMainRoomClass(id: string, data: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, data);
  }
  uploadImage(mainRoomClassId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.httpClient.post(
      `${this.baseUrl}/${mainRoomClassId}/image`,
      formData
    );
  }

}
