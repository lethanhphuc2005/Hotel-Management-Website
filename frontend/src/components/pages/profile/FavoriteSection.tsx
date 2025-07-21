"use client";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { deleteUserFavorite } from "@/services/UserFavoriteService";
import { formatDate } from "@/utils/dateUtils";
import { useState } from "react";
import { capitalizeFirst } from "@/utils/stringUtils";
import Pagination from "@/components/sections/Pagination";
import getImageUrl from '../../../utils/getImageUrl';

type Favorite = {
  id: string;
  createdAt: string;
  updatedAt: string;
  user_id: string;
  room_class_id: {
    id: string;
    name: string;
    images: { url: string }[];
    description: string;
    price: number;
    view: string;
    main_room_class_id?: { name: string };
  };
};

export default function FavoriteSection({
  favorites,
  setFavorites,
}: {
  favorites: Favorite[];
  setFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = favorites.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFavorites = favorites.slice(startIndex, endIndex);
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Không có mục yêu thích nào.
      </div>
    );
  }

  const handleDelete = async (userId: string, favoriteId: string) => {
    setDeletingId(favoriteId);
    try {
      await deleteUserFavorite(userId, favoriteId);
      toast.success("Xóa mục yêu thích thành công");
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    } catch (error) {
      toast.error("Xóa mục yêu thích thất bại. Vui lòng thử lại sau.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="tw-space-y-4">
      {currentFavorites.map((favorite) => (
        <motion.div
          key={favorite.id}
          className="tw-p-4 tw-rounded-xl tw-border tw-border-gray-700 tw-bg-black/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="tw-flex tw-justify-between tw-gap-4 tw-items-start">
            {/* Hình ảnh */}
            <img
              src={getImageUrl(favorite.room_class_id.images?.[0]?.url)}
              alt={favorite.room_class_id.name}
              className="tw-w-28 tw-h-20 tw-object-cover tw-rounded-lg tw-flex-shrink-0 tw-border tw-border-gray-600"
            />

            {/* Thông tin */}
            <div className="tw-flex-1">
              <h3 className="tw-text-lg tw-font-bold tw-text-white">
                {favorite.room_class_id.name}
              </h3>

              <p className="tw-text-sm tw-text-gray-400">
                Ngày thêm: {formatDate(favorite.createdAt)}
              </p>
              <p className="tw-text-sm tw-text-gray-400">
                View:{" "}
                {capitalizeFirst(favorite.room_class_id.view) || "Không rõ"} -
                Loại:{" "}
                {favorite.room_class_id.main_room_class_id?.name || "Không rõ"}
              </p>
              <p className="tw-text-sm tw-text-gray-400 tw-mb-2">
                Giá: {favorite.room_class_id.price.toLocaleString("vi-VN")}₫ /
                đêm
              </p>
            </div>
            {/* Nút xoá */}
            <motion.button
              whileHover={{ scale: 1.05, opacity: 0.85 }}
              whileTap={{ scale: 0.95, opacity: 0.6 }}
              disabled={deletingId === favorite.id}
              onClick={(e) => {
                handleDelete(favorite.user_id, favorite.id);
                e.stopPropagation();
              }}
              className={`tw-text-red-500 tw-border tw-border-red-500 tw-rounded-lg tw-px-3 tw-py-1.5 tw-text-sm ${
                deletingId === favorite.id
                  ? "tw-opacity-50 tw-cursor-not-allowed"
                  : ""
              }`}
            >
              {deletingId === favorite.id ? "Đang xoá..." : "Xoá"}
            </motion.button>
          </div>
        </motion.div>
      ))}
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
