import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment } from '@/types/comment';

@Component({
  selector: 'app-comment-list',
  imports: [FormatDatePipe, CommonModule, FormsModule],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss',
})
export class CommentListComponent {
  @Input() comments: Comment[] = [];
  @Input() filter: any;
  @Output() toggleChange = new EventEmitter<{
    $event: Event;
    comment: Comment;
  }>();
  @Output() viewDetail = new EventEmitter();
  @Output() viewReplyPopup = new EventEmitter<Comment>();
}
