import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment } from '@/types/comment';
import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { CommentTreeComponent } from '../comment-tree/comment-tree.component';

@Component({
  selector: 'app-comment-detail-popup',
  imports: [CommonModule, FormsModule, FormatDatePipe, CommentTreeComponent],
  templateUrl: './comment-detail-popup.component.html',
  styleUrl: './comment-detail-popup.component.scss',
})
export class CommentDetailPopupComponent {
  @Input() comment!: Comment;
  @Output() closePopup = new EventEmitter<void>();
}
