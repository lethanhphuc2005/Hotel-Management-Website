import { Review, ReviewFilter } from '@/types/review';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './review-filter.component.html',
  styleUrl: './review-filter.component.scss',
})
export class ReviewFilterComponent {
  @Output() filterChange = new EventEmitter<string>();
  @Input() filter: ReviewFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    status: '',
    booking_id: '',
    user_id: '',
    employee_id: '',
    rating: 0,
  };
}
