import { ContentType } from '@/types/content-type';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-content-type-list',
  imports: [CommonModule],
  templateUrl: './content-type-list.component.html',
  styleUrl: './content-type-list.component.scss',
})
export class ContentTypeListComponent {
  @Input() contentTypes: ContentType[] = [];
  @Input() filter: any;
  @Output() toggleStatus = new EventEmitter();
  @Output() openEdit = new EventEmitter();
  @Output() openDelete = new EventEmitter();
}
