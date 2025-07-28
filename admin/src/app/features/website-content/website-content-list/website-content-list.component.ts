import { WebsiteContent, WebsiteContentFilter } from '@/types/website-content';
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
  @Input() websiteContents!: WebsiteContent[];
  @Input() filter: WebsiteContentFilter = {
    page: 1,
    limit: 10,
    total: 0,
  };
  @Output() toggleStatus = new EventEmitter<{
    $event: Event;
    content: WebsiteContent;
  }>();
  @Output() openEdit = new EventEmitter<WebsiteContent>();
  @Output() openDelete = new EventEmitter<string>();

  constructor() {}

}
