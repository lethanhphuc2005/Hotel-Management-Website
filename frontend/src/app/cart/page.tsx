"use client";
import { useDispatch, useSelector } from "react-redux";
import styles from "@/styles/pages/cart.module.css";
import { RootState } from "@/contexts/store";
import { removeRoomFromCart, clearCart } from "@/contexts/cartSlice";
import Link from "next/link";
import { getRoomTotalPrice } from "@/contexts/cartSelector";
import { showConfirmDialog } from "@/utils/swal";
import { toast } from "react-toastify";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCirclePlus } from "@fortawesome/free-solid-svg-icons";

export default function Cart() {
  const rooms = useSelector((state: RootState) => state.cart.rooms);
  const dispatch = useDispatch();
  const total = rooms.reduce((sum, room) => {
    const roomTotal = getRoomTotalPrice(room);
    return sum + roomTotal;
  }, 0);

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className={styles.cartTitle}>Giỏ Hàng</div>

        <Link href="/">
          <button className="btn bg-black border text-white">
            ← Tiếp tục đặt phòng
          </button>
        </Link>
      </div>
      <div className="table-responsive">
        <table className={`table align-middle ${styles.darkTable}`}>
          <thead>
            <tr>
              <th></th>
              <th className="fw-normal">PHÒNG</th>
              <th className="fw-normal">DỊCH VỤ</th>
              <th className="fw-normal">GIÁ/ĐÊM</th>
              <th className="fw-normal">SỐ ĐÊM</th>
              <th className="fw-normal">TỔNG</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-5 text-secondary">
                  Giỏ hàng của bạn đang trống.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id}>
                  <td>
                    <img
                      src={`/img/${room.img}`}
                      alt={room.name}
                      className={styles.roomImg}
                    />
                  </td>
                  <td>
                    <div className={styles.roomName}>{room.name}</div>
                    <div className={styles.roomDesc}>{room.desc}</div>
                    <div style={{ fontSize: "0.95rem", color: "#888" }}>
                      Nhận phòng: {room.checkIn}
                    </div>
                    <div style={{ fontSize: "0.95rem", color: "#888" }}>
                      Trả phòng: {room.checkOut}
                    </div>
                    <button
                      className={`${styles.removeBtn} mt-2`}
                      title="Xóa khỏi giỏ"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="tw-mx-2" />
                      Xóa
                    </button>
                  </td>
                  <td>
                    {!room.services ? (
                      <Link
                        href={"/service"}
                        className="text-decoration-none tw-text-white"
                      >
                        <div className="hover:tw-text-primary">
                          <span>Thêm dịch vụ</span>
                          <FontAwesomeIcon
                            icon={faCirclePlus}
                            className="tw-ml-2"
                          />
                        </div>
                      </Link>
                    ) : (
                      <div className={styles.roomServices}>
                        {room.services?.map((service, index) => (
                          <span key={index} className={styles.serviceItem}>
                            {service.name} - {service.quantity}x <br />
                            {formatCurrencyVN(service.price)}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    {formatCurrencyVN(room.price)}
                    {(room.hasSaturdayNight || room.hasSundayNight) && (
                      <div style={{ fontSize: "0.9rem", color: "#FAB320" }}>
                        +50% phụ thu do có đêm cuối tuần
                      </div>
                    )}
                  </td>
                  <td style={{ verticalAlign: "middle" }}>{room.nights} đêm</td>
                  <td style={{ verticalAlign: "middle" }}>
                    {formatCurrencyVN(getRoomTotalPrice(room))}
                  </td>
                  <td></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rooms.length > 0 && (
        <>
          {" "}
          <button
            className="btn btn-outline-danger tw-w-full"
            onClick={() => handleDeleteCart()}
          >
            Xóa toàn bộ giỏ phòng
          </button>
          <div className={styles.shippingBox + " mt-3"}>
            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}>
                <span>Tạm tính</span>
                <span>{formatCurrencyVN(total)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Phí dịch vụ</span>
                <span>Miễn phí</span>
              </div>
              <div className={styles.summaryRow + " " + styles.summaryTotal}>
                <span>Tổng cộng</span>
                <span>{formatCurrencyVN(total)}</span>
              </div>
            </div>
            <div className="text-end mt-4 mb-1">
              <Link href="/payment" className={styles.checkoutBtn}>
                Đặt phòng ({formatCurrencyVN(total)})
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
