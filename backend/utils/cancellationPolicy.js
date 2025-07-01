export function calculateCancellationFee(checkInDate, cancelDate, totalPrice) {
  const hoursDiff = Math.floor(
    (checkInDate.getTime() - cancelDate.getTime()) / (1000 * 60 * 60)
  );

  let feePercent = 0;

  if (hoursDiff <= 24) {
    feePercent = 100;
  } else if (hoursDiff <= 48) {
    feePercent = 80;
  } else if (hoursDiff <= 168) {
    feePercent = 30;
  }

  const feeAmount = Math.round((feePercent / 100) * totalPrice);
  return { feePercent, feeAmount };
}
