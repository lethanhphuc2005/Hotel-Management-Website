import { ImageHelperService } from '@/shared/services/image-helper.service';
import { RoomClass } from '@/types/room-class';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-class-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './room-class-detail.component.html',
  styleUrl: './room-class-detail.component.scss'
})
export class RoomClassDetailComponent {
  @Input() isVisible: boolean = false;
  @Input() roomClass: RoomClass | null = null;
  @Output() closePopup = new EventEmitter();

  constructor(
    private imageHelperService: ImageHelperService,
  ) {}

  getImageUrl(imagePath: string): string {
    return this.imageHelperService.getImageUrl(imagePath);
  }
}
