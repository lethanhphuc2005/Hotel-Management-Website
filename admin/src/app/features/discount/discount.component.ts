import { Component, OnInit } from '@angular/core';
import { DiscountService } from '@/core/services/discount.service';
import { Discount, DiscountFilter, DiscountRequest } from '@/types/discount';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { DiscountListComponent } from './discount-list/discount-list.component';
import { DiscountFilterComponent } from './discount-filter/discount-filter.component';

@Component({
  selector: 'app-discount',
  standalone: true,
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PaginationComponent,
    DiscountListComponent,
    DiscountFilterComponent,
  ],
})
export class DiscountComponent implements OnInit {
  discounts: Discount[] = [];
  selectedDiscount: Discount | null = null;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  isDetailPopupOpen = false;
  imagePreview: string | null = null;
  newDiscount: DiscountRequest = {};
  filter: DiscountFilter = {
    search: '',
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
    status: '',
    total: 0,
    type: '',
    value_type: '',
    valid_from: undefined,
    valid_to: undefined,
    priority: undefined,
    apply_to: '',
    min_advance_days: undefined,
    max_advance_days: undefined,
    min_stay_nights: undefined,
    max_stay_nights: undefined,
    min_rooms: undefined,
    user_level: '',
  };
  constructor(
    private discountService: DiscountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchDiscounts();
  }

  fetchDiscounts(): void {
    this.discountService.getAllDiscounts(this.filter).subscribe({
      next: (response) => {
        this.discounts = response.data;
        this.filter.total = response.pagination.total;
      },
      error: (error) => {
        console.error('Error fetching discounts:', error);
        this.toastr.error(error.error.message || 'Failed to fetch discounts');
        this.discounts = [];
      },
    });
  }

  onPageChange(newPage: number): void {
    this.filter.page = newPage;
    this.fetchDiscounts();
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sort = sortField;
      this.filter.order = this.filter.order === 'asc' ? 'desc' : 'asc';
    }
    this.filter.page = 1; // Reset to first page on filter change
    this.fetchDiscounts();
  }

  onToggleChange(event: Event, item: Discount): void {
    const checkbox = event.target as HTMLInputElement;
    const originalStatus = item.status;
    const newStatus = checkbox.checked;

    // Optimistically update status
    item.status = newStatus;

    this.discountService.toggleDiscountStatus(item.id).subscribe({
      next: () => {
        // Thành công → giữ nguyên status
        this.toastr.success(
          `Trạng thái giảm giá đã được ${
            newStatus ? 'kích hoạt' : 'vô hiệu hóa'
          }`,
          'Thành công'
        );
      },
      error: (err) => {
        // Thất bại → rollback
        item.status = originalStatus;
        this.toastr.error(
          err.error?.message || err.message || err.statusText,
          'Lỗi'
        );
      },
    });
  }

  onViewDetail(discount: Discount): void {
    this.selectedDiscount = discount;
    this.imagePreview = null;
    this.isDetailPopupOpen = true;
  }

  onOpenPopup(isAddForm: boolean, item?: Discount): void {
    this.isAddPopupOpen = isAddForm;
    this.isEditPopupOpen = !isAddForm;
    if (isAddForm) {
      // Reset form thêm mới
      this.selectedDiscount = null;
      this.newDiscount = {
        name: '',
        image: null,
        description: '',
        type: '',
        value: undefined,
        value_type: '',
        conditions: {
          min_advance_days: undefined,
          max_advance_days: undefined,
          min_stay_nights: undefined,
          max_stay_nights: undefined,
          min_rooms: undefined,
          user_levels: [''],
        },
        promo_code: '',
        valid_from: undefined,
        valid_to: undefined,
        apply_to_room_class_ids: [],
        can_be_stacked: false,
        priority: 0,
        status: true,
      };
    } else if (item) {
      // Mở form chỉnh sửa
      this.selectedDiscount = item;
      this.newDiscount = {
        name: item.name,
        image: null, // Image will be handled separately
        description: item.description,
        type: item.type,
        value: item.value,
        value_type: item.value_type,
        conditions: {
          min_advance_days: item.conditions.min_advance_days,
          max_advance_days: item.conditions.max_advance_days,
          min_stay_nights: item.conditions.min_stay_nights,
          max_stay_nights: item.conditions.max_stay_nights,
          min_rooms: item.conditions.min_rooms,
          user_levels: item.conditions.user_levels || undefined,
        },
        promo_code: item.promo_code || '',
        valid_from: new Date(item.valid_from),
        valid_to: new Date(item.valid_to),
        apply_to_room_class_ids: item.apply_to_room_class_ids || [],
        can_be_stacked: item.can_be_stacked,
        priority: item.priority,
        status: item.status,
      };
    }
  }

  onClosePopup(): void {
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.isDetailPopupOpen = false;
    this.selectedDiscount = null;
    this.newDiscount = {
      name: '',
      image: null,
      description: '',
      type: '',
      value: undefined,
      value_type: '',
      conditions: {
        min_advance_days: undefined,
        max_advance_days: undefined,
        min_stay_nights: undefined,
        max_stay_nights: undefined,
        min_rooms: undefined,
        user_levels: [''],
      },
      promo_code: '',
      valid_from: undefined,
      valid_to: undefined,
      apply_to_room_class_ids: [],
      can_be_stacked: false,
      priority: 0,
      status: true,
    };
  }

  onFileSelected(file: File): void {
    this.newDiscount.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
