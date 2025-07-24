import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { buildCommentTree } from '@/shared/utils/reply.utils';
import { Review, ReviewFilter, ReviewRequest } from '@/types/review';
import { ReviewService } from '@/core/services/review.service';
import { ReviewDetailPopupComponent } from './review-detail-popup/review-detail-popup.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { ReviewReplyPopupComponent } from './review-reply-popup/review-reply-popup.component';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { ReviewFilterComponent } from './review-filter/review-filter.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review',
  standalone: true,
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
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
  filter: ReviewFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    status: '',
    booking_id: '',
    user_id: '',
    employee_id: '',
    rating: 0,
  };
  newReview: ReviewRequest = {
    content: '',
    room_class_id: '',
    parent_id: '',
    booking_id: '',
  };
  constructor(
    private reviewService: ReviewService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAllReviews();
  }

  loadAllReviews(): void {
    this.reviewService.getAllReviews(this.filter).subscribe({
      next: (response) => {
        this.reviews = response.data;
        this.filter.total = response.pagination.total;
        this.reviewsTree = buildCommentTree(this.reviews);
        this.userReviews = this.reviews.filter((comment) => !!comment.user_id);
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
      this.filter.sort = sortField;
      this.filter.order = this.filter.order === 'asc' ? 'desc' : 'asc';
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
    this.newReview = {
      content: '',
      room_class_id: '',
      parent_id: '',
      booking_id: '',
    };
  }

  onToggleChange(event: Event, item: Review): void {
    const checkbox = event.target as HTMLInputElement;
    const originalStatus = item.status;
    const newStatus = checkbox.checked;

    // Optimistically update status
    item.status = newStatus;

    this.reviewService.toggleReviewStatus(item.id).subscribe({
      next: () => {
        this.toastService.success(
          `Trạng thái đánh giá đã được ${
            newStatus ? 'kích hoạt' : 'vô hiệu hóa'
          }`,
          'Thành công'
        );
        this.loadAllReviews(); // Reload reviews to reflect changes
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
    booking_id,
  }: ReviewRequest): void {
    if (!this.selectedReview) {
      this.toastService.error('Vui lòng chọn bình luận để trả lời', 'Lỗi');
      return;
    }
    this.newReview = {
      content,
      room_class_id,
      parent_id: parent_id || this.selectedReview.id,
      booking_id: booking_id || this.selectedReview.booking_id,
    };

    this.reviewService.createReview(this.newReview).subscribe({
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
