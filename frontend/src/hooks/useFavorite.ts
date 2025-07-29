import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UserFavorite } from "@/types/userFavorite";
import {
  createUserFavorite,
  deleteUserFavorite,
} from "@/services/UserFavoriteService";
import { useAuth } from "@/contexts/AuthContext";

export function useFavorite(
  roomClassId: string,
  favorites: UserFavorite[] = []
) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [liked, setLiked] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    const matched = favorites.find((f) => f.room_class_id === roomClassId);
    if (matched) {
      setLiked(true);
      setFavoriteId(matched.id.toString());
    }
  }, [favorites, roomClassId]);

  const handleLikeClick = async () => {
    if (isAuthLoading || !user) {
      toast.error("Bạn cần đăng nhập để thực hiện thao tác này.");
      return;
    }
    const userId = user.id;

    try {
      if (!liked) {
        const res = await createUserFavorite({ userId, roomClassId });
        setLiked(true);
        setFavoriteId(String(res.data.id));
        toast.success("Đã thêm vào yêu thích!");
      } else {
        if (!favoriteId) {
          toast.error("Không tìm thấy mục yêu thích để xoá!");
          return;
        }
        await deleteUserFavorite({ userId, favoriteId });
        setLiked(false);
        setFavoriteId(null);
        toast.success("Đã xoá khỏi yêu thích!");
      }
    } catch (err) {
      toast.error("Lỗi khi xử lý yêu thích.");
      console.error(err);
    }
  };

  return { liked, handleLikeClick };
}
