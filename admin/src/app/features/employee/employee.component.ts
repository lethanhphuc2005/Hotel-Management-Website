import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../types/comment';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  employeeList: any[] = [];
  selectedEmployee: any = null;
  newEmployee: any = {};
  editEmployee: any = {};
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  isDetailPopupOpen = false;
  searchKeyword: string = '';
  searchTerm: string = '';
  filteredEmployeeList: any[] = [];
  // Thêm mới cho chức năng đổi mật khẩu
  isChangePasswordPopupOpen = false;
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  selectedEmployeeForPassword: any = null;

  constructor(private employeeService: EmployeeService) {}
onSearch(): void {
  const keyword = this.searchKeyword.trim().toLowerCase();

  if (!keyword) {
    this.filteredEmployeeList = [...this.employeeList];
  } else {
    this.filteredEmployeeList = this.employeeList.filter(emp => {
      const fullName = `${emp.first_name ?? ''} ${emp.last_name ?? ''}`.toLowerCase();
      const position = emp.position?.toLowerCase() ?? '';
      const department = emp.department?.toLowerCase() ?? '';
      const email = emp.email?.toLowerCase() ?? '';

      return (
        fullName.includes(keyword) ||
        position.includes(keyword) ||
        department.includes(keyword) ||
        email.includes(keyword)
      );
    });
  }
}

onChangePassword(employee: any): void {
  this.selectedEmployeeForPassword = employee;
  this.passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  this.isChangePasswordPopupOpen = true;
}
onChangePasswordSubmit(): void {
  if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
    alert('Mật khẩu mới không khớp!');
    return;
  }

  this.employeeService.changePassword(this.selectedEmployeeForPassword._id, {
    oldPassword: this.passwordData.currentPassword,
    newPassword: this.passwordData.newPassword
  }).subscribe({
    next: () => {
      this.isChangePasswordPopupOpen = false;
      alert('Đổi mật khẩu thành công!');
    },
    error: err => {
      console.error('Lỗi đổi mật khẩu:', err);
      alert('Đổi mật khẩu thất bại!');
    }
  });
}
onOpenChangePasswordPopup(employee: any): void {
  this.selectedEmployeeForPassword = employee;
  this.passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  this.isChangePasswordPopupOpen = true;
}


  ngOnInit(): void {
    this.loadEmployeeList();
  }
  initEmptyEmployee(): Employee {
    return {
  first_name: '',
  last_name: '',
  position: '',
  department: '',
  address: '',
  email: '',
  phone_number: '',
  role: 'staff',
  status: true,
  _id: '',

};
  }
  loadEmployeeList(): void {
    this.employeeService.getAllEmployees().subscribe(res => {
      this.employeeList = res.data;
      this.filteredEmployeeList = [...this.employeeList];
    });
  }
  onAdd(): void {
    this.newEmployee = {};
    this.isAddPopupOpen = true;
  }

  closeAddPopup(): void {
    this.isAddPopupOpen = false;
  }

  onAddSubmit(): void {
    console.log('Thêm nhân viên:', this.newEmployee);
    this.isAddPopupOpen = false;
    this.loadEmployeeList();
  }

  onEdit(employee: any): void {
    this.editEmployee = { ...employee };
    this.isEditPopupOpen = true;
  }

  onEditSubmit(): void {
    this.employeeService.updateEmployee(this.editEmployee._id, this.editEmployee).subscribe({
      next: () => {
        this.isEditPopupOpen = false;
        this.loadEmployeeList();
      },
      error: (err) => console.error('Lỗi cập nhật:', err),
    });
  }

  onViewDetail(employee: any): void {
    this.selectedEmployee = employee;
    this.isDetailPopupOpen = true;
  }

  toggleEmployeeStatus(employee: any): void {
    this.employeeService.toggleEmployeeStatus(employee._id).subscribe({
      next: () => {
        employee.status = !employee.status;
      },
      error: (err) => console.error('Lỗi đổi trạng thái:', err),
    });
  }


}
