import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Status } from '../../types/status';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private apiUrl = 'http://localhost:8000/v1/room-status';

  constructor(private http: HttpClient) {}

  getAllStatus(): Observable<Status[]> {
    return this.http.get<Status[]>(this.apiUrl);
  }

}
