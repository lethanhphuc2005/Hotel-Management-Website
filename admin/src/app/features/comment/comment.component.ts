import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommentService } from '@/core/services/comment.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Comment, CommentRequest } from '@/types/comment';
import { CommonFilterBarComponent } from '@/shared/components/common-filter-bar/common-filter-bar.component';
import { ToastrService } from 'ngx-toastr';
import { buildCommentTree } from '@/shared/utils/reply.utils';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentDetailPopupComponent } from './comment-detail-popup/comment-detail-popup.component';
import { CommentReplyPopupComponent } from './comment-reply-popup/comment-reply-popup.component';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CommonFilterBarComponent,
    CommentListComponent,
    CommentDetailPopupComponent,
    CommentReplyPopupComponent,
    PaginationComponent
  ],
})
export class CommentComponent implements OnInit {
  comments: Comment[] = [];
  commentsTree: Comment[] = [];
  userComments: Comment[] = [];
  selectedComment: Comment | null = null;
  isDetailPopupOpen = false;
  isReplyPopupOn = false;
  newComment: CommentRequest = {
    room_class_id: '',
    parent_id: undefined,
    employee_id: undefined,
    content: '',
    status: true,
  };
  filter: {
    keyword: string;
    page: number;
    limit: number;
    sortField: string;
    sortOrder: 'asc' | 'desc';
    total: number;
    status: string;
    room_class: string;
  } = {
    keyword: '',
    page: 1,
    limit: 10,
    sortField: 'createdAt',
    sortOrder: 'desc',
    total: 0,
    status: '',
    room_class: '',
  };

  constructor(
    private commentService: CommentService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAllComments();
  }

  getEmployeeId(): string {
    const user = JSON.parse(localStorage.getItem('login') || '{}');
    console.log('Current user:', user);
    return user?.id || '';
  }

  loadAllComments(): void {
    this.commentService
      .getAllComments({
        search: this.filter.keyword,
        page: this.filter.page,
        limit: this.filter.limit,
        sort: this.filter.sortField,
        order: this.filter.sortOrder,
        status: this.filter.status,
        room_class: this.filter.room_class,
      })
      .subscribe({
        next: (response) => {
          this.comments = response.data;
          this.filter.total = response.pagination.total;
          this.commentsTree = buildCommentTree(this.comments);
          this.userComments = this.comments.filter(
            (comment) => !!comment.user_id
          );
        },
        error: (error) => {
          console.error('Error loading comments:', error);
          this.toastService.error(
            error.error?.message || 'Failed to load comments',
            'Error'
          );
          this.comments = [];
          this.userComments = [];
        },
      });
  }

  findCommentWithChildren(tree: Comment[], id: string): Comment | null {
    for (const node of tree) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = this.findCommentWithChildren(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.loadAllComments();
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sortField = sortField;
      this.filter.sortOrder = this.filter.sortOrder === 'asc' ? 'desc' : 'asc';
    }
    this.filter.page = 1; // Reset to first page on filter change
    this.loadAllComments();
  }

  onPopupOpen(isDetail: boolean, comment: Comment): void {
    if (isDetail) {
      this.selectedComment = this.findCommentWithChildren(
        this.commentsTree,
        comment.id
      );
      this.isDetailPopupOpen = true;
    } else {
      this.selectedComment = comment;
      this.isReplyPopupOn = true;
    }
  }

  onClosePopup(): void {
    this.isDetailPopupOpen = false;
    this.isReplyPopupOn = false;
    this.selectedComment = null;
  }

  onToggleChange(event: Event, comment: Comment): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.commentService.toggleCommentStatus(comment.id).subscribe({
      next: () => {
        comment.status = isChecked;
        this.toastService.success(
          'Cập nhật trạng thái thành công',
          'Thành công'
        );
      },
      error: (error) => {
        console.error('Error updating comment status:', error);
        this.toastService.error(
          error.error?.message || 'Cập nhật trạng thái thất bại',
          'Lỗi'
        );
      },
    });
  }

  onReplySubmit({
    content,
    room_class_id,
    parent_id,
  }: {
    content: string;
    room_class_id: string;
    parent_id: string;
  }): void {
    if (!this.selectedComment) {
      this.toastService.error('Vui lòng chọn bình luận để trả lời', 'Lỗi');
      return;
    }
    const formData = new FormData();
    formData.append('room_class_id', room_class_id);
    formData.append('parent_id', parent_id);
    formData.append('employee_id', this.getEmployeeId());
    formData.append('content', content);
    formData.append('status', true as any);
    this.commentService.createComment(formData).subscribe({
      next: (response) => {
        this.toastService.success('Phản hồi thành công', 'Thành công');
        this.isReplyPopupOn = false;
        this.loadAllComments();
      },
      error: (error) => {
        console.error('Error submitting reply:', error);
        this.toastService.error(
          error.error?.message || 'Phản hồi thất bại',
          'Lỗi'
        );
      },
    });
  }
}
