import { FilterParams } from '@/types/_common';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-common-filter-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './common-filter-bar.component.html',
  styleUrl: './common-filter-bar.component.scss',
})
export class CommonFilterBarComponent {
  @Output() filterChange = new EventEmitter();
  @Output() openAdd = new EventEmitter();
  @Input() filter: FilterParams = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: '',
    order: 'asc',
  };
  @Input() label: string = '';
}
