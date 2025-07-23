import { DiscountFilter } from '@/types/discount';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-discount-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './discount-filter.component.html',
  styleUrl: './discount-filter.component.scss',
})
export class DiscountFilterComponent {
  @Output() filterChange = new EventEmitter<string>();
  @Output() openAdd = new EventEmitter<void>();
  @Input() filter: DiscountFilter = {
    search: '',
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
    status: '',
    total: 0,
    type: '',
    value_type: '',
    valid_from: undefined,
    valid_to: undefined,
    priority: undefined,
    apply_to: '',
    min_advance_days: undefined,
    max_advance_days: undefined,
    min_stay_nights: undefined,
    max_stay_nights: undefined,
    min_rooms: undefined,
    user_level: '',
  };
}
