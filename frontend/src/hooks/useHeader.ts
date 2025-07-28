import { useState, useEffect } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { fetchMainRoomClasses } from "@/services/MainRoomClasssService";
import { MainRoomClass } from "@/types/mainRoomClass";
import { Wallet } from "@/types/wallet";
import { useAuth } from "@/contexts/AuthContext";
import style from "@/styles/layout/header.module.css";
import { User } from "@/types/user";

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
  normal: { label: "Thường", color: "#808080" },
};

export const useHeader = ({
  showDropdown,
  setShowDropdown,
  showSearch,
  setShowSearch,
}: HeaderProps) => {
  const { user, logout } = useAuth();
  const [mainRoomClass, setMainRoomClass] = useState<MainRoomClass[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [didFetch, setDidFetch] = useState(false);
  const { setLoading } = useLoading();
  const level = levelMap[userData?.level || "normal"] || levelMap.normal;
  const toggleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSearch(!showSearch);
  };

  const handleLogout = () => {
    logout();
    setUserData(null);
    setWallet(null);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (!user || didFetch ) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const mainRoomClassData = await fetchMainRoomClasses();

        if (!mainRoomClassData.success) {
          throw new Error(mainRoomClassData.message);
        }

        setMainRoomClass(mainRoomClassData.data);
        setUserData(user); // ← Dùng user từ context
        setWallet(user?.wallet || null); // ← Nếu có thông tin ví
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
    mainRoomClass,
    userData,
    wallet,
    level,
    setMainRoomClass,
    setUserData,
    toggleSearch,
    handleLogout,
  };
};
