import { Room } from "../types/room";
import { RoomTypeMain } from "../types/roomtypemain";
import { Service } from "../types/service";
import { RoomSale, RoomT, RoomTypeItem, ServiceItem } from "./roomItem";

export function RoomTList({ roomtypes }: { roomtypes: RoomTypeMain[] }) {
  return (
    <>
      {roomtypes.map((roomtype: RoomTypeMain) => (
        <RoomT key={roomtype._id} roomtype={roomtype} />
      ))}
    </>
  );
}

export function RoomSaleList({ rooms }: { rooms: Room[] }) {
  return (
    <>
      {rooms.map((room: Room) => (
        <RoomSale room={room} key={room._id} />
      ))}
    </>
  );
}

export function ServiceList({ services }: { services: Service[] }) {
  return (
    <>
      {services.map((service: Service) => (
        <ServiceItem service={service} key={service._id} />
      ))}
    </>
  );
}

export function RoomTypeList({ roomtypes }: { roomtypes: RoomTypeMain[] }) {
  return (
    <>
      {roomtypes.map((roomtype: RoomTypeMain) => (
        <RoomTypeItem roomtype={roomtype} key={roomtype._id} />
      ))}
    </>
  );
}