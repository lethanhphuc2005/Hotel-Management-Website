import { Room, RoomFilter } from '@/types/room';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss',
})
export class RoomListComponent {
  @Input() rooms!: Room[];
  @Input() filter: RoomFilter = {
    page: 1,
    limit: 10,
    total: 0,
  };
  @Output() openPopup = new EventEmitter<Room>();
  @Output() viewDetail = new EventEmitter<Room>();
}
