import { Component, OnInit } from '@angular/core';
import { Feature, FeatureRequest } from '../../types/feature';
import { FeatureService } from '../../core/services/feature.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageHelperService } from '../../shared/services/image-helper.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent implements OnInit {
  originalFeatures: Feature[] = [];
  features: Feature[] = [];
  selectedFeature: Feature | null = null;
  isDetailPopupOpen = false;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  searchKeyword: string = '';
  statusFilterString: string = '';
  statusFilter: boolean | undefined = undefined;
  sortField: string = 'status';
  sortOrder: 'asc' | 'desc' = 'asc';
  imagePreview: string | null = null;
  newFeature: FeatureRequest = {
    name: '',
    description: '',
    icon: '',
    status: true,
    image: null,
  };
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;

  constructor(
    private featureService: FeatureService,
    private imageHelperService: ImageHelperService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllFeatures();
  }

  getImageUrl(image?: string): string {
    return this.imageHelperService.getImageUrl(image);
  }

  getAllFeatures(): void {
    this.featureService
      .getAllFeatures({
        search: this.searchKeyword,
        page: this.page,
        limit: this.limit,
        sort: this.sortField,
        order: this.sortOrder,
        status: this.statusFilterString,
      })
      .subscribe({
        next: (res) => {
          this.features = res.data;
          this.total = res.pagination.total;
          this.totalPages = res.pagination.totalPages;
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Không thể tải tiện nghi');
        },
      });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.getAllFeatures();
  }

  onSearchInput(): void {
    this.page = 1; // Reset về trang đầu khi tìm kiếm
    this.getAllFeatures();
  }

  onStatusChange(): void {
    this.page = 1;
    this.getAllFeatures();
  }

  onSortChange(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.page = 1;
    this.getAllFeatures();
  }

  onToggleChange(event: Event, item: Feature): void {
    const checkbox = event.target as HTMLInputElement;
    const originalStatus = item.status;
    const newStatus = checkbox.checked;

    // Optimistically update status
    item.status = newStatus;

    this.featureService.updateStatus(item.id).subscribe({
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

  onViewDetail(event: MouseEvent, rc: Feature) {
    const target = event.target as HTMLElement;

    if (
      target.closest('label.switch') || // 👉 kiểm tra phần tử (hoặc con của) label.switch
      target.closest('button') ||
      target.closest('input')
    ) {
      return;
    }

    // Nếu không phải các phần tử loại trừ thì mở chi tiết
    this.selectedFeature = rc;
    this.isDetailPopupOpen = true;
  }

  onOpenPopup(isAddForm: boolean, item?: Feature): void {
    this.isAddPopupOpen = isAddForm;
    this.isEditPopupOpen = !isAddForm;
    console.log(isAddForm, item);
    if (isAddForm) {
      // Reset form thêm mới
      this.selectedFeature = null;
      this.newFeature = {
        name: '',
        description: '',
        icon: '',
        status: true,
        image: null,
      };
    } else if (item) {
      // Mở form chỉnh sửa
      this.selectedFeature = item;
      this.newFeature = {
        name: item.name,
        description: item.description,
        icon: item.icon,
        status: item.status,
        image: null,
      };
    }
  }

  onClosePopup(): void {
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.isDetailPopupOpen = false;
    this.selectedFeature = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.newFeature.image = file;

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
    formData.append('name', this.newFeature.name || '');
    formData.append('icon', this.newFeature.icon || '');
    formData.append('description', this.newFeature.description || '');
    formData.append('status', this.newFeature.status?.toString() || 'true');

    if (this.newFeature.image) {
      formData.append('image', this.newFeature.image);
    }

    this.featureService.createFeature(formData).subscribe({
      next: () => {
        this.getAllFeatures();
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
    if (!this.selectedFeature) return;

    const formData = new FormData();
    formData.append('name', this.newFeature.name || '');
    formData.append('icon', this.newFeature.icon || '');
    formData.append('description', this.newFeature.description || '');
    if (this.newFeature.image) {
      formData.append('image', this.newFeature.image);
    }

    this.featureService
      .updateFeature(this.selectedFeature.id, formData)
      .subscribe({
        next: () => {
          this.getAllFeatures();
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
