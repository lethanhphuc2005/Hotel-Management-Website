import { useState, useEffect } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { fetchMainRoomClasses } from "@/services/MainRoomClasssService";
import { MainRoomClass } from "@/types/mainRoomClass";
import { Wallet } from "@/types/wallet";
import { useAuth } from "@/contexts/AuthContext";
import style from "@/styles/layout/header.module.css";
import { fetchProfile } from "@/services/ProfileService";
import { IUser } from "@/types/user";
import { useRouter } from "next/navigation";

interface HeaderProps {
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}

const levelMap: Record<string, { label: string; color: string }> = {
  bronze: { label: "Đồng", color: "#cd8141" },
  silver: { label: "Bạc", color: "#c0c0c0" },
  gold: { label: "Vàng", color: "#FFD700" },
  diamond: { label: "Kim Cương", color: "#b9f2ff" },
};

export const useHeader = ({
  showDropdown,
  setShowDropdown,
  showSearch,
  setShowSearch,
}: HeaderProps) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mainroomclass, setMainroomclass] = useState<MainRoomClass[]>([]);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [didFetch, setDidFetch] = useState(false);
  const { setLoading } = useLoading();
  const level = levelMap[userData?.level || "bronze"] || levelMap.bronze;

  const toggleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSearch(!showSearch);
  };

  const handleLogout = () => {
    logout();
    setUserData(null);
    setWallet(null);
    setShowDropdown(false);
    router.push("/login");
  };

  useEffect(() => {
    if (didFetch) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mainRoomClassData, userProfile] = await Promise.all([
          fetchMainRoomClasses(),
          user ? fetchProfile(user.id) : Promise.resolve(null),
        ]);
        if (!mainRoomClassData.success && !userProfile?.success) {
          throw new Error(
            "Failed to fetch one or more resources: " +
              [mainRoomClassData.message, userProfile?.message]
                .filter(Boolean)
                .join(", ")
          );
        }
        setMainroomclass(mainRoomClassData.data);
        setUserData(userProfile?.data || null);
        setWallet(userProfile?.data?.wallet || null);
      } catch (error) {
        console.error("Error fetching main room classes:", error);
      } finally {
        setLoading(false);
        setDidFetch(true);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add(style.navbarScrollBg);
        } else {
          navbar.classList.remove(style.navbarScrollBg);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector(".tw-relative");
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        showDropdown
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, setShowDropdown]);

  return {
    mainroomclass,
    userData,
    wallet,
    level,
    setMainroomclass,
    setUserData,
    toggleSearch,
    handleLogout,
  };
};
