import { Room, RoomFilter } from '@/types/room';
import { RoomClass } from '@/types/room-class';
import { RoomStatus } from '@/types/status';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './room-filter.component.html',
  styleUrl: './room-filter.component.scss',
})
export class RoomFilterComponent {
  @Input() filter: RoomFilter = {
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
  @Input() roomClasses: RoomClass[] = [];
  @Input() roomStatuses: RoomStatus[] = [];
  @Output() openPopup = new EventEmitter<Room>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() resetFilter = new EventEmitter<void>();
}
