import { Room } from '@/types/room';
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
  @Input() rooms: Room[] = [];
  @Output() openPopup = new EventEmitter();
  @Output() viewDetail = new EventEmitter();
}
