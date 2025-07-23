import { RoomClass, RoomClassFilter } from '@/types/room-class';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-class-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './room-class-list.component.html',
  styleUrl: './room-class-list.component.scss',
})
export class RoomClassListComponent {
  @Input() roomClasses!: RoomClass[];
  @Input() filter: RoomClassFilter = {
    page: 1,
    limit: 10,
    total: 0,
  };
  @Output() toggleStatus = new EventEmitter<{
    $event: Event;
    rc: RoomClass;
  }>();
  @Output() openEdit = new EventEmitter<RoomClass>();
  @Output() openDetail = new EventEmitter<RoomClass>();
}
