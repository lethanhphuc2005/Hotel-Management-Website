import { Component, OnInit } from '@angular/core';
import { Feature, FeatureFilter, FeatureRequest } from '@/types/feature';
import { FeatureService } from '@/core/services/feature.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageHelperService } from '@/shared/services/image-helper.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { CommonFilterBarComponent } from '@/shared/components/common-filter-bar/common-filter-bar.component';
import { compressImage } from '@/shared/utils/image.utils';
import { FeatureListComponent } from './feature-list/feature-list.component';
import { FeatureDetailComponent } from './feature-detail/feature-detail.component';
import { FeatureFormComponent } from './feature-form/feature-form.component';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    CommonFilterBarComponent,
    FeatureListComponent,
    FeatureDetailComponent,
    FeatureFormComponent,
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
  filter: FeatureFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    status: '',
  };

  constructor(
    private featureService: FeatureService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllFeatures();
  }

  getAllFeatures(): void {
    this.featureService.getAllFeatures(this.filter).subscribe({
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
      this.filter.sort = sortField;
      this.filter.order = this.filter.order === 'asc' ? 'desc' : 'asc';
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
          `Trạng thái tiện nghi đã được ${
            newStatus ? 'kích hoạt' : 'vô hiệu hóa'
          }`,
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
    this.newFeature = {
      name: '',
      description: '',
      icon: '',
      status: true,
      image: null,
    };
  }

  onFileSelected(file: File): void {
    this.newFeature.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
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
        this.toastService.success(
          'Thêm tiện nghi thành công',
          'Thành công'
        );
        this.onClosePopup();
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
          this.toastService.success(
            'Cập nhật tiện nghi thành công',
            'Thành công'
          );
          this.onClosePopup();
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
