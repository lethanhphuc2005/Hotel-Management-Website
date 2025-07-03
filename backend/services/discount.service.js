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
    validFrom: { $lte: now },
    validTo: { $gte: now },
    $and: [
      {
        $or: [{ promoCode: null }, { promoCode: promoCode || null }],
      },
      {
        $or: [
          { applyToRoomClassIds: [] },
          { applyToRoomClassIds: roomClassId },
        ],
      },
    ],
  });


  const applicable = [];

  for (const d of discounts) {
    const { conditions } = d;
    let match = true;

    if (d.type === "promo_code" && d.promoCode !== promoCode) match = false;
    if (conditions?.minAdvanceDays && advanceDays < conditions.minAdvanceDays)
      match = false;
    if (conditions?.maxAdvanceDays && advanceDays > conditions.maxAdvanceDays)
      match = false;
    if (conditions?.minStayNights && stayNights < conditions.minStayNights)
      match = false;
    if (conditions?.maxStayNights && stayNights > conditions.maxStayNights)
      match = false;
    if (conditions?.minRooms && totalRooms < conditions.minRooms) match = false;
    if (conditions?.userLevels?.length) {
      if (!user || !conditions.userLevels.includes(user.level || "normal")) {
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
    const amount = d.valueType === "percent" ? finalPrice * d.value : d.value;

    finalPrice -= amount;
    appliedDiscounts.push({
      discountId: d._id,
      name: d.name,
      amount: amount,
      reason: d.description || "",
    });

    if (!d.canBeStacked) break;
  }

  return {
    originalPrice: basePrice,
    finalPrice,
    appliedDiscounts,
  };
};
