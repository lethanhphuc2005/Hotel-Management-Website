import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment, CommentFilter } from '@/types/comment';

@Component({
  selector: 'app-comment-list',
  imports: [FormatDatePipe, CommonModule, FormsModule],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss',
})
export class CommentListComponent {
  @Input() comments!: Comment[];
  @Input() filter: CommentFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    status: '',
    room_class: '',
  };
  @Output() toggleChange = new EventEmitter<{
    $event: Event;
    comment: Comment;
  }>();
  @Output() viewDetail = new EventEmitter<Comment>();
  @Output() viewReplyPopup = new EventEmitter<Comment>();
}
