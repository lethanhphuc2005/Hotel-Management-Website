import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterModule, HttpClientModule],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private toastService: ToastService) {}

  ngOnInit() {
    // this.toastService.show('Thành công', 'Tải dữ liệu hoàn tất', 'success');
    // this.toastService.show('Lỗi', 'Không thể kết nối đến máy chủ', 'error');
  }
}
