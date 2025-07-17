import { RoomClass } from '@/types/room-class';
import { RoomStatus } from '@/types/status';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './room-filter.component.html',
  styleUrl: './room-filter.component.scss'
})
export class RoomFilterComponent {
  @Input() filter: any;
  @Input() roomClasses: RoomClass[] = [];
  @Input() roomStatuses: RoomStatus[] = [];
  @Output() openPopup = new EventEmitter();
  @Output() filterChange = new EventEmitter();
  @Output() resetFilter = new EventEmitter();
}
