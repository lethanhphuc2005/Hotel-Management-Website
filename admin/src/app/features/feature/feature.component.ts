import { Component, OnInit } from '@angular/core';
import { Feature, FeatureRequest } from '../../types/feature';
import { FeatureService } from '../../core/services/feature.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ImageHelperService } from '../../shared/services/image-helper.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { CommonFilterBarComponent } from '@/shared/components/common-filter-bar/common-filter-bar.component';
import { compressImage } from '@/shared/utils/image.utils';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    NgOptimizedImage,
    CommonFilterBarComponent,
  ],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent implements OnInit {
  features: Feature[] = [];
  selectedFeature: Feature | null = null;
  isDetailPopupOpen = false;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  imagePreview: string | null = null;
  newFeature: FeatureRequest = {
    name: '',
    description: '',
    icon: '',
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
        search: this.filter.keyword,
        page: this.filter.page,
        limit: this.filter.limit,
        sort: this.filter.sortField,
        order: this.filter.sortOrder,
        status: this.filter.status,
      })
      .subscribe({
        next: (res) => {
          this.features = res.data;
          this.filter.total = res.pagination.total;
        },
        error: (err) => {
          console.error(err);
          this.toastService.error(err.error?.message, 'Lỗi');
          this.features = [];
        },
      });
  }

  onPageChange(newPage: number): void {
    this.filter.page = newPage;
    this.getAllFeatures();
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sortField = sortField;
      this.filter.sortOrder = this.filter.sortOrder === 'asc' ? 'desc' : 'asc';
    }
    this.filter.page = 1; // Reset to first page on filter change
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

  onViewDetail(f: Feature) {
    this.selectedFeature = f;
    console.log('Selected feature:', f);
    // Reset preview image
    this.imagePreview = null;
    this.isDetailPopupOpen = true;
  }

  onOpenPopup(isAddForm: boolean, item?: Feature): void {
    this.isAddPopupOpen = isAddForm;
    this.isEditPopupOpen = !isAddForm;
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

  async onAddSubmit(): Promise<void> {
    const formData = new FormData();
    formData.append('name', this.newFeature.name || '');
    formData.append('icon', this.newFeature.icon || '');
    formData.append('description', this.newFeature.description || '');
    formData.append('status', this.newFeature.status?.toString() || 'true');

    if (this.newFeature.image) {
      const compressedFile = await compressImage(
        this.newFeature.image,
        1,
        1920
      );
      formData.append('image', compressedFile);
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

  async onEditSubmit(): Promise<void> {
    if (!this.selectedFeature) return;

    const formData = new FormData();
    formData.append('name', this.newFeature.name || '');
    formData.append('icon', this.newFeature.icon || '');
    formData.append('description', this.newFeature.description || '');
    if (this.newFeature.image) {
      const compressedFile = await compressImage(
        this.newFeature.image,
        1,
        1920
      );
      formData.append('image', compressedFile);
    }

    this.featureService
      .updateFeature(this.selectedFeature.id, formData)
      .subscribe({
        next: () => {
          this.getAllFeatures();
          this.isEditPopupOpen = false;
          this.selectedFeature = null;
          this.imagePreview = null; // Reset preview image
          this.newFeature.image = null; // Reset new image
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
