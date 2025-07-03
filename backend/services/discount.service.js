import { differenceInCalendarDays } from "date-fns";
import Discount from "../models/discount.model.js";

export const getApplicableDiscounts = async ({ user, bookingInfo }) => {
  const { checkInDate, checkOutDate, roomClassId, totalRooms, promoCode } =
    bookingInfo;
  const stayNights = differenceInCalendarDays(
    new Date(checkOutDate),
    new Date(checkInDate)
  );
  const advanceDays = differenceInCalendarDays(
    new Date(checkInDate),
    new Date()
  );

  const now = new Date();

  const discounts = await Discount.find({
    status: true,
    valid_from: { $lte: now },
    valid_to: { $gte: now },
    $and: [
      {
        $or: [{ promo_code: null }, { promo_code: promoCode || null }],
      },
      {
        $or: [
          { apply_to_room_class_ids: [] },
          { apply_to_room_class_ids: roomClassId },
        ],
      },
    ],
  });


  const applicable = [];

  for (const d of discounts) {
    const { conditions } = d;
    let match = true;

    if (d.type === "promo_code" && d.promoCode !== promoCode) match = false;
    if (conditions?.min_advance_days && advanceDays < conditions.min_advance_days)
      match = false;
    if (conditions?.max_advance_days && advanceDays > conditions.max_advance_days)
      match = false;
    if (conditions?.min_stay_nights && stayNights < conditions.min_stay_nights)
      match = false;
    if (conditions?.max_stay_nights && stayNights > conditions.max_stay_nights)
      match = false;
    if (conditions?.min_rooms && totalRooms < conditions.min_rooms) match = false;
    if (conditions?.user_levels?.length) {
      if (!user || !conditions.user_levels.includes(user.level || "normal")) {
        match = false;
      }
    }

    if (match) applicable.push(d);
  }

  applicable.sort((a, b) => a.priority - b.priority);
  return applicable;
};

export const calculateBookingPrice = async (bookingInfo, user) => {
  const basePrice = bookingInfo.baseTotal;

  const discounts = await getApplicableDiscounts({ user, bookingInfo });

  let finalPrice = basePrice;
  let appliedDiscounts = [];

  for (const d of discounts) {
    const amount = d.value_type === "percent" ? finalPrice * d.value : d.value;

    finalPrice -= amount;
    appliedDiscounts.push({
      discountId: d._id,
      name: d.name,
      amount: amount,
      reason: d.description || "",
    });

    if (!d.can_be_stacked) break;
  }

  return {
    originalPrice: basePrice,
    finalPrice,
    appliedDiscounts,
  };
};
