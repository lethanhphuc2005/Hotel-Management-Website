// hooks/useProfile.ts
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext"; // nếu bạn có
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/api/profileApi";

export const useProfile = () => {
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const { setLoading } = useLoading();
  const router = useRouter();

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

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getProfile(user.id);
        const data = res.data;

        setProfile(data);
        setFormData({
          id: data.id || data._id,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          address: data.address || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          request: data.request || "",
          is_verified: data.is_verified,
        });
        setBookedRooms(data.bookings || []);
      } catch (err) {
        console.error("Lỗi khi fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, isAuthLoading]);

  return {
    user,
    profile,
    formData,
    setFormData,
    bookedRooms,
    logout,
  };
};
