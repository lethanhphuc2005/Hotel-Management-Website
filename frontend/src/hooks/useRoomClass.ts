import { useLoading } from "@/contexts/LoadingContext";
import { fetchFeatures } from "@/services/FeatureService";
import { fetchMainRoomClasses } from "@/services/MainRoomClassService";
import { fetchRoomClasses } from "@/services/RoomClassService";
import { Feature } from "@/types/feature";
import { MainRoomClass } from "@/types/mainRoomClass";
import { RoomClass } from "@/types/roomClass";
import { useEffect, useMemo, useState, useCallback } from "react";

export const useRoomClass = (
  params?: Partial<Parameters<typeof fetchRoomClasses>[0]>
) => {
  const [roomClasses, setRoomClasses] = useState<RoomClass[]>([]);
  const [totalRoomClasses, setTotalRoomClasses] = useState<number>(0);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [mainRoomClasses, setMainRoomClasses] = useState<MainRoomClass[]>([]);
  const [didFetchStaticData, setDidFetchStaticData] = useState(false);
  const { setLoading } = useLoading();

  const stableParams = useMemo(() => params || {}, [JSON.stringify(params)]);

  // 🟡 Chỉ gọi 1 lần khi mount
  useEffect(() => {
    if (didFetchStaticData) return; // Tránh gọi lại nếu đã fetch
    setDidFetchStaticData(true);
    const fetchStaticData = async () => {
      try {
        const [featuresData, mainRoomClassesData] = await Promise.all([
          fetchFeatures(),
          fetchMainRoomClasses(),
        ]);

        if (!featuresData.success || !mainRoomClassesData.success) {
          throw new Error(
            "Failed to fetch: " +
              [featuresData, mainRoomClassesData]
                .filter((res) => !res.success)
                .map((res) => res.message)
                .join(", ")
          );
        }

        setFeatures(featuresData.data);
        setMainRoomClasses(mainRoomClassesData.data);
      } catch (err) {
        console.error("Error fetching static data:", err);
      }
    };

    fetchStaticData();
  }, [didFetchStaticData]);

  // 🟢 Gọi mỗi khi params thay đổi
  const fetchRoomClassData = useCallback(async () => {
    setLoading(true);
    try {
      const roomClassesData = await fetchRoomClasses(stableParams);

      if (!roomClassesData.success) {
        throw new Error(roomClassesData.message);
      }

      setRoomClasses(roomClassesData.data);
      setTotalRoomClasses(roomClassesData.pagination?.total || 0);
    } catch (err) {
      console.error("Error fetching roomClasses:", err);
    } finally {
      setLoading(false);
    }
  }, [stableParams, setLoading]);

  useEffect(() => {
    fetchRoomClassData();
  }, [fetchRoomClassData]);

  return {
    roomClasses,
    features,
    mainRoomClasses,
    totalRoomClasses,
    refetch: fetchRoomClassData,
    setRoomClasses,
    setFeatures,
    setMainRoomClasses,
  };
};
