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

  const refreshProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await fetchProfile(user.id);

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
    } catch (err) {
      console.error("Lỗi khi refresh profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading || didFetch) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await fetchProfile(user.id);

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
      } catch (err) {
        console.error("Lỗi khi fetch profile:", err);
      } finally {
        setLoading(false);
        setDidFetch(true); // ✅ tránh gọi lại liên tục
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
    comments,
    setComments,
    reviews,
    setReviews,
    logout,
    refreshProfile,
  };
};
