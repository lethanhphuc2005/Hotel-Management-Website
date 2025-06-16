'use client'
import { useEffect, useState } from "react";
import { WebsiteContent } from "../types/websitecontent";
import { MainRoomClass } from "../types/mainroomclass";
import { RoomClass } from "../types/roomclass";
import { Service } from "../types/service";
import { getWebsiteContents } from "../services/websitecontentService";
import { getMainRoomClass } from "../services/mainroomclassService";
import { getServices } from "../services/serviceService";
import { getRoomClass } from "../services/roomclassService";
import { Discount } from "../types/discount";
import { getDiscount } from "../services/discountService";

export function useData() {
    const [websitecontent, setWebsiteContent] = useState<WebsiteContent[]>([]);
    const [mainroomclass, setMainRoomClass] = useState<MainRoomClass[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [roomclass, setRoomClass] = useState<RoomClass[]>([]);
    const [discount, setDiscount] = useState<Discount[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setWebsiteContent(await getWebsiteContents("http://localhost:8000/v1/website-content/user"));
            setMainRoomClass(await getMainRoomClass("http://localhost:8000/v1/main-room-class/user"));
            setServices(await getServices("http://localhost:8000/v1/service/user"));
            setRoomClass(await getRoomClass("http://localhost:8000/v1/room-class/user"));
            setDiscount(await getDiscount("http://localhost:8000/v1/discount/user"));
        };
        fetchData();
    }, []);

    return { websitecontent, mainroomclass, services, roomclass, discount };
}