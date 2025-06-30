"use client";
import { useLoading } from "@/contexts/LoadingContext";
import { fetchDiscounts } from "@/services/DiscountService";
import { fetchMainRoomClasses } from "@/services/MainRoomClasssService";
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

  useEffect(() => {
    if (didFetch) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [roomClassesData, contentsData, servicesData, discountsData] =
          await Promise.all([
            fetchMainRoomClasses(),
            fetchWebsiteContents(),
            fetchServices(),
            fetchDiscounts(),
          ]);

        // Check if the fetch was successful
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
        // Set the fetched data to state

        setMainRoomClasses(roomClassesData.data);
        setWebsiteContents(contentsData.data);
        setServices(servicesData.data);
        setDiscounts(discountsData.data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
        setDidFetch(true);
      }
    };
    fetchData();
  }, [didFetch, setLoading]);

  return {
    mainRoomClasses,
    websiteContents,
    services,
    discounts,
    setMainRoomClasses,
    setWebsiteContents,
    setServices,
    setDiscounts,
  };
};
