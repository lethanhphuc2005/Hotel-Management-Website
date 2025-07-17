import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomClassService } from '../../core/services/room-class.service';
import { FeatureService } from '../../core/services/feature.service';
import { MainRoomClassService } from '../../core/services/main-room-class.service';
import { RoomClass, RoomClassRequest } from '../../types/room-class';
import { ImageHelperService } from '../../shared/services/image-helper.service';
import { Feature } from '../../types/feature';
import { MainRoomClass } from '../../types/main-room-class';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { RoomClassListComponent } from './room-class-list/room-class-list.component';
import { RoomClassDetailComponent } from './room-class-detail/room-class-detail.component';
import { RoomClassFormComponent } from './room-class-form/room-class-form.component';
import { compressImage } from '@/shared/utils/image.utils';
import { RoomClassFilterComponent } from './room-class-filter/room-class-filter.component';

@Component({
  selector: 'app-room-class',
  standalone: true,
  templateUrl: './room-class.component.html',
  styleUrls: ['./room-class.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PaginationComponent,
    RoomClassListComponent,
    RoomClassDetailComponent,
    RoomClassFormComponent,
    RoomClassFilterComponent,
  ],
})
export class RoomClassComponent implements OnInit {
  roomClasses: RoomClass[] = [];
  features: Feature[] = [];
  selectedFeatureIds: string[] = [];
  mainRoomClasses: MainRoomClass[] = [];
  selectedRoomClass: RoomClass | null = null;
  isDetailPopupOpen = false;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  imagePreview: string[] | null = null;
  selectedFiles: File[] = []; // Danh sách file thực tế
  newRoomClass: RoomClassRequest = {};
  filter: {
    keyword: string;
    sortField: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
    total: number;
    status?: string;
    feature?: string;
    type?: string;
    minBed?: number;
    maxBed?: number;
    minCapacity?: number;
    maxCapacity?: number;
  } = {
    keyword: '',
    sortField: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
    total: 0,
    status: '',
    feature: '',
    type: '',
  };

  constructor(
    private roomClassService: RoomClassService,
    private featureService: FeatureService,
    private mainRoomClassService: MainRoomClassService,
    private imageHelperService: ImageHelperService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllRoomClasses();
    this.getAllFeatures();
    this.getAllMainRoomClasses();
  }

  getImageUrl(image?: string): string {
    return this.imageHelperService.getImageUrl(image);
  }

  getAllRoomClasses(): void {
    this.roomClassService
      .getAllRoomClass({
        search: this.filter.keyword,
        page: this.filter.page,
        limit: this.filter.limit,
        sort: this.filter.sortField,
        order: this.filter.sortOrder,
        status: this.filter.status,
        feature: this.filter.feature,
        type: this.filter.type,
        minBed: this.filter.minBed,
        maxBed: this.filter.maxBed,
        minCapacity: this.filter.minCapacity,
        maxCapacity: this.filter.maxCapacity,
      })
      .subscribe({
        next: (res) => {
          this.roomClasses = res.data;
          this.filter.total = res.pagination.total; // Cập nhật tổng số loại phòng
        },
        error: (err) => {
          console.error(err);
          this.toastService.error(err.error?.message, 'Lỗi');
          this.roomClasses = [];
        },
      });
  }

