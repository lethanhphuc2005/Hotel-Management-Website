import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/services/ProfileService";
import { User } from "@/types/user";
import { Booking } from "@/types/booking";
import { Review } from "@/types/review";
import { UserFavorite } from "@/types/userFavorite";
import { Wallet } from "@/types/wallet";
import { Comment } from "@/types/comment";

export const useProfile = () => {
  const { user, isLoading: isAuthLoading, logout } = useAuth();
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
        const response = await fetchProfile();
        if (!response.success) {
          console.error("Lỗi khi fetch profile:", response.message);
          return;
        }
        const data = response.data;

        setProfile(data);
        setFormData({
          id: data.id,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          address: data.address || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          request: data.request || "",
          is_verified: Boolean(data.is_verified),
        });
        setBookedRooms(data.bookings || []);
        setComments(data.comments || []);
        setReviews(data.reviews || []);
        setFavorites(data.favorites || []);
        setWallet(data.wallet || null);
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
