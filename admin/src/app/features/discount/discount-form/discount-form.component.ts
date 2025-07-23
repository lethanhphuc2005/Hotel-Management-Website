import { ImageHelperService } from '@/shared/services/image-helper.service';
import { DiscountRequest } from '@/types/discount';
import { RoomClass } from '@/types/room-class';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-discount-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './discount-form.component.html',
  styleUrl: './discount-form.component.scss',
})
export class DiscountFormComponent {
  @Input() discount: DiscountRequest = {
    conditions: {},
    apply_to_room_class_ids: [] as string[],
  };
  @Input() roomClasses: RoomClass[] = [];
  @Input() isEdit: boolean = false;
  @Input() imagePreview: string | null = null;
  @Output() submitForm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();

  constructor(private imageHelperService: ImageHelperService) {}

  ngOnInit() {}

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileSelected.emit(input.files[0]);
    }
  }

  getImageUrl(image: string | File): string {
    return this.imageHelperService.getImageUrl(image);
  }

  formatDateForInput(date?: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onDateChange(event: string, field: 'valid_from' | 'valid_to') {
    // Convert string (yyyy-MM-dd) to Date
    this.discount[field] = new Date(event);
  }

  onRoomClassCheckboxChange(event: Event, roomClassId: string) {
    const checked = (event.target as HTMLInputElement).checked;
    const ids = this.discount.apply_to_room_class_ids ?? [];
    if (checked) {
      if (!ids.includes(roomClassId)) {
        ids.push(roomClassId);
      }
    } else {
      const index = ids.indexOf(roomClassId);
      if (index !== -1) {
        ids.splice(index, 1);
      }
    }
    this.discount.apply_to_room_class_ids = [...ids]; // force change detection
  }
}
