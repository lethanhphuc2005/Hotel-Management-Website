"use client";
import React, { useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import { useHeader } from "@/hooks/useHeader";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const cartCount = useSelector((state: RootState) => state.cart.rooms.length);
  const { mainroomclass, wallet, userData, toggleSearch, handleLogout, level } =
    useHeader({
      showDropdown,
      setShowDropdown,
      showSearch,
      setShowSearch,
    });

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
                href="/discount"
              >
                Khuyến mãi
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
            {showSearch && (
              <input
                type="text"
                className={`form-control bg-transparent text-white ${style.searchInput}`}
                placeholder="Tìm kiếm..."
                style={{
                  top: "22px",
                  right: "250px",
                  width: "300px",
                  zIndex: 1000,
                  borderRadius: "8px",
                }}
              />
            )}
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
