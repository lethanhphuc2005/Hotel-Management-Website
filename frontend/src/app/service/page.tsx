"use client";
import { useEffect, useMemo, useState } from "react";
import SearchSortBar from "@/components/sections/SearchSortBar";
import { HotelServiceList } from "@/components/pages/service/List";
import { useLoading } from "@/contexts/LoadingContext";
import { fetchServices } from "@/services/ServiceService";
import { Service } from "@/types/service";
import {
  faLock,
  faKitchenSet,
  faSnowflake,
  faFan,
  faToolbox,
  faWifi,
  faMugHot,
  faTv,
  faConciergeBell,
  faUtensils,
  faShower,
  faCouch,
  faDoorOpen,
  faLightbulb,
  faPhone,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@/components/sections/Pagination";
import { useSearchParams } from "next/navigation";

const features = [
  { icon: faLock, label: "Khóa cửa an toàn" },
  { icon: faKitchenSet, label: "Bếp nấu ăn" },
  { icon: faSnowflake, label: "Tủ lạnh" },
  { icon: faFan, label: "Máy điều hòa" },
  { icon: faToolbox, label: "Máy sấy tóc" },
  { icon: faWifi, label: "Wifi tốc độ cao" },
  { icon: faMugHot, label: "Bình đun siêu tốc" },
  { icon: faTv, label: "TV màn hình phẳng" },
  { icon: faConciergeBell, label: "Lễ tân 24/7" },
  { icon: faUtensils, label: "Dụng cụ ăn uống" },
  { icon: faShower, label: "Phòng tắm riêng" },
  { icon: faCouch, label: "Ghế sofa" },
  { icon: faDoorOpen, label: "Ban công riêng" },
  { icon: faLightbulb, label: "Đèn ngủ" },
  { icon: faPhone, label: "Điện thoại nội bộ" },
  { icon: faClock, label: "Dịch vụ báo thức" },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const { setLoading } = useLoading();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name_asc");

  useEffect(() => {
    const fetchServicesData = async () => {
      setLoading(true);
      try {
        const response = await fetchServices();
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch services");
        }
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicesData();
  }, []);

  const searchParams = useSearchParams();

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      setSearchTerm(serviceParam);
    }
  }, [searchParams]);

  const filteredAndSortedServices = useMemo(() => {
    let filtered = services.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [services, searchTerm, sortOption]);

  const totalItems = filteredAndSortedServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredAndSortedServices.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <div className="tw-container tw-mt-[130px] tw-mb-[100px] tw-mx-auto">
      <h4 className="tw-mb-4 tw-font-bold tw-text-white tw-text-xl sm:tw-text-2xl">
        CÁC DỊCH VỤ CÓ PHÍ
      </h4>

      <SearchSortBar
        searchTerm={searchTerm}
        setSearchTerm={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        sortOption={sortOption}
        setSortOption={(value) => {
          setSortOption(value);
          setCurrentPage(1);
        }}
        placeholder="Tìm dịch vụ..."
        sortOptions={[
          { value: "name_asc", label: "Tên A-Z" },
          { value: "name_desc", label: "Tên Z-A" },
          { value: "price_asc", label: "Giá tăng dần" },
          { value: "price_desc", label: "Giá giảm dần" },
        ]}
      />

      {/* Dịch vụ trả phí */}
      <HotelServiceList services={currentServices} />

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          onPageChange={handlePageChange}
          forcePage={currentPage - 1}
        />
      )}

      {/* Dịch vụ miễn phí */}
      <h4 className="tw-mt-12 tw-font-bold tw-text-white tw-text-xl sm:tw-text-2xl">
        CÁC DỊCH VỤ MIỄN PHÍ
      </h4>

      <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-6 tw-text-white tw-mt-6">
        {features.map((feature, index) => (
          <div key={index} className="tw-flex tw-items-start tw-space-x-2">
            <FontAwesomeIcon icon={feature.icon} className="tw-mt-1" />
            <span>{feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
