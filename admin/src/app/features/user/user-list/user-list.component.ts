import { User } from '@/types/user';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  @Input() users: User[] = [];
  @Input() filter: any;
  @Output() toggleChange = new EventEmitter();
  @Output() viewDetail = new EventEmitter<User>();

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
}
