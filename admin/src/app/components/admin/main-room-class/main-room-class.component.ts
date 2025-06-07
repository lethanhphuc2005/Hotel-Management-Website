import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MainRoomClassService } from '../../../services/main-room-class.service';
import { MainRoomClass, RoomClassImage } from '../../../models/main-room-class';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../../services/image.service';
import { RoomClass } from '../../../models/room-class';

@Component({
  selector: 'app-main-room-class',
  standalone: true,
  templateUrl: './main-room-class.component.html',
  styleUrls: ['./main-room-class.component.scss'],
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule]
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


  constructor(private mainRoomClassService: MainRoomClassService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.getAllMainRoomClasses();
  }

  getAllMainRoomClasses(): void {
    this.mainRoomClassService.getAllMainRoomClasses().subscribe({
      next: (res) => {
        this.mainRoomClasses = res.data; // ✅ Lấy đúng mảng
        console.log('Main room classes:', this.mainRoomClasses);
      },
      error: (err) => {
        this.errorMessage = 'Lỗi khi load loại phòng chính: ' + (err.message || err.statusText || 'Unknown error');
      }
    });
  }

  // onEdit(item: MainRoomClass) {
  //   // Mở popup edit
  //   console.log('Edit:', item);
  // }

toggleMainRoomClass(mainRoomClass: any): void {
  const newStatus = !mainRoomClass.status; // Đảo trạng thái boolean

  this.mainRoomClassService.toggleMainRoomClassStatus(mainRoomClass._id, { status: newStatus }).subscribe({
    next: () => {
      mainRoomClass.status = newStatus;
    },
    error: (err) => {
      console.error('Lỗi khi cập nhật trạng thái loại phòng:', err);
    }
  });
}


  getKeys(obj: any): string[] {
    if (!obj) return [];
    return Object.keys(obj).filter(k => k !== '_id');
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
      room_class_list: []
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
      room_class_list: []
    };
    this.imageUrl = '';
  }


  closeAddPopup() {
    this.isAddPopupOpen = false;
  }

  // Gửi dữ liệu lên API để thêm loại phòng chính
  onAddSubmit() {
    // Tạo main room class mà không có images
    const newRoomData = {
      name: this.newMainRoom.name,
      description: this.newMainRoom.description,
      status: this.newMainRoom.status
    };

    this.mainRoomClassService.addMainRoomClass(newRoomData).subscribe({
      next: (res) => {
        const createdMainRoom = res.data;
        const mainRoomClassId = createdMainRoom._id || createdMainRoom['id'];

        if (this.imageUrl.trim()) {
          // Gọi service upload ảnh riêng
          this.imageService.uploadImage(mainRoomClassId, this.imageUrl.trim()).subscribe({
            next: () => {
              this.mainRoomClasses.unshift(createdMainRoom);
              this.isAddPopupOpen = false;
              this.imageUrl = '';
            },
            error: (err) => {
              alert('Upload ảnh thất bại: ' + (err.message || err.statusText));
            }
          });
        } else {
          this.mainRoomClasses.push(createdMainRoom);
          this.isAddPopupOpen = false;
        }
      },
      error: (err) => {
        alert('Thêm loại phòng chính thất bại: ' + (err.message || err.statusText));
      }
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
  room_class_list: RoomClass[]; // ✅ Đúng cú pháp kiểu
} = {
  _id: '',
  name: '',
  description: '',
  status: true,
  images: [],
  room_class_list: []
};

editImageUrl = '';

onEdit(item: MainRoomClass) {
  this.editMainRoom = {
    _id: item._id,
    name: item.name,
    description: item.description,
    status: item.status,
    images: item.images || [],
    room_class_list: item.room_class_list || [] // ✅ Gán giá trị, không phải kiểu
  };
  this.editImageUrl = item.images?.[0]?.url || '';
  this.isEditPopupOpen = true;
}

onEditSubmit() {
  const updatedRoom: MainRoomClass = {
    _id: this.editMainRoom._id,
    name: this.editMainRoom.name,
    description: this.editMainRoom.description,
    status: this.editMainRoom.status,
    images: this.editMainRoom.images || [],
    room_class_list: this.editMainRoom.room_class_list || [],
    room_classes: undefined
  };

  console.log('🧾 Updating main room:', updatedRoom);

  this.mainRoomClassService.updateMainRoomClass(this.editMainRoom._id, updatedRoom).subscribe({
    next: () => {
      if (this.editImageUrl.trim()) {
        this.imageService.uploadImage(this.editMainRoom._id, this.editImageUrl.trim()).subscribe({
          next: () => {
            this.getAllMainRoomClasses();
            this.isEditPopupOpen = false;
          },
          error: (err) => {
            alert('Cập nhật ảnh thất bại: ' + (err.message || err.statusText));
          }
        });
      } else {
        this.getAllMainRoomClasses();
        this.isEditPopupOpen = false;
      }
    },
    error: (err) => {
      console.error('❌ Update failed:', err);
      alert('Cập nhật loại phòng chính thất bại: ' + (err.error?.message || err.message || err.statusText));
    }
  });
}



}
