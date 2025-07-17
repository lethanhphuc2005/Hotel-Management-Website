import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainRoomClassService } from '@/core/services/main-room-class.service';
import { MainRoomClass, MainRoomClassRequest } from '@/types/main-room-class';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ImageHelperService } from '@/shared/services/image-helper.service';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { CommonFilterBarComponent } from '@/shared/components/common-filter-bar/common-filter-bar.component';
import { MainRoomClassListComponent } from './main-room-class-list/main-room-class-list.component';
import { MainRoomClassDetailPopupComponent } from './main-room-class-detail-popup/main-room-class-detail-popup.component';
import { MainRoomClassFormComponent } from './main-room-class-form/main-room-class-form.component';
import { compressImage } from '@/shared/utils/image.utils';

@Component({
  selector: 'app-main-room-class',
  standalone: true,
  templateUrl: './main-room-class.component.html',
  styleUrls: ['./main-room-class.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PaginationComponent,
    CommonFilterBarComponent,
    MainRoomClassListComponent,
    MainRoomClassDetailPopupComponent,
    MainRoomClassFormComponent,
  ],
})
export class MainRoomClassComponent implements OnInit {
  mainRoomClasses: MainRoomClass[] = [];
  selectedMainRoomClass: MainRoomClass | null = null;
  isDetailPopupOpen = false;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  imagePreview: string | null = null;
  newMainRoom: MainRoomClassRequest = {
    name: '',
    description: '',
    status: true,
    image: null,
  };
  filter: {
    keyword: string;
    sortField: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
    total: number;
    status: string;
  } = {
    keyword: '',
    sortField: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
    total: 0,
    status: '',
  };

  constructor(
    private mainRoomClassService: MainRoomClassService,
    private toastService: ToastrService,
    private imageHelperService: ImageHelperService
  ) {}
  ngOnInit(): void {
    this.getAllMainRoomClasses();
  }

  getImageUrl(image?: string): string {
    return this.imageHelperService.getImageUrl(image);
  }

  getAllMainRoomClasses(): void {
    this.mainRoomClassService
      .getAllMainRoomClasses({
        search: this.filter.keyword,
        page: this.filter.page,
        limit: this.filter.limit,
        sort: this.filter.sortField,
        order: this.filter.sortOrder,
        status: this.filter.status,
      })
      .subscribe({
        next: (res) => {
          this.mainRoomClasses = res.data;
          this.filter.total = res.pagination.total;
        },
        error: (err) => {
          console.error(err);
          this.toastService.error(err.error?.message, 'Lỗi');
          this.mainRoomClasses = [];
        },
      });
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.getAllMainRoomClasses();
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sortField = sortField;
      this.filter.sortOrder = this.filter.sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    }
    this.filter.page = 1; // Reset to first page on filter change
    this.getAllMainRoomClasses();
  }

  onToggleChange(event: Event, item: MainRoomClass): void {
    const checkbox = event.target as HTMLInputElement;
    const originalStatus = item.status;
    const newStatus = checkbox.checked;

    // Optimistically update status
    item.status = newStatus;

    this.mainRoomClassService.toggleMainRoomClassStatus(item.id).subscribe({
      next: () => {
        // Thành công → giữ nguyên status
        this.toastService.success(
          'Thay đổi trạng thái loại phòng chính thành công',
          'Thành công'
        );
      },
      error: (err) => {
        // Thất bại → rollback
        item.status = originalStatus;
        this.toastService.error(
          err.error?.message || err.message || err.statusText,
          'Lỗi'
        );
      },
    });
  }

  onViewDetail(rc: MainRoomClass) {
    this.selectedMainRoomClass = rc;
    this.isDetailPopupOpen = true;
  }

  onOpenPopup(isAddForm: boolean, item?: MainRoomClass): void {
    this.isAddPopupOpen = isAddForm;
    this.isEditPopupOpen = !isAddForm;

    if (isAddForm) {
      // Reset form thêm mới
      this.selectedMainRoomClass = null;
      this.newMainRoom = {
        name: '',
        description: '',
        status: true,
        image: null,
      };
    } else if (item) {
      // Mở form chỉnh sửa
      this.selectedMainRoomClass = item;
      this.newMainRoom = {
        name: item.name,
        description: item.description,
        status: item.status,
        image: null, // nếu bạn cho phép upload ảnh mới
      };
    }
  }

  onClosePopup(): void {
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.isDetailPopupOpen = false;
    this.selectedMainRoomClass = null;
  }

  onFileSelected(file: File): void {
    this.newMainRoom.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async onAddSubmit(): Promise<void> {
    const formData = new FormData();
    formData.append('name', this.newMainRoom.name || '');
    formData.append('description', this.newMainRoom.description || '');
    formData.append('status', this.newMainRoom.status?.toString() || 'true');

    if (this.newMainRoom.image) {
      const compressedFile = await compressImage(
        this.newMainRoom.image,
        1,
        1920
      );
      formData.append('image', compressedFile);
    }

    this.mainRoomClassService.addMainRoomClass(formData).subscribe({
      next: () => {
        this.getAllMainRoomClasses();
        this.isAddPopupOpen = false;
        this.toastService.success(
          'Thêm loại phòng chính thành công',
          'Thành công'
        );
      },
      error: (err) => {
        this.toastService.error(
          err.error?.message || err.message || err.statusText,
          'Lỗi'
        );
      },
    });
  }

  async onEditSubmit(): Promise<void> {
    if (!this.selectedMainRoomClass) return;

    const formData = new FormData();
    formData.append('name', this.newMainRoom.name || '');
    formData.append('description', this.newMainRoom.description || '');
    if (this.newMainRoom.image) {
      const compressedFile = await compressImage(
        this.newMainRoom.image,
        1,
        1920
      );
      formData.append('image', compressedFile);
    }

    this.mainRoomClassService
      .updateMainRoomClass(this.selectedMainRoomClass.id, formData)
      .subscribe({
        next: () => {
          this.getAllMainRoomClasses();
          this.isEditPopupOpen = false;
          this.toastService.success(
            'Cập nhật loại phòng chính thành công',
            'Thành công'
          );
        },
        error: (err) => {
          this.toastService.error(
            err.error?.message || err.message || err.statusText,
            'Lỗi'
          );
        },
      });
  }
}
