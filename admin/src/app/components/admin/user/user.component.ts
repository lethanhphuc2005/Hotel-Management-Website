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
        console.log('DATA TRẢ VỀ:', data);
        this.users = data.map((item: any) => ({
          id: item._id,
          TenKH: `${item.last_name} ${item.first_name}`,
          Email: item.email,
          SoDT: item.phone_number,
          DiaChi: item.address,
          YeuCau_DB: item.request,
          isActive: item.status
        }));

      },
      error: (err) => {
        console.error('Lỗi khi lấy user:', err);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  toggleUserStatus(user: User) {
    const action = user.isActive ? 'vô hiệu hoá' : 'kích hoạt lại';
    const confirmed = window.confirm(`Bạn có muốn ${action} tài khoản này không?`);
    if (!confirmed) return;

    this.userService.toggleUserStatus(user.id).subscribe({
      next: (res) => {
        user.isActive = !user.isActive;
        console.log(`✅ ${res.message}`);
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật trạng thái:', err);
      }
    });
  }
  // popup xem
  selectedUser: User | null = null;
  isDetailPopupOpen = false;

  onViewUserDetail(user: User) {
    this.selectedUser = user;
    this.isDetailPopupOpen = true;
  }
}
