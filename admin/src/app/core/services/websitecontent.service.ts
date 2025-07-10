// src/app/services/content.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IContent } from '../../types/websitecontent';

@Injectable({
  providedIn: 'root'
})
export class WebsiteContentService {
  private apiUrl = 'http://localhost:8000/v1/website-content';

  constructor(private http: HttpClient) { }

  getAllContents(): Observable<IContent[]> {
    return this.http.get<{ data: IContent[] }>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  getContentById(id: string): Observable<IContent> {
    return this.http.get<IContent>(`${this.apiUrl}/${id}`);
  }

  updateContent(id: string, formData: FormData): Observable<IContent> {
    return this.http.put<IContent>(`${this.apiUrl}/${id}`, formData);
  }

  onDelete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  createContent(formData: FormData) {
    return this.http.post<IContent>(this.apiUrl, formData);
  }


}
