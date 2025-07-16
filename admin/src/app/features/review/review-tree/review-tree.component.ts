import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { Review } from '@/types/review';

@Component({
  selector: 'app-review-tree',
  imports: [FormsModule, CommonModule, FormatDatePipe],
  templateUrl: './review-tree.component.html',
  styleUrl: './review-tree.component.css',
})
export class ReviewTreeComponent {
  @Input() reviews: Review[]  = [];
}
