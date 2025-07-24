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
import { ToastrService } from 'ngx-toastr';
import { environment } from '@env/environment';

const baseUrl = environment.apiUrl;

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const publicRoutes = ['/auth/login'];
  const toastr = inject(ToastrService); // 👈 inject toastr ở đây

  const isAuthApi = publicRoutes.some((path) => req.url.includes(path));
  const isProtectedAPI = req.url.includes('/api/') && !isAuthApi;

  const http = inject(HttpClient);

  let accessToken: string | null = null;

  try {
    const accessTokenStr = localStorage.getItem('accessToken');
    if (accessTokenStr) {
      accessToken = JSON.parse(accessTokenStr);
    }
  } catch (error) {
    console.error('Lỗi parse localStorage:', error);
    localStorage.removeItem('accessToken');
  }

  if (isProtectedAPI && !accessToken) {
    location.assign('/login');
    return EMPTY;
  }

  let clonedReq = req;
  if (isProtectedAPI && accessToken) {
    clonedReq = req.clone({
      setHeaders: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    });
  }

  return next(clonedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (
        err.status === 403 &&
        isProtectedAPI &&
        err.error === 'Token đã hết hạn.'
      ) {
        return http
          .post(`${baseUrl}/auth/refresh-token`, {
            withCredentials: true, // Để gửi cookie
          })
          .pipe(
            switchMap((res: any) => {
              const newAccessToken = res.data.accessToken;

              localStorage.setItem(
                'accessToken',
                JSON.stringify(newAccessToken)
              );

              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });

              return next(retryReq);
            }),
            catchError((refreshErr) => {
              toastr.error(
                'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.',
                'Lỗi ủy quyền'
              );
              localStorage.removeItem('accessToken');
              location.assign('/login');
              return EMPTY;
            })
          );
      }

      if (err.status === 403 && isProtectedAPI) {
        toastr.error(
          'Bạn không có quyền truy cập vào tài nguyên này.',
          'Lỗi ủy quyền'
        );

        return EMPTY;
      }

      return throwError(() => err);
    })
  );
};
