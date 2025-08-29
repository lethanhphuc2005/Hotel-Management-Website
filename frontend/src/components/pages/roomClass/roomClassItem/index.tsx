"use client";
import { useDispatch, useSelector } from "react-redux";
import { addRoomToCart } from "@/store/cartSlice";
import { toast } from "react-toastify";
import { RoomClass } from "@/types/roomClass";
import { UserFavorite } from "@/types/userFavorite";
import { useFavorite } from "@/hooks/logic/useFavoriteAction";
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
        extraFee: null,
      })
    );
  };

  return (
    <div className="border rounded-4 d-flex flex-column flex-md-row p-3 gap-3 position-relative tw-mb-4">
      <button
        type="button"
        className="btn btn-warning position-absolute tw-end-0 tw-bottom-1 tw-m-3 md:tw-m-2 md:tw-bottom-auto md:tw-top-0"
        onClick={handleAddToCart}
      >
        <i className="bi bi-bag-plus-fill"></i>
      </button>

      <div className="position-relative tw-aspect-square tw-w-full tw-max-w-[300px] tw-min-w-[200px] tw-rounded-2xl tw-overflow-hidden">
        <RoomImageWithLike
          imageUrl={roomClass.images[0].url}
          roomId={roomClass.id}
          liked={liked}
          onLikeClick={handleLikeClick}
        />
      </div>

      <RoomInfo
        roomClass={roomClass}
        numChildrenUnder6={numberOfChildrenUnder6}
        numchildrenOver6={numberOfChildrenOver6}
        numAdults={numberOfAdults}
        capacity={capacity}
        hasWeekend={hasSaturday || hasSunday}
      />

      <div className="mt-3 mt-md-0 align-self-md-end text-md-end">
        <RoomPriceAndBooking
          roomClassId={roomClass.id}
          hasSearched={hasSearched}
          numberOfNights={numberOfNights}
          basePrice={basePrice}
          totalPrice={total}
        />
      </div>
    </div>
  );
}
