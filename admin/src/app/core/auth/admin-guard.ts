import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private toastr = inject(ToastrService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const loginData = localStorage.getItem('login');

    if (!loginData) {
      this.toastr.error('Bạn cần đăng nhập để truy cập trang này');
      return this.router.parseUrl('/login');
    }

    const user = JSON.parse(loginData);
    const isAdminRoute = route.data['adminOnly'] === true;
    console.log('Kiểm tra quyền truy cập:', {
      isAdminRoute,
      userRole: user.data?.role,
    });
    if (isAdminRoute && user.data?.role !== 'admin') {
      this.toastr.error('Bạn không có quyền truy cập vào trang này');
      return this.router.parseUrl('/home');
    }

    return true;
  }
}
