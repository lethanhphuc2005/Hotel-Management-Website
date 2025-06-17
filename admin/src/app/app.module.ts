import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  imports: [
    CommonModule,  // <== Thêm dòng này
    ToastComponent
  ]
})
export class ToastModule {}
