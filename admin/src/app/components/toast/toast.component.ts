import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  imports: [CommonModule],
})
export class ToastComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() visible: boolean = false;
  @Input() type: 'success' | 'error' = 'success';

  getIconClass() {
    return this.type === 'success'
      ? 'fa-solid fa-check-circle'
      : 'fa-solid fa-times-circle';
  }
}
