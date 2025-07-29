import { Component, OnInit } from '@angular/core';
import { UserService } from '@/core/services/user.service';
import { User, UserFilter } from '@/types/user';
import { ToastrService } from 'ngx-toastr';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { UserFilterComponent } from './user-filter/user-filter.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
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
  filter: UserFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    status: '',
    is_verified: '',
    level: '',
  };

  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadInitialData();
    } catch (err) {
      console.error(err);
    } finally {
      this.spinner.hide();
    }
  }

  async loadInitialData() {
    await Promise.all([this.loadAllUsers()]);
  }

  loadAllUsers() {
    this.userService.getAllUsers(this.filter).subscribe({
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
        // Successfully toggled status
        this.toastrService.success(
          `Trạng thái người dùng đã được cập nhật thành ${
            newStatus ? 'hoạt động' : 'không hoạt động'
          }`,
          'Thành công'
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
