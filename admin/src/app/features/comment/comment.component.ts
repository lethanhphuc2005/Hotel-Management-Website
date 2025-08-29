import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommentService } from '@/core/services/comment.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Comment, CommentFilter, CommentRequest } from '@/types/comment';
import { CommonFilterBarComponent } from '@/shared/components/common-filter-bar/common-filter-bar.component';
import { ToastrService } from 'ngx-toastr';
import { buildCommentTree } from '@/shared/utils/reply.utils';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentDetailPopupComponent } from './comment-detail-popup/comment-detail-popup.component';
import { CommentReplyPopupComponent } from './comment-reply-popup/comment-reply-popup.component';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { EmployeeService } from '@/core/services/employee.service';

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
    PaginationComponent,
  ],
})
export class CommentComponent implements OnInit {
  comments: Comment[] = [];
  commentsTree: Comment[] = [];
  userComments: Comment[] = [];
  selectedComment: Comment | null = null;
  isDetailPopupOpen = false;
  isReplyPopupOn = false;
  employeeId: string | null = null;
  filter: CommentFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    status: '',
    room_class: '',
  };
  newComment: CommentRequest = {
    content: '',
    room_class_id: '',
    parent_id: '',
    employee_id: '',
  };

  constructor(
    private commentService: CommentService,
    private employeeService: EmployeeService,
    private toastService: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadInitialData();
    } catch (err) {
      console.error(err);
    } finally {
      this.spinner.hide();
    }
  }

  async loadInitialData() {
    await Promise.all([this.loadAllComments(), this.loadEmployeeId()]);
  }

  loadEmployeeId() {
    this.employeeService.getCurrentEmployee().subscribe({
      next: (response) => {
        this.employeeId = response.data.id;
      },
      error: (error) => {
        console.error('Error loading employee data:', error);
        this.toastService.error(
          error.error?.message || 'Failed to load employee data',
          'Error'
        );
      },
    });
  }

  loadAllComments(): void {
    this.commentService.getAllComments(this.filter).subscribe({
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
      this.filter.sort = sortField;
      this.filter.order = this.filter.order === 'asc' ? 'desc' : 'asc';
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
    this.newComment = {
      content: '',
      room_class_id: '',
      parent_id: '',
      employee_id: '',
    };
  }

  onToggleChange(event: Event, item: Comment): void {
    const checkbox = event.target as HTMLInputElement;
    const originalStatus = item.status;
    const newStatus = checkbox.checked;

    // Optimistically update status
    item.status = newStatus;

    this.commentService.toggleCommentStatus(item.id).subscribe({
      next: () => {
        this.toastService.success(
          `Trạng thái bình luận đã được ${
            newStatus ? 'kích hoạt' : 'vô hiệu hóa'
          }`,
          'Thành công'
        );
        this.loadAllComments();
      },
      error: (err) => {
        // Thất bại → rollback
        item.status = originalStatus;
        this.toastService.error(
          err.error?.message || err.message || err.statusText,
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
    if (!this.selectedComment) return;
    this.spinner.show();

    this.newComment = {
      content,
      room_class_id,
      parent_id: parent_id || this.selectedComment.id,
      employee_id: this.employeeId || '',
    };

    this.commentService
      .createComment(this.newComment)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (response) => {
          this.toastService.success('Phản hồi thành công', 'Thành công');
          this.onClosePopup();
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
