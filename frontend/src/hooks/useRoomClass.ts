import { useLoading } from "@/contexts/LoadingContext";
import { fetchFeatures } from "@/services/FeatureService";
import { fetchMainRoomClasses } from "@/services/MainRoomClasssService";
import { fetchRoomClasses } from "@/services/RoomClassService";
import { Feature } from "@/types/feature";
import { MainRoomClass } from "@/types/mainRoomClass";
import { RoomClass } from "@/types/roomClass";
import { useEffect, useState } from "react";

export const useRoomClass = () => {
  const [didFetch, setDidFetch] = useState(false);
  const [roomClasses, setRoomClasses] = useState<RoomClass[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [mainRoomClasses, setMainRoomClasses] = useState<MainRoomClass[]>([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (didFetch) return;
    setDidFetch(true); // ✅ đặt ở đầu, tránh race condition

    const fetchData = async () => {
      setLoading(true);
      try {
        const [roomClassesData, featuresData, mainRoomClassesData] =
          await Promise.all([
            fetchRoomClasses(),
            fetchFeatures(),
            fetchMainRoomClasses(),
          ]);

        if (
          !roomClassesData.success ||
          !featuresData.success ||
          !mainRoomClassesData.success
        ) {
          throw new Error(
            "Failed to fetch one or more resources: " +
              [roomClassesData, featuresData, mainRoomClassesData]
                .filter((res) => !res.success)
                .map((res) => res.message)
                .join(", ")
          );
        }

        setRoomClasses(roomClassesData.data);
        setFeatures(featuresData.data);
        setMainRoomClasses(mainRoomClassesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setDidFetch(true);
      }
    };
    fetchData();
  }, [didFetch, setLoading]);

  return {
    roomClasses,
    features,
    mainRoomClasses,
    setRoomClasses,
    setFeatures,
    setMainRoomClasses,
  };
};
