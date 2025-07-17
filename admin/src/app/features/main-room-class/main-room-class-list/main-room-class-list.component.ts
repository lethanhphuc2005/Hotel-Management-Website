import { ImageHelperService } from '@/shared/services/image-helper.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { MainRoomClass } from '@/types/main-room-class';

@Component({
  selector: 'app-main-room-class-list',
  imports: [CommonModule, FormatDatePipe],
  templateUrl: './main-room-class-list.component.html',
  styleUrl: './main-room-class-list.component.scss',
})
export class MainRoomClassListComponent {
  @Input() mainRoomClasses: MainRoomClass[] = [];
  @Input() filter: any;
  @Output() toggleStatus = new EventEmitter();
  @Output() openEdit = new EventEmitter();
  @Output() openDetail = new EventEmitter();

  constructor(private imageHelper: ImageHelperService) {}

  getImageUrl(imagePath: string): string {
    return this.imageHelper.getImageUrl(imagePath);
  }
}
