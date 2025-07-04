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
      <div className="mb-3 tw-text-center">
        <span style={{ fontSize: 13 }}>{formatCurrencyVN(priceRange[0])}</span>
        <span className="mx-2">-</span>
        <span style={{ fontSize: 13 }}>{formatCurrencyVN(priceRange[1])}</span>
      </div>
      <div className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
        <div style={{ flex: 1, margin: "0 8px" }}>
          <Slider
            min={0}
            max={5000000}
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
            trackStyle={[{ backgroundColor: "#FAB320" }]}
            handleStyle={[
              {
                borderColor: "#FAB320",
                backgroundColor: "#FAB320",
              },
              {
                borderColor: "#FAB320",
                backgroundColor: "#FAB320",
              },
            ]}
            railStyle={{ backgroundColor: "#ccc" }}
          />
        </div>
      </div>
    </div>
  );
}
