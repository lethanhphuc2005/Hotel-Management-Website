"use client";
import { useDispatch, useSelector } from "react-redux";
import styles from "@/styles/pages/cart.module.css";
import { RootState } from "@/store/store";
import {
  removeRoomFromCart,
  clearCart,
  addExtraBedToCart,
} from "@/store/cartSlice";
import { getRoomTotalPrice } from "@/store/cartSelector";
import { showConfirmDialog } from "@/utils/swal";
import { toast } from "react-toastify";
import CartTitle from "@/components/pages/cart/Title";
import CartTable from "@/components/pages/cart/Table";
import CartAction from "@/components/pages/cart/Action";
import { useMemo } from "react";

export default function Cart() {
  const rooms = useSelector((state: RootState) => state.cart.rooms);
  const dispatch = useDispatch();
  const total = useMemo(() => {
    return rooms.reduce((sum, room) => {
      return sum + getRoomTotalPrice(room);
    }, 0);
  }, [rooms]);

  const extraTotal = rooms.reduce((sum, room) => sum + (room.extraFee || 0), 0);

  const handleDeleteRoom = async (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;
    const result = await showConfirmDialog(
      `Bạn có chắc muốn xóa phòng "${room.name}" khỏi giỏ hàng?`,
      "Phòng này sẽ bị xóa khỏi giỏ hàng.",
      "Xóa",
      "Huỷ"
    );
    if (!result) {
      return;
    } else {
      toast.success(`Đã xóa phòng "${room.name}" khỏi giỏ hàng.`);
    }
    dispatch(removeRoomFromCart(roomId));
  };

  const handleAddExtraBed = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    const extraBedPrice = 100_000;
    if (!room) return;

    dispatch(
      addExtraBedToCart({
        roomId,
        extraBedPrice,
      })
    );
  };

  const handleDeleteCart = async () => {
    const result = await showConfirmDialog(
      "Bạn có chắc muốn xóa toàn bộ giỏ hàng?",
      "Tất cả phòng và dịch vụ sẽ bị xóa khỏi giỏ hàng.",
      "Xóa",
      "Huỷ"
    );

    if (!result) {
      return;
    } else {
      toast.success("Đã xóa toàn bộ giỏ hàng.");
    }
    dispatch(clearCart());
  };

  return (
    <div className={`container ${styles.cartContainer}`}>
      <CartTitle />

      <CartTable
        rooms={rooms}
        handleDeleteRoom={handleDeleteRoom}
        handleAddExtraBed={handleAddExtraBed}
        getRoomTotalPrice={getRoomTotalPrice}
      />

      {rooms.length > 0 && (
        <CartAction total={total} extraTotal={extraTotal} handleDeleteCart={handleDeleteCart} />
      )}
    </div>
  );
}
