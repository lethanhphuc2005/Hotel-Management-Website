import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartService {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
}

export interface CartRoom {
  id: string;
  name: string;
  img: string;
  desc: string;
  price: number;
  nights: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenUnder6: number;
  childrenOver6: number;
  bedAmount: number;
  view: string;
  total: number;
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
      state.rooms.push(action.payload);
    },
    removeRoomFromCart: (state, action: PayloadAction<string>) => {
      state.rooms = state.rooms.filter((room) => room.id !== action.payload);
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
  removeRoomFromCart,
  addServiceToRoom,
  removeServiceFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