  getAllFeatures(): void {
    this.featureService
      .getAllFeatures({
        status: 'true',
        limit: 1000,
      })
      .subscribe({
        next: (res) => {
          this.features = res.data;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getAllMainRoomClasses(): void {
    this.mainRoomClassService
      .getAllMainRoomClasses({
        status: 'true',
        limit: 1000,
      })
      .subscribe({
        next: (res) => {
          this.mainRoomClasses = res.data;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sortField = sortField;
      this.filter.sortOrder = this.filter.sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    }
    this.filter.page = 1;
    this.getAllRoomClasses();
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.getAllRoomClasses();
  }

  onFeatureToggle(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedFeatureIds.push(id);
    } else {
      this.selectedFeatureIds = this.selectedFeatureIds.filter((f) => f !== id);
    }

    // Cập nhật vào object tạo mới
    this.newRoomClass.features = [...this.selectedFeatureIds];
  }

  onToggleChange(event: Event, item: RoomClass): void {
    const checkbox = event.target as HTMLInputElement;
    const originalStatus = item.status;
    const newStatus = checkbox.checked;

    item.status = newStatus;

    this.roomClassService.toggleRoomClassStatus(item.id).subscribe({
      next: () => {
        this.toastService.success(
          `Trạng thái phòng "${item.name}" đã được cập nhật thành ${
            newStatus ? 'Kích hoạt' : 'Vô hiệu hóa'
          }.`
        );
      },
      error: (err) => {
        item.status = originalStatus; // Rollback status on error
        this.toastService.error(
          err.error?.message || err.message || err.statusText,
          'Lỗi'
        );
      },
    });
  }

  onViewDetail(rc: RoomClass) {
    this.selectedRoomClass = rc;
    this.isDetailPopupOpen = true;
  }

  onOpenPopup(isAddForm: boolean, item?: RoomClass): void {
    this.isAddPopupOpen = isAddForm;
    this.isEditPopupOpen = !isAddForm;

    if (isAddForm) {
      this.selectedRoomClass = null;
      this.newRoomClass = {
        name: '',
        description: '',
        status: true,
        images: null,
      };
    } else if (item) {
      this.selectedRoomClass = item;
      this.newRoomClass = {
        name: item.name,
        description: item.description,
        status: item.status,
        images: null,
      };
      this.imagePreview =
        item.images?.map((img) =>
          this.imageHelperService.getImageUrl(img.url)
        ) || null;
      this.selectedFeatureIds =
        item.features?.map((f) =>
          (f.feature_id?.id || f.feature_id?.id)?.toString()
        ) || [];
    }
  }

  onClosePopup(): void {
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.isDetailPopupOpen = false;
    this.selectedRoomClass = null;
    this.selectedFiles = []; // Reset selected files
    this.imagePreview = null; // Reset image preview
    this.newRoomClass = {};
    this.selectedFeatureIds = []; // Reset selected feature IDs
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);

      // Gộp với ảnh đã chọn trước đó
      this.selectedFiles = [...this.selectedFiles, ...newFiles];

      // Tạo lại imagePreview từ tất cả selectedFiles
      this.imagePreview = this.selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      // Xoá toàn bộ ảnh cũ từ DB khỏi preview (nếu có)
      if (this.selectedRoomClass) {
        this.selectedRoomClass.images = [];
      }

      // Gán lại images cho FormData
      this.newRoomClass.images = [...this.selectedFiles];
    } else {
      this.selectedFiles = [];
      this.imagePreview = null;
      this.newRoomClass.images = [];
    }
  }

  removeImage(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedFiles.splice(index, 1);

    if (this.imagePreview) {
      this.imagePreview.splice(index, 1);
    }

    this.newRoomClass.images = [...this.selectedFiles];
  }

  async onAddRoomClass(): Promise<void> {
    const formData = new FormData();
    formData.append(
      'main_room_class_id',
      String(this.newRoomClass.main_room_class_id || '')
    );
    formData.append('name', this.newRoomClass.name || '');
    formData.append('description', this.newRoomClass.description || '');
    formData.append('bed_amount', String(this.newRoomClass.bed_amount || 0));
    formData.append('capacity', String(this.newRoomClass.capacity || 0));
    formData.append('price', String(this.newRoomClass.price || 0));
    formData.append(
      'price_discount',
      String(this.newRoomClass.price_discount || 0)
    );
    formData.append('view', this.newRoomClass.view || '');
    if (this.selectedFiles.length > 0) {
      for (const file of this.selectedFiles) {
        const compressedFile = await compressImage(file, 1, 1920);
        formData.append('images', compressedFile);
      }
    }

    if (this.newRoomClass.features && this.newRoomClass.features.length > 0) {
      this.newRoomClass.features.forEach((featureId) => {
        formData.append('features', featureId);
      });
    }

    this.roomClassService.addRoomClass(formData).subscribe({
      next: (res) => {
        this.getAllRoomClasses();
        this.isAddPopupOpen = false;
        this.selectedFiles = []; // Reset selected files
        this.imagePreview = null; // Reset image preview
        this.newRoomClass = {}; // Reset form data
        this.selectedFeatureIds = []; // Reset selected feature IDs
        this.toastService.success(res.message, 'Thành công');
      },
      error: (err) => {
        this.toastService.error(
          err.error?.message || err.message || err.statusText,
          'Lỗi'
        );
      },
    });
  }

  async onEditRoomClass(): Promise<void> {
    if (!this.selectedRoomClass) return;

    const formData = new FormData();
    formData.append(
      'main_room_class_id',
      String(this.selectedRoomClass.main_room_class_id || '')
    );
    formData.append('name', this.selectedRoomClass.name || '');
    formData.append('description', this.selectedRoomClass.description || '');
    formData.append(
      'bed_amount',
      String(this.selectedRoomClass.bed_amount || 0)
    );
    formData.append('capacity', String(this.selectedRoomClass.capacity || 0));
    formData.append('price', String(this.selectedRoomClass.price || 0));
    formData.append(
      'price_discount',
      String(this.selectedRoomClass.price_discount || 0)
    );
    formData.append('view', this.selectedRoomClass.view || '');
    if (this.selectedFiles.length > 0) {
      for (const file of this.selectedFiles) {
        const compressedFile = await compressImage(file, 1, 1920);
        formData.append('images', compressedFile);
      }
    }
    if (this.newRoomClass.features && this.newRoomClass.features.length > 0) {
      formData.append('features', JSON.stringify(this.newRoomClass.features));
    }

    this.roomClassService
      .updateRoomClass(this.selectedRoomClass.id, formData)
      .subscribe({
        next: (res) => {
          this.getAllRoomClasses();
          this.isEditPopupOpen = false;
          this.selectedFiles = []; // Reset selected files
          this.imagePreview = null; // Reset image preview
          this.newRoomClass = {}; // Reset form data
          this.selectedRoomClass = null; // Reset selected room class
          this.selectedFeatureIds = []; // Reset selected feature IDs
          this.toastService.success(res.message, 'Thành công');
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
