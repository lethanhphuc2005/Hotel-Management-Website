import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-content-type-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './content-type-form.component.html',
  styleUrl: './content-type-form.component.scss',
})
export class ContentTypeFormComponent {
  @Input() contentType: any = {};
  @Input() isEdit: boolean = false;
  @Output() submitForm = new EventEmitter();
  @Output() close = new EventEmitter();
}
