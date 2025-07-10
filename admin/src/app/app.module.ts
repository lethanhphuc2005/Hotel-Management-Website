import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastComponent } from './shared/components/toast/toast.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  imports: [
    CommonModule,  // <== Thêm dòng này
    ToastComponent,
    FullCalendarModule
  ]
})
export class ToastModule {}
