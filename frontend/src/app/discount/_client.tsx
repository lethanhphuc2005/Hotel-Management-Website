"use client";
import { useEffect, useMemo, useState } from "react";
import SearchSortBar from "@/components/sections/SearchSortBar";
import { useLoading } from "@/contexts/LoadingContext";
import Pagination from "@/components/sections/Pagination";
import { Discount } from "@/types/discount";
import { fetchDiscounts } from "@/services/DiscountService";
import { DiscountList } from "@/components/pages/discount/List";
import { useDiscount } from "@/hooks/data/useDiscount";

export default function DiscountsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const memorzedParams = useMemo(() => {
    const baseParams: Record<string, any> = {
      search: searchTerm,
      sort: sortOption,
      order: sortOrder,
      page: currentPage,
      limit: itemsPerPage,
    };
    if (searchTerm) {
      baseParams.search = searchTerm;
    }

    return baseParams;
  }, [searchTerm, sortOption, currentPage, itemsPerPage, sortOrder]);

  const { discounts, total } = useDiscount(memorzedParams);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <div className="tw-container tw-mt-[130px] tw-mb-[100px] tw-mx-auto">
      <h4 className="tw-mb-4 tw-font-bold tw-text-white tw-text-xl sm:tw-text-2xl">
        CÁC KHUYẾN MÃI
      </h4>

      <SearchSortBar
        searchTerm={searchTerm}
        setSearchTerm={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        sortOption={`${sortOption}-${sortOrder}`}
        setSortOption={(value) => {
          const [field, order] = value.split("-");
          setSortOption(field);
          setSortOrder(order as "asc" | "desc");
          setCurrentPage(1);
        }}
        placeholder="Tìm khuyến mãi..."
        sortOptions={[
          { value: "valid_from-asc", label: "Ngày bắt đầu A-Z" },
          { value: "valid_from-desc", label: "Ngày bắt đầu Z-A" },
          { value: "valid_to-asc", label: "Ngày kết thúc A-Z" },
          { value: "valid_to-desc", label: "Ngày kết thúc Z-A" },
          { value: "value-asc", label: "Giảm giá tăng dần" },
          { value: "value-desc", label: "Giảm giá giảm dần" },
        ]}
      />

      <DiscountList discounts={discounts} />

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          onPageChange={handlePageChange}
          forcePage={currentPage - 1}
        />
      )}
    </div>
  );
}
