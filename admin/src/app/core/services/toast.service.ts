import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _show: (title: string, message: string, type: 'success' | 'error') => void = () => {};

  register(showFn: (title: string, message: string, type: 'success' | 'error') => void) {
    this._show = showFn;
  }

  show(title: string, message: string, type: 'success' | 'error' = 'success') {
    this._show(title, message, type);
  }

  success(title: string, message: string) {
    this.show(title, message, 'success');
  }

  error(title: string, message: string) {
    this.show(title, message, 'error');
  }
}

