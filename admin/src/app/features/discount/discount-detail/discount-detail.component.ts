import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { Discount, DiscountCondition } from '@/types/discount';
import { RoomClass } from '@/types/room-class';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-discount-detail',
  imports: [CommonModule, FormsModule, FormatDatePipe],
  templateUrl: './discount-detail.component.html',
  styleUrl: './discount-detail.component.scss',
})
export class DiscountDetailComponent {
  @Input() discount!: Discount;
  @Input() roomClasses: RoomClass[] = [];
  @Output() close = new EventEmitter();

  constructor() {}

  getRoomClassNameById(roomClassId: string): string {
    const roomClass = this.roomClasses.find((rc) => rc.id === roomClassId);
    return roomClass ? roomClass.name : 'Không xác định';
  }

  getRoomClassNames(): string {
    if (!this.discount?.apply_to_room_class_ids) return 'Không xác định';
    return this.discount.apply_to_room_class_ids
      .map((id) => this.getRoomClassNameById(id))
      .join(', ');
  }

  getDiscounTypeName(type: string): string {
    switch (type) {
      case 'early_bird':
        return 'Đặt phòng sớm';
      case 'last_minute':
        return 'Đặt phòng gấp';
      case 'length_of_stay':
        return 'Đặt phòng dài ngày';
      case 'promo_code':
        return 'Mã khuyến mãi';
      case 'seasonal':
        return 'Khuyến mãi theo mùa';
      case 'multi_room':
        return 'Đặt nhiều phòng';
      case 'user_level':
        return 'Cấp độ người dùng';
      default:
        return 'Không xác định';
    }
  }

  getConditionText(condition: DiscountCondition): string {
    if (!condition) return 'Không có điều kiện';
    const {
      min_advance_days,
      max_advance_days,
      min_stay_nights,
      max_stay_nights,
      min_rooms,
      user_levels,
    } = condition;
    const conditions: string[] = [];
    if (min_advance_days !== undefined) {
      conditions.push(`Đặt trước tối thiểu ${min_advance_days} ngày`);
    }
    if (max_advance_days !== undefined) {
      conditions.push(`Đặt trước tối đa ${max_advance_days} ngày`);
    }
    if (min_stay_nights !== undefined) {
      conditions.push(`Tối thiểu ${min_stay_nights} đêm lưu trú`);
    }
    if (max_stay_nights !== undefined) {
      conditions.push(`Tối đa ${max_stay_nights} đêm lưu trú`);
    }
    if (min_rooms !== undefined) {
      conditions.push(`Tối thiểu ${min_rooms} phòng`);
    }
    if (user_levels && user_levels.length > 0) {
      conditions.push(`Cấp độ người dùng: ${user_levels.join(', ')}`);
    }
    return conditions.length > 0 ? conditions.join(', ') : 'Không có điều kiện';
  }
}
