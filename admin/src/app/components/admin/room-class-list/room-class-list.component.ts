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
  selectedFeatureDropdown: string | null = null;
  selectedRoomClass: any;
  isDetailPopupOpen: boolean = false;
  isAddRoomPopupOpen = false;
  newRoomClass: any = {};
  features: any[] = [];
  mainRoomClasses: any[] = [];

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
  onEdit(rc: any) {

  }
  onAdd() {
    this.isAddRoomPopupOpen = true;
    this.newRoomClass = {};
  }

    onAddRoomClassSubmit() {
    const selectedFeatures = this.features
      .filter(f => f.selected)
      .map(f => ({ feature_id: f._id })); // ✅ Map thành object

    const data = {
      ...this.newRoomClass,
      features: selectedFeatures,
      status: true // trạng thái hđ 
    };

    this.roomClassService.addRoomClass(data).subscribe({
      next: () => {
        this.loadRoomClasses();
        this.closeAddRoomPopup();
      },
      error: (err) => {
        console.error('Lỗi khi thêm loại phòng:', err);
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
}
