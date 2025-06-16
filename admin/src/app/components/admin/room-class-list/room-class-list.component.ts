import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomClassService } from '../../../services/room-class.service';
import { FeatureService } from '../../../services/feature.service';
import { MainRoomClassService } from '../../../services/main-room-class.service';

@Component({
  selector: 'app-room-class-list',
  standalone: true,
  templateUrl: './room-class-list.component.html',
  styleUrls: ['./room-class-list.component.scss'],
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule]
})
export class RoomClassListComponent implements OnInit {
  roomClasses: any[] = [];
  allRoomClasses: any[] = [];
  selectedFeatureDropdown: string | null = null;
  selectedRoomClass: any;
  isDetailPopupOpen: boolean = false;
  isAddRoomPopupOpen = false;
  newRoomClass: any = {};
  features: any[] = [];
  mainRoomClasses: any[] = [];
  selectedRoomClassFiles: File[] = [];
  previewRoomClassImages: string[] = [];
  editRoomClassFiles: File[] = [];
  editPreviewImages: string[] = [];
  filter = {
    feature: [] as string[]
  };




  constructor(private http: HttpClient, private roomClassService: RoomClassService, private featureService: FeatureService, private mainRoomClassService: MainRoomClassService) { }

  ngOnInit(): void {
    this.loadRoomClasses();
    this.loadFeatures();
    this.loadMainRoomClasses();
  }

  loadRoomClasses() {
    this.roomClassService.getAllRoomClass().subscribe({
      next: (res) => this.roomClasses = res.data,
      error: (err) => console.error('Lỗi khi load room class:', err),
    });
  }

  loadFeatures() {
    this.featureService.getAllFeatures().subscribe({
      next: (res) => {
        this.features = res.data.map(f => ({ ...f, selected: false }));
      },
      error: (err) => console.error('Lỗi khi load tiện nghi:', err)
    });
  }

  loadMainRoomClasses() {
    this.mainRoomClassService.getAllMainRoomClasses().subscribe({
      next: (res) => this.mainRoomClasses = res.data,
      error: (err) => console.error('Lỗi khi load main room class:', err)
    });
  }


  toggleStatus(rc: any) {
    const updatedStatus = !rc.status; // Đảo trạng thái

    this.roomClassService.updateRoomClass(rc._id, { status: updatedStatus }).subscribe({
      next: (res) => {
        console.log('Cập nhật trạng thái thành công:', res);
        rc.status = updatedStatus; // Cập nhật UI sau khi API thành công
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật trạng thái:', err);
      }
    });
  }


  toggleDropdown(id: string) {
    this.selectedFeatureDropdown = this.selectedFeatureDropdown === id ? null : id;
  }

  toggleFeatureSelection(feature: any) {
    feature.selected = !feature.selected;
  }
  toggleFeatureDropdown(rc: any): void {
    rc.showFeatures = !rc.showFeatures;
  }

  onAdd() {
    this.isAddRoomPopupOpen = true;
    this.newRoomClass = {};
  }
  // them

  // Bo anh review
  removeSelectedImage(index: number): void {
    this.selectedRoomClassFiles.splice(index, 1);
    this.previewRoomClassImages.splice(index, 1);
  }


  onRoomClassImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);

      // Thêm vào danh sách ảnh đã chọn (nếu muốn chọn nhiều lần)
      this.selectedRoomClassFiles = [...this.selectedRoomClassFiles, ...newFiles];

      // Cập nhật preview
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      this.previewRoomClassImages = [...this.previewRoomClassImages, ...newPreviews];
    }
  }


  onAddRoomClassSubmit() {
  if (!this.newRoomClass.name || !this.newRoomClass.price || !this.newRoomClass.main_room_class_id) {
    alert('Vui lòng nhập đầy đủ thông tin.');
    return;
  }

  const formData = new FormData();

  formData.append('name', this.newRoomClass.name);
  formData.append('description', this.newRoomClass.description);
  formData.append('bed_amount', this.newRoomClass.bed_amount.toString());
  formData.append('view', this.newRoomClass.view || '');
  formData.append('capacity', this.newRoomClass.capacity.toString());
  formData.append('price', this.newRoomClass.price.toString());
  formData.append('main_room_class_id', this.newRoomClass.main_room_class_id);

  const selectedFeatureIds = this.features
    .filter(f => f.selected)
    .map(f => f._id);
  formData.append('features', JSON.stringify(selectedFeatureIds));

  if (this.selectedRoomClassFiles.length === 0) {
    alert('Vui lòng chọn ít nhất 1 ảnh.');
    return;
  }

  this.selectedRoomClassFiles.forEach(file => {
    formData.append('images', file);
  });

  // DEBUG
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  this.roomClassService.addRoomClass(formData).subscribe({
    next: () => {
      this.loadRoomClasses();
      this.isAddRoomPopupOpen = false;
      this.selectedRoomClassFiles = [];
      this.previewRoomClassImages = [];
    },
    error: err => {
      console.error('❌ Lỗi server:', err);
      alert('Thêm loại phòng thất bại: ' + (err.error?.message || err.message || err.statusText));
    }
  });
}


  closeAddRoomPopup() {
    this.isAddRoomPopupOpen = false;
  }

  onViewDetail(rc: any): void {
    this.selectedRoomClass = rc;
    this.isDetailPopupOpen = true;
  }

  // sửa

  isEditRoomPopupOpen = false;
  editRoomClass: any = {};

  onEdit(rc: any) {
    this.editRoomClass = { ...rc, main_room_class_id: rc.main_room_class?.[0]?._id };

    this.features.forEach(f => {
      f.selected = rc.features?.some((rf: any) => rf.feature_id?._id === f._id);
    });

    // Gán ảnh cũ (URL ảnh từ backend nếu có)
    this.editPreviewImages = rc.images || []; // giả sử ảnh backend trả về là mảng URL
    this.editRoomClassFiles = []; // chưa có ảnh File mới
    this.isEditRoomPopupOpen = true;
  }

  // sua anh
  onEditRoomClassImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
      this.editRoomClassFiles = [...this.editRoomClassFiles, ...newFiles];
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      this.editPreviewImages = [...this.editPreviewImages, ...newPreviews];
    }
  }
  // xoa anh da chon
  removeEditImage(index: number) {
    this.editRoomClassFiles.splice(index, 1);
    this.editPreviewImages.splice(index, 1);
  }


  onEditRoomClassSubmit() {
    const selectedFeatures = this.features
      .filter(f => f.selected)
      .map(f => ({ feature_id: f._id }));

    const formData = new FormData();
    formData.append('name', this.editRoomClass.name);
    formData.append('description', this.editRoomClass.description);
    formData.append('bed_amount', this.editRoomClass.bed_amount.toString());
    formData.append('view', this.editRoomClass.view || '');
    formData.append('capacity', this.editRoomClass.capacity.toString());
    formData.append('price', this.editRoomClass.price.toString());
    formData.append('main_room_class_id', this.editRoomClass.main_room_class_id);
    formData.append('features', JSON.stringify(selectedFeatures));

    this.editRoomClassFiles.forEach(file => {
      formData.append('images', file);
    });

    this.roomClassService.updateFullRoomClass(this.editRoomClass._id, formData).subscribe({
      next: () => {
        this.loadRoomClasses();
        this.isEditRoomPopupOpen = false;
        this.editRoomClassFiles = [];
        this.editPreviewImages = [];
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật loại phòng:', err);
      }
    });
  }

  // Nếu ảnh từ backend không có dạng URL trực tiếp, bạn có thể thêm host vào như: this.editPreviewImages = rc.images?.map((img: string) => environment.apiUrl + '/' + img);

  // lọc
  onFeatureFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const featureId = input.value;

    if (input.checked) {
      this.filter.feature.push(featureId);
    } else {
      this.filter.feature = this.filter.feature.filter((id: string) => id !== featureId);
    }

    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allRoomClasses];

    if (this.filter.feature.length > 0) {
      filtered = filtered.filter((room: any) => {
        const roomFeatureIds = (room.features || [])
          .map((f: any) => f.feature_id?._id)
          .filter(Boolean);
        return this.filter.feature.some((id: string) => roomFeatureIds.includes(id));
      });
    }

    this.roomClasses = filtered;
  }



  // chọn nhiều return this.filter.feature.every((id: string) => roomFeatureIds.includes(id));
}
