import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private url = 'http://127.0.0.1:8000/v1';

  constructor(private httpClient: HttpClient) {}

  uploadImage(mainRoomClassId: string, imageUrl: string): Observable<any> {
    return this.httpClient.post(`${this.url}/main-room-class/${mainRoomClassId}/image`, {
      url: imageUrl,
      target: 'main_room_class',
      status: true
    });
  }

  getImagesByRoomId(id: string): Observable<any> {
    return this.httpClient.get(`${this.url}/image?room_class_id=${id}&target=main_room_class`);
  }
}


