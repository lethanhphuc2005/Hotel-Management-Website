import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/services/ProfileService";

export const useProfile = () => {
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const { setLoading } = useLoading();
  const router = useRouter();

  const [didFetch, setDidFetch] = useState(false);

  const [profile, setProfile] = useState<any>(null);
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

  const [bookedRooms, setBookedRooms] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  const refreshProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await fetchProfile(user.id);
      if (!response.success) {
        console.error("Lỗi khi refresh profile:", response.message);
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
    } catch (err) {
      console.error("Lỗi khi refresh profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading || didFetch) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetchProfile(user.id);
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
      } catch (err) {
        console.error("Lỗi khi fetch profile:", err);
      } finally {
        setLoading(false);
        setDidFetch(true); // ✅ tránh gọi lại liên tục
      }
    };

    fetchProfileData();
  }, [user, isAuthLoading, didFetch, setLoading]);

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
    logout,
    refreshProfile,
  };
};
