import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainRoomClass } from '../models/main-room-class';

@Injectable({
  providedIn: 'root'
})
export class MainRoomClassService {
  private url = 'http://127.0.0.1:8000/v1';

  constructor(private httpClient: HttpClient) {}

  getAllMainRoomClasses(): Observable<{ message: string, roomTypeMains: MainRoomClass[] }> {
    return this.httpClient.get<{ message: string, roomTypeMains: MainRoomClass[] }>(
      `${this.url}/main-room-class`
    );
  }
}
