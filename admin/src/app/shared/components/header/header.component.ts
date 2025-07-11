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
  ngOnInit() {}
  constructor(private router: Router, private toastService: ToastrService) {}

  logout() {
    localStorage.removeItem('login');
    this.toastService.success('Đăng xuất thành công', 'Thông báo');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
