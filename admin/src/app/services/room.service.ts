import { Room } from './../models/room';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://127.0.0.1:8000/v1';

  constructor(private http: HttpClient) { }

  // Lấy tất cả phòng
  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/room`);
  }

  // Thêm phòng
  addRoom(roomData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/room`, roomData);
  }

  // Cập nhật trạng thái phòng
  // updateRoomStatus(id: string, body: { status: boolean }): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/room/toggle/${id}`, body);
  // }

}
