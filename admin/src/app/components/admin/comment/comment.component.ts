import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { CommentItemComponent } from "./comment-item/comment-item.component";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
  imports: [CommonModule, CommentItemComponent]
})
export class CommentComponent implements OnInit {
  constructor(private commentService: CommentService) { }
  comments: any[] = [];

ngOnInit() {
  this.getAll();
}

getAll() {
  this.commentService.getAllComments().subscribe((res: any) => {
    console.log('API trả về:', res);
    this.comments = res.data || res;
  });
}


viewComment(comment: any) {
  console.log('Xem:', comment);
}

editComment(comment: any) {
  console.log('Sửa:', comment);
}

deleteComment(id: string) {
  if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
    this.commentService.deleteComment(id).subscribe(() => {
      this.getAll(); // Cập nhật lại danh sách
    });
  }
}


}
