import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideToastr({
      positionClass: 'toast-top-right', // Vị trí hiển thị toast
      timeOut: 3000, // Thời gian tự động đóng (ms)
      extendedTimeOut: 1000, // Thời gian chờ sau khi hover
      closeButton: true, // Hiện nút đóng (x)
      progressBar: true, // Hiện thanh tiến trình
      progressAnimation: 'decreasing', // Hiệu ứng thanh tiến trình
      easeTime: 300, // Thời gian hiệu ứng hiển thị
      tapToDismiss: true, // Cho phép click vào để tắt
      preventDuplicates: true, // Không hiển thị trùng nội dung
      maxOpened: 5, // Số toast tối đa cùng lúc
      autoDismiss: true, // Tự động đóng toast cũ nếu vượt max
      newestOnTop: true, // Toast mới sẽ hiển thị trên cùng
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning',
      },
    }),

    provideAnimations(), // ✅ thêm dòng này để fix lỗi animation
  ],
};
