import { Component, OnInit } from '@angular/core';
import { PaymentMethod } from '../../types/method';
import { PaymentMethodService } from '../../core/services/payment-method.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-method',
  standalone:true,
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  imports:[CommonModule, FormsModule, RouterModule]
})
export class PaymentMethodComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  searchKeyword = '';

  // Thêm
  isAddPopupOpen = false;
  newPaymentMethod: Partial<PaymentMethod> = {
    name: '',
    status: true,
  };

  // Chi tiết
  selectedPaymentMethod: PaymentMethod | null = null;
  isDetailPopupOpen = false;

  // Sửa
  isEditPopupOpen = false;
  editPaymentMethod: Partial<PaymentMethod> = {
    id: '',
    name: '',
    status: true,
  };

  constructor(private paymentService: PaymentMethodService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.paymentService.getAll(this.searchKeyword).subscribe({
      next: (res) => {
        this.paymentMethods = res.data;
      },
      error: () => {
        this.paymentMethods = [];
      },
    });
  }

  onSearch(): void {
    this.loadData();
  }

  onAdd(): void {
    this.isAddPopupOpen = true;
    this.newPaymentMethod = {
      name: '',
      status: true,
    };
  }

  closeAddPopup(): void {
    this.isAddPopupOpen = false;
  }

  onAddSubmit(): void {
    this.paymentService.add(this.newPaymentMethod).subscribe({
      next: () => {
        this.loadData();
        this.isAddPopupOpen = false;
      },
    });
  }

  onViewDetail(method: PaymentMethod): void {
    this.selectedPaymentMethod = method;
    this.isDetailPopupOpen = true;
  }

  onEdit(method: PaymentMethod): void {
    this.editPaymentMethod = { ...method };
    this.isEditPopupOpen = true;
  }

  onEditSubmit(): void {
    if (this.editPaymentMethod.id) {
      this.paymentService
        .update(this.editPaymentMethod.id, this.editPaymentMethod)
        .subscribe({
          next: () => {
            this.loadData();
            this.isEditPopupOpen = false;
          },
        });
    }
  }

  toggleStatus(method: PaymentMethod): void {
    this.paymentService
      .update(method.id, { status: !method.status })
      .subscribe(() => this.loadData());
  }
}
