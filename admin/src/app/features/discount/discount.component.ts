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
import { DiscountFormComponent } from './discount-form/discount-form.component';
import { RoomClassService } from '@/core/services/room-class.service';
import { RoomClass } from '@/types/room-class';
import { compressImage } from '@/shared/utils/image.utils';
import { DiscountDetailComponent } from './discount-detail/discount-detail.component';

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
    DiscountFormComponent,
    DiscountDetailComponent,
  ],
})
export class DiscountComponent implements OnInit {
  discounts: Discount[] = [];
  roomClasses: RoomClass[] = [];
  selectedDiscount: Discount | null = null;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  isDetailPopupOpen = false;
  imagePreview: string | null = null;
  newDiscount: DiscountRequest = {
    conditions: {},
    apply_to_room_class_ids: [] as string[],
  };
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
    private roomClassService: RoomClassService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.fetchDiscounts();
    this.fetchRoomClasses();
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

  fetchRoomClasses(): void {
    this.roomClassService
      .getAllRoomClass({
        page: 1,
        limit: 1000,
        total: 0,
        status: 'true',
      })
      .subscribe({
        next: (response) => {
          this.roomClasses = response.data;
        },
        error: (error) => {
          console.error('Error fetching room classes:', error);
          this.toastr.error(
            error.error.message || 'Failed to fetch room classes'
          );
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
          user_levels: undefined,
        },
        promo_code: '',
        valid_from: undefined,
        valid_to: undefined,
        apply_to_room_class_ids: [] as string[],
        can_be_stacked: false,
        priority: 0,
        status: true,
      };
    } else if (item) {
      // Mở form chỉnh sửa
      this.selectedDiscount = item;
      this.imagePreview = item.image?.url || null;
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
        valid_from: item.valid_from,
        valid_to: item.valid_to,
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
    this.imagePreview = null;
    this.newDiscount = {
      name: '',
      image: null,
      uploadImage: null,
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
        user_levels: undefined,
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
    this.newDiscount.uploadImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async onAddSubmit(): Promise<void> {
    const formData = new FormData();
    formData.append('name', this.newDiscount.name || '');
    formData.append('description', this.newDiscount.description || '');
    formData.append('type', this.newDiscount.type || '');
    formData.append('value', this.newDiscount.value?.toString() || '');
    formData.append('value_type', this.newDiscount.value_type || '');
    formData.append('conditions', JSON.stringify(this.newDiscount.conditions));
    formData.append('promo_code', this.newDiscount.promo_code || '');
    formData.append(
      'valid_from',
      this.newDiscount.valid_from?.toISOString() || ''
    );
    formData.append('valid_to', this.newDiscount.valid_to?.toISOString() || '');
    if (this.newDiscount.apply_to_room_class_ids) {
      formData.append(
        'apply_to_room_class_ids',
        JSON.stringify(this.newDiscount.apply_to_room_class_ids)
      );
    }
    formData.append(
      'can_be_stacked',
      this.newDiscount.can_be_stacked ? 'true' : 'false'
    );
    formData.append('priority', this.newDiscount.priority?.toString() || '0');
    formData.append('status', this.newDiscount.status ? 'true' : 'false');
    if (this.newDiscount.uploadImage) {
      const compressedFile = await compressImage(
        this.newDiscount.uploadImage,
        1,
        1920
      );
      formData.append('image', compressedFile);
    }
    this.discountService.createDiscount(formData).subscribe({
      next: (response) => {
        this.toastr.success('Thêm giảm giá thành công', 'Thành công');
        this.onClosePopup();
        this.fetchDiscounts();
      },
      error: (error) => {
        console.error('Error adding discount:', error);
        this.toastr.error(
          error.error.message || 'Thêm giảm giá thất bại',
          'Lỗi'
        );
      },
    });
  }
  async onEditSubmit(): Promise<void> {
    if (!this.selectedDiscount) return;

    const formData = new FormData();
    formData.append('name', this.newDiscount.name || '');
    formData.append('description', this.newDiscount.description || '');
    formData.append('type', this.newDiscount.type || '');
    formData.append('value', this.newDiscount.value?.toString() || '');
    formData.append('value_type', this.newDiscount.value_type || '');
    formData.append('conditions', JSON.stringify(this.newDiscount.conditions));
    formData.append('promo_code', this.newDiscount.promo_code || '');
    formData.append(
      'valid_from',
      new Date(this.newDiscount.valid_from || '').toISOString() || ''
    );
    formData.append(
      'valid_to',
      new Date(this.newDiscount.valid_to || '').toISOString() || ''
    );
    if (this.newDiscount.apply_to_room_class_ids) {
      formData.append(
        'apply_to_room_class_ids',
        JSON.stringify(this.newDiscount.apply_to_room_class_ids)
      );
    }
    formData.append(
      'can_be_stacked',
      this.newDiscount.can_be_stacked ? 'true' : 'false'
    );
    formData.append('priority', this.newDiscount.priority?.toString() || '0');
    formData.append('status', this.newDiscount.status ? 'true' : 'false');

    if (this.newDiscount.uploadImage) {
      const compressedFile = await compressImage(
        this.newDiscount.uploadImage,
        1,
        1920
      );
      formData.append('image', compressedFile);
    }

    this.discountService
      .updateDiscount(this.selectedDiscount.id, formData)
      .subscribe({
        next: (response) => {
          this.toastr.success('Cập nhật giảm giá thành công', 'Thành công');
          this.onClosePopup();
          this.fetchDiscounts();
        },
        error: (error) => {
          console.error('Error updating discount:', error);
          this.toastr.error(
            error.error.message || 'Cập nhật giảm giá thất bại',
            'Lỗi'
          );
        },
      });
  }
}
