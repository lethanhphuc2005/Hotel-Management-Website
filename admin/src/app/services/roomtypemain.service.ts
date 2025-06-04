// src/app/services/roomtype.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { RoomTypeMain } from '../models/roomtypemain';
import { HttpHeaders } from '@angular/common/http';
import { AuthHeaderService } from './utils/header';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeMainService {
  private url = `http://127.0.0.1:8000/v1`;

  constructor(
    private httpClient: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}


  getAllRoomTypeMains(): Observable<{ message: string, roomTypeMains: RoomTypeMain[] }> {
    const headers = this.authHeaderService.getAuthHeadersOrEmpty();

    if (!headers) {
      return EMPTY;
    }

    return this.httpClient.get<{ message: string, roomTypeMains: RoomTypeMain[] }>(
      `${this.url}/room-type-main`,
      { headers }
    );
  }


}
