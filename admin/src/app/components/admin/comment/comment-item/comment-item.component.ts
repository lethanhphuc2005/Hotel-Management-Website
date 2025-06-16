import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../../../services/comment.service'; // đường dẫn có thể cần điều chỉnh

@Component({
  selector: 'app-comment-item',
  standalone: true,
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss'],
  imports: [CommonModule]
})
export class CommentItemComponent {
  @Input() comment: any;
  @Input() index: number = 0;
  @Input() level: number = 0;
  @Input() onViewComment!: (comment: any, isReply: boolean) => void;

  constructor(private commentService: CommentService) {}

  viewComment(comment: any) {
    this.onViewComment(comment, this.level > 0);
  }

  deleteComment(id: string) {
    console.log('Xóa:', id);
  }

toggleStatus(comment: any) {
  this.commentService.toggleStatus(comment._id).subscribe({
    next: (res: any) => {
      comment.status = !comment.status; // Cập nhật tại chỗ
      alert('Cập nhật trạng thái thành công!');
    },
    error: (err: any) => {
      console.error('Lỗi cập nhật trạng thái bình luận:', err);
      alert('Không thể cập nhật trạng thái. Vui lòng thử lại!');
    }
  });
}

}
