import { Service } from "@/app/types/service";
import { HotelServiceItem } from "./Item";

export function HotelServiceList({ list }: { list: Service[] }) {
    return (
        <>
            {list.map((hotelservice, index) => (
                <HotelServiceItem item={hotelservice} key={index}/>
            ))}
        </>
    );
}