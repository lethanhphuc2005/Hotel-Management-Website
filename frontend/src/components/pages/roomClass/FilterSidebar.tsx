"use client";

import { AnimatePresence, motion } from "framer-motion";
import AnimatedCheckbox from "@/components/common/Checkbox";
import PriceSlider from "@/components/pages/roomClass/PriceSlider";
import { Feature } from "@/types/feature";
import { MainRoomClass } from "@/types/mainRoomClass";

interface FilterSidebarProps {
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
          Tất cả loại phòng
        </p>
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
                checked={selectedViews.includes(view)} // ✅ đúng logic
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
