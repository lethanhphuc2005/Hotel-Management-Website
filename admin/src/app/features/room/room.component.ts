import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Room, RoomRequest } from '../../types/room';
import { RoomService } from '../../core/services/room.service';
import { RoomStatusService } from '../../core/services/room-status.service';
import { FormsModule } from '@angular/forms';
import { RoomClassService } from '../../core/services/room-class.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ToastrService } from 'ngx-toastr';
import { RoomClass } from '../../types/room-class';
import { RoomStatus } from '../../types/status';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-room-list',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  imports: [RouterModule, CommonModule, FormsModule, FullCalendarModule, PaginationComponent],
  standalone: true,
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  roomClasses: RoomClass[] = [];
  roomStatuses: RoomStatus[] = []; // Assuming you have a type for room statuses
  selectedRoom: Room | null = null;
  isDetailPopupOpen = false;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  statusFilterString: string = '';
  statusFilter: boolean | undefined = undefined;
  newRoom: RoomRequest = {};
  filter: {
    keyword: string;
    check_in_date?: string;
    check_out_date?: string;
    total: number;
    page: number;
    limit: number;
    type: string;
    status: string;
    sortField: string;
    sortOrder: 'asc' | 'desc';
  } = {
    keyword: '',
    check_in_date: undefined,
    check_out_date: undefined,
    total: 0,
    page: 1,
    limit: 10,
    type: '',
    status: '',
    sortField: 'createdAt',
    sortOrder: 'desc',
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
    this.roomService
      .getAllRooms({
        search: this.filter.keyword,
        page: this.filter.page,
        limit: this.filter.limit,
        sort: this.filter.sortField,
        order: this.filter.sortOrder,
        type: this.filter.type,
        status: this.filter.status,
        check_in_date: this.filter.check_in_date,
        check_out_date: this.filter.check_out_date,
      })
      .subscribe({
        next: (res: any) => {
          this.rooms = res.data;
          this.filter.total = res.pagination.total;
        },
        error: (err) => {
          console.error('Lỗi khi lấy danh sách phòng:', err);
          this.toastService.error(
            err.error?.message || err.message || err.statusText,
            'Lỗi'
          );
          this.rooms = [];
          this.filter.total = 0;
        },
      });
  }

  getAllRoomClasses(): void {
    this.roomClassService
      .getAllRoomClass({
        page: 1,
        limit: 100, // Lấy tất cả loại phòng
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

  onViewDetail(event: MouseEvent, r: Room) {
    const target = event.target as HTMLElement;

    if (
      target.closest('label.switch') || // 👉 kiểm tra phần tử (hoặc con của) label.switch
      target.closest('button') ||
      target.closest('input')
    ) {
      return;
    }
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
        name: '',
        floor: 0,
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
  }

  onAddSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.newRoom.name || '');
    formData.append(
      'floor',
      this.newRoom.floor ? this.newRoom.floor.toString() : '0'
    );
    formData.append('room_class_id', this.newRoom.room_class_id || '');
    formData.append('room_status_id', this.newRoom.room_status_id || '');

    this.roomService.addRoom(formData).subscribe({
      next: (res: any) => {
        this.getAllRooms();
        this.isAddPopupOpen = false;
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

    const formData = new FormData();
    formData.append('name', this.selectedRoom.name || '');
    formData.append(
      'floor',
      this.selectedRoom.floor ? this.selectedRoom.floor.toString() : '0'
    );
    formData.append('room_class_id', this.selectedRoom.room_class_id || '');
    formData.append('room_status_id', this.selectedRoom.room_status_id || '');

    this.roomService
      .updateRoom(this.selectedRoom.id ?? '', formData)
      .subscribe({
        next: (res: any) => {
          this.getAllRooms();
          this.isEditPopupOpen = false;
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
          events: [], // fallback
        };
      },
    });
  }
}
