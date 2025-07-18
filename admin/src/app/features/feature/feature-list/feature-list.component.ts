import { ImageHelperService } from '@/shared/services/image-helper.service';
import { Feature } from '@/types/feature';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feature-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './feature-list.component.html',
  styleUrl: './feature-list.component.scss',
})
export class FeatureListComponent {
  @Input() features: Feature[] = [];
  @Input() filter: any;
  @Output() toggleStatus = new EventEmitter();
  @Output() openEdit = new EventEmitter();
  @Output() viewDetail = new EventEmitter();

  constructor(private imageHelper: ImageHelperService) {}

  getImageUrl(imagePath: string): string {
    return this.imageHelper.getImageUrl(imagePath);
  }
}
