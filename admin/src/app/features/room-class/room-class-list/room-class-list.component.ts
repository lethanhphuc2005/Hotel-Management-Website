import { RoomClass } from '@/types/room-class';
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
  @Input() roomClasses: RoomClass[] = [];
  @Input() filter: any;
  @Output() toggleStatus = new EventEmitter();
  @Output() openEdit = new EventEmitter();
  @Output() openDetail = new EventEmitter();
}
