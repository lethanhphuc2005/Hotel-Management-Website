import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToastService } from './services/toast.service';
import { ToastComponent } from './components/toast/toast.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  showToast = false;
  toastTitle = '';
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.register(this.showCustomToast.bind(this));
  }

  showCustomToast(
    title: string,
    message: string,
    type: 'success' | 'error' = 'success'
  ) {
    this.toastTitle = title;
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 2000);
  }
}
