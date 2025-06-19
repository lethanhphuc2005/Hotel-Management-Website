"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import style from "./header.module.css";
import Link from "next/link";
import { getMainRoomClass } from "@/services/mainroomclassService";
import { MainRoomClass } from "@/types/mainroomclass";
import { useAuth } from "@/contexts/AuthContext";
import { useSelector } from "react-redux";
import { RootState } from "@/contexts/store";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [mainroomclass, setMainroomclass] = useState<MainRoomClass[]>([]);
  const { user, logout } = useAuth();
  const cartCount = useSelector((state: RootState) => state.cart.rooms.length);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMainRoomClass(
        "http://localhost:8000/v1/main-room-class/user"
      );
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
    window.location.href = "/";
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        if (window.scrollY > 500) {
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
                href="/roomtype"
              >
                Phòng
              </Link>
              <ul className={style.dropdownMenu}>
                {mainroomclass.map((mainroom, index) => (
                  <li key={index}>
                    <Link
                      href={`/roomtype/${mainroom._id}`}
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
                href="/hotelservice"
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
            <a className="text-white" onClick={toggleSearch} href="#">
              <i className="bi bi-search fs-5"></i>
            </a>
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
            <a className="text-white" href="#">
              <i className="bi bi-bell fs-5"></i>
            </a>

            {/* Avatar & Dropdown */}
            <div className={style.dropdown}>
              <a
                className="text-white d-flex align-items-center gap-2"
                href="#"
              >
                <i className="bi bi-person-circle fs-5"></i>
                {user && (
                  <span>
                    Xin chào, <strong>{user.first_name}</strong>
                  </span>
                )}
              </a>
              <div className={style.dropdownMenu}>
                {user ? (
                  <>
                    <Link
                      className={style.dropdownItem}
                      href="/profile"
                    >
                      Quản lý tài khoản
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={style.dropdownItem}
                      style={{ border: "none", background: "none" }}
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
                <i
                  className="bi bi-cart fs-5"
                  style={{ fontSize: 28, color: "#fff" }}
                ></i>
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
