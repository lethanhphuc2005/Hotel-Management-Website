import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './review-filter.component.html',
  styleUrl: './review-filter.component.scss',
})
export class ReviewFilterComponent {
  @Output() filterChange = new EventEmitter();
  @Output() openAdd = new EventEmitter();
  @Input() filter: any;
  @Input() label: string = '';
}
