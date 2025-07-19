import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeRequest } from '@/types/employee';
import { ChangePasswordRequest } from '@/types/auth';
import { EmployeeService } from '@/core/services/employee.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class ProfileComponent implements OnInit {
  user: Employee | null = null;

  editing = false;
  changingPassword = false;

  currentPassword = '';
  newPassword = '';

  loading = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadUser();
  }

loadUser(): void {
  const loginDataString = localStorage.getItem('login');

  if (!loginDataString) {
    alert('Không tìm thấy thông tin người dùng!');
    return;
  }

  const loginData = JSON.parse(loginDataString);
  const userId = loginData.id;

  this.loading = true;
  this.employeeService.getEmployeeById(userId).subscribe({
    next: (response) => {
      this.user = response.data;
      this.loading = false;
    },
    error: () => {
      alert('Không thể tải dữ liệu người dùng!');
      this.loading = false;
    }
  });
}

  saveProfile(): void {
    if (!this.user) return;

    const updateData: EmployeeRequest = {
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      position: this.user.position,
      department: this.user.department,
      address: this.user.address,
      email: this.user.email,
      phone_number: this.user.phone_number,
      role: this.user.role,
      status: this.user.status
    };

    this.employeeService.updateEmployee(this.user.id, updateData).subscribe({
      next: () => {
        alert('Cập nhật thông tin thành công!');
        this.editing = false;
        this.loadUser(); // ✅ Reload lại sau khi cập nhật
      },
      error: () => alert('Cập nhật thất bại!')
    });
  }

changePasswordError = '';

changePassword(): void {
  this.changePasswordError = '';

  if (!this.user) return;

  if (!this.currentPassword || !this.newPassword) {
    this.changePasswordError = 'Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới.';
    return;
  }

  if (this.newPassword.length < 6) {
    this.changePasswordError = 'Mật khẩu mới tối thiểu 6 ký tự.';
    return;
  }

  if (this.currentPassword === this.newPassword) {
    this.changePasswordError = 'Mật khẩu mới không được trùng với mật khẩu hiện tại.';
    return;
  }

  const body: ChangePasswordRequest = {
    oldPassword: this.currentPassword,
    newPassword: this.newPassword
  };

  this.employeeService.changePassword(this.user.id, body).subscribe({
    next: () => {
      alert('Đổi mật khẩu thành công!');
      this.currentPassword = '';
      this.newPassword = '';
      this.changingPassword = false;
    },
    error: (error) => {
      const errorMessage = error?.error?.message || 'Đổi mật khẩu thất bại!';
      if (errorMessage.toLowerCase().includes('incorrect')) {
        this.changePasswordError = 'Mật khẩu hiện tại không đúng.';
      } else {
        this.changePasswordError = errorMessage;
      }
    }
  });
}


}
