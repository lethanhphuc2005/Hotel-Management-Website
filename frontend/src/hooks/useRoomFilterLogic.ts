import { useMemo } from "react";
import { RoomClass } from "@/types/roomClass";
import { DateRange } from "@/types/_common";

interface FilterParams {
  roomClasses: RoomClass[];
  searchTerm?: string;
  sortOption?: string; // Not used in the logic, but can be added if needed
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
  dateRange: DateRange[];
}

export function useRoomFilterLogic({
  roomClasses,
  searchTerm = "",
  sortOption = "price_asc", // Default sort option, not used in the logic
  selectedViews,
  selectedFeatureIds,
  selectedMainRoomClassIds,
  priceRange,
  guests,
  dateRange,
}: FilterParams) {
  return useMemo(() => {
    // thuật toán tính số giường cần
    function calculateMinBedsNeeded(
      adults: number,
      teens: number,
      kidsUnder6: number
    ) {
      let beds = 0;
      let remainingAdults = adults;
      let remainingTeens = teens;
      let remainingKidsUnder6 = kidsUnder6;

      // Xử lý TH đặc biệt: 1 người lớn + 1 teen + 1 trẻ <6 => 1 giường
      if (adults === 1 && teens === 1 && kidsUnder6 === 1) {
        return 1;
      }

      // Ghép 2 người lớn với nhau
      beds += Math.floor(remainingAdults / 2);
      remainingAdults %= 2;

      // Ghép 1 người lớn + 1 teen
      if (remainingAdults === 1 && remainingTeens >= 1) {
        beds += 1;
        remainingAdults = 0;
        remainingTeens -= 1;
      }

      // Người lớn còn lại (lẻ) => 1 giường riêng
      if (remainingAdults === 1) {
        beds += 1;
        remainingAdults = 0;
      }

      // Ghép 2 teen với nhau
      beds += Math.floor(remainingTeens / 2);
      remainingTeens %= 2;

      // 1 teen dư => dùng giường xếp, KHÔNG cộng thêm vào `beds`

      // ====== Xử lý trẻ dưới 6 tuổi ======

      // Nếu có ít nhất 1 người lớn -> 1 trẻ <6 có thể nằm chung
      if (adults >= 1 && kidsUnder6 > 0) {
        remainingKidsUnder6 -= 1;
      }

      if (remainingKidsUnder6 > 0) {
        // Cứ 2 trẻ nằm chung 1 giường
        beds += Math.floor(remainingKidsUnder6 / 2);
        if (remainingKidsUnder6 % 2 !== 0) {
          beds += 1;
        }
      }

      return beds;
    }

    // --- Guest logic ---
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
    const minBedsNeeded = calculateMinBedsNeeded(
      numAdults,
      numChildrenOver6,
      numChildrenUnder6
    );

    const isSpecialCase =
      (numAdults === 1 && numChildrenOver6 === 1 && numChildrenUnder6 === 1) ||
      (numAdults === 1 && numChildrenOver6 === 0 && numChildrenUnder6 === 2);

    // --- Lọc cơ bản ---
    const filteredRoomClass = roomClasses.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPrice =
        item.price >= priceRange[0] && item.price <= priceRange[1];

      const matchView =
        selectedViews.length === 0 || selectedViews.includes(item.view);

      const matchFeatures =
        selectedFeatureIds.length === 0 ||
        selectedFeatureIds.every((selectedId) =>
          item.features?.some((f) => f.feature.id === selectedId)
        );

      const matchMainRoomClass =
        selectedMainRoomClassIds.length === 0 ||
        selectedMainRoomClassIds.includes(item.main_room_class_id);

      return (
        matchSearch &&
        matchPrice &&
        matchView &&
        matchFeatures &&
        matchMainRoomClass
      );
    });

    // --- Lọc theo số giường phù hợp ---
    const suitableRoomClass = filteredRoomClass.filter(
      (room) => room.bed_amount >= minBedsNeeded
    );

    // --- Ưu tiên phòng ít giường nhất ---
    const minBed = Math.min(
      ...suitableRoomClass.map((room) => room.bed_amount)
    );
    const topRooms = suitableRoomClass.filter(
      (room) => room.bed_amount === minBed
    );
    const otherRooms = suitableRoomClass.filter(
      (room) => room.bed_amount !== minBed
    );

    // --- Sắp xếp hiển thị ---
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

    // --- Check quá tải ---
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

    // --- Extra bed check ---
    // const showExtraBedOver6 =
    //   numChildrenOver6 > 0 && totalNeedBed > minBedsNeeded * 2;

    // --- Sắp xếp displayRoomClass theo sortOption ---
    const displayRoomClassSorted = [...displayRoomClass]
      .map((room) => {
        const reviews = room.reviews || [];
        const totalRating = reviews.reduce(
          (sum, r) => sum + (r.rating || 0),
          0
        );
        const rating = reviews.length ? totalRating / reviews.length : 0;
        return { ...room, rating };
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "rating_asc":
            return (a.rating || 0) - (b.rating || 0);
          case "rating_desc":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });

    return {
      filteredRoomClass,
      suitableRoomClass,
      displayRoomClass: displayRoomClassSorted,
      totalEffectiveGuests,
      isOverCapacity,
      numAdults,
      numChildrenUnder6,
      numChildrenOver6,
    };
  }, [
    roomClasses,
    searchTerm,
    sortOption,
    selectedViews,
    selectedFeatureIds,
    selectedMainRoomClassIds,
    priceRange,
    guests,
    dateRange,
  ]);
}
