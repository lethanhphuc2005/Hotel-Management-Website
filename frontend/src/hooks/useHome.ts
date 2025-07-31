"use client";
import { useLoading } from "@/contexts/LoadingContext";
import { fetchDiscounts } from "@/services/DiscountService";
import { fetchMainRoomClasses } from "@/services/MainRoomClassService";
import { fetchServices } from "@/services/ServiceService";
import { fetchWebsiteContents } from "@/services/WebsiteContentService";
import { Discount } from "@/types/discount";
import { MainRoomClass } from "@/types/mainRoomClass";
import { Service } from "@/types/service";
import { WebsiteContent } from "@/types/websiteContent";
import { useEffect, useState } from "react";

export const useHome = () => {
  const [didFetch, setDidFetch] = useState(false);
  const { setLoading } = useLoading();
  const [mainRoomClasses, setMainRoomClasses] = useState<MainRoomClass[]>([]);
  const [websiteContents, setWebsiteContents] = useState<WebsiteContent[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  // useEffect chính (không còn fetch Gemini ở đây nữa)
  useEffect(() => {
    if (didFetch) return;
    setDidFetch(true);

    const fetchData = async () => {
      setLoading(true);
      try {
        const [roomClassesData, contentsData, servicesData, discountsData] =
          await Promise.all([
            fetchMainRoomClasses(),
            fetchWebsiteContents(),
            fetchServices({ limit: 8, page: 1 }),
            fetchDiscounts({ limit: 3, page: 1 }),
          ]);

        if (
          !roomClassesData.success ||
          !contentsData.success ||
          !servicesData.success ||
          !discountsData.success
        ) {
          throw new Error(
            "Failed to fetch one or more resources: " +
              [
                roomClassesData.message,
                contentsData.message,
                servicesData.message,
                discountsData.message,
              ]
                .filter(Boolean)
                .join(", ")
          );
        }

        setMainRoomClasses(roomClassesData.data);
        setWebsiteContents(contentsData.data);
        setServices(servicesData.data);
        setDiscounts(discountsData.data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [didFetch]);

  return {
    mainRoomClasses,
    websiteContents,
    services,
    discounts,
  };
};
