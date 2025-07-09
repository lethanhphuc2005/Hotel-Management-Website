"use client";
import { useEffect, useState } from "react";
import SearchSortBar from "@/components/sections/SearchSortBar";
import { useLoading } from "@/contexts/LoadingContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Service } from "@/types/service";
import { fetchSuggestionsByKeyword } from "@/services/SearchService";
import { RoomClass } from "@/types/roomClass";
import { Feature } from "@/types/feature";
import { RoomClassListForSearch } from "@/components/pages/roomClass/RoomClassList";
import { HotelServiceList } from "@/components/pages/service/List";

export default function SearchPage() {
  const [roomClasses, setRoomClasses] = useState<RoomClass[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name_asc");

  const { setLoading } = useLoading();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchTerm(query);
      fetchData(query);
    } else {
      setSearchTerm("");
      setServices([]);
      setRoomClasses([]);
      setFeatures([]);
    }
  }, []);

  useEffect(() => {
    if (!searchTerm) return;

    const delayDebounce = setTimeout(() => {
      fetchData(searchTerm); // Chỉ fetch sau khi user ngừng gõ 500ms
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }, 500);

    return () => clearTimeout(delayDebounce); // Hủy timeout nếu user gõ tiếp
  }, [searchTerm]);

  const fetchData = async (query: string = "") => {
    setLoading(true);
    try {
      const response = await fetchSuggestionsByKeyword("keyword", query);
      setServices(response.services);
      setRoomClasses(response.roomClasses);
      setFeatures(response.features);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tw-container tw-mt-[130px] tw-mb-[100px] tw-mx-auto">
      <h4 className="tw-mb-4 tw-font-bold tw-text-white tw-text-xl sm:tw-text-2xl">
        KẾT QUẢ TÌM KIẾM: "{searchTerm}"
      </h4>

      <SearchSortBar
        searchTerm={searchTerm}
        setSearchTerm={(value) => {
          setSearchTerm(value); // chỉ set, không gọi fetch ngay
        }}
        sortOption={sortOption}
        setSortOption={(value) => {
          setSortOption(value);
        }}
        placeholder="Tìm kiếm từ khóa..."
        sortOptions={[
          { value: "name_asc", label: "Tên A-Z" },
          { value: "name_desc", label: "Tên Z-A" },
          { value: "price_asc", label: "Giá tăng dần" },
          { value: "price_desc", label: "Giá giảm dần" },
        ]}
      />

      {/* DỊCH VỤ */}
      {services.length > 0 && (
        <>
          <h5 className="tw-mt-8 tw-mb-2 tw-text-white tw-text-lg font-semibold">
            Dịch vụ liên quan
          </h5>
          <HotelServiceList services={services} />
        </>
      )}

      {/* LOẠI PHÒNG */}
      {roomClasses.length > 0 && (
        <>

          <RoomClassListForSearch title="Loại phòng liên quan" roomClasses={roomClasses} />
        </>
      )}

      {/* TIỆN NGHI */}
      {features.length > 0 && (
        <>
          <h5 className="tw-mt-8 tw-mb-2 tw-text-white tw-text-lg font-semibold">
            Tiện nghi liên quan
          </h5>
          <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-6 tw-text-white">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="tw-flex tw-items-start tw-gap-2 tw-bg-neutral-800 tw-p-3 tw-rounded-xl"
              >
                <span>{feature.icon && <i className={feature.icon}></i>}</span>
                <span>{feature.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
