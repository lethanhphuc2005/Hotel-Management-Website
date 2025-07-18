import { Component, OnInit } from '@angular/core';
import { UserService } from '@/core/services/user.service';
import { User } from '@/types/user';
import { ToastrService } from 'ngx-toastr';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { UserFilterComponent } from './user-filter/user-filter.component';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [
    UserListComponent,
    UserDetailComponent,
    PaginationComponent,
    UserFilterComponent,
  ],
})
export class UserComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  isDetailPopupOpen = false;
  filter: {
    keyword: string;
    page: number;
    limit: number;
    sort: string;
    total: number;
    order: 'desc' | 'asc';
    status?: string;
    is_verified?: string;
    level?: string;
  } = {
    keyword: '',
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
    total: 0,
    status: '',
    is_verified: '',
    level: '',
  };

  constructor(
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.userService
      .getAllUsers({
        search: this.filter.keyword,
        page: this.filter.page,
        limit: this.filter.limit,
        sort: this.filter.sort,
        order: this.filter.order,
        status: this.filter.status,
        is_verified: this.filter.is_verified,
        level: this.filter.level,
      })
      .subscribe({
        next: (response) => {
          this.users = response.data;
          this.filter.total = response.pagination.total;
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          this.toastrService.error(err.error?.message, 'Lỗi');
          this.users = [];
        },
      });
  }

  onPageChange(page: number) {
    this.filter.page = page;
    this.loadAllUsers();
  }

  onFilterChange(sortField?: string) {
    if (sortField) {
      this.filter.sort = sortField;
      this.filter.order = this.filter.order === 'desc' ? 'asc' : 'desc';
    }
    this.filter.page = 1; // Reset to first page on filter change
    this.loadAllUsers();
  }

  onViewDetail(user: User) {
    this.selectedUser = user;
    this.isDetailPopupOpen = true;
  }

  onClosePopup() {
    this.isDetailPopupOpen = false;
    this.selectedUser = null;
  }

  onToggleChange(event: Event, item: User): void {
    const checkbox = event.target as HTMLInputElement;
    const originalStatus = item.status;
    const newStatus = checkbox.checked;

    item.status = newStatus;

    this.userService.toggleUserStatus(item.id).subscribe({
      next: () => {
        this.toastrService.success(
          `Trạng thái phòng "${item.id}" đã được cập nhật thành ${
            newStatus ? 'Kích hoạt' : 'Vô hiệu hóa'
          }.`
        );
      },
      error: (err) => {
        item.status = originalStatus; // Rollback status on error
        this.toastrService.error(
          err.error?.message || err.message || err.statusText,
          'Lỗi'
        );
      },
    });
  }
}
