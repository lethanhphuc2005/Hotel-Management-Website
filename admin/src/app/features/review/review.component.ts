import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReviewService } from '../../core/services/review.service';

@Component({
  selector: 'app-review',
  standalone: true,
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
})
export class ReviewComponent implements OnInit {
  reviews: any[] = [];
  filteredReviews: any[] = [];
  selectedReview: any = null;
  isDetailPopupOpen = false;
  searchKeyword = '';

  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.reviewService.getAll().subscribe({
      next: (res) => {
        const rawReviews = res.data;
        const reviewMap = new Map<string, any>();
        const topLevelReviews: any[] = [];

        for (const review of rawReviews) {
          review.replies = [];
          reviewMap.set(review._id, review);
        }

        for (const review of rawReviews) {
          if (review.parent_id) {
            const parent = reviewMap.get(review.parent_id);
            if (parent) {
              parent.replies.push(review);
            }
          } else {
            topLevelReviews.push(review);
          }
        }

        this.reviews = topLevelReviews;
        this.filteredReviews = this.reviews;
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách đánh giá:', err);
      }
    });
  }

  getReviewerName(review: any): string {
    if (review.user_id) {
      return `${review.user_id.last_name} ${review.user_id.first_name}`;
    }
    if (review.employee_id) {
      return `${review.employee_id.last_name} ${review.employee_id.first_name} (NV)`;
    }
    return 'Ẩn danh';
  }

  onViewDetail(review: any) {
    this.selectedReview = review;
    this.isDetailPopupOpen = true;
  }

  onSearch() {
    const keyword = this.searchKeyword.toLowerCase();
    this.filteredReviews = this.reviews.filter(review =>
      this.getReviewerName(review).toLowerCase().includes(keyword)
    );
  }

  onToggleVisibility(review: any) {
    const newStatus = !review.status;
    console.log('ID gửi đi:', review._id);

    this.reviewService.update(review._id, {}).subscribe({
      next: () => {
        review.status = newStatus;

        const action = newStatus ? 'Kích hoạt' : 'Vô hiệu hoá';
        console.log(`${action} đánh giá thành công.`);
      },
      error: (err) => {
        console.error('Lỗi cập nhật trạng thái:', err);

        // Nếu là 404, làm mới danh sách
        if (err.status === 404) {
          this.getAll();
        }
      }
    });
  }

}



