import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '@/core/services/employee.service';
import { AuthService } from '@/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  userName: string = 'Người dùng';
  email: string = '';
  isLoggedIn: boolean = false;
  constructor(
    private router: Router,
    private toastService: ToastrService,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEmployeeData();
    this.isLoggedIn = !!localStorage.getItem('accessToken');
  }

  loadEmployeeData(): void {
    const accessTokenStr = localStorage.getItem('accessToken');
    if (!accessTokenStr) {
      this.toastService.error('Bạn cần đăng nhập để truy cập trang này.');
      location.assign('/login');
      return;
    }
    this.employeeService.getCurrentEmployee().subscribe({
      next: (response) => {
        const employee = response.data;
        this.userName = `${employee.last_name} ${employee.first_name}`;
        this.email = employee.email;
      },
      error: () => {
        this.toastService.error('Không thể tải dữ liệu người dùng!');
      },
    });
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      localStorage.removeItem('accessToken');
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
      this.toastService.success('Đăng xuất thành công!');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      this.toastService.error('Đăng xuất không thành công. Vui lòng thử lại.');
    }
  }
}
