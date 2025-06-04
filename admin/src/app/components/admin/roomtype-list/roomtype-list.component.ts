import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoomType, TienNghi } from '../../../models/roomtype';
import { RoomTypeService } from '../../../services/roomtype.service';


@Component({
  selector: 'app-roomtype-list',
  standalone: true,
  templateUrl: './roomtype-list.component.html',
  styleUrls: ['./roomtype-list.component.scss'],
  imports: [RouterModule, CommonModule, HttpClientModule]
})
export class RoomTypeListComponent implements OnInit {
  content: any;
  getTienNghiString(_t18: RoomType) {
    throw new Error('Method not implemented.');
  }
  roomTypes: RoomType[] = [];
  selectedRoomType: RoomType | null = null;
  loading = false;
  errorMessage: string | null = null;
  room: any;

  constructor(private roomTypeService: RoomTypeService) { }


  ngOnInit(): void {
    this.loadRoomTypes();
  }

  loadRoomTypes(): void {
    this.loading = true;
    this.errorMessage = null;
    this.roomTypeService.getAllRoomTypes().subscribe({
      next: (data: RoomType[]) => {
        this.roomTypes = data;
        if (data.length > 0) {
          this.selectedRoomType = data[0];
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Lỗi khi load loại phòng: ' + (err.message || err.statusText || 'Unknown error');
        console.error(this.errorMessage, err);
        this.loading = false;
      }
    });
  }
  onAdd() {

  }
  onEdit(roomType: RoomType) {

  }


  onSelectRoomType(roomType: RoomType): void {
    this.selectedRoomType = roomType;
  }

  // Trong component .ts
  getTienNghiNames(tienNghiList: TienNghi[]): string {
    if (!tienNghiList || tienNghiList.length === 0) return 'Không có tiện nghi';
    return tienNghiList.map(tn => tn.TenTN).join(', ');
  }
  onToggleStatus(rt: any) {
    rt.HoatDong = !rt.HoatDong;
    // TODO: gọi API cập nhật trạng thái hoạt động nếu cần
    console.log(`Loại phòng ${rt.TenLPCT} trạng thái: ${rt.HoatDong ? 'Hoạt động' : 'Ngưng hoạt động'}`);
  }


}
