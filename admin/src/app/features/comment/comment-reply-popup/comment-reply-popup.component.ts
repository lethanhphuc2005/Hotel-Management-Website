import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment } from '@/types/comment';

@Component({
  selector: 'app-comment-reply-popup',
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-reply-popup.component.html',
  styleUrl: './comment-reply-popup.component.scss',
})
export class CommentReplyPopupComponent {
  content: string = '';
  @Input() comment: Comment | null = null;
  @Input() isVisible: boolean = false;
  @Input() replyContent: string = '';
  @Output() submitForm = new EventEmitter();
  @Output() close = new EventEmitter();

  onSubmit() {
    if (this.comment) {
      this.submitForm.emit({
        content: this.content,
        parent_id: this.comment.id,
        room_class_id: this.comment.room_class?.id,
      });
      this.content = '';
    }
  }
}
