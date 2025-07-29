import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    ToastrModule,
    NgxSpinnerModule.forRoot({
      type: 'ball-clip-rotate',
    }),
  ],
})
export class AppModule {}
