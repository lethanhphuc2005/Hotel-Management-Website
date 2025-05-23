import { Room } from "../types/room";
import { RoomType } from "../types/roomtype";
import { Service } from "../types/service";
import { Roomofrt, RoomSale, RoomT, ServiceItem } from "./roomItem";

export function RoomTList({ roomtypes }: { roomtypes: RoomType[] }) {
  return (
    <>
      {roomtypes.map((roomtype: RoomType) => (
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

export function RoomofrtList({ roomofrts }: { roomofrts: Room[] }) {
  return (
    <>
      {roomofrts.map((roomofrt: Room) => (
        <Roomofrt roomofrt={roomofrt} key={roomofrt._id} />
      ))}
    </>
  );
}