"use client";

import { AnimatePresence, motion } from "framer-motion";
import AnimatedCheckbox from "@/components/common/Checkbox";
import PriceSlider from "@/components/pages/roomClass/PriceSlider";
import { Feature } from "@/types/feature";
import { MainRoomClass } from "@/types/mainRoomClass";
import { AnimatedButton } from "@/components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faTrash,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

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
  isFiltered: boolean;
  setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
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
  isFiltered,
  setIsFiltered,
  setCurrentPage
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

  const handleSubmit = () => {
    setIsFiltered(true);
    setCurrentPage(1);
    setShowViewFilter(false);
    setShowFeatureFilter(false);
    setShowMainRoomClassFilter(false);
    toast.success("Đã lọc kết quả tìm kiếm");
  };

  const handleReset = () => {
    setSearchTerm("");
    setSortOption("price");
    setSelectedViews([]);
    setSelectedFeatureIds([]);
    setSelectedMainRoomClassIds([]);
    setPriceRange([0, 10000000]); // Giả sử giá phòng tối đa là 1 triệu
    setIsFiltered(false);
    setShowViewFilter(false);
    setShowFeatureFilter(false);
    setShowMainRoomClassFilter(false);
    setCurrentPage(1);
    toast.success("Đã xóa bộ lọc");
  };

  return (
    <div className="sticky-top" style={{ top: "13%" }}>
      <h4 className="tw-font-bold tw-my-4 tw-text-primary">LỌC TẤT CẢ PHÒNG</h4>

      <div className="tw-flex md:tw-flex-row tw-flex-col tw-gap-3 tw-mb-3">
        <input
          type="text"
          className="tw-px-4 tw-py-2 tw-rounded-md tw-bg-[#1d1d1d] tw-text-primary tw-placeholder-gray-400 tw-border tw-border-primary focus:tw-outline-none tw-w-full tw-flex-1"
          placeholder="Tìm kiếm phòng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <AnimatedButton
          className="tw-bg-primary tw-text-white tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-secondary"
          onClick={handleSubmit}
        >
          <FontAwesomeIcon icon={faFilter} />
        </AnimatedButton>
        <AnimatedButton
          className="tw-bg-secondary tw-text-white tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-primary"
          onClick={handleReset}
        >
          <FontAwesomeIcon icon={faTrash} />
        </AnimatedButton>
      </div>

      <PriceSlider priceRange={priceRange} setPriceRange={setPriceRange} />

      <p
        className="tw-font-bold tw-cursor-pointer tw-flex tw-items-center"
        onClick={() => setShowMainRoomClassFilter(!showMainRoomClassFilter)}
      >
        Lọc theo loại phòng
        <span className="tw-mx-2 tw-text-2xl">
          {showMainRoomClassFilter ? (
            <FontAwesomeIcon icon={faCaretUp} />
          ) : (
            <FontAwesomeIcon icon={faCaretDown} />
          )}
        </span>
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
        className="tw-font-bold tw-cursor-pointer tw-flex tw-items-center"
        onClick={() => setShowViewFilter(!showViewFilter)}
      >
        Lọc theo view
        <span className="tw-mx-2 tw-text-2xl">
          {showMainRoomClassFilter ? (
            <FontAwesomeIcon icon={faCaretUp} />
          ) : (
            <FontAwesomeIcon icon={faCaretDown} />
          )}
        </span>
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
        className="tw-font-bold tw-cursor-pointer tw-flex tw-items-center"
        onClick={() => setShowFeatureFilter(!showFeatureFilter)}
      >
        Lọc theo tiện nghi
        <span className="tw-mx-2 tw-text-2xl">
          {showMainRoomClassFilter ? (
            <FontAwesomeIcon icon={faCaretUp} />
          ) : (
            <FontAwesomeIcon icon={faCaretDown} />
          )}
        </span>
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
