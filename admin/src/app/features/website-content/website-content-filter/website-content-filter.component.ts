import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-website-content-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './website-content-filter.component.html',
  styleUrl: './website-content-filter.component.scss',
})
export class WebsiteContentFilterComponent {
  @Output() filterChange = new EventEmitter();
  @Output() openAdd = new EventEmitter();
  @Input() filter: any;
}
