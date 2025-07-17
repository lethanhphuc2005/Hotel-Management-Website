import { Feature } from '@/types/feature';
import { MainRoomClass } from '@/types/main-room-class';
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
  @Input() filter: any;
  @Input() mainRoomClasses: MainRoomClass[] = [];
  @Input() features: Feature[] = [];
  @Output() filterChange = new EventEmitter<any>();
  @Output() openPopup = new EventEmitter<void>();
}
