import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-room-add',
  standalone: true, // ⚠️ Phải thêm dòng này
  imports: [CommonModule, ReactiveFormsModule], // thêm module bạn dùng trong template
  templateUrl: './roomlist-add.component.html',
  styleUrls: ['./roomlist-add.component.css']
})
export class RoomAddComponent implements OnInit {
  @Output() added = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  roomForm!: FormGroup;
  roomTypes: any;
  statuses: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      TenPhong: ['', Validators.required],
      Tang: ['', Validators.required],
      MaLP: ['', Validators.required],
      TrangThai: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.roomForm.valid) {
      // Gửi dữ liệu lên server ở đây (nếu có)
      this.added.emit(); // emit khi thêm thành công
    }
  }

  close() {
    this.closed.emit(); // emit khi đóng form
  }
}
