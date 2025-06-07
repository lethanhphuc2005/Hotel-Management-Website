import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Room } from '../../../models/room';
import { Status } from '../../../models/status';
import { RoomService } from '../../../services/room.service';
import { StatusService } from '../../../services/status.service';
import { RoomStatusService } from '../../../services/room-status.service';
import { FormsModule } from '@angular/forms';
import { RoomClassService } from '../../../services/room-class.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
  standalone: true
})
export class RoomListComponent implements OnInit {

  rooms!: Room[];
  selectedRoom: any;
  statuses: Status[] = [];
  showAddPopup!: boolean;
  showDetailPopup = false;
  rt: any;
  roomStatusList: any[] = [];
  isRoomDetailOpen = false;
  isAddRoomPopupOpen = false;
  newRoom: any = {};
  roomStatuses: any[] = [];
  selectedRoomClassInfo: any;
  roomClasses: any;

  constructor(
    private roomService: RoomService,
    private statusService: StatusService,
    private roomStatusService: RoomStatusService,
    private roomClassService: RoomClassService // 🆕 inject status service
  ) { }


  ngOnInit() {
    this.getAllRooms();
    this.getAllStatus();
    this.loadRoomStatuses();
    this.getAllRoomClasses();
  }

  getAllRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (res: any) => {
        this.rooms = res.data; // 👈 lấy mảng data
        console.log('Danh sách phòng:', this.rooms);
      },
      error: (err) => console.error('Lỗi khi lấy danh sách phòng:', err),
    });
  }

  getAllRoomClasses() {
    this.roomClassService.getAllRoomClass().subscribe({
      next: (res) => {
        this.roomClasses = res.data;
      },
      error: (err: any) => {
        console.error('Lỗi khi lấy loại phòng:', err);
      }
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
    return this.statuses.find(s => s._id === id)?.name || 'Không rõ';
  }


  openAddPopup() {
    this.isAddRoomPopupOpen = true;
  }

  closeAddRoomPopup() {
    this.isAddRoomPopupOpen = false;
    this.newRoom = {};
    this.selectedRoomClassInfo = null;  // Nếu bạn dùng selectedRoomClassInfo
  }
  getTienNghiNames(tienNghi: any[] | null | undefined): string {
    if (!tienNghi || tienNghi.length === 0) return 'Chưa có tiện nghi';
    return tienNghi.map(tn => tn.TenTN).join(', ');
  }

  getFeatureNames(room: Room): string {
    const features = room.room_class?.[0]?.features;
    if (!features || features.length === 0) return 'Không có';
    return features.map(f => f.feature_id?.name).join(', ');
  }


  loadRooms() {
    this.getAllRooms();
  }

  viewRoomDetail(room: any) {
    this.selectedRoom = room;
    this.isRoomDetailOpen = true;
  }

  //   toggleRoomStatus(room: any) {
  //   const newStatus = !room.status;

  //   this.roomService.updateRoomStatus(room._id, { status: newStatus }).subscribe({
  //     next: () => {
  //       room.status = newStatus;
  //       console.log('Cập nhật trạng thái hiển thị phòng thành công');
  //     },
  //     error: (err) => {
  //       console.error('Lỗi khi cập nhật trạng thái phòng:', err);
  //     }
  //   });
  // }


  loadRoomStatuses() {
    this.roomStatusService.getAllRoomStatuses().subscribe({
      next: (res) => {
        this.roomStatuses = res;
      },
      error: (err) => {
        console.error('Lỗi khi load roomStatuses:', err);
      }
    });
  }

  onRoomClassChange(selectedId: string) {
    const selected = this.roomClasses.find((rc: { _id: string; }) => rc._id === selectedId);
    if (selected) {
      this.selectedRoomClassInfo = selected;

      // Gán các ô thông tin (tự điền khi chọn loại phòng)
      this.newRoom.bed_amount = selected.bed_amount;
      this.newRoom.price = selected.price;
      this.newRoom.description = selected.description;
    }
  }


  onAddRoomSubmit() {
    const defaultStatus = this.roomStatusList.find(s => s.name === 'Đang trống');
    const defaultStatusId = defaultStatus?._id;

    if (!defaultStatusId) {
      console.error('Không tìm thấy trạng thái "Đang trống"');
      return;
    }

    const data = {
      ...this.newRoom,
      room_status_id: defaultStatusId
    };

    this.roomService.addRoom(data).subscribe({
      next: () => {
        this.loadRooms();
        this.closeAddRoomPopup();
      },
      error: (err) => console.error('Lỗi khi thêm phòng:', err)
    });
  }

  // sửa
  isEditRoomPopupOpen = false;
  editRoomData: any = {};
  editingRoomId: string = '';
  selectedEditRoomClassInfo: any = null;

  editRoom(room: any) {
    this.editRoomData = { ...room };
    this.editingRoomId = room._id;
    this.isEditRoomPopupOpen = true;
    this.onEditRoomClassChange(room.room_class_id);
  }


  onEditRoomClassChange(selectedId: string) {
    const selected = this.roomClasses.find((rc: { _id: string; }) => rc._id === selectedId);
    if (selected) {
      this.selectedEditRoomClassInfo = selected;
      this.editRoomData.bed_amount = selected.bed_amount;
      this.editRoomData.price = selected.price;
      this.editRoomData.description = selected.description;
    }
  }
  onEditRoomSubmit() {
    if (!this.editingRoomId) return;

    const data = {
      name: this.editRoomData.name,
      floor: Number(this.editRoomData.floor),  // Ép kiểu number tại đây
      room_class_id: this.editRoomData.room_class_id,
      room_status_id: this.editRoomData.room_status_id || this.editRoomData.status?.[0]?._id
    };

    this.roomService.updateRoom(this.editingRoomId, data).subscribe({
      next: () => {
        this.loadRooms();
        this.closeEditRoomPopup();
      },
      error: (err) => console.error('Lỗi khi cập nhật phòng:', err)
    });
  }

  closeEditRoomPopup() {
    this.isEditRoomPopupOpen = false;
    this.editRoomData = {};
    this.selectedEditRoomClassInfo = null;
  }

}

