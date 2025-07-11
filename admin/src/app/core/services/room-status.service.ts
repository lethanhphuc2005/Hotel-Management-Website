// services/room-status.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class RoomStatusService {
  private readonly baseUrl = `${environment.apiUrl}/room-status`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllRoomStatuses(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
}
