import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../../core/services/discount.service';
import { Discount } from '../../types/discount';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discount',
  standalone: true,
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule]
})
export class DiscountComponent implements OnInit {
  discounts: Discount[] = [];
  filteredDiscounts: Discount[] = [];

  isAddPopupOpen = false;
  isEditPopupOpen = false;
  isDetailPopupOpen = false;

  selectedDiscount!: Discount;
  newDiscount: Discount = this.getEmptyDiscount();
  editDiscount: Discount = this.getEmptyDiscount();

  searchTerm: string = '';
selectedImageFile: File | null = null;
previewImage: string | ArrayBuffer | null = null;

  constructor(private discountService: DiscountService) { }

  ngOnInit(): void {
    this.loadDiscounts();
  }
  loadDiscounts() {
    this.discountService.getAll().subscribe({
      next: (res) => {
        this.discounts = res.data;
        this.filteredDiscounts = [...this.discounts]; // nếu bạn có lọc
      },
      error: (err) => {
        console.error('Lỗi khi load khuyến mãi:', err);
      }
    });
  }

 openAddPopup() {
  this.newDiscount = this.getEmptyDiscount();
  this.selectedImageFile = null;
  this.previewImage = null;
  this.isAddPopupOpen = true;
}

openEditPopup(discount: Discount) {
  this.editDiscount = { ...discount };
  this.selectedImageFile = null;
  this.previewImage = discount.image ? ('http://localhost:8000/' + discount.image) : null;
  this.isEditPopupOpen = true;
}


  viewDetail(discount: Discount) {
    console.log("📸 Ảnh khuyến mãi:", discount.image); // Kiểm tra giá trị
    this.selectedDiscount = discount;
    this.isDetailPopupOpen = true;
  }

  closePopup() {
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.isDetailPopupOpen = false;
  }

  toggleStatus(discount: Discount) {
    if (!discount._id) {
      alert('❌ Mã khuyến mãi không hợp lệ!');
      return;
    }

    const now = new Date();
    const start = new Date(discount.start_day);
    const end = new Date(discount.end_day);

    // Nếu đang TẮT (status = false), người dùng muốn BẬT lên
    if (!discount.status) {
      if (now < start) {
        alert('❌ Khuyến mãi này chưa đến ngày bắt đầu. Không thể bật!');
        return;
      }
      if (now > end) {
        alert('❌ Khuyến mãi này đã hết hạn. Không thể bật lại!');
        return;
      }
    }

    // Nếu hợp lệ hoặc chỉ tắt => gọi API
    this.discountService.toggleStatus(discount._id).subscribe({
      next: () => {
        discount.status = !discount.status;
        console.log('✅ Đã cập nhật trạng thái thành công');
        this.loadDiscounts();
      },
      error: (err) => {
        console.error('❌ Lỗi khi cập nhật trạng thái:', err);
        alert(err.error?.message || 'Không thể cập nhật trạng thái. Vui lòng thử lại!');
        this.loadDiscounts();
      }
    });
  }
  isValidToToggle(discount: any): boolean {
    const now = new Date();
    const start = new Date(discount.start_day);
    const end = new Date(discount.end_day);
    // Nếu đang bật (status = true) thì cho tắt bất kỳ lúc nào
    if (discount.status) {
      return true;
    }
    // Nếu đang tắt (status = false) thì chỉ cho bật nếu trong thời gian hợp lệ
    return start <= now && now <= end;
  }
  getFormattedValue(discount: any): string {
    return discount.type === 'Percentage'
      ? `${discount.value}%`
      : `${discount.value.toLocaleString()} VNĐ`;
  }
  onSubmit() {
    const discount = this.currentDiscount;
    // Đảm bảo giá trị limit là đúng
    discount.limit = discount.limit?.toLowerCase() === 'limited' ? 'limited' : 'unlimited';

    if (discount.limit === 'limited') {
      if (!discount.quantity || discount.quantity <= 0) {
        alert('❌ Vui lòng nhập số lượng lớn hơn 0 cho khuyến mãi có giới hạn.');
        return;
      }
    } else {
      // unlimited: không được nhập quantity
      if (discount.quantity && discount.quantity > 0) {
        alert('❌ Không được nhập số lượng cho khuyến mãi không giới hạn.');
        return;
      }
      // đảm bảo quantity là 0 hoặc undefined
      discount.quantity = 0;
    }
    // xử lý gọi API như bình thường
    if (this.isEditPopupOpen) {
      if (!discount._id) {
        alert('❌ Không thể cập nhật vì thiếu ID.');
        return;
      }
      this.discountService.update(discount._id, discount).subscribe({
        next: () => {
          this.loadDiscounts();
          this.closePopup();
        },
        error: (err) => {
          alert(`❌ Cập nhật thất bại: ${err.error?.message || 'Lỗi không xác định'}`);
        }
      });
    } else {
      this.discountService.add(discount).subscribe({
        next: () => {
          this.loadDiscounts();
          this.closePopup();
        },
        error: (err) => {
          alert(`❌ Thêm thất bại: ${err.error?.message || 'Lỗi không xác định'}`);
        }
      });
    }
  }
  get currentDiscount(): Discount {
    return this.isEditPopupOpen ? this.editDiscount : this.newDiscount;
  }

  getEmptyDiscount(): Discount {
    return {
      name: '',
      image: '',
      description: '',
      type: 'Percentage',
      value: 1,
      start_day: '',
      end_day: '',
      quantity: 1,
      status: true,
      limit: 'limited',
    };
  }
  onSearch() {
    const keyword = this.searchTerm.toLowerCase();
    this.filteredDiscounts = this.discounts.filter((d) =>
      d.name.toLowerCase().includes(keyword)
    );
  }
onImageSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.selectedImageFile = file;

    // Hiển thị ảnh xem trước
    const reader = new FileReader();
    reader.onload = e => this.previewImage = reader.result;
    reader.readAsDataURL(file);
  } else {
    this.selectedImageFile = null;
    this.previewImage = null;
  }
}
}
