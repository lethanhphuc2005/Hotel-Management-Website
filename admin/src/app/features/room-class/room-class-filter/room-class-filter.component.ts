import { Feature } from '@/types/feature';
import { MainRoomClass } from '@/types/main-room-class';
import { RoomClassFilter } from '@/types/room-class';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-class-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './room-class-filter.component.html',
  styleUrl: './room-class-filter.component.scss',
})
export class RoomClassFilterComponent {
  @Input() filter: RoomClassFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    type: '',
    status: '',
    feature: '',
    minBed: 0,
    maxBed: 0,
    maxCapacity: 0,
    minCapacity: 0,
  };
  @Input() mainRoomClasses: MainRoomClass[] = [];
  @Input() features: Feature[] = [];
  @Output() filterChange = new EventEmitter<string>();
  @Output() openPopup = new EventEmitter<void>();
}
