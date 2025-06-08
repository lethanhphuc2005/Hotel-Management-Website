import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainRoomClass } from '../models/main-room-class';

@Injectable({
  providedIn: 'root'
})
export class MainRoomClassService {
  private url = 'http://127.0.0.1:8000/v1';

  constructor(private httpClient: HttpClient) { }

  getAllMainRoomClasses(): Observable<{ message: string, data: MainRoomClass[] }> {
    return this.httpClient.get<{ message: string, data: MainRoomClass[] }>(
      `${this.url}/main-room-class`
    );
  }
  getMainRoomClassById(id: string): Observable<{ message: string, data: MainRoomClass }> {
    return this.httpClient.get<{ message: string, data: MainRoomClass }>(
      `${this.url}/main-room-class/${id}`
    );
  }
  addMainRoomClass(data: any): Observable<any> {
    return this.httpClient.post(
      `${this.url}/main-room-class`,
      data
    );
  }
  toggleMainRoomClassStatus(id: string, body: { status: boolean }): Observable<any> {
    return this.httpClient.put(`${this.url}/main-room-class/toggle/${id}`, body);
  }
  // sửa
  updateMainRoomClass(id: string, data: any): Observable<any> {
    return this.httpClient.put(`${this.url}/main-room-class/${id}`, data);
  }
  uploadImage(mainRoomClassId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.httpClient.post(
      `${this.url}/main-room-class/${mainRoomClassId}/image`,
      formData
    );
  }

}
