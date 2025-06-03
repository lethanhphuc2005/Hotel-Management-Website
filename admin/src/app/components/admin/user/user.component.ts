import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [RouterModule, CommonModule, HttpClientModule]
})
export class UserComponent implements OnInit, OnDestroy {
  users: User[] = [];
  editingUser: User | null = null;

  private subscription?: Subscription;
i: any;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getAllUser();
  }

  getAllUser() {
    this.subscription = this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.map((item: any) => ({
          id: item._id,                 // ánh xạ _id → id
          TenKH: item.TenKH,
          Email: item.Email,
          SoDT: item.SoDT,
          DiaChi: item.DiaChi,
          YeuCau_DB: item.YeuCau_DB,
          isActive: item.TrangThai      // ánh xạ TrangThai → isActive
        }));
      },
      error: (err) => {
        console.error('Lấy dữ liệu user lỗi:', err);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  toggleUserStatus(user: User) {
    // Lấy user chi tiết theo id trước
    this.userService.getUserById(user.id).subscribe({
      next: (userDetail) => {
        // Tạo bản sao user và đổi trạng thái
        const updatedUser = { ...userDetail, isActive: !userDetail['TrangThai'] };

        // Gọi update trạng thái
        this.userService.updateUserStatus({
          ...updatedUser,
          id: user.id,
          isActive: updatedUser.isActive
        }).subscribe({
          next: () => {
            user.isActive = updatedUser.isActive;
            console.log(`Đã cập nhật trạng thái user ${user.Email} thành ${user.isActive}`);
          },
          error: (err) => {
            console.error('Lỗi cập nhật trạng thái user:', err);
          }
        });
      },
      error: (err) => {
        console.error('Lỗi lấy chi tiết user:', err);
      }
    });
  }

}
