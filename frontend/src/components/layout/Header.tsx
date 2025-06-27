"use client";
import React, { useEffect, useState } from "react";
import style from "@/styles/layout/header.module.css";

import { useAuth } from "@/contexts/AuthContext";
import { useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  faCartShopping,
  faUser,
  faBell,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MainRoomClass } from "@/types/mainRoomClass";
import { fetchMainRoomClasses } from "@/services/MainRoomClasssService";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [mainroomclass, setMainroomclass] = useState<MainRoomClass[]>([]);
  const { user, logout } = useAuth();
  const cartCount = useSelector((state: RootState) => state.cart.rooms.length);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchMainRoomClasses();
      if (!response.success) {
        console.error("Failed to fetch main room classes:", response.message);
        return;
      }
      const data = response.data;
      setMainroomclass(data);
    };
    fetchData();
  }, []);

  const toggleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSearch(!showSearch);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

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
            <li className="nav-item">
              <Link
                className={`nav-link active text-white fw-bold ${style.item}`}
                href="/"
              >
                Trang chủ
              </Link>
            </li>
            <li className={`nav-item ${style.dropdown}`}>
              <Link
                className={`nav-link active text-white fw-bold ${style.item}`}
                href="/room-class"
              >
                Phòng
              </Link>
              <ul className={style.dropdownMenu}>
                {mainroomclass.map((mainroom, index) => (
                  <li key={index}>
                    <Link
                      href={`/room-class?mainRoomClassId=${mainroom.id}`}
                      className={style.dropdownItem}
                    >
                      {mainroom.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link active text-white fw-bold ${style.item}`}
                href="/service"
              >
                Dịch vụ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link active text-white fw-bold ${style.item}`}
                href="/news"
              >
                Tin tức
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link active text-white fw-bold ${style.item}`}
                href="/contact"
              >
                Liên hệ
              </Link>
            </li>
          </ul>

          <div className="d-flex gap-3 align-items-center">
            <Link href={"#"}>
              <motion.div
                whileHover={{ color: "#FAB320" }}
                style={{ fontSize: 20, color: "white" }}
                onClick={toggleSearch}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </motion.div>
            </Link>
            {showSearch && (
              <input
                type="text"
                className={`form-control bg-transparent text-white ${style.searchInput}`}
                placeholder="Tìm kiếm..."
                style={{
                  position: "absolute",
                  top: "22px",
                  right: "250px",
                  width: "400px",
                  zIndex: 1000,
                  borderRadius: "8px",
                }}
              />
            )}
            <Link href={"#"}>
              <motion.div
                whileHover={{ color: "#FAB320" }}
                style={{ fontSize: 20, color: "white" }}
              >
                <FontAwesomeIcon icon={faBell} />
              </motion.div>
            </Link>

            {/* Avatar & Dropdown */}
            <div className={style.dropdown}>
              <div className="text-white d-flex align-items-center gap-2 cursor-pointer">
                <Link href={user ? "/profile" : "/login"}>
                  <motion.div
                    whileHover={{ color: "#FAB320" }}
                    style={{ fontSize: 20, color: "white" }}
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </motion.div>
                </Link>
                {user && (
                  <span>
                    Xin chào, <strong>{user.first_name}</strong>
                  </span>
                )}
              </div>
              <div className={style.dropdownMenu}>
                {user ? (
                  <>
                    <Link className={style.dropdownItem} href="/profile">
                      Quản lý tài khoản
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={style.dropdownItem}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        background: "none",
                      }}
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link className={style.dropdownItem} href="/login">
                      Đăng nhập
                    </Link>
                    <Link className={style.dropdownItem} href="/register">
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </nav>
  );
}
