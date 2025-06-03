// src/app/services/content.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IContent } from '../models/websitecontent';


@Injectable({
  providedIn: 'root'
})
export class WebsiteContentService {
  private apiUrl = 'http://localhost:8000/v1/website-content';

  constructor(private http: HttpClient) {}

  getAllContents(): Observable<IContent[]> {
    return this.http.get<IContent[]>(this.apiUrl);
  }

  getContentById(id: string): Observable<IContent> {
    return this.http.get<IContent>(`${this.apiUrl}/${id}`);
  }

  createContent(content: IContent): Observable<IContent> {
    return this.http.post<IContent>(this.apiUrl, content);
  }

  updateContent(id: string, content: IContent): Observable<IContent> {
    return this.http.put<IContent>(`${this.apiUrl}/${id}`, content);
  }

  deleteContent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
