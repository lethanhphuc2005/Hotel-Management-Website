"use client";
import { CartRoom } from "@/store/cartSlice";
import styles from "@/styles/pages/cart.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { formatCurrencyVN } from "@/utils/currencyUtils";

interface CartTableProps {
  rooms: CartRoom[];
  handleDeleteRoom: (roomId: string) => void;
  handleAddExtraBed: (roomId: string) => void;
  getRoomTotalPrice: (room: CartRoom) => number;
}

export default function CartTable(props: CartTableProps) {
  const { rooms, handleDeleteRoom, handleAddExtraBed, getRoomTotalPrice } =
    props;
  return (
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
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-5 !tw-text-primary">
                Giỏ hàng của bạn đang trống.
              </td>
            </tr>
          ) : (
            rooms.map((room) => (
              <tr key={room.id}>
                <td>
                  <img
                    src={room.img}
                    alt={room.name}
                    className={styles.roomImg}
                  />
                </td>
                <td>
                  <div className={styles.roomName}>{room.name}</div>
                  <div className={styles.roomDesc}>{room.desc}</div>
                  <div style={{ fontSize: "0.95rem", color: "#888" }}>
                    Người lớn: {room.adults}, Trẻ dưới 6 tuổi:{" "}
                    {room.childrenUnder6}, Trẻ trên 6 tuổi: {room.childrenOver6}
                  </div>
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
                <td className="tw-text-left">
                  {!room.services ? (
                    <Link
                      href={"/service"}
                      className="text-decoration-none tw-text-white tw-"
                    >
                      <span className="tw-inline-flex tw-items-center tw-whitespace-nowrap hover:tw-text-primary">
                        Thêm dịch vụ
                        <FontAwesomeIcon
                          icon={faCirclePlus}
                          className="tw-ml-2"
                        />
                      </span>
                    </Link>
                  ) : (
                    <div>
                      {room.services?.map((service, index) => (
                        <span key={index}>
                          {service.name} - {service.quantity}x <br />
                          {formatCurrencyVN(service.price)}
                        </span>
                      ))}
                    </div>
                  )}
                  {room.isNeedExtraBed && !room.isAddExtraBed && (
                    <button
                      onClick={() => handleAddExtraBed(room.id)}
                      className="tw-inline-flex tw-items-center tw-whitespace-nowrap hover:tw-text-primary"
                    >
                      Thêm giường
                      <FontAwesomeIcon
                        icon={faCirclePlus}
                        className="tw-ml-2"
                      />
                    </button>
                  )}
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  {formatCurrencyVN(room.price)}
                  {(room.hasSaturdayNight ||
                    (room.hasSundayNight && room.extraFee)) && (
                    <div style={{ fontSize: "0.9rem", color: "#FAB320" }}>
                      +50% phụ thu đêm cuối tuần
                    </div>
                  )}
                </td>
                <td style={{ verticalAlign: "middle" }}>{room.nights} đêm</td>
                <td style={{ verticalAlign: "middle" }}>
                  {formatCurrencyVN(room.total || getRoomTotalPrice(room))}
                  {room.extraFee && (
                    <div style={{ fontSize: "0.9rem", color: "#FAB320" }}>
                      (+{formatCurrencyVN(room.extraFee)})
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
