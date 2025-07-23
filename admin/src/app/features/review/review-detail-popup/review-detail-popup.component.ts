import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { ReviewTreeComponent } from '../review-tree/review-tree.component';
import { Review } from '@/types/review';

@Component({
  selector: 'app-review-detail-popup',
  imports: [CommonModule, FormsModule, FormatDatePipe, ReviewTreeComponent],
  templateUrl: './review-detail-popup.component.html',
  styleUrl: './review-detail-popup.component.scss',
})

export class ReviewDetailPopupComponent {
  @Input() review!: Review;
  @Output() closePopup = new EventEmitter<void>();
}
