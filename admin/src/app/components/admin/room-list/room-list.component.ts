import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RoomAddComponent } from '../roomlist-add/roomlist-add.component';
import { Room } from '../../../models/room';
import { Status } from '../../../models/status';
import { RoomService } from '../../../services/room.service';
import { StatusService } from '../../../services/status.service';


@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
  imports: [RouterModule, CommonModule, HttpClientModule, RoomAddComponent],
  standalone: true
})
export class RoomListComponent implements OnInit {

  rooms!: Room[];
  selectedRoom: any;
  roomTypes: any;
  statuses: Status[] = [];
  showAddPopup!: boolean;

  constructor(
    private roomService: RoomService,
    private statusService: StatusService // 🆕 inject status service
  ) {}

  ngOnInit() {
    this.getAllRooms();
    this.getAllStatus();
  }

  getAllRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (res) => {
        this.rooms = res;
        console.log('Danh sách phòng:', this.rooms);
      },
      error: (err) => console.error('Lỗi khi lấy danh sách phòng:', err),
    });
  }


  getAllStatus(): void {
    this.statusService.getAllStatus().subscribe({
      next: (res: Status[]) => this.statuses = res,
      error: (err: any) => console.error('Lỗi khi lấy trạng thái:', err)
    });
  }

  // 🆕 Hàm lấy tên trạng thái từ ID
  getStatusName(id: string): string {
    return this.statuses.find(s => s._id === id)?.TenTT || 'Không rõ';
  }

  editRoom(rt: any) {
    // Mở form sửa, truyền rt vào để chỉnh sửa
  }

  deleteRoom(rt: any) {
    if (confirm('Bạn có chắc muốn xoá phòng này?')) {
      // Gọi API xoá hoặc xoá khỏi danh sách roomTypes
    }
  }

  getTienNghiNames(tienNghi: any[] | null | undefined): string {
    if (!tienNghi || tienNghi.length === 0) return 'Chưa có tiện nghi';
    return tienNghi.map(tn => tn.TenTN).join(', ');
  }
  // them phong
  openAddPopup() {
    this.showAddPopup = true;
  }


  onShowPopup() {
    this.showAddPopup = true;
  }

  onClosed() {
    this.showAddPopup = false;
  }

  onAdded() {
    this.showAddPopup = false;
    this.loadRooms(); // hoặc gọi lại API load danh sách phòng
  }
  loadRooms() {
    throw new Error('Method not implemented.');
  }
  toggleRoomStatus(room: any): void {
    room.TrangThai.TenTT = room.TrangThai.TenTT === 'Hoạt động' ? 'Ngưng hoạt động' : 'Hoạt động';
    // TODO: Gọi API cập nhật trạng thái phòng nếu có
    console.log('Trạng thái mới:', room.TrangThai.TenTT);
  }

}


