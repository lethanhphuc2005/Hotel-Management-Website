"use client";

import { AnimatePresence, motion } from "framer-motion";
import AnimatedCheckbox from "@/components/common/Checkbox";
import PriceSlider from "@/components/pages/roomClass/PriceSlider";
import { Feature } from "@/types/feature";
import { MainRoomClass } from "@/types/mainRoomClass";

interface FilterSidebarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  sortOption: string;
  setSortOption: React.Dispatch<React.SetStateAction<string>>; // Thêm setSortOption nếu cần
  views: string[];
  selectedViews: string[]; // 👈 danh sách được chọn
  setSelectedViews: React.Dispatch<React.SetStateAction<string[]>>;
  features: Feature[];
  selectedFeatureIds: string[];
  setSelectedFeatureIds: React.Dispatch<React.SetStateAction<string[]>>;
  mainRoomClasses: MainRoomClass[];
  selectedMainRoomClassIds: string[];
  setSelectedMainRoomClassIds: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  showViewFilter: boolean;
  setShowViewFilter: (val: boolean) => void;
  showFeatureFilter: boolean;
  setShowFeatureFilter: (val: boolean) => void;
  showMainRoomClassFilter: boolean;
  setShowMainRoomClassFilter: (val: boolean) => void;
  handleCheckboxChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => void;
}

export default function FilterSidebar({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  views,
  selectedViews,
  setSelectedViews,
  features,
  selectedFeatureIds,
  setSelectedFeatureIds,
  mainRoomClasses,
  selectedMainRoomClassIds,
  setSelectedMainRoomClassIds,
  priceRange,
  setPriceRange,
  showViewFilter,
  setShowViewFilter,
  showFeatureFilter,
  setShowFeatureFilter,
  showMainRoomClassFilter,
  setShowMainRoomClassFilter,
  handleCheckboxChange,
}: FilterSidebarProps) {
  const handleCheckboxdChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const value = e.target.value;
    setState((prev) =>
      e.target.checked
        ? [...prev, value]
        : prev.filter((item) => item !== value)
    );
  };
  return (
    <div className="sticky-top" style={{ top: "13%" }}>
      <div className="mt-3 mb-4" style={{ color: "#FAB320" }}>
        <p className="fs-5" style={{ letterSpacing: "3px" }}>
          TÌM KIẾM VÀ LỌC TẤT CẢ PHÒNG
        </p>
      </div>

      <div className="tw-flex md:tw-flex-row tw-flex-col tw-gap-3">
        <input
          type="text"
          className="tw-px-4 tw-py-2 tw-rounded-md tw-bg-[#1d1d1d] tw-text-primary tw-placeholder-gray-400 tw-border tw-border-primary focus:tw-outline-none tw-w-full tw-mb-3 tw-flex-1"
          placeholder="Tìm kiếm phòng..."
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <select
          className="tw-px-4 tw-py-2 tw-rounded-md tw-bg-[#1d1d1d] tw-text-primary tw-border tw-border-primary focus:tw-outline-none tw-w-full
          tw-mb-3 tw-flex-1"
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
          }}
        >
          <option value="default" disabled>
            Sắp xếp theo
          </option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="rating_desc">Đánh giá cao nhất</option>
          <option value="rating_asc">Đánh giá thấp nhất</option>
        </select>
      </div>

      <PriceSlider priceRange={priceRange} setPriceRange={setPriceRange} />

      <p
        className="mt-3 mb-2 fw-bold tw-cursor-pointer"
        onClick={() => setShowMainRoomClassFilter(!showMainRoomClassFilter)}
        style={{ userSelect: "none" }}
      >
        Lọc theo loại phòng {showMainRoomClassFilter ? "▲" : "▼"}
      </p>
      <AnimatePresence>
        {showMainRoomClassFilter && (
          <motion.div
            key="feature-filter"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="d-flex flex-column gap-3 mb-3 overflow-hidden"
          >
            {mainRoomClasses.map((mainRoomClass) => (
              <AnimatedCheckbox
                key={mainRoomClass.id}
                value={mainRoomClass.id}
                checked={selectedMainRoomClassIds.includes(mainRoomClass.id)}
                onChange={(e: any) =>
                  handleCheckboxdChange(
                    e,
                    selectedMainRoomClassIds,
                    setSelectedMainRoomClassIds
                  )
                }
                label={mainRoomClass.name}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <p
        className="mt-3 mb-2 fw-bold tw-cursor-pointer"
        onClick={() => setShowViewFilter(!showViewFilter)}
        style={{ userSelect: "none" }}
      >
        Lọc theo view {showViewFilter ? "▲" : "▼"}
      </p>
      <AnimatePresence>
        {showViewFilter && (
          <motion.div
            key="view-filter"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="d-flex flex-column gap-3 mb-3 overflow-hidden"
          >
            {views.map((view) => (
              <AnimatedCheckbox
                key={view}
                value={view}
                checked={selectedViews.includes(view)}
                onChange={(e: any) =>
                  handleCheckboxChange(e, selectedViews, setSelectedViews)
                }
                label={view.charAt(0).toUpperCase() + view.slice(1)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <p
        className="mt-3 mb-2 fw-bold tw-cursor-pointer"
        onClick={() => setShowFeatureFilter(!showFeatureFilter)}
        style={{ userSelect: "none" }}
      >
        Lọc theo tiện nghi {showFeatureFilter ? "▲" : "▼"}
      </p>
      <AnimatePresence>
        {showFeatureFilter && (
          <motion.div
            key="feature-filter"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="d-flex flex-column gap-3 mb-3 overflow-hidden"
          >
            {features.map((feature) => (
              <AnimatedCheckbox
                key={feature.id}
                value={feature.id}
                checked={selectedFeatureIds.includes(feature.id)}
                onChange={(e: any) =>
                  handleCheckboxdChange(
                    e,
                    selectedFeatureIds,
                    setSelectedFeatureIds
                  )
                }
                label={feature.name}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
