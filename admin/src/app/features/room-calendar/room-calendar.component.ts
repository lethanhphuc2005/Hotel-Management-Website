import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-room-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './room-calendar.component.html',
  styleUrls: ['./room-calendar.component.css'],
})
export class RoomCalendarComponent implements OnChanges {
  @Input() roomId!: string;

  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    height: 'auto',
    locale: 'vi',
  };

  constructor(private roomService: RoomService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['roomId'] && this.roomId) {
      this.loadCalendarData();
    }
  }

  loadCalendarData() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    this.roomService.getBookingCalendar(this.roomId, year, month).subscribe({
      next: (res: any) => {
        const events = res.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          color: event.status?.code === 'CHECKED_IN' ? '#34d399' : '#f87171',
        }));

        this.calendarOptions = {
          ...this.calendarOptions,
          events,
        };
      },
      error: (err) => {
        console.error('Lỗi khi tải calendar:', err);
      },
    });
  }
}
