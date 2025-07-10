import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, withInterceptorsFromDi } from '@angular/common/http';
import { MainRoomClassService } from '../../core/services/main-room-class.service';
import { MainRoomClass, RoomClassImage } from '../../types/main-room-class';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../core/services/image.service';
import { RoomClass } from '../../types/room-class';

@Component({
  selector: 'app-main-room-class',
  standalone: true,
  templateUrl: './main-room-class.component.html',
  styleUrls: ['./main-room-class.component.scss'],
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
})
export class MainRoomClassComponent implements OnInit {
  getIndex(arg0: string) {
    throw new Error('Method not implemented.');
  }
  mainRoomClasses!: MainRoomClass[];
  selectedMainRoomClass: MainRoomClass | null = null;
  loading = false;
  errorMessage: string | null = null;
  selectedMainRoom: MainRoomClass | null = null;
  isDetailPopupOpen = false;
  searchKeyword: string = '';
  suggestions: MainRoomClass[] = [];
  showSuggestions: boolean = false;
  hovered: string = '';
  statusFilterString: string = '';
  statusFilter: boolean | undefined = undefined;
  sortField: string = 'status';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private mainRoomClassService: MainRoomClassService,
    private imageService: ImageService
  ) {}
  isImageChecked: boolean = false;

  ngOnInit(): void {
    this.getAllMainRoomClasses();
    this.isImageChecked = true;
  }

  getAllMainRoomClasses(): void {
    this.mainRoomClassService
      .getAllMainRoomClasses(
        this.searchKeyword,
        this.statusFilter,
        this.sortField,
        this.sortOrder
      )
      .subscribe({
        next: (res) => {
          this.mainRoomClasses = res.data;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onStatusChange(): void {
    if (this.statusFilterString === '') {
      this.statusFilter = undefined;
    } else {
      this.statusFilter = this.statusFilterString === 'true';
    }
    this.getAllMainRoomClasses();
  }

  // Toggle sort order
  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.getAllMainRoomClasses();
  }

  // Change status filter (via dropdown/button)
  setStatusFilter(value: 'all' | 'active' | 'inactive') {
    if (value === 'all') this.statusFilter = undefined;
    else this.statusFilter = value === 'active';
    this.getAllMainRoomClasses();
  }

  clearSearch() {
    this.searchKeyword = '';
    this.onSearchInput(); // để cập nhật lại danh sách nếu có lọc
  }

  onSearch(): void {
    this.getAllMainRoomClasses();
  }
  onSearchInput(): void {
    if (!this.searchKeyword.trim()) {
      this.suggestions = [];
      return;
    }

    this.mainRoomClassService
      .getAllMainRoomClasses(this.searchKeyword)
      .subscribe({
        next: (res) => {
          this.suggestions = res.data;
        },
        error: (err) => {
          console.error('Lỗi lấy danh sách gợi ý loại phòng chính', err);
        },
      });
  }

  toggleMainRoomClass(mainRoomClass: any): void {
    const newStatus = !mainRoomClass.status; // Đảo trạng thái boolean

    this.mainRoomClassService
      .toggleMainRoomClassStatus(mainRoomClass._id, { status: newStatus })
      .subscribe({
        next: () => {
          mainRoomClass.status = newStatus;
        },
        error: (err) => {
          const message = err?.error?.message || 'Lỗi không xác định';

          if (message.includes('đang được sử dụng')) {
            alert(
              ' Không thể vô hiệu hóa loại phòng chính này vì đang có loại phòng con đang được sử dụng.'
            );
          } else if (message.includes('có loại phòng con')) {
            alert(
              ' Không thể vô hiệu hóa loại phòng chính vì nó vẫn còn loại phòng con.'
            );
          } else {
            alert(' Có lỗi xảy ra khi cập nhật trạng thái:\n' + message);
          }

          console.error('Lỗi khi cập nhật trạng thái loại phòng:', err);
        },
      });
  }

  getKeys(obj: any): string[] {
    if (!obj) return [];
    return Object.keys(obj).filter((k) => k !== '_id');
  }

  getValue(obj: any, key: string): any {
    return obj?.[key];
  }

  onViewDetail(item: MainRoomClass) {
    // Mở popup chi tiết
    console.log('Chi tiết Main Room Class:', item);
    this.selectedMainRoom = item;
    this.isDetailPopupOpen = true;
  }

  // popup thêm
  isAddPopupOpen = false;

  newMainRoom: {
    name: string;
    description: string;
    status: boolean;
    images: RoomClassImage[];
    room_class_list: [];
  } = {
    name: '',
    description: '',
    status: true,
    images: [],
    room_class_list: [],
  };

  imageUrl = '';
  onAdd() {
    this.resetAddForm();
    this.isAddPopupOpen = true;
  }

  resetAddForm() {
    this.newMainRoom = {
      name: '',
      description: '',
      status: true,
      images: [],
      room_class_list: [],
    };
    this.imageUrl = '';
  }

  closeAddPopup() {
    this.isAddPopupOpen = false;
  }

  // Gửi dữ liệu lên API để thêm loại phòng chính
  onAddSubmit() {
    const formData = new FormData();
    formData.append('name', this.newMainRoom.name);
    formData.append('description', this.newMainRoom.description);
    formData.append('status', this.newMainRoom.status.toString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.mainRoomClassService.addMainRoomClass(formData).subscribe({
      next: (res) => {
        this.getAllMainRoomClasses();
        this.isAddPopupOpen = false;
        this.selectedFile = null;
      },
      error: (err) => {
        alert(
          'Thêm loại phòng chính thất bại: ' + (err.message || err.statusText)
        );
      },
    });
  }

  // popup sửa
  isEditPopupOpen = false;

  editMainRoom: {
    _id: string;
    name: string;
    description: string;
    status: boolean;
    images: RoomClassImage[];
    room_class_list: RoomClass[];
  } = {
    _id: '',
    name: '',
    description: '',
    status: true,
    images: [],
    room_class_list: [],
  };

  editImageUrl = '';

  // xoá ảnh hiện tại
  removeEditImage() {
    this.editImageUrl = '';
    this.editSelectedFile = null;
    this.editMainRoom.images = [];
  }

  onEdit(item: MainRoomClass) {
    this.editMainRoom = {
      _id: item._id,
      name: item.name,
      description: item.description,
      status: item.status,
      images: item.images || [],
      room_class_list: item.room_class_list || [],
    };
    this.editImageUrl =
      `http://localhost:8000/images/${item.images?.[0]?.url}` || '';
    this.isEditPopupOpen = true;
  }

  onEditSubmit() {
    const formData = new FormData();
    formData.append('name', this.editMainRoom.name);
    formData.append('description', this.editMainRoom.description);

    if (this.isImageChecked) {
      // Nếu ảnh được check, thì cập nhật ảnh mới hoặc gửi ảnh cũ
      if (this.editSelectedFile) {
        formData.append('image', this.editSelectedFile);
      } else if (this.editImageUrl) {
        formData.append('existingImageUrl', this.editImageUrl);
      }
    } else {
      // Nếu ảnh KHÔNG được check, không thêm gì vào => giữ nguyên ảnh cũ ở backend
      console.log('Không cập nhật ảnh');
    }

    this.mainRoomClassService
      .updateMainRoomClass(this.editMainRoom._id, formData)
      .subscribe({
        next: () => {
          this.getAllMainRoomClasses();
          this.isEditPopupOpen = false;
          this.editSelectedFile = null;
          this.editImageUrl = '';
        },
        error: (err) => {
          alert(
            'Cập nhật loại phòng chính thất bại: ' +
              (err.error?.message || err.message || err.statusText)
          );
        },
      });
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  editSelectedFile: File | null = null;

  onEditFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.editSelectedFile = file;
      this.editImageUrl = URL.createObjectURL(file); // để preview
    }
  }
}
