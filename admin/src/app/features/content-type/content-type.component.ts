import { Component, OnInit } from '@angular/core';
import { ContentTypeService } from '../../core/services/content-type.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ContentType,
  ContentTypeFilter,
  ContentTypeRequest,
} from '@/types/content-type';
import { ToastrService } from 'ngx-toastr';
import { ContentTypeListComponent } from './content-type-list/content-type-list.component';
import { ContentTypeFormComponent } from './content-type-form/content-type-form.component';
import { CommonFilterBarComponent } from '@/shared/components/common-filter-bar/common-filter-bar.component';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-content-type',
  standalone: true,
  templateUrl: './content-type.component.html',
  styleUrls: ['./content-type.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ContentTypeListComponent,
    ContentTypeFormComponent,
    CommonFilterBarComponent,
    PaginationComponent,
  ],
})
export class ContentTypeComponent implements OnInit {
  contentTypes: ContentType[] = [];
  selectedContentType: ContentType | null = null;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  newContentType: ContentTypeRequest = {
    name: '',
    description: '',
    status: true,
  };
  filter: ContentTypeFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    status: '',
  };

  constructor(
    private contentTypeService: ContentTypeService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.loadAllContentTypes();
  }

  loadAllContentTypes() {
    this.contentTypeService.getAllContentTypes(this.filter).subscribe({
      next: (response) => {
        this.contentTypes = response.data;
        this.filter.total = response.pagination.total;
      },
      error: (err) => {
        console.error('Error fetching content types:', err);
        this.toastService.error(err.error?.message, 'Lỗi');
        this.contentTypes = [];
      },
    });
  }

  onPageChange(page: number) {
    this.filter.page = page;
    this.loadAllContentTypes();
  }

  onFilterChange(sortField?: string) {
    if (sortField) {
      this.filter.sort = sortField;
      this.filter.order = this.filter.order === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    }
    this.filter.page = 1; // Reset to first page on filter change
    this.loadAllContentTypes();
  }

  onToggleChange(event: Event, item: ContentType): void {
    const checkbox = event.target as HTMLInputElement;
    const originalStatus = item.status;
    const newStatus = checkbox.checked;

    // Optimistically update status
    item.status = newStatus;

    this.contentTypeService.toggleContentTypeStatus(item.id).subscribe({
      next: () => {
        // Thành công → giữ nguyên status
        this.toastService.success(
          `Trạng thái loại nội dung đã được ${
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

  onOpenPopup(isAddForm: boolean, item?: ContentType): void {
    this.isAddPopupOpen = isAddForm;
    this.isEditPopupOpen = !isAddForm;

    if (isAddForm) {
      // Reset form thêm mới
      this.selectedContentType = null;
      this.newContentType = {
        name: '',
        description: '',
        status: true,
      };
    } else if (item) {
      // Mở form chỉnh sửa
      this.selectedContentType = item;
      this.newContentType = {
        name: item.name,
        description: item.description,
        status: item.status,
      };
    }
  }

  onClosePopup(): void {
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.selectedContentType = null;
    this.newContentType = {
      name: '',
      description: '',
      status: true,
    };
  }

  onAddSubmit(): void {
    this.contentTypeService.createContentType(this.newContentType).subscribe({
      next: () => {
        this.loadAllContentTypes();
        this.onClosePopup();
        this.toastService.success(
          'Thêm loại nội dung thành công',
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
    if (!this.selectedContentType) return;
    this.contentTypeService
      .updateContentType(this.selectedContentType.id, this.newContentType)
      .subscribe({
        next: () => {
          this.loadAllContentTypes();
          this.onClosePopup();
          this.toastService.success(
            'Cập nhật loại nội dung thành công',
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

  onDeleleSubmit(id: string): void {
    confirm('Bạn có chắc chắn muốn xóa loại nội dung này?') &&
      this.contentTypeService.deleteContentType(id).subscribe({
        next: () => {
          this.loadAllContentTypes();
          this.onClosePopup();
          this.toastService.success(
            'Xóa loại nội dung thành công',
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
