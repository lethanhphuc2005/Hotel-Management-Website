import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  ngOnInit() {}
  constructor(private router: Router, private ToastService: ToastService) {}

  logout() {
    localStorage.removeItem('login');
    this.ToastService.show('Thành công', 'Đăng xuất thành công', 'success');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
