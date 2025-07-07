"use client";
import { useEffect, useMemo, useState } from "react";
import SearchSortBar from "@/components/sections/SearchSortBar";
import { useLoading } from "@/contexts/LoadingContext";
import Pagination from "@/components/sections/Pagination";
import { Discount } from "@/types/discount";
import { fetchDiscounts } from "@/services/DiscountService";
import { DiscountList } from "@/components/pages/discount/List";

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const { setLoading } = useLoading();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name_asc");

  useEffect(() => {
    const fetchDiscountsData = async () => {
      setLoading(true);
      try {
        const response = await fetchDiscounts();
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch discounts");
        }
        setDiscounts(response.data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscountsData();
  }, []);

  const filteredAndSortedDiscounts = useMemo(() => {
    let filtered = discounts.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // switch (sortOption) {
    //   case "name_asc":
    //     filtered.sort((a, b) => a.name.localeCompare(b.name));
    //     break;
    //   case "name_desc":
    //     filtered.sort((a, b) => b.name.localeCompare(a.name));
    //     break;
    //   case "price_asc":
    //     filtered.sort((a, b) => a.price - b.price);
    //     break;
    //   case "price_desc":
    //     filtered.sort((a, b) => b.price - a.price);
    //     break;
    // }

    return filtered;
  }, [discounts, searchTerm, sortOption]);

  const totalItems = filteredAndSortedDiscounts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDiscounts = filteredAndSortedDiscounts.slice(
    startIndex,
    endIndex
  );

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <div className="tw-container tw-mt-[130px] tw-mb-[100px] tw-mx-auto">
      <h4 className="tw-mb-4 tw-font-bold tw-text-white tw-text-xl sm:tw-text-2xl">
        CÁC KHUYẾN MÃI
      </h4>

      {/* <SearchSortBar
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
      /> */}

      {/* Dịch vụ trả phí */}
      <DiscountList discounts={currentDiscounts} />

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
