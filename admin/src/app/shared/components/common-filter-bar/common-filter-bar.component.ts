import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-common-filter-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './common-filter-bar.component.html',
  styleUrl: './common-filter-bar.component.scss',
})
export class CommonFilterBarComponent {
  @Output() filterChange = new EventEmitter();
  @Output() openAdd = new EventEmitter();
  @Input() filter: any;
  @Input() label: string = '';
}
