import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { Review, ReviewFilter } from '@/types/review';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-list',
  imports: [FormatDatePipe, CommonModule, FormsModule],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss',
})
export class ReviewListComponent {
  @Input() reviews: Review[] = [];
  @Input() filter: ReviewFilter = {
    page: 1,
    limit: 10,
    total: 0,
  };
  @Output() toggleChange = new EventEmitter<{
    $event: Event;
    review: Review;
  }>();
  @Output() viewDetail = new EventEmitter<Review>();
  @Output() viewReplyPopup = new EventEmitter<Review>();
}
