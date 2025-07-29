"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { fetchDiscounts } from "@/services/DiscountService";
import { fetchMainRoomClasses } from "@/services/MainRoomClasssService";
import { fetchServices } from "@/services/ServiceService";
import { fetchWebsiteContents } from "@/services/WebsiteContentService";
import { fetchSuggestionsFromGemini } from "@/services/ChatbotService";
import { Discount } from "@/types/discount";
import { MainRoomClass } from "@/types/mainRoomClass";
import { Service } from "@/types/service";
import { WebsiteContent } from "@/types/websiteContent";
import { useEffect, useState } from "react";
import { RoomClass } from "@/types/roomClass";

export const useHome = () => {
  const [didFetch, setDidFetch] = useState(false);
  const { user } = useAuth();
  const { setLoading } = useLoading();
  const [mainRoomClasses, setMainRoomClasses] = useState<MainRoomClass[]>([]);
  const [websiteContents, setWebsiteContents] = useState<WebsiteContent[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [recommends, setRecommends] = useState<RoomClass[]>([]);

  useEffect(() => {
    if (didFetch) return;
    setDidFetch(true);
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all necessary data concurrently
        const [
          roomClassesData,
          contentsData,
          servicesData,
          discountsData,
          recommenedData,
        ] = await Promise.all([
          fetchMainRoomClasses(),
          fetchWebsiteContents(),
          fetchServices(),
          fetchDiscounts(),
          user ? fetchSuggestionsFromGemini() : Promise.resolve([]),
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
        setRecommends(
          Array.isArray(recommenedData)
            ? recommenedData
            : recommenedData.data || []
        );
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [didFetch, user]);

  return {
    mainRoomClasses,
    websiteContents,
    services,
    discounts,
    recommends,
  };
};
