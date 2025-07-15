import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastComponent } from './shared/components/toast/toast.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    ToastComponent,
    FullCalendarModule,
    BrowserAnimationsModule,
    ToastrModule
    
  ],
})
export class ToastModule {}
