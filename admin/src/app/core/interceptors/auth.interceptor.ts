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
  const isAuthApi =
    req.url.includes('/auth/login') || req.url.includes('/auth/register');
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

  const accessToken = loginData?.data?.accessToken;
  const refreshToken = loginData?.data?.refreshToken;
  if (isProtectedAPI && !accessToken) {
    location.assign('/login');
    return EMPTY;
  }
  // 👉 Clone request và thêm token nếu có
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
      // 👉 Nếu token hết hạn, thử refresh
      if (err.status === 403 && isProtectedAPI && refreshToken) {
        return http
          .post(`${baseUrl}/account/refresh`, {
            refreshToken,
          })
          .pipe(
            switchMap((res: any) => {
              const newAccessToken = res.data.accessToken;
              const newRefreshToken = res.data.refreshToken;

              const updatedLoginData = {
                ...loginData.data,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              };
              localStorage.setItem('login', JSON.stringify(updatedLoginData));
              // 👉 Gửi lại request với token mới
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });

              return next(retryReq);
            }),
            catchError(() => {
              // 👉 Refresh thất bại => Xoá login và chuyển về login
              // localStorage.removeItem('login');
              location.assign('/login');
              return EMPTY;
            })
          );
      }

      return throwError(() => err);
    })
  );
};
