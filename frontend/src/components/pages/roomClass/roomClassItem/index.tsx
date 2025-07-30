"use client";
import { useDispatch, useSelector } from "react-redux";
import { addRoomToCart } from "@/store/cartSlice";
import { toast } from "react-toastify";
import { RoomClass } from "@/types/roomClass";
import { UserFavorite } from "@/types/userFavorite";
import { useFavorite } from "@/hooks/useFavorite";
import RoomImageWithLike from "./RoomImageWithLike";
import RoomInfo from "./RoomInfo";
import RoomPriceAndBooking from "./RoomPriceAndBooking";

export default function RoomClassItem({
  roomClass,
  hasSearched,
  numberOfNights = 1,
  numberOfAdults = 1,
  startDate,
  endDate,
  capacity,
  hasSaturday = false,
  hasSunday = false,
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
  startDate: Date;
  endDate: Date;
  capacity: number;
  hasSaturday?: boolean;
  hasSunday?: boolean;
  favorites?: UserFavorite[];
}) {
  const dispatch = useDispatch();
  const { liked, handleLikeClick } = useFavorite(roomClass.id, favorites);

  const basePrice =
    (roomClass.price_discount ?? 0) > 0
      ? roomClass.price_discount ?? 0
      : roomClass.price;

  let total = 0;
  let current = new Date(startDate);

  while (current < endDate) {
    const day = current.getDay();
    const isWeekend = day === 0 || day === 6;
    const price = basePrice * (isWeekend ? 1.5 : 1);
    total += price;

    current.setDate(current.getDate() + 1);
  }

  const isNeedExtraBed =
    numberOfAdults + numberOfChildrenUnder6 + numberOfChildrenOver6 > capacity;

  const handleAddToCart = () => {
    dispatch(
      addRoomToCart({
        id: roomClass.id,
        name: roomClass.name,
        img: roomClass.images[0].url,
        price: basePrice,
        nights: numberOfNights,
        checkIn: startDate.toISOString(),
        checkOut: endDate.toISOString(),
        adults: numberOfAdults,
        childrenUnder6: numberOfChildrenUnder6,
        childrenOver6: numberOfChildrenOver6,
        bedAmount: roomClass.bed.quantity,
        view: roomClass.view,
        isNeedExtraBed,
        hasSaturdayNight: hasSaturday,
        hasSundayNight: hasSunday,
        features: roomClass.features?.map((f) => f.feature.name) ?? [],
      })
    );
  };

  return (
    <div className="border rounded-4 d-flex p-3 gap-3 position-relative">
      <button
        type="button"
        className="btn btn-warning position-absolute top-0 end-0 m-2"
        onClick={handleAddToCart}
      >
        <i className="bi bi-bag-plus-fill"></i>
      </button>

      <RoomImageWithLike
        imageUrl={roomClass.images[0].url}
        roomId={roomClass.id}
        liked={liked}
        onLikeClick={handleLikeClick}
      />

      <RoomInfo
        roomClass={roomClass}
        numChildrenUnder6={numberOfChildrenUnder6}
        numchildrenOver6={numberOfChildrenOver6}
        numAdults={numberOfAdults}
        capacity={capacity}
        hasWeekend={hasSaturday || hasSunday}
      />

      <RoomPriceAndBooking
        roomClassId={roomClass.id}
        hasSearched={hasSearched}
        numberOfNights={numberOfNights}
        basePrice={basePrice}
        totalPrice={total}
      />
    </div>
  );
}
