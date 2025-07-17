import { Room } from '@/types/room';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-room-detail',
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.scss',
})
export class RoomDetailComponent {
  @Input() room: Room | null = null;
  @Input() isVisible: boolean = false;
  @Input() calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    height: 'auto',
    locale: 'vi',
  };
  @Output() close = new EventEmitter<void>();
}
