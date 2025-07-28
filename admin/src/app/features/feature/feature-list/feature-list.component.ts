import { Feature, FeatureFilter } from '@/types/feature';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feature-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './feature-list.component.html',
  styleUrl: './feature-list.component.scss',
})
export class FeatureListComponent {
  @Input() features!: Feature[];
  @Input() filter: FeatureFilter = {
    page: 1,
    limit: 10,
    total: 0,
  };
  @Output() toggleStatus = new EventEmitter<{
    $event: Event;
    feature: Feature;
  }>();
  @Output() openEdit = new EventEmitter<Feature>();
  @Output() viewDetail = new EventEmitter<Feature>();

  constructor() {}
}
