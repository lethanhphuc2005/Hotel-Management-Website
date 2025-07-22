import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường
import {
  ServiceDetailResponse,
  ServiceFilter,
  ServiceRequest,
  ServiceResponse,
} from '@/types/service';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private readonly baseUrl = `${environment.apiUrl}/service`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllServices({
    search = '',
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    status,
  }: ServiceFilter): Observable<ServiceResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);
    if (status) params = params.set('status', status);
    return this.http.get<ServiceResponse>(this.baseUrl, { params });
  }

  getServiceById(id: string): Observable<ServiceDetailResponse> {
    return this.http.get<ServiceDetailResponse>(`${this.baseUrl}/${id}`);
  }

  createService(
    data: FormData | ServiceRequest
  ): Observable<ServiceDetailResponse> {
    return this.http.post<ServiceDetailResponse>(this.baseUrl, data);
  }

  updateService(
    id: string,
    data: FormData | ServiceRequest
  ): Observable<ServiceDetailResponse> {
    return this.http.patch<ServiceDetailResponse>(`${this.baseUrl}/${id}`, data);
  }

  toggleServiceStatus(id: string): Observable<ServiceDetailResponse> {
    return this.http.patch<ServiceDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {}
    );
  }
}
