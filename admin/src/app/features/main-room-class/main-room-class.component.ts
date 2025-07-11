import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainRoomClassService } from '../../core/services/main-room-class.service';
import {
  MainRoomClass,
  MainRoomClassRequest,
} from '../../types/main-room-class';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ImageHelperService } from '../../shared/services/image-helper.service';

@Component({
  selector: 'app-main-room-class',
  standalone: true,
  templateUrl: './main-room-class.component.html',
  styleUrls: ['./main-room-class.component.scss'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class MainRoomClassComponent implements OnInit {
  originalMainRoomClasses: MainRoomClass[] = [];
  mainRoomClasses: MainRoomClass[] = [];
  selectedMainRoomClass: MainRoomClass | null = null;
  isDetailPopupOpen = false;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  searchKeyword: string = '';
  statusFilterString: string = '';
  statusFilter: boolean | undefined = undefined;
  sortField: string = 'status';
  sortOrder: 'asc' | 'desc' = 'asc';
  imagePreview: string | null = null;
  newMainRoom: MainRoomClassRequest = {
    name: '',
    description: '',
    status: true,
    image: null,
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
    this.mainRoomClassService.getAllMainRoomClasses().subscribe({
      next: (res) => {
        this.originalMainRoomClasses = res.data;
        this.mainRoomClasses = [...this.originalMainRoomClasses];
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSearchInput(): void {
    if (!this.searchKeyword.trim()) {
      this.mainRoomClasses = [...this.originalMainRoomClasses];
      return;
    }

    this.mainRoomClasses = this.originalMainRoomClasses.filter((item) =>
      item.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
  }

  onStatusChange(): void {
    if (!this.statusFilterString || this.statusFilterString === '') {
      this.mainRoomClasses = [...this.originalMainRoomClasses];
      return;
    }
    this.statusFilter = this.statusFilterString === 'true' ? true : false;
    this.mainRoomClasses = this.originalMainRoomClasses.filter(
      (item) => item.status === this.statusFilter
    );
  }

  onSortChange(field: string): void {
    if (this.sortField === field) {
      // Nếu đang sắp xếp theo trường này, đảo ngược thứ tự
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Nếu đổi sang trường khác, đặt lại thứ tự về tăng dần
      this.sortField = field;
      this.sortOrder = 'asc';
    }

    // Sắp xếp mảng theo trường và thứ tự đã chọn
    this.mainRoomClasses.sort((a, b) => {
      const aValue = a[this.sortField as keyof MainRoomClass];
      const bValue = b[this.sortField as keyof MainRoomClass];

      if (aValue === undefined || bValue === undefined) return 0;

      const aVal = typeof aValue === 'boolean' ? Number(aValue) : aValue;
      const bVal = typeof bValue === 'boolean' ? Number(bValue) : bValue;

      if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
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

  onViewDetail(event: MouseEvent, rc: MainRoomClass) {
    const target = event.target as HTMLElement;

    if (
      target.closest('label.switch') || // 👉 kiểm tra phần tử (hoặc con của) label.switch
      target.closest('button') ||
      target.closest('input')
    ) {
      return;
    }

    // Nếu không phải các phần tử loại trừ thì mở chi tiết
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.newMainRoom.image = file;

      // Hiển thị ảnh preview nếu cần
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onAddSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.newMainRoom.name || '');
    formData.append('description', this.newMainRoom.description || '');
    formData.append('status', this.newMainRoom.status?.toString() || 'true');

    if (this.newMainRoom.image) {
      formData.append('image', this.newMainRoom.image);
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

  onEditSubmit(): void {
    if (!this.selectedMainRoomClass) return;

    const formData = new FormData();
    formData.append('name', this.newMainRoom.name || '');
    formData.append('description', this.newMainRoom.description || '');
    if (this.newMainRoom.image) {
      formData.append('image', this.newMainRoom.image);
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
