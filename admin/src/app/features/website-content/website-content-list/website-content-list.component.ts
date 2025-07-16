import { ImageHelperService } from '@/shared/services/image-helper.service';
import { WebsiteContent } from '@/types/website-content';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';

@Component({
  selector: 'app-website-content-list',
  imports: [CommonModule, FormatDatePipe],
  templateUrl: './website-content-list.component.html',
  styleUrl: './website-content-list.component.scss',
})
export class WebsiteContentListComponent {
  @Input() websiteContents: WebsiteContent[] = [];
  @Input() filter: any;
  @Output() toggleStatus = new EventEmitter();
  @Output() openEdit = new EventEmitter();
  @Output() openDelete = new EventEmitter();

  constructor(private imageHelper: ImageHelperService) {}

  getImageUrl(imagePath: string): string {
    return this.imageHelper.getImageUrl(imagePath);
  }
}
