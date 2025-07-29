import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { Booking } from "@/types/booking";
import { Review } from "@/types/review";
import { UserFavorite } from "@/types/userFavorite";
import { Wallet } from "@/types/wallet";
import { Comment } from "@/types/comment";

export const useProfile = () => {
  const { user, isLoading: isAuthLoading, logout, refetchProfile } = useAuth();
  const { setLoading } = useLoading();
  const router = useRouter();
  const [didFetch, setDidFetch] = useState(false);

  const [profile, setProfile] = useState<User>();
  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    address: "",
    email: "",
    phone_number: "",
    request: "",
    is_verified: false,
  });

  const [bookedRooms, setBookedRooms] = useState<Booking[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [isAuthLoading, user]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || isAuthLoading || didFetch) return;

      try {
        setLoading(true);

        setProfile(user);
        setFormData({
          id: user.id,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          address: user.address || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          request: user.request || "",
          is_verified: Boolean(user.is_verified),
        });
        setBookedRooms(user.bookings || []);
        setComments(user.comments || []);
        setReviews(user.reviews || []);
        setFavorites(user.favorites || []);
        setWallet(user.wallet || null);
        setDidFetch(true); // ✅ set sau thành công
      } catch (err) {
        console.error("Lỗi khi fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, isAuthLoading, didFetch]);

  return {
    refetchProfile,
    user,
    profile,
    formData,
    setFormData,
    bookedRooms,
    setBookedRooms,
    comments,
    setComments,
    reviews,
    setReviews,
    favorites,
    setFavorites,
    wallet,
    setWallet,
    logout,
  };
};
