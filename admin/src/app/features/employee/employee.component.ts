import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '@/core/services/employee.service';
import { AuthService } from '@/core/services/auth.service';
import { Employee, EmployeeRequest } from '@/types/employee';
import { ToastrService } from 'ngx-toastr';
import { EmployeeFilterComponent } from './employee-filter/employee-filter.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmployeeFilterComponent,
    EmployeeListComponent,
    EmployeeFormComponent,
    EmployeeDetailComponent,
  ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  isDetailPopupOpen = false;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  newEmployee: EmployeeRequest = {
    first_name: '',
    last_name: '',
    position: '',
    department: '',
    address: '',
    email: '',
    phone_number: '',
    role: '',
    status: true,
    password: '',
    secret_key: '',
  };
  filter: {
    search: string;
    page: number;
    limit: number;
    sortField: string;
    sortOrder: 'desc' | 'asc';
    total?: number;
    status?: string;
    role?: string;
    department?: string;
    position?: string;
  } = {
    search: '',
    page: 1,
    limit: 10,
    sortField: 'createdAt',
    sortOrder: 'desc',
    status: '',
    role: '',
    department: '',
    position: '',
  };

  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllEmployees();
  }

  loadAllEmployees(): void {
    this.employeeService
      .getAllEmployees({
        search: this.filter.search,
        page: this.filter.page,
        limit: this.filter.limit,
        sort: this.filter.sortField,
        order: this.filter.sortOrder,
        status: this.filter.status,
        role: this.filter.role,
        department: this.filter.department,
        position: this.filter.position,
      })
      .subscribe({
        next: (response) => {
          this.employees = response.data;
          this.filter.total = response.pagination.total;
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          this.toastService.error(
            error.error.message || 'Failed to load employees',
            'Error'
          );
          this.employees = [];
        },
      });
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sortField = sortField;
      this.filter.sortOrder = this.filter.sortOrder === 'desc' ? 'asc' : 'desc';
    }

    this.filter.page = 1;
    this.loadAllEmployees();
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.loadAllEmployees();
  }

  onViewDetail(employee: Employee): void {
    this.selectedEmployee = employee;
    this.isDetailPopupOpen = true;
  }

  onOpenPopup(isAdd: boolean, item?: Employee): void {
    this.isAddPopupOpen = isAdd;
    this.isEditPopupOpen = !isAdd;
    if (isAdd) {
      this.newEmployee = {
        first_name: '',
        last_name: '',
        position: '',
        department: '',
        address: '',
        email: '',
        phone_number: '',
        role: '',
        status: true,
      };
    } else if (item) {
      this.selectedEmployee = item;
      this.newEmployee = {
        first_name: item.first_name,
        last_name: item.last_name,
        position: item.position,
        department: item.department,
        address: item.address,
        email: item.email,
        phone_number: item.phone_number,
        role: item.role,
        status: item.status,
      };
    }
  }

  onClosePopup(): void {
    this.isDetailPopupOpen = false;
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.selectedEmployee = null;
  }

  onToggleStatusChange(event: Event, employee: Employee): void {
    const target = event.target as HTMLInputElement;
    const orginalStatus = employee.status;
    const newStatus = target.checked;

    this.employeeService.toggleEmployeeStatus(employee.id).subscribe({
      next: (res) => {
        employee.status = newStatus;
        this.toastService.success(
          res.message || 'Status updated successfully',
          'Success'
        );
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.toastService.error(
          error.error.message || 'Failed to update status'
        );
        employee.status = orginalStatus; // Revert status on error
      },
    });
  }
  onAddSubmit(): void {
    const formData = new FormData();
    formData.append('first_name', this.newEmployee.first_name);
    formData.append('last_name', this.newEmployee.last_name);
    formData.append('position', this.newEmployee.position);
    formData.append('department', this.newEmployee.department);
    formData.append('address', this.newEmployee.address);
    formData.append('email', this.newEmployee.email);
    formData.append('phone_number', this.newEmployee.phone_number);
    formData.append('role', this.newEmployee.role);
    formData.append('status', String(this.newEmployee.status));
    formData.append('password', this.newEmployee.password || '');
    formData.append('secret_key', this.newEmployee.secret_key || '');
    this.authService.register(formData).subscribe({
      next: (res) => {
        this.toastService.success('Employee added successfully', 'Success');
        this.isAddPopupOpen = false;
        this.loadAllEmployees();
      },
      error: (error) => {
        console.error('Error adding employee:', error);
        this.toastService.error(
          error.error.message || 'Failed to add employee',
          'Error'
        );
      },
    });
  }
  onEditSubmit(): void {
    if (!this.selectedEmployee) {
      this.toastService.error('No employee selected for editing', 'Error');
      return;
    }
    const formData = new FormData();
    formData.append('first_name', this.selectedEmployee.first_name);
    formData.append('last_name', this.selectedEmployee.last_name);
    formData.append('position', this.selectedEmployee.position);
    formData.append('department', this.selectedEmployee.department);
    formData.append('address', this.selectedEmployee.address);
    formData.append('email', this.selectedEmployee.email);
    formData.append('phone_number', this.selectedEmployee.phone_number);
    formData.append('role', this.selectedEmployee.role);

    this.employeeService
      .updateEmployee(this.selectedEmployee!.id, formData)
      .subscribe({
        next: (res) => {
          this.toastService.success('Employee updated successfully', 'Success');
          this.isEditPopupOpen = false;
          this.selectedEmployee = null;
          this.loadAllEmployees();
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          this.toastService.error(
            error.error.message || 'Failed to update employee',
            'Error'
          );
        },
      });
  }
}
