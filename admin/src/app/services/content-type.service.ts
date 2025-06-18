// services/content-type.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentType, ContentTypeResponse } from '../models/content-type';



@Injectable({
  providedIn: 'root',
})
export class ContentTypeService {
  private apiUrl = 'http://127.0.0.1:8000/v1/content-type';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ContentTypeResponse> {
    return this.http.get<ContentTypeResponse>(this.apiUrl);
  }


  create(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  update(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
