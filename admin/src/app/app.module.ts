import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [
    CommonModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    ToastrModule,
    NgxSpinnerModule.forRoot({
      type: 'ball-clip-rotate',
    }),
    NgApexchartsModule,
  ],
})
export class AppModule {}
