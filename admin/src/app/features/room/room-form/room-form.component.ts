import { Room } from '@/types/room';
import { RoomClass } from '@/types/room-class';
import { RoomStatus } from '@/types/status';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.scss'
})
export class RoomFormComponent {
  @Input() isVisible: boolean = false;
  @Input() isEdit: boolean = false;
  @Input() room: any | null = null
  @Input() roomClasses: RoomClass[] = [];
  @Input() roomStatuses: RoomStatus[] = [];
  @Output() formSubmit = new EventEmitter();
  @Output() close = new EventEmitter();
}
