import { MainRoomClass } from "../types/mainroomclass";
import { RoomClass } from "../types/roomclass";
import { Service } from "../types/service";
import { RoomClassSaleItem, MainRoomClassItem, RoomClassItem, ServiceItem } from "./roomItem";

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
    <>
      {svl.map((sv: Service) => (
        <ServiceItem svi={sv} key={sv._id} />
      ))}
    </>
  );
}

export function RoomClassList({ rcl }: { rcl: RoomClass[] }) {
  return (
    <>
      {rcl.map((rc) => (
        <RoomClassItem rci={rc} key={rc._id} />
      ))}
    </>
  );
}