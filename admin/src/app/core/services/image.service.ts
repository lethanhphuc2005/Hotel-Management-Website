import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly baseUrl = `${environment.apiUrl}/image`; // Lấy URL từ file cấu hình môi trường

  constructor(private httpClient: HttpClient) {}

  uploadImage(mainRoomClassId: string, imageUrl: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/main-room-class/${mainRoomClassId}/image`, {
      url: imageUrl,
      target: 'main_room_class',
      status: true
    });
  }

  getImagesByRoomId(id: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/image?room_class_id=${id}&target=main_room_class`);
  }
}


