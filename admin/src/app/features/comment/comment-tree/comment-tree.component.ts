import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment } from '@/types/comment';
import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';

@Component({
  selector: 'app-comment-tree',
  imports: [FormsModule, CommonModule, FormatDatePipe],
  templateUrl: './comment-tree.component.html',
  styleUrl: './comment-tree.component.css',
})
export class CommentTreeComponent {
  @Input() comments: Comment[] = [];
}
