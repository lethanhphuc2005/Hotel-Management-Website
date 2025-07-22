"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Feature, RoomClassFeature } from "@/types/feature";

type DefaultFeature = {
  name: string;
  icon: keyof typeof solidIcons;
};

// Các tiện nghi mặc định hiển thị trực tiếp
const defaultFeatures: DefaultFeature[] = [
  { name: "Wi-Fi miễn phí", icon: "faWifi" },
  { name: "Tivi màn hình phẳng", icon: "faTv" },
  { name: "Điều hòa không khí", icon: "faSnowflake" },
  { name: "Tủ lạnh mini", icon: "faWineBottle" },
  { name: "Bàn làm việc", icon: "faLaptop" },
  { name: "Máy sấy tóc", icon: "faWind" },
  { name: "Phòng tắm riêng", icon: "faBath" },
  { name: "Dịch vụ phòng", icon: "faBellConcierge" },
  { name: "Bàn ủi / Bàn ủi hơi nước", icon: "faShirt" },
  { name: "Ban công / cửa sổ", icon: "faWindowMaximize" },
];

const FeatureSection = ({ features }: { features: RoomClassFeature[] }) => {
  return (
    <section className="tw-max-w-[1320px] tw-mx-auto tw-mt-10 tw-p-6 tw-shadow-xl  tw-border-t tw-border-white">
      <h3 className="tw-text-2xl tw-font-playfair tw-text-primary tw-font-bold tw-mb-4">
        Tiện nghi có sẵn
      </h3>

      <div className="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 lg:tw-grid-cols-5 tw-gap-4">
        {/* Tiện nghi mặc định */}
        {defaultFeatures.map((feature) => {
          const icon = solidIcons[feature.icon] as IconDefinition;
          return (
            <div
              key={`default-${feature.name}`}
              className="tw-flex tw-items-center tw-gap-3 tw-rounded-lg tw-p-3 tw-text-white hover:tw-bg-primary hover:tw-text-black tw-transition"
            >
              <FontAwesomeIcon icon={icon || solidIcons.faCircleCheck} />
              <span className="tw-text-sm">{feature.name}</span>
            </div>
          );
        })}
      </div>

      <h3 className="tw-text-2xl tw-font-playfair tw-text-primary tw-font-bold tw-mb-4 tw-mt-4">
        Tiện nghi phòng
      </h3>
      {/* Tiện nghi từ DB */}
      {features.length === 0 && (
        <div className="tw-text-gray-500 tw-text-center tw-py-4 tw-rounded-lg">
          Hiện tại phòng này chưa có tiện nghi nào được cập nhật.
        </div>
      )}
      <div className="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 lg:tw-grid-cols-5 tw-gap-4">
        {features.map((feature: any) => {
          const iconName = feature.feature_id.icon as keyof typeof solidIcons;
          const icon = solidIcons[iconName] as IconDefinition;
          return (
            <div
              key={feature.id}
              className="tw-flex tw-items-center tw-gap-3 tw-rounded-lg tw-p-3 tw-text-white hover:tw-bg-primary hover:tw-text-black tw-transition"
            >
              <FontAwesomeIcon icon={icon || solidIcons.faCircleCheck} />
              <span className="tw-text-sm">{feature.feature_id.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureSection;
