import { Component, OnInit } from '@angular/core';
import { Service } from '../../../models/service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../../services/service.service'; // ✅ Đã tách service

@Component({
  selector: 'app-service',
  standalone: true,
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ServiceComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  searchKeyword: string = '';
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  isDetailPopupOpen = false;
  newService: Service = { name: '', price: 0, description: '', status: true };
  editService: Service = { name: '', price: 0, description: '', status: true };
  selectedService!: Service;
  selectedFile: File | null = null;
  editSelectedFile: File | null = null;

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.getServices();
  }
getServices() {
  this.serviceService.getAll().subscribe(res => {
    console.log('Dịch vụ nhận được:', res);
    this.services = res.data; // ✅ lấy đúng mảng từ `data`
    this.filteredServices = [...this.services];
  }, err => {
    console.error('Lỗi khi lấy dịch vụ:', err);
    this.services = [];
    this.filteredServices = [];
  });
}

  onSearch() {
    const keyword = this.searchKeyword.toLowerCase();
    this.filteredServices = this.services.filter(service =>
      service.name.toLowerCase().includes(keyword)
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onEditFileSelected(event: any) {
    this.editSelectedFile = event.target.files[0];
  }

  onAdd() {
    this.isAddPopupOpen = true;
    this.newService = { name: '', price: 0, description: '', status: true };
    this.selectedFile = null;
  }

  closeAddPopup() {
    this.isAddPopupOpen = false;
  }

  onAddSubmit() {
    const formData = new FormData();
    formData.append('name', this.newService.name);
    formData.append('price', this.newService.price.toString());
    formData.append('description', this.newService.description);
    formData.append('status', this.newService.status.toString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.serviceService.createService(formData).subscribe(() => {
      this.getServices();
      this.isAddPopupOpen = false;
    });
  }

  onViewDetail(sv: Service) {
    this.selectedService = sv;
    this.isDetailPopupOpen = true;
  }

  onEdit(sv: Service) {
    this.editService = { ...sv };
    this.editSelectedFile = null;
    this.isEditPopupOpen = true;
  }

  onEditSubmit() {
    const formData = new FormData();
    formData.append('name', this.editService.name);
    formData.append('price', this.editService.price.toString());
    formData.append('description', this.editService.description);
    formData.append('status', this.editService.status.toString());
    if (this.editSelectedFile) {
      formData.append('image', this.editSelectedFile);
    }

    this.serviceService.updateService(this.editService._id!, formData).subscribe(() => {
      this.getServices();
      this.isEditPopupOpen = false;
    });
  }

  toggleService(sv: Service) {
    this.serviceService.toggleStatus(sv._id!).subscribe(() => {
      sv.status = !sv.status;
    });
  }
}
