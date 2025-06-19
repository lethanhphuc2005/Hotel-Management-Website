import { Component, OnInit } from '@angular/core';
import { BookingMethodService } from '../../../services/booking-method.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-method',
  standalone: true,
  templateUrl: './booking-method.component.html',
  styleUrls: ['./booking-method.component.scss'],
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
})
export class BookingMethodComponent implements OnInit {
  bookingMethods: any[] = [];
  filteredMethods: any[] = [];
  searchKeyword: string = '';
  selectedMethod: any = null;
  sortOrder: 'asc' | 'desc' = 'asc';
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  isDetailPopupOpen: boolean = false;

  newMethod: any = {
    name: '',
    description: '',
    status: true,
  };

  editMethod: any = {
    _id: '',
    name: '',
    description: '',
    status: true,
  };

  constructor(private bookingMethodService: BookingMethodService) {}

  ngOnInit(): void {
    this.getAllBookingMethods();
  }

  getAllBookingMethods() {
  this.bookingMethodService.getAll().subscribe({
    next: (res: any) => {
      console.log('Dữ liệu phương thức:', res);
      if (Array.isArray(res.data)) {
        this.bookingMethods = res.data;
        this.filteredMethods = [...this.bookingMethods];
        this.applyFilters(); // << Thêm dòng này để áp dụng filter ngay
      } else {
        this.bookingMethods = [];
        this.filteredMethods = [];
      }
    },
    error: (err) => {
      console.error('Lỗi load phương thức:', err);
    },
  });
}


  applyFilters() {
    const keyword = this.searchKeyword?.toLowerCase() || '';

    this.filteredMethods = this.bookingMethods.filter((item) =>
      item.name?.toLowerCase().includes(keyword)
    );

    if (this.sortOrder === 'asc') {
      this.filteredMethods.sort((a, b) =>
        a.status === b.status ? 0 : a.status ? -1 : 1
      );
    } else {
      this.filteredMethods.sort((a, b) =>
        a.status === b.status ? 0 : a.status ? 1 : -1
      );
    }
  }

  onSearch() {
    this.applyFilters();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  onViewDetail(method: any) {
    this.selectedMethod = method;
    this.isDetailPopupOpen = true;
  }

  toggleStatus(method: any) {
    const updatedMethod = { ...method, status: !method.status };
    this.bookingMethodService.update(method._id, updatedMethod).subscribe({
      next: () => {
        method.status = !method.status;
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
    this.newMethod = {
      name: '',
      description: '',
      status: true,
    };
    this.isAddPopupOpen = true;
  }

  onAddSubmit() {
    this.bookingMethodService.create(this.newMethod).subscribe({
      next: () => {
        this.getAllBookingMethods();
        this.isAddPopupOpen = false;
      },
      error: (err) => {
        alert('Thêm phương thức thất bại');
        console.error(err);
      },
    });
  }

  // ===== Sửa =====
  onEdit(method: any) {
    this.editMethod = { ...method };
    this.isEditPopupOpen = true;
  }

  onEditSubmit() {
    this.bookingMethodService.update(this.editMethod._id, this.editMethod).subscribe({
      next: () => {
        this.getAllBookingMethods();
        this.isEditPopupOpen = false;
      },
      error: (err) => {
        alert('Cập nhật phương thức thất bại');
        console.error(err);
      },
    });
  }
}
