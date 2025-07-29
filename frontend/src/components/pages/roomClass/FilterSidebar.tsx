"use client";

import { AnimatePresence, motion } from "framer-motion";
import AnimatedCheckbox from "@/components/common/Checkbox";
import PriceSlider from "@/components/pages/roomClass/PriceSlider";
import { Feature } from "@/types/feature";
import { MainRoomClass } from "@/types/mainRoomClass";
import { AnimatedButton } from "@/components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";

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
  setCurrentPage,
}: FilterSidebarProps) {
  const [tempRange, setTempRange] = useState<[number, number]>(priceRange);
  const [inputValue, setInputValue] = useState(searchTerm);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setSearchTerm(inputValue);
      setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    }, 500); // 500ms chờ sau khi người dùng dừng gõ

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  const handleReset = () => {
    setSearchTerm("");
    setSortOption("price");
    setSelectedViews([]);
    setSelectedFeatureIds([]);
    setSelectedMainRoomClassIds([]);
    setTempRange([0, 10_000_000]); // Giả sử giá phòng tối đa là 5 triệu
    setPriceRange([0, 10_000_000]); // Giả sử giá phòng tối đa là 1 triệu
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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <AnimatedButton
          className="tw-bg-secondary tw-text-white tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-primary"
          onClick={handleReset}
        >
          <FontAwesomeIcon icon={faTrash} />
        </AnimatedButton>
      </div>

      <PriceSlider
        tempRange={tempRange}
        setTempRange={setTempRange}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

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
