import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../types/user';
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
  selectedUser: User | null = null;
  isDetailPopupOpen = false;
  private subscription?: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.subscription = this.userService.getAllUsers().subscribe({
   next: (response: any) => {
  const rawUsers: any[] = response.data; // 👈 lấy mảng thật sự
  this.users = rawUsers.map((item: User): any => ({
    id: item.id,
    first_name: `${item.last_name} ${item.first_name}`,
    email: item.email,
    phone_number: item.phone_number,
    address: item.address,
    request: item.request,
    status: item.status
  }));
},

      error: (err) => {
        console.error('Failed to fetch users:', err);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

 onToggleUserStatus(event: Event, user: User) {
  event.preventDefault();

  const action = user.status ? 'vô hiệu hóa' : 'kích hoạt lại';
  const confirmed = window.confirm(`Bạn có chắc muốn ${action} tài khoản này không?`);

  if (!confirmed) return;

  this.userService.toggleUserStatus(user.id).subscribe({
    next: (res) => {
      user.status = !user.status;
      console.log(`✅ ${res.message || 'Cập nhật trạng thái thành công.'}`);
    },
    error: (err) => {
      console.error('Không thể cập nhật trạng thái tài khoản:', err);
      alert('Có lỗi khi cập nhật trạng thái!');
    }
  });
}



  onViewUserDetail(user: User) {
    this.selectedUser = user;
    this.isDetailPopupOpen = true;
  }
}
