import { CartRoom } from "./cartSlice";

// cartSelectors.ts
export const getRoomTotalPrice = (room: CartRoom) => {
  const roomPrice =
    room.price * room.nights * (room.hasSaturdayNight ? 1.5 : 1);
  const servicePrice =
    room.services?.reduce((sum, s) => sum + s.price * s.quantity, 0) || 0;
  return roomPrice + servicePrice;
};
