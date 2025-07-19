import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-discount-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './discount-filter.component.html',
  styleUrl: './discount-filter.component.scss',
})
export class DiscountFilterComponent {
  @Output() filterChange = new EventEmitter();
  @Output() openAdd = new EventEmitter();
  @Input() filter: any;
  @Input() label: string = '';
}
