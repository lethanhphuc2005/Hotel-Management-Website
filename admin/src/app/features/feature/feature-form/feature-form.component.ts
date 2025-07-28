import { FeatureRequest } from '@/types/feature';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feature-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './feature-form.component.html',
  styleUrl: './feature-form.component.scss',
})
export class FeatureFormComponent {
  @Input() feature: FeatureRequest = {};
  @Input() isEdit: boolean = false;
  @Input() imagePreview: string | null = null;
  @Output() submitForm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();

  constructor() {}

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileSelected.emit(input.files[0]);
    }
  }
}
