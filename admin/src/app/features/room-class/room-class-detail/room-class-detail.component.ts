import { RoomClass } from '@/types/room-class';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-class-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './room-class-detail.component.html',
  styleUrl: './room-class-detail.component.scss',
})
export class RoomClassDetailComponent {
  @Input() roomClass!: RoomClass;
  @Output() closePopup = new EventEmitter<void>();

  constructor() {}
}
