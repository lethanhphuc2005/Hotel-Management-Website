import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Status } from '../../types/status';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private readonly baseUrl = `${environment.apiUrl}/room-status`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllStatus(): Observable<Status[]> {
    return this.http.get<Status[]>(this.baseUrl);
  }

}
