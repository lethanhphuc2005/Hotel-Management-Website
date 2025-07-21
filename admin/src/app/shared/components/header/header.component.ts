import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  constructor(private router: Router, private toastService: ToastrService) {}

 ngOnInit(): void {
    const loginDataString = localStorage.getItem('login');
    if (loginDataString) {
      const loginData = JSON.parse(loginDataString);
      this.isLoggedIn = true;
      this.userName = `${loginData.last_name} ${loginData.first_name}`;
    } else {
      this.isLoggedIn = false;
    }
  }
  logout() {
    localStorage.removeItem('login');
    this.toastService.success('Đăng xuất thành công', 'Thông báo');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

}
