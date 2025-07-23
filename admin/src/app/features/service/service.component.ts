import { Component, OnInit } from '@angular/core';
import { Service, ServiceFilter, ServiceRequest } from '@/types/service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '@/core/services/service.service';
import { ToastrService } from 'ngx-toastr';
import { ImageHelperService } from '@/shared/services/image-helper.service';
import { compressImage } from '@/shared/utils/image.utils';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { CommonFilterBarComponent } from '@/shared/components/common-filter-bar/common-filter-bar.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceFormComponent } from './service-form/service-form.component';

@Component({
  selector: 'app-service',
  standalone: true,
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    CommonFilterBarComponent,
    ServiceListComponent,
    ServiceFormComponent,
  ],
})
export class ServiceComponent implements OnInit {
  services: Service[] = [];
  selectedService: Service | null = null;
  isDetailPopupOpen = false;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  imagePreview: string | null = null;
  newService: ServiceRequest = {
    name: '',
    description: '',
    status: true,
    image: null,
    uploadImage: null, // Reset upload image
  };
  filter: ServiceFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    status: '',
  };

  constructor(
    private serviceService: ServiceService,
    private toastService: ToastrService,
    private imageHelperService: ImageHelperService
  ) {}

  ngOnInit(): void {
    this.loadAllServices();
  }

  getImageUrl(image: string): string {
    return this.imageHelperService.getImageUrl(image);
  }

  loadAllServices(): void {
    this.serviceService.getAllServices(this.filter).subscribe({
      next: (response) => {
        this.services = response.data;
        this.filter.total = response.pagination.total;
      },
      error: (error) => {
        this.toastService.error(error.message || 'Failed to load services');
      },
    });
  }

  onPageChange(newPage: number): void {
    this.filter.page = newPage;
    this.loadAllServices();
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sort = sortField;
      this.filter.order = this.filter.order === 'asc' ? 'desc' : 'asc';
    }
    this.filter.page = 1; // Reset to first page on filter change
    this.loadAllServices();
  }

  onToggleChange(event: Event, item: Service): void {
    const checkbox = event.target as HTMLInputElement;
    const originalStatus = item.status;
    const newStatus = checkbox.checked;

    // Optimistically update status
    item.status = newStatus;

    this.serviceService.toggleServiceStatus(item.id).subscribe({
      next: () => {
        // Thành công → giữ nguyên status
        this.toastService.success(
          `Trạng thái dịch vụ ${
            newStatus ? 'kích hoạt' : 'vô hiệu hóa'
          } thành công`,
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

  onViewDetail(s: Service) {
    this.selectedService = s;
    this.imagePreview = null;
    this.isDetailPopupOpen = true;
  }

  onOpenPopup(isAddForm: boolean, item?: Service): void {
    this.isAddPopupOpen = isAddForm;
    this.isEditPopupOpen = !isAddForm;
    if (isAddForm) {
      // Reset form thêm mới
      this.selectedService = null;
      this.newService = {
        name: '',
        description: '',
        status: true,
        image: null,
        uploadImage: null, // Reset upload image
      };
    } else if (item) {
      // Mở form chỉnh sửa
      this.selectedService = item;
      this.imagePreview = this.getImageUrl(item.image);
      this.newService = {
        name: item.name,
        description: item.description,
        status: item.status,
        image: null, // Reset image to allow new upload
        uploadImage: null, // Reset upload image
      };
    }
  }

  onClosePopup(): void {
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.isDetailPopupOpen = false;
    this.selectedService = null;
    this.newService = {
      name: '',
      description: '',
      status: true,
      image: null,
      uploadImage: null, // Reset upload image
    };
  }

  onFileSelected(file: File): void {
    this.newService.uploadImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async onAddSubmit(): Promise<void> {
    const formData = new FormData();
    formData.append('name', this.newService.name || '');
    formData.append('description', this.newService.description || '');
    formData.append('status', this.newService.status?.toString() || 'true');

    if (this.newService.uploadImage) {
      const compressedFile = await compressImage(
        this.newService.uploadImage,
        1,
        1920
      );
      formData.append('image', compressedFile);
    }

    this.serviceService.createService(formData).subscribe({
      next: () => {
        this.loadAllServices();
        this.onClosePopup();
        this.toastService.success('Thêm dịch vụ thành công', 'Thành công');
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
    if (!this.selectedService) return;

    const formData = new FormData();
    formData.append('name', this.newService.name || '');
    formData.append('description', this.newService.description || '');
    if (this.newService.uploadImage) {
      const compressedFile = await compressImage(
        this.newService.uploadImage,
        1,
        1920
      );
      formData.append('image', compressedFile);
    }

    this.serviceService
      .updateService(this.selectedService.id, formData)
      .subscribe({
        next: () => {
          this.loadAllServices();
          this.onClosePopup();
          this.toastService.success('Cập nhật dịch vụ thành công', 'Thành công');
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
