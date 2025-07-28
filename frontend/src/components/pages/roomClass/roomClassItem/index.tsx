"use client";
import { useDispatch, useSelector } from "react-redux";
import { addRoomToCart } from "@/contexts/cartSlice";
import { toast } from "react-toastify";
import { RootState } from "@/contexts/store";
import { RoomClass } from "@/types/roomClass";
import { UserFavorite } from "@/types/userFavorite";
import { useFavorite } from "@/hooks/useFavorite";
import RoomImageWithLike from "./RoomImageWithLike";
import RoomInfo from "./RoomInfo";
import RoomPriceAndBooking from "./RoomPriceAndBooking";
import getImageUrl from "@/utils/getImageUrl";

export default function RoomClassItem({
  roomClass,
  hasSearched,
  numberOfNights = 1,
  numberOfAdults = 1,
  startDate,
  endDate,
  numberOfChildrenUnder6 = 0,
  numberOfChildrenOver6 = 0,
  favorites = [],
}: {
  roomClass: RoomClass;
  hasSearched: boolean;
  numberOfNights: number;
  numberOfAdults: number;
  numberOfChildrenUnder6?: number;
  numberOfChildrenOver6?: number;
  startDate?: Date;
  endDate?: Date;
  favorites?: UserFavorite[];
}) {
  const dispatch = useDispatch();
  const { liked, handleLikeClick } = useFavorite(roomClass.id, favorites);

  const cartRooms = useSelector((state: RootState) => state?.cart.rooms);

  let basePrice =
    (roomClass.price_discount ?? 0) > 0
      ? roomClass.price_discount ?? 0
      : roomClass.price;

  function calcTotalPricePerNight() {
    if (!startDate || !endDate) return basePrice;
    let total = 0;
    const current = new Date(startDate);
    while (current < endDate) {
      total +=
        current.getDay() === 6 || current.getDay() === 0
          ? basePrice * 1.5
          : basePrice;
      current.setDate(current.getDate() + 1);
    }
    return total;
  }

  const totalPrice = calcTotalPricePerNight();

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn ngày nhận và trả phòng!");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isStartToday =
      startDate instanceof Date &&
      new Date(startDate).setHours(0, 0, 0, 0) === today.getTime();

    const isEndToday =
      endDate instanceof Date &&
      new Date(endDate).setHours(0, 0, 0, 0) === today.getTime();

    if (isStartToday || isEndToday) {
      toast.error("Vui lòng chọn ngày nhận và trả phòng không phải hôm nay!");
      return;
    }

    const isDuplicate = cartRooms.some((room) =>
      room.id.includes(roomClass.id)
    );

    if (isDuplicate) {
      toast.error("Phòng này bạn đã thêm vào giỏ hàng rồi!");
      return;
    }

    const checkInISO = startDate.toLocaleDateString("vi-VN") || "";
    const checkOutISO = endDate.toLocaleDateString("vi-VN") || "";

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

    const current = new Date(startDate);
    let hasSaturday = false;
    let hasSunday = false;
    while (current < endDate!) {
      if (current.getDay() === 6) hasSaturday = true;
      if (current.getDay() === 0) hasSunday = true;
      current.setDate(current.getDate() + 1);
    }

    const description = `${numberOfAdults} người lớn${
      numberOfChildrenUnder6 > 0
        ? `, ${numberOfChildrenUnder6} trẻ dưới 6 tuổi`
        : ""
    }${
      numberOfChildrenOver6 > 0
        ? `, ${numberOfChildrenOver6} trẻ trên 6 tuổi`
        : ""
    }, ${roomClass.bed_amount} giường đôi`;

    dispatch(
      addRoomToCart({
        id: roomClass.id,
        name: roomClass.name,
        img: roomClass?.images?.[0]?.url || "",
        desc: description,
        price: basePrice,
        nights: numberOfNights,
        checkIn: checkInISO,
        checkOut: checkOutISO,
        adults: numberOfAdults,
        childrenUnder6: numberOfChildrenUnder6,
        childrenOver6: numberOfChildrenOver6,
        bedAmount: roomClass.bed_amount,
        view: roomClass.view,
        total: totalPrice,
        hasSaturdayNight: hasSaturday,
        hasSundayNight: hasSunday,
        features: roomClass?.features?.map((f) => f.feature.name) ?? [],
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
        imageUrl={getImageUrl(roomClass?.images?.[0]?.url)}
        roomId={roomClass.id}
        liked={liked}
        onLikeClick={handleLikeClick}
      />

      <RoomInfo
        roomClass={roomClass}
        numChildrenUnder6={numberOfChildrenUnder6}
        numchildrenOver6={numberOfChildrenOver6}
        numAdults={numberOfAdults}
      />

      <RoomPriceAndBooking
        roomClassId={roomClass.id}
        hasSearched={hasSearched}
        numberOfNights={numberOfNights}
        numberOfAdults={numberOfAdults}
        numChildrenUnder6={numberOfChildrenUnder6}
        numchildrenOver6={numberOfChildrenOver6}
        totalPrice={totalPrice}
        basePrice={basePrice}
      />
    </div>
  );
}
