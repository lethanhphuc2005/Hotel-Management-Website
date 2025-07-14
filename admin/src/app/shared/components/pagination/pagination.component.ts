import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, CommonModule],
  styleUrls: ['./pagination.component.css'],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() page: number = 1;
  @Input() total: number = 0;
  @Input() limit: number = 10;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  getPageRange(): number[] {
    const range: number[] = [];
    const maxShown = 5;
    let start = Math.max(1, this.page - Math.floor(maxShown / 2));
    let end = start + maxShown - 1;

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, end - maxShown + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages && p !== this.page) {
      this.pageChange.emit(p);
    }
  }
}
