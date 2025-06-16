import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const jsonData = localStorage.getItem('login');
    // Nếu chưa đăng nhập
    if (!jsonData) {
      alert('Vui lòng đăng nhập trước');
      return this.router.parseUrl('/login');
    }
 const user = JSON.parse(jsonData);
const isAdminRoute = route.data['adminOnly'] === true;
// Kiểm tra role thay vì admin
if (isAdminRoute && user.data?.role !== 'admin') {
  alert('Bạn không có quyền truy cập trang này');
  return this.router.parseUrl('/unauthorized');
}
    return true;
  }
}
