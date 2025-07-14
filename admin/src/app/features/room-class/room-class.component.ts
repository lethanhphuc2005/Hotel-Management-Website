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

@Component({
  selector: 'app-room-class-list',
  standalone: true,
  templateUrl: './room-class.component.html',
  styleUrls: ['./room-class.component.scss'],
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
})
export class RoomClassListComponent implements OnInit {
  roomClasses: RoomClass[] = [];
  features: Feature[] = [];
  selectedFeatureIds: string[] = [];
  mainRoomClasses: MainRoomClass[] = [];
  selectedRoomClass: RoomClass | null = null;
  isDetailPopupOpen = false;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  searchKeyword: string = '';
  statusFilterString: string = '';
  statusFilter: boolean | undefined = undefined;
  sortField: string = 'status';
  sortOrder: 'asc' | 'desc' = 'asc';
  imagePreview: string[] | null = null;
  selectedFiles: File[] = []; // Danh sách file thực tế
  newRoomClass: RoomClassRequest = {};
  total = 0; // Tổng số loại phòng, có thể dùng để hiển thị phân trang
  limit = 10; // Số lượng loại phòng hiển thị mỗi trang
  page = 1; // Trang hiện tại
  minBed = 0; // Giá trị tối thiểu cho số giường
  maxBed = 10;
  minCapacity = 0; // Giá trị tối thiểu cho sức chứa
  maxCapacity = 10;

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
        search: this.searchKeyword,
        page: this.page,
        limit: this.limit,
        sort: this.sortField,
        order: this.sortOrder,
        status: this.statusFilterString,
        feature: '',
        type: '',
        minBed: this.minBed,
        maxBed: this.maxBed,
        minCapacity: this.minCapacity,
        maxCapacity: this.maxCapacity,
      })
      .subscribe({
        next: (res) => {
          this.roomClasses = res.data;
          this.total = res.pagination.total; // Cập nhật tổng số loại phòng
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getAllFeatures(): void {
    this.featureService
      .getAllFeatures({
        search: '',
        page: 1,
        limit: 100,
        sort: 'createdAt',
        order: 'desc',
        status: '',
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
    this.mainRoomClassService.getAllMainRoomClasses({}).subscribe({
      next: (res) => {
        this.mainRoomClasses = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSearchInput(): void {
    this.page = 1; // Reset to first page on new search
    this.getAllRoomClasses();
  }

  onStatusChange(): void {
    this.page = 1; // Reset to first page on status change
    this.getAllRoomClasses();
  }

  onSortChange(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc'; // Default to ascending on new sort
    }
    this.getAllRoomClasses();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.getAllRoomClasses();
  }

  onToggleFeature(rc: RoomClass, event: MouseEvent) {
    event.stopPropagation(); // Prevent row click event
    rc.showFeatures = !rc.showFeatures;
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

  onViewDetail(event: MouseEvent, rc: RoomClass) {
    const target = event.target as HTMLElement;

    if (
      target.closest('label.switch') || // 👉 kiểm tra phần tử (hoặc con của) label.switch
      target.closest('button') ||
      target.closest('input')
    ) {
      return;
    }

    // Nếu không phải các phần tử loại trừ thì mở chi tiết
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
    }
  }

  onClosePopup(): void {
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.isDetailPopupOpen = false;
    this.selectedRoomClass = null;
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

  onAddRoomClass(): void {
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
      this.selectedFiles.forEach((file) => {
        formData.append('images', file);
      });
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

  isFeatureChecked(featureId: string): boolean {
    if (!this.selectedRoomClass?.features) return false;

    return this.selectedRoomClass.features.some(
      (f) => (f.feature_id?.id || f.feature_id?.id)?.toString() === featureId
    );
  }

  onEditRoomClass(): void {
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
      this.selectedFiles.forEach((file) => {
        formData.append('images', file);
      });
    }

    if (
      this.selectedRoomClass.features &&
      this.selectedRoomClass.features.length > 0
    ) {
      this.selectedRoomClass.features.forEach((featureId) => {
        formData.append('features', featureId.feature_id?.id || '');
      });
    }

    console.log('FormData before update:', formData);
    console.log('Selected Room Class ID:', this.selectedRoomClass.id);

    this.roomClassService
      .updateRoomClass(this.selectedRoomClass.id, formData)
      .subscribe({
        next: (res) => {
          this.getAllRoomClasses();
          this.isEditPopupOpen = false;
          this.selectedFiles = []; // Reset selected files
          this.imagePreview = null; // Reset image preview
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
