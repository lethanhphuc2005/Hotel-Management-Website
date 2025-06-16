// services/room-status.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomStatusService {
  private apiUrl = 'http://127.0.0.1:8000/v1/room-status';

  constructor(private http: HttpClient) {}

  getAllRoomStatuses(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


}
