import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const jsonData = localStorage.getItem('login');

    if (jsonData) {
      const user = JSON.parse(jsonData);
      const isAdminRoute = route.data['adminOnly'] === true;

      // Nếu route yêu cầu admin mà user không phải admin
      if (isAdminRoute && !user.admin) {
        this.router.navigate(['/unauthorized']);
        return false;
      }

      // Cho phép truy cập
      return true;
    }

    // Nếu chưa đăng nhập thì chuyển hướng
    this.router.navigate(['/login']);
    return false;
  }
}
