import { CartRoom } from "./cartSlice";

// cartSelectors.ts
export const getRoomTotalPrice = (room: CartRoom) => {
  const total = (room.total || 0) + (room.extraFee ?? 0);
  console.log("getRoomTotalPrice", {
    roomId: room.id,
    roomName: room.name,
    total,
    extraFee: room.extraFee,
  });
  const servicePrice =
    room.services?.reduce((sum, s) => sum + s.price * s.quantity, 0) || 0;

  return total + servicePrice;
};
