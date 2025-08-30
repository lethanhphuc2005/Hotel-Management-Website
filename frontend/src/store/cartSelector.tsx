import { CartRoom } from "./cartSlice";

// cartSelectors.ts
export const getRoomTotalPrice = (room: CartRoom) => {
  const total = (room.total || 0)
  const servicePrice =
    room.services?.reduce((sum, s) => sum + s.price * s.quantity, 0) || 0;

  return total + servicePrice;
};

export const getFinalRoomPrice = (room: CartRoom) => {
  const basePrice = getRoomTotalPrice(room);
  const extraFee = room.extraFee || 0;
  return basePrice + extraFee;
}