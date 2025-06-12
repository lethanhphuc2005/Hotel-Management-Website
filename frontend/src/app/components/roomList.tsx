import { MainRoomClass } from "../types/mainroomclass";
import { RoomClass } from "../types/roomclass";
import { Service } from "../types/service";
import { RoomClassSaleItem, MainRoomClassItem, RoomClassItem, ServiceItem } from "./roomItem";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export function MainRoomClassList({ mrcl }: { mrcl: MainRoomClass[] }) {
  return (
    <>
      {mrcl.map((mrc: MainRoomClass) => (
        <MainRoomClassItem key={mrc._id} mrci={mrc} />
      ))}
    </>
  );
}

export function RoomClassSaleList({ rcsl }: { rcsl: RoomClass[] }) {
  return (
    <>
      {rcsl.map((rcs: RoomClass) => (
        <RoomClassSaleItem rcsi={rcs} key={rcs._id} />
      ))}
    </>
  );
}

export function ServiceList({ svl }: { svl: Service[] }) {
  return (
    <div className="container mt-2">
    <Swiper
      modules={[Navigation]}
      spaceBetween={24}
      slidesPerView={1}
      breakpoints={{
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
        1200: { slidesPerView: 4 }
      }}
      navigation
      style={{ padding: "16px 0" }}
    >
      {svl.slice(0, 6).map((svi, idx) => (
        <SwiperSlide key={svi._id || idx}>
          <ServiceItem svi={svi} />
        </SwiperSlide>
      ))}
    </Swiper>
    </div>
  );
}

export function RoomClassList({ rcl, numberOfNights, totalGuests, hasSearched  }: { rcl: RoomClass[], numberOfNights: number, totalGuests: number, hasSearched?: boolean }) {
  return (
    <>
      {rcl.map((rc) => (
        <RoomClassItem rci={rc} numberOfNights={numberOfNights} totalGuests={totalGuests} hasSearched={hasSearched} key={rc._id} />
      ))}
    </>
  );
}