import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MainRoomClassService } from '../../../services/main-room-class.service';
import { MainRoomClass } from '../../../models/main-room-class';

@Component({
  selector: 'app-main-room-class',
  standalone: true,
  templateUrl: './main-room-class.component.html',
  styleUrls: ['./main-room-class.component.scss'],
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class MainRoomClassComponent implements OnInit {
  mainRoomClasses!: MainRoomClass[];
  selectedMainRoomClass: MainRoomClass | null = null;
  loading = false;
  errorMessage: string | null = null;
  roomTypes: any;
  selectedMainRoom: MainRoomClass | null = null;
  isDetailPopupOpen = false;


  constructor(private mainRoomClassService: MainRoomClassService) {}

  ngOnInit(): void {
    this.getAllMainRoomClasses();
  }

  getAllMainRoomClasses(): void {
    this.mainRoomClassService.getAllMainRoomClasses().subscribe({
      next: (res) => {
        this.mainRoomClasses = res.roomTypeMains;
      },
      error: (err) => {
        this.errorMessage = 'Lỗi khi load loại phòng chính: ' + (err.message || err.statusText || 'Unknown error');
      }
    });
  }
roomTypeMains: MainRoomClass[] = [];

onAdd() {
  // Mở form thêm
}

onEdit(item: MainRoomClass) {
  // Mở popup edit
  console.log('Edit:', item);
}

onToggleStatus(item: MainRoomClass) {
  // Gọi API cập nhật trạng thái
  item.status = !item.status;
  console.log('Toggled status:', item);
}

onViewRoomChildPopup(item: MainRoomClass) {
  // Mở popup hiển thị loại phòng con
  console.log('Xem danh sách loại phòng con:', item.room_class_list);
}
onViewDetail(item: MainRoomClass) {
  // Mở popup chi tiết
  console.log('Chi tiết Main Room Class:', item);
  this.selectedMainRoom = item;
  this.isDetailPopupOpen = true;
}

}
