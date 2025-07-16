import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-content-type-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './content-type-filter.component.html',
  styleUrl: './content-type-filter.component.scss',
})
export class ContentTypeFilterComponent {
  @Output() filterChange = new EventEmitter();
  @Output() openAdd = new EventEmitter();
  @Input() filter: any;
}
