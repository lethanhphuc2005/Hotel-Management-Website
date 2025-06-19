import { Component, OnInit } from '@angular/core';
import { Feature } from '../../../models/feature';
import { FeatureService } from '../../../services/feature.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements OnInit {
  features: Feature[] = [];
  searchKeyword: string = '';

  newFeature: Partial<Feature> = { name: '', description: '', status: true };
  editFeature: Feature = {} as Feature;
  selectedFeature: Feature = {} as Feature;

  isAddPopupOpen = false;
  isEditPopupOpen = false;
  isDetailPopupOpen = false;

  editImageUrl = '';

  constructor(private featureService: FeatureService) {}

  ngOnInit(): void {
    this.getAllFeatures();
  }

  getAllFeatures() {
    this.featureService.getAllFeatures().subscribe({
      next: res => this.features = res.data,
      error: err => console.error('❌ Lỗi khi tải danh sách tiện nghi:', err)
    });
  }

  onSearch() {
    const keyword = this.searchKeyword.trim().toLowerCase();
    if (!keyword) return this.getAllFeatures();
    this.features = this.features.filter(f =>
      f.name.toLowerCase().includes(keyword) ||
      f.description?.toLowerCase().includes(keyword)
    );
  }

  onAdd() {
    this.newFeature = { name: '', description: '', status: true };
    this.isAddPopupOpen = true;
  }

  closeAddPopup() {
    this.isAddPopupOpen = false;
    this.newFeature = {};
  }

  onAddSubmit() {
    const formData = new FormData();
    formData.append('name', this.newFeature.name || '');
    formData.append('description', this.newFeature.description || '');
    formData.append('status', this.newFeature.status ? 'true' : 'false');
    if (this.newFeature.image && typeof this.newFeature.image !== 'string') {
      formData.append('image', this.newFeature.image);
    }

    this.featureService.createFeature(formData).subscribe({
      next: () => {
        this.getAllFeatures();
        this.closeAddPopup();
      },
      error: err => console.error('❌ Thêm tiện nghi thất bại:', err)
    });
  }

  onEdit(feature: Feature) {
    this.editFeature = { ...feature };
    this.editImageUrl = `http://localhost:8000/${feature.image}`;
    this.isEditPopupOpen = true;
  }

  onEditFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.editFeature.image = file as any;
      const reader = new FileReader();
      reader.onload = e => this.editImageUrl = (e.target as any).result;
      reader.readAsDataURL(file);
    }
  }

  onEditSubmit() {
    const formData = new FormData();
    formData.append('name', this.editFeature.name);
    formData.append('description', this.editFeature.description || '');
    formData.append('status', this.editFeature.status ? 'true' : 'false');
    if (this.editFeature.image && typeof this.editFeature.image !== 'string') {
      formData.append('image', this.editFeature.image);
    }

    this.featureService.updateFeature(this.editFeature._id, formData).subscribe({
      next: () => {
        this.getAllFeatures();
        this.isEditPopupOpen = false;
      },
      error: err => console.error('❌ Cập nhật tiện nghi thất bại:', err)
    });
  }

  onViewDetail(feature: Feature) {
    this.selectedFeature = feature;
    this.isDetailPopupOpen = true;
  }

  toggleFeatureStatus(feature: Feature) {
    this.featureService.updateStatus(feature._id, !feature.status).subscribe({
      next: () => feature.status = !feature.status,
      error: err => alert(err.error.message || '❌ Không thể cập nhật trạng thái.')
    });
  }
  onFileSelected(){}
  onDelete(feature: Feature) {
    if (confirm(`Bạn có chắc chắn muốn xoá tiện nghi "${feature.name}"?`)) {
      this.featureService.deleteFeature(feature._id).subscribe({
        next: () => this.getAllFeatures(),
        error: err => alert(err.error.message || '❌ Không thể xoá tiện nghi.')
      });
    }
  }
}
