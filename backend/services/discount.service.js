const { differenceInCalendarDays } = require("date-fns");
const Discount = require("../models/discount.model");
const getApplicableDiscounts = async ({ user, bookingInfo }) => {
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

  const codeFilter = promoCode
    ? { promo_code: { $in: [null, "", promoCode] } }
    : { promo_code: { $in: [null, ""] } };

  const discounts = await Discount.find({
    status: true,
    valid_from: { $lte: now },
    valid_to: { $gte: now },
    ...codeFilter,
    $or: [
      { apply_to_room_class_ids: [] },
      { apply_to_room_class_ids: roomClassId },
    ],
  });

  const applicable = [];
  let isPromoValid = !promoCode; // nếu không nhập thì mặc định là true

  for (const d of discounts) {
    const { conditions } = d;
    let match = true;

    if (d.type === "promo_code") {
      if (d.promo_code !== promoCode) {
        match = false;
      } else {
        isPromoValid = true;
      }
    }

    if (
      conditions?.min_advance_days &&
      advanceDays < conditions.min_advance_days
    )
      match = false;
    if (
      conditions?.max_advance_days &&
      advanceDays > conditions.max_advance_days
    )
      match = false;
    if (conditions?.min_stay_nights && stayNights < conditions.min_stay_nights)
      match = false;
    if (conditions?.max_stay_nights && stayNights > conditions.max_stay_nights)
      match = false;
    if (conditions?.min_rooms && totalRooms < conditions.min_rooms)
      match = false;
    if (conditions?.user_levels?.length) {
      if (!user || !conditions.user_levels.includes(user.level || "normal")) {
        match = false;
      }
    }

    if (match) applicable.push(d);
  }

  applicable.sort((a, b) => a.priority - b.priority);

  return {
    applicable,
    isPromo: isPromoValid,
  };
};

const calculateBookingPrice = async (bookingInfo, user) => {
  const basePrice = bookingInfo.baseTotal;

  const { applicable: discounts, isPromo } = await getApplicableDiscounts({
    user,
    bookingInfo,
  });

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
    isPromo,
  };
};

module.exports = {
  getApplicableDiscounts,
  calculateBookingPrice,
};
