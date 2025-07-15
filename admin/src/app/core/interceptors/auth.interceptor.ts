import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const baseUrl = environment.apiUrl;

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
  ];
  const isAuthApi = publicRoutes.some((path) => req.url.includes(path));
  const isProtectedAPI = req.url.includes('/api/') && !isAuthApi;

  const http = inject(HttpClient);

  let loginData: any = null;

  try {
    const loginDataStr = localStorage.getItem('login');
    if (loginDataStr) {
      loginData = JSON.parse(loginDataStr);
    }
  } catch (error) {
    console.error('Lỗi parse localStorage:', error);
    localStorage.removeItem('login');
  }

  const accessToken = loginData?.accessToken;
  const refreshToken = loginData?.refreshToken;

  if (isProtectedAPI && !accessToken) {
    location.assign('/login');
    return EMPTY;
  }

  let clonedReq = req;
  if (isProtectedAPI && accessToken) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(clonedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 403 && isProtectedAPI && refreshToken) {
        return http.post(`${baseUrl}/account/refresh`, { refreshToken }).pipe(
          switchMap((res: any) => {
            const newAccessToken = res.data.accessToken;
            const newRefreshToken = res.data.refreshToken;

            const updatedLoginData = {
              ...loginData, // ⚠️ giữ nguyên user / các trường khác
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            };
            localStorage.setItem('login', JSON.stringify(updatedLoginData));

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });

            return next(retryReq);
          }),
          catchError((refreshErr) => {
            localStorage.removeItem('login');
            location.assign('/login');
            return EMPTY;
          })
        );
      }

      return throwError(() => err);
    })
  );
};
