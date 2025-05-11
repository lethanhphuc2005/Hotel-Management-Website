import { Room } from './../models/room';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  url = `http://127.0.0.1:8000/v1`
constructor(private httpClient: HttpClient) { }
getAllRooms(): Observable<Room[]> {
  return this.httpClient.get<Room[]>(`${this.url}/room`);
}

  }
