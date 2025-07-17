import { User } from '@/types/user';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  @Input() isVisible: boolean = false;
  @Input() user: User | null = null;
  @Output() closeDetail = new EventEmitter<void>();

  getUserLevelName(level: string): string {
    switch (level) {
      case 'bronze':
        return 'Đồng';
      case 'silver':
        return 'Bạc';
      case 'gold':
        return 'Vàng';
      case 'diamond':
        return 'Kim Cương';
      default:
        return '';
    }
  }

  visibleBookings = 3;
  visibleComments = 3;
  visibleReviews = 3;

  showAllBookings = false;
  showAllComments = false;
  showAllReviews = false;

  toggleShowAll(type: 'bookings' | 'comments' | 'reviews') {
    if (type === 'bookings') {
      this.showAllBookings = !this.showAllBookings;
    } else if (type === 'comments') {
      this.showAllComments = !this.showAllComments;
    } else if (type === 'reviews') {
      this.showAllReviews = !this.showAllReviews;
    }
  }
}
