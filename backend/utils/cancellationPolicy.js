export function calculateCancellationFee(
  checkInDate,
  cancelDate,
  totalPrice,
  createdAt
) {
  const timeSinceBookingMs = cancelDate.getTime() - createdAt.getTime();
  const hoursSinceBooking = timeSinceBookingMs / (1000 * 60 * 60);

  let feePercent = 0;

  if (hoursSinceBooking <= 24) {
    // ✅ Miễn phí nếu hủy trong 24h sau khi đặt
    feePercent = 0;
  } else {
    // Nếu quá 24h kể từ lúc đặt thì áp dụng theo khoảng cách đến check-in
    const hoursUntilCheckIn =
      (checkInDate.getTime() - cancelDate.getTime()) / (1000 * 60 * 60);
    if (hoursUntilCheckIn <= 24) {
      feePercent = 100;
    } else if (hoursUntilCheckIn <= 48) {
      feePercent = 80;
    } else if (hoursUntilCheckIn <= 168) {
      feePercent = 30;
    }
  }

  const feeAmount = Math.round((feePercent / 100) * totalPrice);
  return { feePercent, feeAmount };
}
