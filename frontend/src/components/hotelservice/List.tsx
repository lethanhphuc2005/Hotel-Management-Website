import { Service } from "@/types/service";
import { HotelServiceItem } from "./Item";

export function HotelServiceList({ list }: { list: Service[] }) {
  return (
    <>
      {list.map((hotelservice) => (
        <HotelServiceItem item={hotelservice} key={hotelservice.id} />
      ))}
    </>
  );
}
