import { Component, OnInit } from '@angular/core';
import { BookingStatusService } from '../../../services/booking-status.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss'],
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
})
export class BookingStatusComponent implements OnInit {
  bookingStatuses: any[] = [];
  filteredStatuses: any[] = [];
  searchKeyword: string = '';
  statusFilterString: string = '';
  selectedStatus: any = null;
  sortOrder: 'asc' | 'desc' = 'asc';
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  isDetailPopupOpen: boolean = false;
  newStatus: any = {
    name: '',
    code: '',
    status: true,
  };

  editStatus: any = {
    _id: '',
    name: '',
    code: '',
    status: true,
  };

  constructor(private bookingStatusService: BookingStatusService) { }

  ngOnInit(): void {
    this.getAllBookingStatuses();
  }

  getAllBookingStatuses() {
    this.bookingStatusService.getAll().subscribe({
      next: (res: any) => {
        console.log('Dữ liệu trả về:', res);
        if (Array.isArray(res)) {
          this.bookingStatuses = res;
          this.filteredStatuses = [...this.bookingStatuses];
        } else {
          this.bookingStatuses = [];
          this.filteredStatuses = [];
        }
      },
      error: (err) => {
        console.error('Lỗi load booking status:', err);
      }
    });
  }


  applyFilters() {
  const keyword = this.searchKeyword?.toLowerCase() || '';
  const statusFilter = this.statusFilterString || '';

  // Lọc dữ liệu
  this.filteredStatuses = this.bookingStatuses.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(keyword);
    const statusMatch =
      !statusFilter || item.status.toString() === statusFilter;

    return nameMatch && statusMatch;
  });

  // Sắp xếp theo status (true/false)
  if (this.sortOrder === 'asc') {
    this.filteredStatuses.sort((a, b) => {
      return a.status === b.status ? 0 : a.status ? -1 : 1;
    });
  } else {
    this.filteredStatuses.sort((a, b) => {
      return a.status === b.status ? 0 : a.status ? 1 : -1;
    });
  }
}


  onViewDetail(status: any) {
    this.selectedStatus = status;
    this.isDetailPopupOpen = true;
  }

  onSearch() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  toggleStatus(status: any) {
    const updatedStatus = { ...status, status: !status.status };
    this.bookingStatusService.update(status._id, updatedStatus).subscribe({
      next: () => {
        status.status = !status.status;
        this.applyFilters();
      },
      error: (err) => {
        alert('Không thể cập nhật trạng thái');
        console.error(err);
      },
    });
  }

  // ===== Thêm =====
  onAdd() {
    this.newStatus = {
      name: '',
      code: '',
      status: true,
    };
    this.isAddPopupOpen = true;
  }

  onAddSubmit() {
    this.bookingStatusService.create(this.newStatus).subscribe({
      next: () => {
        this.getAllBookingStatuses();
        this.isAddPopupOpen = false;
      },
      error: (err) => {
        alert('Thêm thất bại');
        console.error(err);
      },
    });
  }

  // ===== Sửa =====
  onEdit(status: any) {
    this.editStatus = { ...status };
    this.isEditPopupOpen = true;
  }

  onEditSubmit() {
    this.bookingStatusService.update(this.editStatus._id, this.editStatus).subscribe({
      next: () => {
        this.getAllBookingStatuses();
        this.isEditPopupOpen = false;
      },
      error: (err) => {
        alert('Cập nhật thất bại');
        console.error(err);
      },
    });
  }
}
