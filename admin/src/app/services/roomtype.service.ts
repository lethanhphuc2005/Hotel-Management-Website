// src/app/services/roomtype.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomType } from '../models/roomtype';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {
  url = `http://127.0.0.1:8000/v1`;

  constructor(private httpClient: HttpClient) {}

  getAllRoomTypes(): Observable<RoomType[]> {
    return this.httpClient.get<RoomType[]>(`${this.url}/room-type`);
  }
}
