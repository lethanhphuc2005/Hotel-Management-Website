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

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const isAuthApi =
    req.url.includes('/auth/login') || req.url.includes('/auth/register');
  const isProtectedAPI = req.url.includes('/v1/') && !isAuthApi;

  const http = inject(HttpClient);

  let loginData: any = null;

  try {
    const loginDataStr = localStorage.getItem('login');
    if (loginDataStr) {
      loginData = JSON.parse(loginDataStr);
    }
  } catch (error) {
    console.error('Lỗi parse localStorage:', error);
    // localStorage.removeItem('login');
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
          .post('http://127.0.0.1:8000/v1/account/refresh', {
            refreshToken,
          })
          .pipe(
            switchMap((res: any) => {
              const newAccessToken = res.accessToken;
              const newRefreshToken = res.refreshToken;

              const updatedLoginData = {
                ...loginData,
                data: {
                  ...loginData.data,
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken,
                },
              };

              localStorage.setItem('login', JSON.stringify(updatedLoginData));
              console.log('Lưu localStorage thành công');
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
