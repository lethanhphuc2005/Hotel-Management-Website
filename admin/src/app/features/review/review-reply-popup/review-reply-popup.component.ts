import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Review } from '@/types/review';

@Component({
  selector: 'app-review-reply-popup',
  imports: [CommonModule, FormsModule],
  templateUrl: './review-reply-popup.component.html',
  styleUrl: './review-reply-popup.component.scss',
})
export class ReviewReplyPopupComponent {
  content: string = '';
  @Input() review: Review | null = null;
  @Input() isVisible: boolean = false;
  @Input() replyContent: string = '';
  @Output() submitForm = new EventEmitter();
  @Output() close = new EventEmitter();

  onSubmit() {
    if (this.review) {
      this.submitForm.emit({
        content: this.content,
        parent_id: this.review.id,
        room_class_id: this.review.room_class_id.id,
        booking_id: this.review.booking_id.id,
      });
      this.content = '';
    }
  }
}
