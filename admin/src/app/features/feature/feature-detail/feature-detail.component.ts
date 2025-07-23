import { ImageHelperService } from '@/shared/services/image-helper.service';
import { Feature } from '@/types/feature';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feature-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './feature-detail.component.html',
  styleUrl: './feature-detail.component.scss'
})
export class FeatureDetailComponent {
  @Input() feature!: Feature;
  @Output() close = new EventEmitter<void>();

  constructor(
    private imageHelper: ImageHelperService
  ) {}

  getImageUrl(imagePath: string): string {
    return this.imageHelper.getImageUrl(imagePath);
  }
}
