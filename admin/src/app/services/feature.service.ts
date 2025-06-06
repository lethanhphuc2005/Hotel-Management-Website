import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  private url = 'http://127.0.0.1:8000/v1';

  constructor(private http: HttpClient) {}

  getAllFeatures(): Observable<{ message: string, data: any[] }> {
    return this.http.get<{ message: string, data: any[] }>(`${this.url}/feature`);
  }
}

