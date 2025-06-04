import { Injectable } from '@angular/core';
import {HttpEvent,HttpHandler,HttpInterceptor,HttpRequest,HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isProtectedAPI = req.url.includes('/v1/');

    if (!isProtectedAPI) {
      return next.handle(req);
    }

    const loginDataStr = localStorage.getItem('login');
    console.log(loginDataStr)

    if (!loginDataStr) {
      location.assign('/login');
      return EMPTY;
    }

    const loginData = JSON.parse(loginDataStr);
    const accessToken = loginData?.data?.accessToken;
    const refreshToken = loginData?.data?.refreshToken;
    console.log(accessToken)
    let clonedReq = req;
    if (accessToken) {
      clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(clonedReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 403 && refreshToken) {
          // Refresh token flow
          return this.http.post('http://127.0.0.1:8000/v1/account/refresh', { refreshToken }).pipe(
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
              console.log(newAccessToken)
              return next.handle(retryReq);
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
  }
}
