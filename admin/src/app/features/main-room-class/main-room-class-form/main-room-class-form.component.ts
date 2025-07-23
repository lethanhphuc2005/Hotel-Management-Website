import { ImageHelperService } from '@/shared/services/image-helper.service';
import { MainRoomClassRequest } from '@/types/main-room-class';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-room-class-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './main-room-class-form.component.html',
  styleUrl: './main-room-class-form.component.scss',
})
export class MainRoomClassFormComponent {
  @Input() mainRoomClass: MainRoomClassRequest = {};
  @Input() isEdit: boolean = false;
  @Input() imagePreview: string | null = null;
  @Output() submitForm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();

  constructor(private imageHelperService: ImageHelperService) {}

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileSelected.emit(input.files[0]);
    }
  }

  getImageUrl(image: string | File): string {
    return this.imageHelperService.getImageUrl(image);
  }
}
