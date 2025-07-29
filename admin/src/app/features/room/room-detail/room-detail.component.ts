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
  @Input() room!: Room;
  @Input() calendarOptions: any = {};
  @Output() close = new EventEmitter<void>();
}
