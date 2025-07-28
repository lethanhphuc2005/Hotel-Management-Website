"use client";

import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { formatCurrencyVN } from "@/utils/currencyUtils";

interface PriceSliderProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

export default function PriceSlider({
  priceRange,
  setPriceRange,
}: PriceSliderProps) {
  return (
    <div className="mb-3">
      <label className="fw-bold mb-2">Ngân sách của bạn (mỗi đêm)</label>
      <div className="tw-flex tw-items-center tw-justify-between tw-text-sm tw-font-medium tw-text-white tw-mb-2">
        <span className="tw-min-w-[80px] tw-text-left tw-text-primary">
          {formatCurrencyVN(priceRange[0])}
        </span>
        <span className="tw-min-w-[80px] tw-text-primary">
          {formatCurrencyVN(priceRange[1])}
        </span>
      </div>
      <div className="tw-flex tw-items-center tw-mb-4 tw-gap-3 tw-text-sm tw-font-medium tw-text-white">
        <Slider
          min={0}
          max={10000000}
          step={100000}
          range
          value={priceRange}
          onChange={(value) => {
            if (Array.isArray(value) && value.length === 2) {
              setPriceRange([value[0], value[1]]);
            }
          }}
          allowCross={false}
          pushable={100000}
          trackStyle={[{ backgroundColor: "#FAB320", height: 6 }]}
          handleStyle={[
            {
              borderColor: "#FAB320",
              backgroundColor: "#FAB320",
              width: 18,
              height: 18,
              marginTop: -6,
            },
            {
              borderColor: "#FAB320",
              backgroundColor: "#FAB320",
              width: 18,
              height: 18,
              marginTop: -6,
            },
          ]}
          railStyle={{ backgroundColor: "#444", height: 6 }}
        />
      </div>
    </div>
  );
}
