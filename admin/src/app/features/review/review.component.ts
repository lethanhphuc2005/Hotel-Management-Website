import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { buildCommentTree } from '@/shared/utils/reply.utils';
import { Review } from '@/types/review';
import { ReviewService } from '@/core/services/review.service';
import { ReviewDetailPopupComponent } from './review-detail-popup/review-detail-popup.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { ReviewReplyPopupComponent } from './review-reply-popup/review-reply-popup.component';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { ReviewFilterComponent } from './review-filter/review-filter.component';

@Component({
  selector: 'app-review',
  standalone: true,
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  imports: [
    ReviewDetailPopupComponent,
    ReviewListComponent,
    ReviewReplyPopupComponent,
    PaginationComponent,
    ReviewFilterComponent,
  ],
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  reviewsTree: Review[] = [];
  userReviews: Review[] = [];
  selectedReview: Review | null = null;
  isDetailPopupOpen = false;
  isReplyPopupOn = false;
  filter: {
    keyword: string;
    page: number;
    limit: number;
    sortField: string;
    sortOrder: 'asc' | 'desc';
    total: number;
    booking_id: string;
    user_id: string;
    employee_id?: string;
    status: string;
    rating: number;
  } = {
    keyword: '',
    page: 1,
    limit: 10,
    sortField: 'createdAt',
    sortOrder: 'desc',
    total: 0,
    booking_id: '',
    user_id: '',
    employee_id: '',
    status: '',
    rating: 0,
  };

  constructor(
    private reviewService: ReviewService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAllReviews();
  }

  getEmployeeId(): string {
    const user = JSON.parse(localStorage.getItem('login') || '{}');
    return user?.id || '';
  }

  loadAllReviews(): void {
    this.reviewService
      .getAllReviews({
        search: this.filter.keyword,
        page: this.filter.page,
        limit: this.filter.limit,
        sort: this.filter.sortField,
        order: this.filter.sortOrder,
        booking_id: this.filter.booking_id,
        user_id: this.filter.user_id,
        employee_id: this.filter.employee_id,
        status: this.filter.status,
        rating: this.filter.rating,
      })
      .subscribe({
        next: (response) => {
          this.reviews = response.data;
          this.filter.total = response.pagination.total;
          this.reviewsTree = buildCommentTree(this.reviews);
          this.userReviews = this.reviews.filter(
            (comment) => !!comment.user_id
          );
        },
        error: (error) => {
          console.error('Error loading reviews:', error);
          this.toastService.error(
            error.error?.message || 'Failed to load reviews',
            'Error'
          );
          this.reviews = [];
          this.userReviews = [];
        },
      });
  }

  findReviewWithChildren(tree: Review[], id: string): Review | null {
    for (const node of tree) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = this.findReviewWithChildren(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.loadAllReviews();
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sortField = sortField;
      this.filter.sortOrder = this.filter.sortOrder === 'asc' ? 'desc' : 'asc';
    }
    this.filter.page = 1; // Reset to first page on filter change
    this.loadAllReviews();
  }

  onPopupOpen(isDetail: boolean, comment: Review): void {
    if (isDetail) {
      this.selectedReview = this.findReviewWithChildren(
        this.reviewsTree,
        comment.id
      );
      this.isDetailPopupOpen = true;
    } else {
      this.selectedReview = comment;
      this.isReplyPopupOn = true;
    }
  }

  onClosePopup(): void {
    this.isDetailPopupOpen = false;
    this.isReplyPopupOn = false;
    this.selectedReview = null;
  }

  onToggleChange(event: Event, comment: Review): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.reviewService.toggleReviewStatus(comment.id).subscribe({
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
    booking_id,
  }: {
    content: string;
    room_class_id: string;
    parent_id: string;
    booking_id: string;
  }): void {
    if (!this.selectedReview) {
      this.toastService.error('Vui lòng chọn bình luận để trả lời', 'Lỗi');
      return;
    }
    const formData = new FormData();
    formData.append('booking_id', booking_id);
    formData.append('room_class_id', room_class_id);
    formData.append('parent_id', parent_id);
    formData.append('employee_id', this.getEmployeeId());
    formData.append('content', content);
    formData.append('status', true as any);
    this.reviewService.createReview(formData).subscribe({
      next: (response) => {
        this.toastService.success('Phản hồi thành công', 'Thành công');
        this.isReplyPopupOn = false;
        this.loadAllReviews();
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
