import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Feature } from '../../../types/feature';
import { MainRoomClass } from '../../../types/main-room-class';
import { RoomClass, RoomClassRequest } from '../../../types/room-class';

@Component({
  selector: 'app-room-class-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-class-form.component.html',
  styleUrls: ['./room-class-form.component.scss'],
})
export class RoomClassFormComponent {
  @Input() isEdit = false;
  @Input() roomClass: RoomClassRequest = {};
  @Input() features: Feature[] = [];
  @Input() mainRoomClasses: MainRoomClass[] = [];
  @Input() imagePreview: string[] | null = null;
  @Input() selectedFeatureIds: string[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<Event>();
  @Output() removeImage = new EventEmitter<{
    index: number;
    event: MouseEvent;
  }>();
  @Output() featureToggle = new EventEmitter<{
    id: string;
    event: Event;
  }>();

  BED_CAPACITY: { [key: string]: number } = {
    đơn: 1,
    đôi: 2,
    queen: 2.25,
    king: 2.5,
  };

  ngOnInit() {
    this.autoUpdateCapacity();
  }

  autoUpdateCapacity() {
    // Cập nhật sức chứa khi thay đổi loại hoặc số giường
    setInterval(() => {
      if (
        !this.isEdit &&
        this.roomClass.bed &&
        this.roomClass.bed.type &&
        this.roomClass.bed.quantity !== undefined &&
        this.roomClass.bed.quantity >= 0
      ) {
        const perBed = this.BED_CAPACITY[this.roomClass.bed.type] || 1;
        this.roomClass.capacity = Math.round(
          perBed * this.roomClass.bed.quantity
        );
      }
    }, 300); // hoặc debounce tốt hơn nếu dùng RxJS
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.formSubmit.emit();
    }
  }

  onClose() {
    this.close.emit();
  }
  onFileChange(event: Event) {
    this.fileSelected.emit(event);
  }

  onRemoveImage(index: number, event: MouseEvent) {
    this.removeImage.emit({ index, event });
  }

  onToggleFeature(id: string, event: Event) {
    this.featureToggle.emit({ id, event });
  }

  isFeatureChecked(id: string): boolean {
    return this.selectedFeatureIds.includes(id);
  }
}
