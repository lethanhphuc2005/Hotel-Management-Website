import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToastService } from './core/services/toast.service';
import { TitleService } from './core/services/title.service';
import { ToastComponent } from './shared/components/toast/toast.component';

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

  constructor(private toastService: ToastService, private titleService: TitleService) {}

  ngOnInit() {
    this.titleService.init();
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
    }, 4000);
  }
}
