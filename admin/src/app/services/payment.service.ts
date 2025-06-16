import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://127.0.0.1:8000/v1/payment';

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
