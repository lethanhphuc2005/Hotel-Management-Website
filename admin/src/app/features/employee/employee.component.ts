import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '@/core/services/employee.service';
import { AuthService } from '@/core/services/auth.service';
import { Employee, EmployeeFilter, EmployeeRequest } from '@/types/employee';
import { ToastrService } from 'ngx-toastr';
import { EmployeeFilterComponent } from './employee-filter/employee-filter.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { RegisterRequest } from '@/types/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

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
    PaginationComponent,
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
  newRegisterEmployee: RegisterRequest = {
    email: '',
    password: '',
    secret_key: '',
  };
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
  filter: EmployeeFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    status: '',
    role: '',
    department: '',
    position: '',
  };

  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastrService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadInitialData();
    } catch (err) {
      console.error(err);
    } finally {
      this.spinner.hide();
    }
  }

  async loadInitialData() {
    await Promise.all([this.loadAllEmployees()]);
  }
  loadAllEmployees(): void {
    this.employeeService.getAllEmployees(this.filter).subscribe({
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
      this.filter.sort = sortField;
      this.filter.order = this.filter.order === 'desc' ? 'asc' : 'desc';
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
    this.newRegisterEmployee = {
      email: '',
      password: '',
      secret_key: '',
    };
  }

  onToggleStatusChange(event: Event, employee: Employee): void {
    const target = event.target as HTMLInputElement;
    const orginalStatus = employee.status;
    const newStatus = target.checked;

    this.employeeService.toggleEmployeeStatus(employee.id).subscribe({
      next: (res) => {
        this.toastService.success(
          `Trạng thái nhân viên đã được ${
            newStatus ? 'kích hoạt' : 'vô hiệu hóa'
          }`,
          'Thành công'
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
    this.spinner.show();

    this.authService
      .register(this.newRegisterEmployee)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (res) => {
          this.toastService.success('Employee added successfully', 'Success');
          this.loadAllEmployees();
          this.onClosePopup();
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
    if (!this.selectedEmployee) return;
    this.spinner.show();

    this.employeeService
      .updateEmployee(this.selectedEmployee.id, this.newEmployee)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (res) => {
          this.toastService.success('Employee updated successfully', 'Success');
          this.loadAllEmployees();
          this.onClosePopup();
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
