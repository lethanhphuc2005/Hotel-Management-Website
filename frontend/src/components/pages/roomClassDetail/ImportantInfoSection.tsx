"use client";

const ImportantInfoSection = () => {
  return (
    <section className="tw-bg-black tw-text-white tw-py-10 tw-border-t tw-border-white tw-mb-10">
      <h2 className="tw-text-2xl sm:tw-text-3xl tw-font-bold tw-uppercase tw-mb-8 tw-text-left">
        Những điều cần biết
      </h2>

      <div className="tw-grid sm:tw-grid-cols-3 tw-gap-8 tw-text-sm sm:tw-text-base">
        {/* Nội quy phòng */}
        <div>
          <h3 className="tw-font-semibold tw-text-lg tw-mb-2">Nội quy phòng</h3>
          <ul className="tw-space-y-1 tw-list-disc tw-pl-5">
            <li>Nhận phòng: 14:00 - 22:00</li>
            <li>Trả phòng: 12:00</li>
            <li>Tối đa 4 khách</li>
            <li>Không hút thuốc</li>
            <li>Không được mang thú cưng</li>
          </ul>
        </div>

        {/* An toàn và chỗ ở */}
        <div>
          <h3 className="tw-font-semibold tw-text-lg tw-mb-2">
            An toàn và chỗ ở
          </h3>
          <ul className="tw-space-y-1 tw-list-disc tw-pl-5">
            <li>Có máy báo khói</li>
            <li>Máy phát hiện khí CO</li>
            <li>Có sơ đồ thoát hiểm sau cửa phòng</li>
            <li>Cửa sổ và ban công được lắp an toàn</li>
            <li>Hành lý được đặt camera an ninh 24/7</li>
          </ul>
        </div>

        {/* Chính sách hủy */}
        <div>
          <h3 className="tw-font-semibold tw-text-lg tw-mb-2">
            Chính sách hủy
          </h3>
          <ul className="tw-space-y-1 tw-list-disc tw-pl-5">
            <li>Miễn phí hủy trong vòng 24 giờ sau khi đặt</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ImportantInfoSection;
