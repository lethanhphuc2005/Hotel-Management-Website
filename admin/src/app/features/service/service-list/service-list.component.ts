import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { Service, ServiceFilter } from '@/types/service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-list',
  imports: [CommonModule, FormsModule, FormatDatePipe],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss',
})
export class ServiceListComponent {
  @Input() services!: Service[];
  @Input() filter: ServiceFilter = {
    page: 1,
    limit: 10,
    total: 0,
  };
  @Output() toggleStatus = new EventEmitter<{
    $event: Event;
    service: Service;
  }>();
  @Output() openEdit = new EventEmitter<Service>();
  @Output() viewDetail = new EventEmitter<Service>();

  constructor() {}
}
