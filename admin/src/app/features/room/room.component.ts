import { Component, OnInit, ViewChild } from '@angular/core';
import { Room, RoomFilter, RoomRequest } from '../../types/room';
import { RoomService } from '../../core/services/room.service';
import { RoomStatusService } from '../../core/services/room-status.service';
import { RoomClassService } from '../../core/services/room-class.service';
import {
  FullCalendarModule,
  FullCalendarComponent,
} from '@fullcalendar/angular';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

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
  roomStatuses: RoomStatus[] = [];
  selectedRoom: Room | null = null;
  isDetailPopupOpen = false;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  statusFilterString: string = '';
  statusFilter: boolean | undefined = undefined;

  private loadedMonths: Set<string> = new Set(); // ✅ Dùng Set để cache tháng/phòng đã tải

  @ViewChild('calendar') calendar!: FullCalendarComponent;

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

  // calendarOptions = {
  //   plugins: [dayGridPlugin, interactionPlugin],
  //   initialView: 'dayGridMonth',
  //   events: [],
  //   height: 'auto',
  //   locale: 'vi',
  //   datesSet: (arg: any) => {
  //     const start = new Date(arg.startStr);
  //     const year = start.getFullYear();
  //     const month = start.getMonth() + 1;
  //     if (this.selectedRoom?.id) {
  //       this.loadCalendarDataOnce(this.selectedRoom.id, year, month);
  //     }
  //   },
  // };

  private alreadyLoadedMonth: string | null = null;

  calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    initialDate: new Date(),
    events: [], // hiển thị tháng hiện tại
    height: 'auto',
    locale: 'vi',
    // Thêm debug để kiểm tra ngày tháng
    datesSet: (arg: any) => {
      console.log('🔍 Debug Calendar Dates:');
      console.log('arg.startStr:', arg.startStr);
      console.log('arg.endStr:', arg.endStr);

      // ✅ Lấy ngày giữa của view để xác định tháng chính xác
      const viewStart = new Date(arg.start);
      const viewEnd = new Date(arg.end);
      const middleDate = new Date(
        (viewStart.getTime() + viewEnd.getTime()) / 2
      );

      const year = middleDate.getFullYear();
      const month = middleDate.getMonth() + 1;

      console.log('📅 Middle date:', middleDate);
      console.log('📅 Actual month:', { year, month });

      const key = `${year}-${month}`;

      if (this.alreadyLoadedMonth === key) return;
      this.alreadyLoadedMonth = key;

      if (this.selectedRoom) {
        console.log('🚀 Loading calendar for:', {
          roomId: this.selectedRoom.id,
          year,
          month,
        });
        this.loadCalendarData(this.selectedRoom.id, year, month);
      }
    },
  };

  constructor(
    private roomService: RoomService,
    private roomStatusService: RoomStatusService,
    private roomClassService: RoomClassService,
    private toastService: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadInitialData();
    } catch (err) {
      console.error(err);
    } finally {
      this.spinner.hide();
    }
  }

  async loadInitialData() {
    await Promise.all([
      this.getAllRoomClasses(),
      this.getAllRoomStatuses(),
      this.getAllRooms(),
    ]);
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
        next: (res: any) => (this.roomClasses = res.data),
        error: (err) => console.error('Lỗi khi lấy danh sách loại phòng:', err),
      });
  }

  getAllRoomStatuses(): void {
    this.roomStatusService.getAllRoomStatuses().subscribe({
      next: (res: any) => (this.roomStatuses = res.data),
      error: (err) =>
        console.error('Lỗi khi lấy danh sách trạng thái phòng:', err),
    });
  }

  onFilterChange(): void {
    this.filter.page = 1;
    this.getAllRooms();
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.getAllRooms();
  }

  onViewDetail(r: Room) {
    this.selectedRoom = r;
    this.isDetailPopupOpen = true;
  }

  onOpenPopup(isAddForm: boolean, item?: Room): void {
    this.isAddPopupOpen = isAddForm;
    this.isEditPopupOpen = !isAddForm;

    if (isAddForm) {
      this.selectedRoom = null;
      this.newRoom = {
        room_class_id: '',
        room_status_id: '',
      };
    } else if (item) {
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
    this.alreadyLoadedMonth = null; // ✅ Reset cache khi đóng popup
    this.calendarOptions.events = []; // ✅ Reset calendar events
  }

  onAddSubmit(): void {
    this.spinner.show();
    this.roomService
      .addRoom(this.newRoom)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: () => {
          this.getAllRooms();
          this.onClosePopup();
          this.toastService.success('Thêm phòng thành công', 'Thành công');
        },
        error: (err) => {
          this.toastService.error(err.error?.message || err.message, 'Lỗi');
        },
      });
  }

  onEditSubmit(): void {
    if (!this.selectedRoom) return;
    this.spinner.show();
    this.roomService
      .updateRoom(this.selectedRoom.id, this.newRoom)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: () => {
          this.getAllRooms();
          this.onClosePopup();
          this.toastService.success('Cập nhật phòng thành công', 'Thành công');
        },
        error: (err) => {
          this.toastService.error(err.error?.message || err.message, 'Lỗi');
        },
      });
  }

  loadCalendarDataOnce(roomId: string, year: number, month: number) {
    const key = `${roomId}-${year}-${month}`;
    if (this.loadedMonths.has(key)) return;
    this.loadedMonths.add(key);
    this.loadCalendarData(roomId, year, month);
  }

  loadCalendarData(roomId: string, year: number, month: number) {
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
          events, // ✅ Cập nhật events an toàn
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
