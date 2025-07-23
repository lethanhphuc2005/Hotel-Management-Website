import { UserFilter } from '@/types/user';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.scss',
})
export class UserFilterComponent {
  @Input() filter: UserFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    is_verified: '',
    level: '',
    status: '',
  };
  @Output() filterChange = new EventEmitter<string>();
}
