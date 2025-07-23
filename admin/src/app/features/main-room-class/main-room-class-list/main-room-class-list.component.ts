import { ImageHelperService } from '@/shared/services/image-helper.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { MainRoomClass, MainRoomClassFilter } from '@/types/main-room-class';

@Component({
  selector: 'app-main-room-class-list',
  imports: [CommonModule, FormatDatePipe],
  templateUrl: './main-room-class-list.component.html',
  styleUrl: './main-room-class-list.component.scss',
})
export class MainRoomClassListComponent {
  @Input() mainRoomClasses: MainRoomClass[] = [];
  @Input() filter: MainRoomClassFilter = {
    page: 1,
    limit: 10,
    total: 0,
  };
  @Output() toggleStatus = new EventEmitter<{
    $event: Event;
    mainRoomClass: MainRoomClass;
  }>();
  @Output() openEdit = new EventEmitter<MainRoomClass>();
  @Output() openDetail = new EventEmitter<MainRoomClass>();

  constructor(private imageHelper: ImageHelperService) {}

  getImageUrl(imagePath: string): string {
    return this.imageHelper.getImageUrl(imagePath);
  }
}
