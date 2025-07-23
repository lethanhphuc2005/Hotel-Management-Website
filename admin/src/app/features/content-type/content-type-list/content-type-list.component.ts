import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { ContentType, ContentTypeFilter } from '@/types/content-type';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-content-type-list',
  imports: [CommonModule, FormatDatePipe],
  templateUrl: './content-type-list.component.html',
  styleUrl: './content-type-list.component.scss',
})
export class ContentTypeListComponent {
  @Input() contentTypes!: ContentType[];
  @Input() filter: ContentTypeFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    status: '',
  };
  @Output() toggleStatus = new EventEmitter<{
    $event: Event;
    contentType: ContentType;
  }>();
  @Output() openEdit = new EventEmitter<ContentType>();
  @Output() openDelete = new EventEmitter<string>();
}
