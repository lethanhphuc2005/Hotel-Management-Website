// auth.interceptor.ts
import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const isProtectedAPI = req.url.includes('/v1/');
  const http = inject(HttpClient);

  if (!isProtectedAPI) {
    return next(req);
  }

  const loginDataStr = localStorage.getItem('login');
  if (!loginDataStr) {
    location.assign('/login');
    return EMPTY;
  }

  const loginData = JSON.parse(loginDataStr);
  const accessToken = loginData?.data?.accessToken;
  const refreshToken = loginData?.data?.refreshToken;

  let clonedReq = req;
  if (accessToken) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 403 && refreshToken) {
        return http.post('http://127.0.0.1:8000/v1/account/refresh', { refreshToken }).pipe(
          switchMap((res: any) => {
            const newAccessToken = res.accessToken;
            const newRefreshToken = res.refreshToken;

            const updatedLoginData = {
              ...loginData,
              data: {
                ...loginData.data,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
              }
            };

            localStorage.setItem('login', JSON.stringify(updatedLoginData));

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`
              }
            });

            return next(retryReq);
          }),
          catchError(() => {
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
