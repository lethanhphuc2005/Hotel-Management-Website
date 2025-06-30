import { RoomClass } from "@/types/roomClass";

interface FilterParams {
  roomClasses: RoomClass[];
  selectedViews: string[];
  selectedFeatureIds: string[];
  selectedMainRoomClassIds: string[];
  priceRange: [number, number];
  guests: {
    adults: number;
    children: {
      age0to6: number;
      age7to17: number;
    };
  };
  dateRange: { startDate: Date; endDate: Date; key: string }[];
}

export function useRoomFilterLogic({
  roomClasses,
  selectedViews,
  selectedFeatureIds,
  selectedMainRoomClassIds,
  priceRange,
  guests,
}: FilterParams) {
  const filteredRoomClass = roomClasses.filter(
    (item) =>
      item.price >= priceRange[0] &&
      item.price <= priceRange[1] &&
      (selectedViews.length === 0 || selectedViews.includes(item.view)) &&
      (selectedFeatureIds.length === 0 ||
        selectedFeatureIds.every((selectedId) =>
          item.features?.some((f) => f.feature_id.id === selectedId)
        )) &&
      (selectedMainRoomClassIds.length === 0 ||
        selectedMainRoomClassIds.some(
          (selectedId) => item.main_room_class_id === selectedId
        ))
  );

  const numAdults = guests.adults ?? 0;
  const numChildrenUnder6 = guests.children.age0to6 ?? 0;
  const numChildrenOver6 = guests.children.age7to17 ?? 0;

  const adultPairs = Math.floor(numAdults / 2);
  const teenPairs = Math.floor(numChildrenOver6 / 2);
  const maxChildrenCanShare = adultPairs + teenPairs;
  const numChildrenNeedBed = Math.max(
    0,
    numChildrenUnder6 - maxChildrenCanShare
  );
  const totalNeedBed = numAdults + numChildrenOver6 + numChildrenNeedBed;
  const minBedsNeeded = Math.ceil(totalNeedBed / 2);

  const isSpecialCase =
    (numAdults === 1 && numChildrenOver6 === 1 && numChildrenUnder6 === 1) ||
    (numAdults === 1 && numChildrenOver6 === 0 && numChildrenUnder6 === 2);

  const suitableRoomClass = filteredRoomClass.filter(
    (room) =>
      room.bed_amount * 2 >= totalNeedBed ||
      (isSpecialCase && room.bed_amount === 1)
  );

  const minBed = Math.min(...suitableRoomClass.map((room) => room.bed_amount));
  const topRooms = suitableRoomClass.filter(
    (room) => room.bed_amount === minBed
  );
  const otherRooms = suitableRoomClass.filter(
    (room) => room.bed_amount !== minBed
  );

  const displayRoomClass = isSpecialCase
    ? [...topRooms, ...otherRooms]
    : suitableRoomClass
        .map((room) => ({
          ...room,
          isSuitable: room.bed_amount >= minBedsNeeded,
        }))
        .sort((a, b) => {
          if (a.isSuitable && !b.isSuitable) return -1;
          if (!a.isSuitable && b.isSuitable) return 1;
          return a.bed_amount - b.bed_amount;
        });

  const maxCapacity = filteredRoomClass.reduce(
    (max, room) => Math.max(max, room.capacity),
    0
  );
  const effectiveChildrenUnder6 = Math.max(
    0,
    numChildrenUnder6 - maxChildrenCanShare
  );
  const totalEffectiveGuests =
    numAdults + numChildrenOver6 + effectiveChildrenUnder6;
  const isOverCapacity = totalEffectiveGuests > maxCapacity;

  const showExtraBedOver6 =
    numChildrenOver6 > 0 && totalNeedBed > minBedsNeeded * 2;

  return {
    filteredRoomClass,
    suitableRoomClass,
    displayRoomClass,
    totalEffectiveGuests,
    isOverCapacity,
    showExtraBedOver6,
    numAdults,
    numChildrenUnder6,
    numChildrenOver6,
  };
}
