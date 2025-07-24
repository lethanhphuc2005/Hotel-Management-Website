import { useLoading } from "@/contexts/LoadingContext";
import { fetchFeatures } from "@/services/FeatureService";
import { fetchMainRoomClasses } from "@/services/MainRoomClasssService";
import { fetchRoomClasses } from "@/services/RoomClassService";
import { Feature } from "@/types/feature";
import { MainRoomClass } from "@/types/mainRoomClass";
import { RoomClass } from "@/types/roomClass";
import { useEffect, useState } from "react";

export const useRoomClass = (
  params?: Partial<Parameters<typeof fetchRoomClasses>[0]>,
  page = 1,
  limit = 10,
  hasSearched = false
) => {
  const [roomClasses, setRoomClasses] = useState<RoomClass[]>([]);
  const [totalRoomClasses, setTotalRoomClasses] = useState<number>(0);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [mainRoomClasses, setMainRoomClasses] = useState<MainRoomClass[]>([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomClassesData, featuresData, mainRoomClassesData] =
          await Promise.all([
            fetchRoomClasses({
              ...params,
              page,
              limit,
            }),
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
        console.log("roomClassesData", roomClassesData);
        setRoomClasses(roomClassesData.data);
        setTotalRoomClasses(roomClassesData.pagination?.total || 0);
        setFeatures(featuresData.data);
        setMainRoomClasses(mainRoomClassesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [params, page, limit]);

  return {
    roomClasses,
    features,
    mainRoomClasses,
    totalRoomClasses,
    setRoomClasses,
    setFeatures,
    setMainRoomClasses,
  };
};
