function getCancelPolicyTimeline(
  checkInDate: Date,
  checkOutDate: Date,
  createdAt: Date
) {
  const timeline: {
    label: string;
    from: Date;
    to: Date | null;
    feePercent: number;
    description: string;
  }[] = [];

  const toDate = (d: Date) => new Date(d); // clone tránh mutate
  const addHours = (date: Date, hours: number) =>
    new Date(date.getTime() + hours * 60 * 60 * 1000);
  const subHours = (date: Date, hours: number) =>
    new Date(date.getTime() - hours * 60 * 60 * 1000);

  const afterBooking24h = addHours(createdAt, 24);
  const checkInMinus7d = subHours(checkInDate, 168);
  const checkInMinus48h = subHours(checkInDate, 48);
  const checkInMinus24h = subHours(checkInDate, 24);

  // Mốc 1: Trong 24h sau khi đặt
  timeline.push({
    label: "Trong 24h sau khi đặt",
    from: toDate(createdAt),
    to: toDate(afterBooking24h),
    feePercent: 0,
    description: "Miễn phí hủy trong vòng 24 giờ sau khi đặt.",
  });

  // Mốc 2: Sau 24h đặt đến 7 ngày trước check-in
  if (afterBooking24h < checkInMinus7d) {
    timeline.push({
      label: "Sau 24h đặt đến 7 ngày trước check-in",
      from: toDate(afterBooking24h),
      to: toDate(checkInMinus7d),
      feePercent: 0,
      description: "Miễn phí hủy trước 7 ngày check-in.",
    });
  }

  // Mốc 3: 7 ngày đến 48 giờ trước check-in
  timeline.push({
    label: "Từ 7 ngày đến 48h trước check-in",
    from: toDate(checkInMinus7d),
    to: toDate(checkInMinus48h),
    feePercent: 30,
    description: "Phí huỷ 30% tổng tiền.",
  });

  // Mốc 4: 48 giờ đến 24 giờ trước check-in
  timeline.push({
    label: "Từ 48h đến 24h trước check-in",
    from: toDate(checkInMinus48h),
    to: toDate(checkInMinus24h),
    feePercent: 80,
    description: "Phí huỷ 80% tổng tiền.",
  });

  // Mốc 5: Trong vòng 24 giờ trước check-in
  timeline.push({
    label: "Trong 24h trước check-in",
    from: toDate(checkInMinus24h),
    to: toDate(checkInDate),
    feePercent: 100,
    description: "Phí huỷ 100% tổng tiền.",
  });

  // ⛔ Lọc các mốc nằm ngoài thời gian từ createdAt đến checkOutDate
  const finalTimeline = timeline
    .filter((item) => item.to === null || item.from < checkOutDate)
    .map((item) => ({
      ...item,
      from: item.from < createdAt ? createdAt : item.from,
      to:
        item.to && item.to > checkOutDate
          ? checkOutDate
          : item.to ?? checkOutDate,
    }))
    .filter((item) => item.from < (item.to ?? checkOutDate)); // Loại bỏ nếu from >= to

  return finalTimeline;
}

export default getCancelPolicyTimeline;
