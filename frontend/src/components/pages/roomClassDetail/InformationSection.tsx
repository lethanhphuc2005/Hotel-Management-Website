import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faUserFriends,
  faEye,
  faTag,
  faPercent,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";
import { RoomClass } from "@/types/roomClass";
import { MainRoomClass } from "@/types/mainRoomClass";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import RoomBookingBox from "./BookingForm";
import { capitalizeFirst } from "@/utils/stringUtils";
import { useRoomSearch } from "@/hooks/useRoomSearch";
import { Image } from "@/types/image";

const InformationSection = ({
  roomClass,
  mainRoomClass,
  images,
}: {
  roomClass: RoomClass;
  mainRoomClass: MainRoomClass;
  images: Image[];
}) => {
  const {
    dateRange,
    setDateRange,
    guests,
    setGuests,
    price,
    setPrice,
    showCalendar,
    setShowCalendar,
    showGuestBox,
    setShowGuestBox,
    guestBoxRef,
    calendarRef,
    totalGuests,
    numberOfAdults,
    numberOfChildren,
    numberOfNights,
    totalPrice,
    hasSearched,
    setHasSearched,
    handleSearch,
  } = useRoomSearch();
  return (
    <div className="tw-flex tw-gap-6 md:tw-flex-row tw-flex-col">
      <section className="tw-max-w-[1320px] tw-mx-auto tw-mt-4   tw-rounded-2xl tw-shadow-xl">
        {/* Tên phòng và mô tả */}
        <div className="tw-mb-6">
          <h2 className="tw-text-3xl tw-text-primary tw-font-bold tw-text-playfair">
            {roomClass.name || "Tên phòng chưa được cập nhật"}
          </h2>
          <p className="tw-mt-2 tw-text-lg tw-text-gray-400">
            {roomClass.description ||
              "Mô tả phòng chưa được cập nhật. Vui lòng liên hệ lễ tân để biết thêm chi tiết."}
          </p>
        </div>

        {/* Grid thông tin chi tiết */}
        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-6 tw-text-white">
          <div className="tw-flex tw-items-center tw-gap-3">
            <FontAwesomeIcon icon={faBed} className="tw-text-xl" />
            <span>
              Số giường: <strong>{roomClass.bed_amount}</strong>
            </span>
          </div>
          <div className="tw-flex tw-items-center tw-gap-3">
            <FontAwesomeIcon icon={faUserFriends} className="tw-text-xl" />
            <span>
              Sức chứa: <strong>{roomClass.capacity} người</strong>
            </span>
          </div>
          <div className="tw-flex tw-items-center tw-gap-3">
            <FontAwesomeIcon icon={faEye} className="tw-text-xl" />
            <span>
              Hướng nhìn: <strong>{capitalizeFirst(roomClass.view)}</strong>
            </span>
          </div>
          {roomClass.price_discount ? (
            <>
              <div className="tw-flex tw-items-center tw-gap-3 tw-text-gray-400">
                <FontAwesomeIcon icon={faTag} className="tw-text-xl" />
                <span>
                  Giá: <del>{formatCurrencyVN(roomClass.price)}/đêm</del>
                </span>
              </div>
              <div className="tw-flex tw-items-center tw-gap-3 tw-text-primary">
                <FontAwesomeIcon icon={faPercent} className="tw-text-xl" />
                <span>
                  Ưu đãi:{" "}
                  <strong>
                    {formatCurrencyVN(roomClass.price_discount)}/đêm
                  </strong>
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="tw-flex tw-items-center tw-gap-3 tw-text-primary">
                <FontAwesomeIcon icon={faTag} className="tw-text-xl " />
                <span>
                  Giá: <strong>{formatCurrencyVN(roomClass.price)}/đêm</strong>
                </span>
              </div>
              <div className="tw-flex tw-items-center tw-gap-3">
                <FontAwesomeIcon icon={faPercent} className="tw-text-xl" />
                <span>Không có ưu đãi</span>
              </div>
            </>
          )}
          <div className="tw-flex tw-items-center tw-gap-3">
            <FontAwesomeIcon icon={faDoorOpen} className="tw-text-xl" />
            <span>
              Loại phòng: <strong>{mainRoomClass.name}</strong>
            </span>
          </div>
        </div>
      </section>
      {/* Booking Box */}
      <div className="md:tw-max-w-[40%] tw-mx-auto tw-mt-6 tw-w-full">
        <RoomBookingBox
          roomClass={roomClass}
          dateRange={dateRange}
          setDateRange={setDateRange}
          guests={guests}
          setGuests={setGuests}
          price={price}
          setPrice={setPrice}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          showGuestBox={showGuestBox}
          setShowGuestBox={setShowGuestBox}
          guestBoxRef={guestBoxRef}
          calendarRef={calendarRef}
          totalGuests={totalGuests}
          numberOfAdults={numberOfAdults}
          numberOfChildren={numberOfChildren}
          numberOfNights={numberOfNights}
          totalPrice={totalPrice}
          hasSearched={hasSearched}
          setHasSearched={setHasSearched}
          handleSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default InformationSection;
