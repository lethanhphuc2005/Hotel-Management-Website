"use client";

import { SuggestionResponse } from "@/types/suggestion";
import { useRouter } from "next/navigation";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  faClock,
  faFire,
  faRobot,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createSearchLog } from "@/services/SearchService";
import { handleSearchClick } from "@/utils/handleSearchClick";

type Props = {
  suggestions: SuggestionResponse[];
  trending: { keyword: string; count: number }[];
  clusters: { representative: string }[];
  history: string[];
  onClose?: () => void;
};

const SearchSuggestions: React.FC<Props> = ({
  suggestions,
  trending,
  clusters,
  history,
  onClose,
}) => {
  const router = useRouter();

  if (
    !suggestions.length &&
    !history.length &&
    !trending.length &&
    !clusters.length
  )
    return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="tw-bg-black tw-text-white tw-rounded-2xl tw-absolute tw-z-50 tw-w-[95%] tw-shadow-2xl tw-max-h-[320px] tw-overflow-hidden tw-p-4 tw-space-y-4 tw-border tw-border-gray-700"
      >
        {suggestions.length > 0 && (
          <ul className="tw-space-y-2 tw-p-0">
            {suggestions.map((item, index) => (
              <li
                key={index}
                className="tw-px-4 tw-py-2 tw-cursor-pointer tw-rounded-xl hover:tw-bg-primary hover:tw-text-black tw-transition-colors tw-text-sm tw-flex tw-justify-between"
                onClick={() => handleSearchClick(item, router, onClose)}
              >
                <span>
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className=" tw-mr-2"
                  />
                  {item.label}
                </span>
                <span className="tw-text-xs tw-opacity-60">({item.type})</span>
              </li>
            ))}
          </ul>
        )}

        {suggestions.length === 0 && (
          <div className="tw-space-y-4">
            {history.length > 0 && (
              <div>
                <p className="tw-text-primary tw-font-semibold tw-mb-2">
                  <FontAwesomeIcon icon={faClock} className="tw-mr-2" />
                  Lịch sử tìm kiếm
                </p>
                <div className="tw-flex tw-gap-2 tw-flex-wrap">
                  {history.map((keyword, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleSearchClick(
                          { label: keyword, type: "keyword" },
                          router,
                          onClose
                        )
                      }
                      className="tw-bg-gray-800 hover:tw-bg-primary hover:tw-text-black tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-transition-all"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {trending.length > 0 && (
              <div>
                <p className="tw-text-primary tw-font-semibold tw-mb-2">
                  <FontAwesomeIcon icon={faFire} className="tw-mr-2" />
                  Xu hướng tìm kiếm
                </p>
                <div className="tw-flex tw-gap-2 tw-flex-wrap">
                  {trending.map((item, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleSearchClick(
                          { label: item.keyword, type: "keyword" },
                          router,
                          onClose
                        )
                      }
                      className="tw-bg-gray-800 hover:tw-bg-primary hover:tw-text-black tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-transition-all"
                    >
                      {item.keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {clusters.length > 0 && (
              <div>
                <p className="tw-text-primary tw-font-semibold tw-mb-2">
                  <FontAwesomeIcon icon={faRobot} className="tw-mr-2" />
                  Gợi ý thông minh
                </p>
                <div className="tw-flex tw-gap-2 tw-flex-wrap">
                  {clusters.map((item, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleSearchClick(
                          { label: item.representative, type: "keyword" },
                          router,
                          onClose
                        )
                      }
                      className="tw-bg-gray-800 hover:tw-bg-primary hover:tw-text-black tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-transition-all"
                    >
                      {item.representative}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchSuggestions;
