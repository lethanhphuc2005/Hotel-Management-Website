import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Room } from '../../../models/room';
import { RoomService } from '../../../services/room.service';

@Component({
  selector: 'app-room-list',
  standalone: true,
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
  imports: [CommonModule, RouterModule]
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  selectedRoom: Room | null = null;  // Biến lưu phòng đã chọn

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        // Set selectedRoom mặc định là phòng đầu tiên
        if (this.rooms.length > 0) {
          this.selectedRoom = this.rooms[0];
        }
      },
      error: (err) => {
        console.error('Lỗi khi load phòng:', err);
      }
    });
  }
  onSelectRoom(room: Room): void {
    this.selectedRoom = room; // Cập nhật phòng đã chọn
  }
}
