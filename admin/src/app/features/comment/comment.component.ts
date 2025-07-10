import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../core/services/comment.service';
import { CommentItemComponent } from "./comment-item/comment-item.component";
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  imports: [CommonModule, CommentItemComponent, RouterModule, HttpClientModule, FormsModule],
})
export class CommentComponent implements OnInit {
  constructor(private commentService: CommentService) { }
  comments: any[] = [];
  searchKeyword: string = '';
  filteredComments: any[] = [];


  ngOnInit() {
    this.getAll();
  }

getAll() {
  this.commentService.getAllComments().subscribe((res: any) => {
    console.log('API trả về:', res);
    this.comments = res.data || [];
    this.filteredComments = [...this.comments];
  });
}


  // popup xem
  selectedComment: any = null;
  isDetailPopupOpen = false;

  viewComment(comment: any) {
    this.selectedComment = {
      ...comment,
      replies: comment.parent_comment || [],
      isReplyOnly: !!comment.parent_id
    };
    this.isDetailPopupOpen = true;
  }

  onSearch() {
    const keyword = this.searchKeyword?.toLowerCase().trim() || '';

    this.filteredComments = this.comments.filter((comment) => {
      const name =
        (comment.user_id?.last_name + ' ' + comment.user_id?.first_name) ||
        (comment.employee_id?.last_name + ' ' + comment.employee_id?.first_name) || '';
      const email = comment.user_id?.email || comment.employee_id?.email || '';
      const content = comment.content || '';

      return (
        name.toLowerCase().includes(keyword) ||
        email.toLowerCase().includes(keyword) ||
        content.toLowerCase().includes(keyword)
      );
    });
  }



}
