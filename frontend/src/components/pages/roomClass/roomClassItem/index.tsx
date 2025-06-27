"use client";
import { useDispatch, useSelector } from "react-redux";
import { addRoomToCart } from "@/contexts/cartSlice";
import { toast } from "react-toastify";
import { useRoomSearch } from "@/hooks/useRoomSearch";
import { RootState } from "@/contexts/store";
import { RoomClass } from "@/types/roomClass";
import { UserFavorite } from "@/types/userFavorite";
import { useFavorite } from "@/hooks/useFavorite";
import RoomImageWithLike from "./RoomImageWithLike";
import RoomInfo from "./RoomInfo";
import RoomPriceAndBooking from "./RoomPriceAndBooking";

export default function RoomClassItem({
  rci,
  numberOfNights,
  totalGuests,
  hasSearched,
  numberOfAdults,
  numberOfChildren,
  startDate,
  endDate,
  numChildrenUnder6 = 0,
  numchildrenOver6 = 0,
  numAdults,
  showExtraBedOver6,
  favorites = [],
}: {
  rci: RoomClass;
  numberOfNights: number;
  totalGuests: number;
  hasSearched?: boolean;
  numberOfAdults?: number;
  numberOfChildren?: number;
  startDate?: Date;
  endDate?: Date;
  numChildrenUnder6?: number;
  numchildrenOver6?: number;
  numAdults?: number;
  showExtraBedOver6?: boolean;
  features?: string[];
  favorites?: UserFavorite[];
}) {
  const dispatch = useDispatch();
  const { liked, handleLikeClick } = useFavorite(rci.id, favorites);
  const { startDate: selectedStartDate, endDate: selectedEndDate } =
    useRoomSearch();
  const adults = numberOfAdults ?? 1;
  const childrenUnder6 = numChildrenUnder6 ?? 0;
  const childrenOver6 = numchildrenOver6 ?? 0;
  const cartRooms = useSelector((state: RootState) => state.cart.rooms);

  const basePrice =
    (rci.price_discount ?? 0) > 0 ? rci.price_discount ?? 0 : rci.price;

  function calcTotalPricePerNight(start?: Date, end?: Date) {
    if (!start || !end) return basePrice;
    let total = 0;
    const current = new Date(start);
    while (current < end) {
      total +=
        current.getDay() === 6 || current.getDay() === 0
          ? basePrice * 1.5
          : basePrice;
      current.setDate(current.getDate() + 1);
    }
    return total;
  }

  const totalPrice = calcTotalPricePerNight(startDate, endDate);

  const checkInISO = startDate?.toLocaleDateString("vi-VN") || "";
  const checkOutISO = endDate?.toLocaleDateString("vi-VN") || "";

  const handleAddToCart = () => {
    if (!hasSearched || !selectedStartDate || !selectedEndDate) {
      toast.error(
        "Vui lòng chọn ngày nhận và trả phòng trước khi thêm vào giỏ hàng!"
      );
      return;
    }

    const isDuplicate = cartRooms.some(
      (room) =>
        room.name.includes(rci.name) &&
        room.view === rci.view &&
        room.checkIn === checkInISO &&
        room.checkOut === checkOutISO
    );

    if (isDuplicate) {
      toast.error("Phòng này bạn đã thêm vào giỏ hàng rồi!");
      return;
    }

    if (cartRooms.length > 0) {
      const firstRoom = cartRooms[0];
      if (
        firstRoom.checkIn !== checkInISO ||
        firstRoom.checkOut !== checkOutISO
      ) {
        toast.error(
          "Bạn chỉ có thể thêm phòng có cùng ngày nhận và trả phòng!"
        );
        return;
      }
    }

    const current = new Date(startDate!);
    let hasSaturday = false;
    let hasSunday = false;
    while (current < endDate!) {
      if (current.getDay() === 6) hasSaturday = true;
      if (current.getDay() === 0) hasSunday = true;
      current.setDate(current.getDate() + 1);
    }

    dispatch(
      addRoomToCart({
        id: rci.id,
        name: rci.name,
        img: rci?.images?.[0]?.url || "",
        desc: `${adults} người lớn${
          childrenUnder6 > 0 ? `, ${childrenUnder6} trẻ 0–6 tuổi` : ""
        }${childrenOver6 > 0 ? `, ${childrenOver6} trẻ 7–17 tuổi` : ""}, ${
          rci.bed_amount
        } giường đôi`,
        price: basePrice,
        nights: numberOfNights,
        checkIn: checkInISO,
        checkOut: checkOutISO,
        adults,
        childrenUnder6,
        childrenOver6,
        bedAmount: rci.bed_amount,
        view: rci.view,
        total: totalPrice,
        hasSaturdayNight: hasSaturday,
        hasSundayNight: hasSunday,
        features: rci?.features?.map((f) => f.feature_id.name) ?? [],
      })
    );
    toast.success("Đã thêm phòng vào giỏ hàng!");
  };

  return (
    <div
      className="border rounded-4 d-flex p-3 gap-3 position-relative"
      style={{ height: "280px" }}
    >
      <button
        type="button"
        className="btn btn-warning position-absolute top-0 end-0 m-2"
        onClick={handleAddToCart}
      >
        <i className="bi bi-bag-plus-fill"></i>
      </button>

      <RoomImageWithLike
        imageUrl={rci?.images?.[0]?.url || ""}
        roomId={rci.id}
        liked={liked}
        onLikeClick={handleLikeClick}
      />

      <RoomInfo
        rci={rci}
        numChildrenUnder6={childrenUnder6}
        numchildrenOver6={childrenOver6}
        numAdults={numAdults}
        showExtraBedOver6={showExtraBedOver6}
      />

      <RoomPriceAndBooking
        hasSearched={hasSearched}
        numberOfNights={numberOfNights}
        numberOfAdults={numberOfAdults}
        numChildrenUnder6={childrenUnder6}
        numchildrenOver6={childrenOver6}
        totalPrice={totalPrice}
        basePrice={basePrice}
      />
    </div>
  );
}
