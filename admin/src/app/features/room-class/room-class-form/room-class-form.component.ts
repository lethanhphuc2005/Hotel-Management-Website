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
  @Input() formData!: RoomClassRequest | RoomClass;
  @Input() features: Feature[] = [];
  @Input() mainRoomClasses: MainRoomClass[] = [];
  @Input() imagePreview: string[] | null = null;
  @Input() selectedFeatureIds: string[] = [];

  @Output() close = new EventEmitter();
  @Output() formSubmit = new EventEmitter();
  @Output() fileSelected = new EventEmitter<Event>();
  @Output() removeImage = new EventEmitter<{
    index: number;
    event: MouseEvent;
  }>();
  @Output() featureToggle = new EventEmitter();

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
