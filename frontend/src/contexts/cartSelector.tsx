import { CartRoom } from "./cartSlice";

// cartSelectors.ts
export const getRoomTotalPrice = (room: CartRoom) => {
  const [checkInDay, checkInMonth, checkInYear] = room.checkIn.split("/");
  const [checkOutDay, checkOutMonth, checkOutYear] = room.checkOut.split("/");

  const start = new Date(`${checkInYear}-${checkInMonth}-${checkInDay}`);
  const end = new Date(`${checkOutYear}-${checkOutMonth}-${checkOutDay}`);

  const basePrice = room.price;
  let total = 0;
  const current = new Date(start);

  while (current < end) {
    const day = current.getDay();
    if (day === 6 || day === 0) {
      total += basePrice * 1.5;
    } else {
      total += basePrice;
    }
    current.setDate(current.getDate() + 1);
  }

  const servicePrice =
    room.services?.reduce((sum, s) => sum + s.price * s.quantity, 0) || 0;

  return total + servicePrice;
};
