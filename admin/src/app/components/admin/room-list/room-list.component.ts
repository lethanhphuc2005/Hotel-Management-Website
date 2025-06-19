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
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule, FullCalendarModule],
  standalone: true
})
export class RoomListComponent implements OnInit {

  rooms!: Room[];
  selectedRoom: any;
  statuses: Status[] = [];
  showAddPopup!: boolean;
  showDetailPopup = false;
  roomStatusList: any[] = [];
  isRoomDetailOpen = false;
  isAddRoomPopupOpen = false;
  newRoom: any = {};
  roomStatuses: any[] = [];
  selectedRoomClassInfo: any;
  roomClasses: any;
  selectedFloor: number | null = null;
  selectedStatus: string | null = null;
  searchKeyword: string = '';
  filteredRooms: any[] = [];
  totalRooms: number = 0;
  selectedRoomClass: string = '';
  allRooms: Room[] = []; // chứa tất cả dữ liệu gốc từ API
  filter: {
    check_in_date?: string;
    check_out_date?: string;
    room_status_id?: string;
    room_class_id?: string;
    status?: string;
    keyword?: string;
  } = {
      check_in_date: '',
      check_out_date: '',
      room_status_id: '',
      room_class_id: '',
      status: '',
      keyword: ''
    };

  bookingService: any;
  calendarOptions: any = {
    initialView: 'dayGridMonth',
    events: [],
    height: 'auto',
    locale: 'vi'
  };


  constructor(
    private roomService: RoomService,
    // private statusService: StatusService,
    private roomStatusService: RoomStatusService,
    private roomClassService: RoomClassService
  ) { }

  ngOnInit() {
    this.getAllRooms();
    this.getAllRoomStatuses();
    this.loadRoomStatuses();
    this.getAllRoomClasses();
    this.getAvailableRooms(); // gọi hàm mới
  }

  getAvailableRooms() {
    this.roomStatusService.getAllRoomStatuses().subscribe((statuses: any[]) => {
      const emptyStatus = statuses.find(s => s.name === 'Đang trống');
      if (emptyStatus) {
        const availableRooms = emptyStatus.rooms;
        console.log('Phòng trống:', availableRooms);
      }
    });
  }

  getAllRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (res: any) => {
        this.rooms = res.data;
        this.filterRooms();
        console.log('Danh sách phòng:', this.rooms);
        console.log('Tất cả trạng thái phòng:', this.rooms.map(room => room.room_status_id));
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

  // lấy tất cả trạng thái
  getAllRoomStatuses(): void {
    this.roomStatusService.getAllRoomStatuses().subscribe({
      next: (res: any) => {
        this.roomStatuses = res.data;
      },
      error: (err: any) => {
        console.error('Lỗi khi lấy room status:', err);
      }
    });
  }


  // Hàm lấy tên trạng thái từ ID
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
    return features.map(f => f.feature_id).join(', ');
  }


  loadRooms() {
    this.getAllRooms();
  }

  viewRoomDetail(room: any) {
    this.selectedRoom = room;
    this.isRoomDetailOpen = true;

    this.bookingService.getBookedDates(room._id).subscribe((res: { data: string[] }) => {
      const events = res.data.map((dateStr: string) => ({
        title: 'Đã đặt',
        start: dateStr.split('T')[0],
        allDay: true,
        color: '#f87171' // đỏ
      }));

      this.calendarOptions = {
        ...this.calendarOptions,
        events
      };
    });
  }

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
    if (!this.newRoom.room_status_id) {
      alert("Vui lòng chọn trạng thái phòng.");
      return;
    }

    const payload = {
      name: this.newRoom.name,
      floor: this.newRoom.floor,
      room_class_id: this.newRoom.room_class_id,
      room_status_id: this.newRoom.room_status_id
    };

    this.roomService.addRoom(payload).subscribe({
      next: () => {
        this.closeAddRoomPopup();
        this.loadRooms(); // Reload lại danh sách phòng
      },
      error: (err) => {
        console.error('Lỗi khi thêm phòng:', err);
      }
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

  // lọc
  filterRooms() {
    this.filteredRooms = this.rooms.filter(room => {
      const matchStatus = this.filter.room_status_id ? room.room_status_id === this.filter.room_status_id : true;
      const matchClass = this.filter.room_class_id ? room.room_class_id === this.filter.room_class_id : true;
      const matchKeyword = this.filter.keyword ? room.name?.toLowerCase().includes(this.filter.keyword.toLowerCase()) : true;
      return matchStatus && matchClass && matchKeyword;
    });

    console.log('Kết quả lọc:', this.filteredRooms);
  }



  filterByDate() {
    const params: any = {};

    if (this.filter.check_in_date)
      params.check_in_date = new Date(this.filter.check_in_date).toISOString();

    if (this.filter.check_out_date)
      params.check_out_date = new Date(this.filter.check_out_date).toISOString();

    if (this.filter.room_status_id)
      params.room_status_id = this.filter.room_status_id;

    if (this.filter.room_class_id)
      params.room_class_id = this.filter.room_class_id;

    if (this.filter.keyword)
      params.keyword = this.filter.keyword;

    this.roomService.getRooms(params).subscribe({
      next: (res) => {
        this.filteredRooms = res.data;
        console.log('Phòng trống trong khoảng ngày:', this.filteredRooms);
      },
      error: (err) => {
        console.error('Lỗi khi lọc phòng trống:', err);
      },
    });
  }


}

