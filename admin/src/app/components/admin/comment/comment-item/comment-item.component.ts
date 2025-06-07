import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-item',
  standalone: true, // nếu bạn đang dùng standalone component
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.css'],
  imports: [CommonModule] // ✅ THÊM DÒNG NÀY
})
export class CommentItemComponent {
  @Input() comment: any;
  @Input() index: number = 0;
  @Input() level: number = 0;
  @Input() onViewComment!: (comment: any, isReply: boolean) => void;

  viewComment(comment: any) {
    this.onViewComment(comment, this.level > 0); 
  }

  deleteComment(id: string) {
    console.log('Xóa:', id);
  }
}
