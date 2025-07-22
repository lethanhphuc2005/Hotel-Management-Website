"use client";
import React, { useEffect, useState } from "react";
import style from "@/styles/layout/header.module.css";
import { useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import { AnimatePresence, motion } from "framer-motion";
import {
  faCartShopping,
  faUser,
  faBell,
  faMagnifyingGlass,
  faStar,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import { useHeader } from "@/hooks/useHeader";
import SearchSuggestions from "../sections/SearchSuggestion";
import {
  fetchSuggestions,
  fetchSearchLogsByUser,
  fetchSearchLogsByAI,
  fetchSearchTrending,
} from "@/services/SearchService";
import { SuggestionResponse } from "@/types/suggestion";
import { AnimatedButton } from "@/components/common/Button";
import { handleSearchClick } from "@/utils/handleSearchClick";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionResponse[]>([]);
  const [trending, setTrending] = useState<
    { keyword: string; count: number }[]
  >([]);
  const [clusters, setClusters] = useState<{ representative: string }[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const router = useRouter();
  const handleSearch = () => {
    if (searchValue.trim()) {
      const query: Record<string, string> = { q: searchValue.trim() };
      router.push(`/search?${new URLSearchParams(query).toString()}`);
      handleSearchClick({ label: searchValue.trim(), type: "keyword" }, router);
      setSearchValue("");
      setSuggestions([]);
      setShowSearch(false);
    } else {
      toast.info("Vui lòng nhập từ khóa tìm kiếm");
    }
  };

  const cartCount = useSelector((state: RootState) => state.cart.rooms.length);
  const { mainRoomClass, wallet, userData, toggleSearch, handleLogout, level } =
    useHeader({
      showDropdown,
      setShowDropdown,
      showSearch,
      setShowSearch,
    });

  useEffect(() => {
    if (!searchValue) {
      if (trending.length === 0) fetchSearchTrending().then(setTrending);
      if (clusters.length === 0) fetchSearchLogsByAI().then(setClusters);
      if (userData && history.length === 0)
        fetchSearchLogsByUser().then(setHistory);
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const result = await fetchSuggestions(searchValue);
      setSuggestions(result);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue, userData]);

  const menuItems = [
    {
      label: "Trang chủ",
      href: "/",
    },
    {
      label: "Phòng",
      href: "/room-class",
      dropdown: true,
      items: mainRoomClass.map((mainroom) => ({
        label: mainroom.name,
        href: `/room-class?mainRoomClassId=${mainroom.id}`,
      })),
    },
    {
      label: "Dịch vụ",
      href: "/service",
    },
    {
      label: "Khuyến mãi",
      href: "/discount",
    },
    {
      label: "Tin tức",
      href: "/news",
    },
    {
      label: "Liên hệ",
      href: "/contact",
    },
  ];

  const handleClick = (item: { label: string; href: string }) => {
    if (item.href === "/") {
      router.push("/");
    } else {
      router.push(item.href);
    }
    setShowDropdown(false);
    setShowSearch(false);
    setSearchValue("");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">
        <Link className={`navbar-brand text-white`} href="/">
          <img width="203px" height="57px" src="/img/image.png" alt="logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`nav-item ${item.dropdown ? style.dropdown : ""}`}
              >
                <Link
                  className={`nav-link active text-white fw-bold ${style.item}`}
                  href={item.href}
                  onClick={() => handleClick(item)}
                >
                  {item.label}
                </Link>

                {item.dropdown && item.items && (
                  <ul className={style.dropdownMenu}>
                    {item.items.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={subItem.href}
                          className={style.dropdownItem}
                          onClick={() => handleClick(subItem)}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="d-flex gap-3 align-items-center">
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="tw-fixed tw-inset-0 tw-z-[999] tw-bg-black/90 tw-backdrop-blur-sm tw-flex tw-justify-center tw-items-start md:tw-items-center tw-pt-[120px] md:tw-pt-0"
                >
                  {/* Nút đóng */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="tw-absolute tw-top-[5%] tw-right-[5%] tw-text-white hover:tw-text-primary tw-transition-colors tw-bg-transparent tw-border-none tw-cursor-pointer"
                    onClick={() => setShowSearch(false)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="tw-text-2xl" />
                  </motion.button>

                  {/* Box input & suggestion */}
                  <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="tw-bg-black tw-rounded-xl tw-w-full md:tw-w-[600px] tw-p-4 tw-relative tw-shadow-lg"
                  >
                    <div className="tw-flex tw-gap-2 tw-items-center tw-mb-4">
                      <input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSearch();
                        }}
                        className="tw-flex-1 tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-text-white tw-bg-black"
                        placeholder="Tìm kiếm phòng, tiện nghi, dịch vụ..."
                        autoFocus
                      />
                      <AnimatedButton
                        className=" tw-px-4 tw-py-2"
                        onClick={() => handleSearch()}
                      >
                        Tìm kiếm
                      </AnimatedButton>
                    </div>

                    <SearchSuggestions
                      suggestions={suggestions}
                      trending={trending}
                      clusters={clusters}
                      history={history}
                      onClose={() => {
                        setSuggestions([]);
                        setShowSearch(false);
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <Link href={"#"}>
              <motion.div
                whileHover={{ color: "#FAB320" }}
                style={{ fontSize: 20, color: "white" }}
                onClick={toggleSearch}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </motion.div>
            </Link>

            <Link href={"#"}>
              <motion.div
                whileHover={{ color: "#FAB320" }}
                style={{ fontSize: 20, color: "white" }}
              >
                <FontAwesomeIcon icon={faBell} />
              </motion.div>
            </Link>

            <Link className={`text-white`} href="/cart">
              <div style={{ position: "relative", display: "inline-block" }}>
                <motion.div
                  whileHover={{ color: "#FAB320" }}
                  style={{ fontSize: 20 }}
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                </motion.div>

                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -13,
                      background: "#FAB320",
                      color: "black",
                      borderRadius: "50%",
                      padding: "3px 8px",
                      fontSize: 10,
                      fontWeight: 700,
                      transition: "all 0.2s",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Avatar & Dropdown */}
            <div className="tw-relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="tw-flex tw-items-center tw-gap-2 tw-text-white tw-cursor-pointer"
              >
                <FontAwesomeIcon icon={faUser} className="tw-text-xl" />
                {userData && (
                  <div className="tw-hidden md:tw-flex tw-flex-col tw-items-start">
                    <span className="tw-text-white tw-font-semibold tw-text-sm">
                      {userData.last_name} {userData.first_name}
                    </span>
                    <div className="tw-flex tw-items-center tw-text-xs tw-font-semibold tw-rounded-md tw-overflow-hidden">
                      <div className="tw-bg-black tw-px-2 tw-py-[2px] tw-flex tw-items-center tw-gap-1">
                        <FontAwesomeIcon
                          icon={faStar}
                          className="tw-text-[#FAB320]"
                        />
                        <span className="tw-text-[#FAB320]">VIP</span>
                      </div>
                      <div
                        className="tw-px-2 tw-py-[2px]"
                        style={{ backgroundColor: level.color, color: "black" }}
                      >
                        {level.label}
                      </div>
                    </div>
                  </div>
                )}
                {wallet && (
                  <span className="tw-bg-[#FAB320] tw-text-black tw-text-xs tw-font-semibold tw-px-2 tw-py-1 tw-rounded-full">
                    {formatCurrencyVN(wallet.balance)}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="tw-absolute tw-right-0 tw-z-50 tw-bg-black tw-border tw-border-gray-700 tw-rounded-md tw-mt-2 tw-shadow-lg tw-p-2 tw-w-full tw-min-w-[150px]"
                  >
                    {userData ? (
                      <>
                        <Link
                          className="tw-block tw-text-white hover:tw-text-[#FAB320] tw-px-3 tw-py-2 tw-text-sm tw-no-underline"
                          href="/profile"
                        >
                          Quản lý tài khoản
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="tw-block tw-text-white hover:tw-text-red-400 tw-px-3 tw-py-2 tw-text-sm tw-w-full tw-text-left tw-no-underline"
                        >
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          className="tw-block tw-text-white hover:tw-text-[#FAB320] tw-px-3 tw-py-2 tw-text-sm tw-no-underline"
                          href="/login"
                        >
                          Đăng nhập
                        </Link>
                        <Link
                          className="tw-block tw-text-white hover:tw-text-[#FAB320] tw-px-3 tw-py-2 tw-text-sm tw-no-underline"
                          href="/register"
                        >
                          Đăng ký
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
