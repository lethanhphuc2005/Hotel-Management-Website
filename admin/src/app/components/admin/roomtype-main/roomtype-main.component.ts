import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RoomTypeDetail, RoomTypeMain } from '../../../models/roomtypemain';
import { RoomTypeMainService } from '../../../services/roomtypemain.service';
import { TienNghi } from '../../../models/roomtype';


@Component({
  selector: 'app-roomtypemain',
  standalone: true,
  templateUrl: './roomtype-main.component.html',
  styleUrls: ['./roomtype-main.component.scss'],
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class RoomTypeMainComponent implements OnInit {
  roomTypeMains!: RoomTypeMain[];
  selectedRoomTypeMain: RoomTypeMain | null = null;
  loading = false;
  errorMessage: string | null = null;
  roomTypes: any;

  constructor(private roomTypeMainService: RoomTypeMainService) { }

  ngOnInit(): void {
    this.getAllRoomTypeMains();
  }

  getAllRoomTypeMains(): void {
    console.log('Đang gọi getAllRoomTypeMains...');
    this.roomTypeMainService.getAllRoomTypeMains().subscribe({
      next: (res) => {
        console.log('Dữ liệu trả về từ API:', res);
        this.roomTypeMains = res.roomTypeMains;
        console.log('roomTypeMains:', this.roomTypeMains);
      },
      error: (err) => {
        this.errorMessage = 'Lỗi khi load loại phòng chính: ' + (err.message || err.statusText || 'Unknown error');
        console.error('Lỗi khi gọi API:', err);
      }
    });
  }


  onAdd(): void {
    // thêm loại phòng chính
  }

  onToggleStatus(rtm: any) {
    rtm.TrangThai = !rtm.TrangThai;
    // Gọi API cập nhật nếu cần
  }

  onEdit(rtm: any) {
    // Hiển thị form sửa loại phòng chính
  }


  // onEdit(roomType: RoomTypeDetail): void {
  //   console.log('Edit loại phòng con:', roomType);
  // }

  // onToggleStatus(rt: RoomTypeDetail): void {
  //   rt.TrangThai = !rt.TrangThai;
  //   console.log(`Loại phòng ${rt.TenLPCT} trạng thái: ${rt.TrangThai ? 'Hoạt động' : 'Ngưng hoạt động'}`);
  // }

}


//   getTienNghiNames(tienNghiList?: TienNghi[]): string {
//     if (!tienNghiList || tienNghiList.length === 0) return 'Không có tiện nghi';
//     return tienNghiList.map(tn => tn.TenTN).join(', ');
//   }
// }
