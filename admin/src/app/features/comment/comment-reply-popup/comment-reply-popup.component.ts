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
  @Input() comment!: Comment;
  @Input() replyContent: string = '';
  @Output() submitForm = new EventEmitter<{
    content: string;
    parent_id: string;
    room_class_id: string;
  }>();
  @Output() close = new EventEmitter<void>();

  onSubmit() {
    this.submitForm.emit({
      content: this.content,
      parent_id: this.comment.id,
      room_class_id: this.comment.room_class.id,
    });
    this.content = '';
  }
}
