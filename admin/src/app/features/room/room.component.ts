import { Component, OnInit } from '@angular/core';
import { Room, RoomFilter, RoomRequest } from '../../types/room';
import { RoomService } from '../../core/services/room.service';
import { RoomStatusService } from '../../core/services/room-status.service';
import { RoomClassService } from '../../core/services/room-class.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ToastrService } from 'ngx-toastr';
import { RoomClass } from '../../types/room-class';
import { RoomStatus } from '../../types/status';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { RoomFilterComponent } from './room-filter/room-filter.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { RoomFormComponent } from './room-form/room-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    PaginationComponent,
    RoomFilterComponent,
    RoomListComponent,
    RoomDetailComponent,
    RoomFormComponent,
  ],
  standalone: true,
})
export class RoomComponent implements OnInit {
  rooms: Room[] = [];
  roomClasses: RoomClass[] = [];
  roomStatuses: RoomStatus[] = []; // Assuming you have a type for room statuses
  selectedRoom: Room | null = null;
  isDetailPopupOpen = false;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  statusFilterString: string = '';
  statusFilter: boolean | undefined = undefined;
  newRoom: RoomRequest = {
    name: '',
    floor: 0,
    room_class_id: '',
    room_status_id: '',
  };
  filter: RoomFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    type: '',
    status: '',
    check_in_date: undefined,
    check_out_date: undefined,
  };
  calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    height: 'auto',
    locale: 'vi',
  };
  constructor(
    private roomService: RoomService,
    private roomStatusService: RoomStatusService,
    private roomClassService: RoomClassService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.getAllRooms();
    this.getAllRoomClasses();
    this.getAllRoomStatuses();
  }

  getAllRooms(): void {
    this.roomService.getAllRooms(this.filter).subscribe({
      next: (res: any) => {
        this.rooms = res.data;
        this.filter.total = res.pagination.total;
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách phòng:', err);
        this.toastService.error(err.error?.message, 'Lỗi');
        this.rooms = [];
        this.filter.total = 0;
      },
    });
  }

  getAllRoomClasses(): void {
    this.roomClassService
      .getAllRoomClass({
        page: 1,
        limit: 100,
        total: 0,
        status: 'true',
        sort: 'createdAt',
        order: 'asc',
      })
      .subscribe({
        next: (res: any) => {
          this.roomClasses = res.data;
        },
        error: (err) => console.error('Lỗi khi lấy danh sách loại phòng:', err),
      });
  }

  getAllRoomStatuses(): void {
    this.roomStatusService.getAllRoomStatuses().subscribe({
      next: (res: any) => {
        this.roomStatuses = res.data;
      },
      error: (err) =>
        console.error('Lỗi khi lấy danh sách trạng thái phòng:', err),
    });
  }

  onFilterChange(): void {
    this.filter.page = 1; // Reset to first page on filter change
    this.getAllRooms();
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.getAllRooms();
  }

  onViewDetail(r: Room) {
    this.loadCalendarData(r.id);
    // Nếu không phải các phần tử loại trừ thì mở chi tiết
    this.selectedRoom = r;
    this.isDetailPopupOpen = true;
  }

  onOpenPopup(isAddForm: boolean, item?: Room): void {
    this.isAddPopupOpen = isAddForm;
    this.isEditPopupOpen = !isAddForm;

    if (isAddForm) {
      // Reset form thêm mới
      this.selectedRoom = null;
      this.newRoom = {
        room_class_id: '',
        room_status_id: '',
      };
    } else if (item) {
      // Mở form chỉnh sửa
      this.selectedRoom = item;
      this.newRoom = {
        name: item.name,
        floor: item.floor,
        room_class_id: item.room_class_id,
      };
    }
  }

  onClosePopup(): void {
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.isDetailPopupOpen = false;
    this.selectedRoom = null;
    this.newRoom = {
      name: '',
      floor: 0,
      room_class_id: '',
      room_status_id: '',
    };
  }

  onAddSubmit(): void {
    this.roomService.addRoom(this.newRoom).subscribe({
      next: (res: any) => {
        this.getAllRooms();
        this.onClosePopup();
        this.toastService.success('Thêm phòng thành công', 'Thành công');
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
    if (!this.selectedRoom) return;

    this.roomService.updateRoom(this.selectedRoom.id, this.newRoom).subscribe({
      next: (res: any) => {
        this.getAllRooms();
        this.onClosePopup();
        this.toastService.success('Cập nhật phòng thành công', 'Thành công');
      },
      error: (err) => {
        this.toastService.error(
          err.error?.message || err.message || err.statusText,
          'Lỗi'
        );
      },
    });
  }

  loadCalendarData(roomId: string) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    this.roomService.getBookingCalendar(roomId, year, month).subscribe({
      next: (res: any) => {
        const events = res.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          color: event.status?.code === 'CHECKED_IN' ? '#f87171' : '#34d399',
          allDay: true,
        }));

        this.calendarOptions = {
          ...this.calendarOptions,
          events,
        };
      },
      error: (err) => {
        console.error('Lỗi khi tải lịch đặt phòng:', err);
        this.calendarOptions = {
          ...this.calendarOptions,
          events: [],
        };
      },
    });
  }
}
