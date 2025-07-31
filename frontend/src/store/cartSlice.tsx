import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getRoomTotalPrice } from "./cartSelector";

export interface CartService {
  id: string;
  name: string;
  image: string;
  description?: string;
  price: number;
  quantity: number;
}

export interface CartRoom {
  id: string;
  name: string;
  img: string;
  desc?: string;
  price: number;
  nights: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenUnder6: number;
  childrenOver6: number;
  bedAmount: number;
  view: string;
  extraFee: number | null; // Phụ thu cuối tuần hoặc giường phụ
  total?: number;
  isNeedExtraBed?: boolean;
  isAddExtraBed?: boolean; // Đánh dấu đã thêm giường phụ
  hasSaturdayNight: boolean;
  hasSundayNight: boolean;
  features: string[];
  services?: CartService[]; // Thêm vào đây
}

interface CartState {
  rooms: CartRoom[];
  services: CartService[];
}

const initialState: CartState = {
  rooms: [],
  services: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // === Phòng ===
    addRoomToCart: (state, action: PayloadAction<CartRoom>) => {
      const cartItem = action.payload;
      const cartRooms = state.rooms;

      let basePrice = cartItem.price;
      if (cartItem.hasSaturdayNight || cartItem.hasSundayNight) {
        basePrice *= 1.5; // Tăng giá nếu có cuối tuần
      }

      const startDate = new Date(cartItem.checkIn);
      const endDate = new Date(cartItem.checkOut);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isStartToday =
        startDate instanceof Date &&
        new Date(startDate).setHours(0, 0, 0, 0) === today.getTime();

      const isEndToday =
        endDate instanceof Date &&
        new Date(endDate).setHours(0, 0, 0, 0) === today.getTime();

      if (!startDate || !endDate) {
        toast.error("Vui lòng chọn ngày nhận và trả phòng!");
        return;
      }

      if (startDate > endDate) {
        toast.error("Ngày nhận phòng không thể sau ngày trả phòng!");
        return;
      }

      if (isStartToday || isEndToday) {
        toast.error("Vui lòng chọn ngày nhận và trả phòng không phải hôm nay!");
        return;
      }

      const isDuplicate = cartRooms.some((room) => room.id === cartItem.id);

      if (isDuplicate) {
        toast.error("Phòng này bạn đã thêm vào giỏ hàng rồi!");
        return;
      }

      const checkInIso = startDate.toLocaleDateString("vi-VN");
      const checkOutIso = endDate.toLocaleDateString("vi-VN");

      if (cartRooms.length > 0) {
        const firstRoom = cartRooms[0];
        if (
          firstRoom.checkIn !== checkInIso ||
          firstRoom.checkOut !== checkOutIso
        ) {
          toast.error(
            "Bạn chỉ có thể thêm phòng có cùng ngày nhận và trả phòng!"
          );
          return;
        }
      }

      const newRoom: CartRoom = {
        ...cartItem,
        checkIn: checkInIso,
        checkOut: checkOutIso,
        price: basePrice,
        total: 0, // Sẽ tính sau
      };

      // Tính tổng giá phòng
      const total =
        (newRoom.price * (endDate.getTime() - startDate.getTime())) /
        (1000 * 3600 * 24); //

      let extraFee = 0;
      let current = new Date(startDate);
      while (current < endDate) {
        const day = current.getDay();
        if (day === 0 || day === 6) {
          extraFee += newRoom.price * 0.5; // Phụ thu 50% cho cuối tuần
        }
        current.setDate(current.getDate() + 1);
      }
      if (extraFee > 0) {
        newRoom.extraFee = extraFee;
      } else {
        newRoom.extraFee = null; // Không có phụ thu
      }

      const description = `
        Phòng: ${newRoom.name}, ${newRoom.adults} người lớn, ${
        newRoom.childrenUnder6
      } trẻ em dưới 6 tuổi,  ${newRoom.childrenOver6} trẻ em trên 6 tuổi, ${
        newRoom.bedAmount
      } giường,
        ${newRoom.isAddExtraBed ? "cần giường phụ" : ""}
      `;

      newRoom.desc = description.trim();
      newRoom.total = total;
      state.rooms.push(newRoom);
      console.log("Thêm phòng vào giỏ hàng:", newRoom);
      toast.success("Đã thêm phòng vào giỏ hàng!");
    },
    removeRoomFromCart: (state, action: PayloadAction<string>) => {
      state.rooms = state.rooms.filter((room) => room.id !== action.payload);
    },

    addExtraBedToCart: (
      state,
      action: PayloadAction<{
        roomId: string;
        extraBedPrice: number;
      }>
    ) => {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room) {
        room.extraFee = (room.extraFee ?? 0) + action.payload.extraBedPrice;
        room.isAddExtraBed = true; // Đánh dấu đã thêm giường phụ
        room.total = getRoomTotalPrice(room); // Cập nhật tổng giá phòng
        toast.success(`Đã thêm giường phụ cho phòng "${room.name}".`);
      }
    },

    // === Dịch vụ ===
    addServiceToRoom: (
      state,
      action: PayloadAction<{
        roomId: string;
        service: CartService;
      }>
    ) => {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room) {
        if (!room.services) room.services = [];

        const existingService = room.services.find(
          (s) => s.id === action.payload.service.id
        );

        if (existingService) {
          existingService.quantity += action.payload.service.quantity;
        } else {
          room.services.push(action.payload.service);
        }
      }
    },

    removeServiceFromCart: (state, action: PayloadAction<string>) => {
      state.services = state.services.filter((s) => s.id !== action.payload);
    },

    // === Xoá tất cả ===
    clearCart: (state) => {
      state.rooms = [];
      state.services = [];
    },
  },
});

export const {
  addRoomToCart,
  addExtraBedToCart,
  removeRoomFromCart,
  addServiceToRoom,
  removeServiceFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
