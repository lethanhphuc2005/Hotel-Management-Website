"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useEffect, useState } from 'react';
import style from './header.module.css';
import { RoomType } from '../../types/roomtype';
import { getRoomTypes } from '../../services/roomtypeService';
import Link from 'next/link';

export default function Header() {
  const [roomtypes, setRoomtypes] = useState<RoomType[]>([]);
  
    useEffect(() => {
    const fetchData = async () => {
      const data = await getRoomTypes("http://localhost:8000/v1/roomtype");
      setRoomtypes(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add(style.navbarScrollBg);
        } else {
          navbar.classList.remove(style.navbarScrollBg);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container">
          <a className="navbar-brand text-white" href="/"><img width="203px" height="57px" src="/img/image.png" alt="" /></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <ul
              className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
            // style={{ ['--bs-scroll-height']: '100px' }}
            >
              <li className="nav-item">
                <a className={`nav-link active text-white fw-bold ${style.item}`} href="/">Trang chủ</a>
              </li>
              <li className={`nav-item ${style.dropdown}`}>
                <a className={`nav-link active text-white fw-bold ${style.item}`} href="/roomtype">Phòng</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link active text-white fw-bold ${style.item}`} href="#">Dịch vụ</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link active text-white fw-bold ${style.item}`} href="#">Liên hệ</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link active text-white fw-bold ${style.item}`} href='#'>Tin tức</a>
              </li>
            </ul>
            <form className={`d-flex ${style.formSearch}`} role="search">
              <input className={`form-control me-2 text-white ${style.inputSearch}`} type="search" placeholder="Tìm kiếm..." aria-label="Search" />
              <button className={`btn btn-outline-light ${style.btnSearch}`} type="submit"><i className="bi bi-search fs-6"></i></button>
            </form>
            <div className='d-flex gap-3'>
              {/* <a className='text-white' href=""><i className="bi bi-search fs-5"></i></a> */}
              <a className='text-white' href=""><i className="bi bi-bell fs-5"></i></a>
              <div className={style.dropdown}>
                <a className='text-white' href=""><i className="bi bi-person-circle fs-5"></i></a>
                <div className={style.dropdownMenu}>
                  <Link className={style.dropdownItem} href="/login">Đăng nhập</Link>
                  <Link className={style.dropdownItem} href="/register">Đăng ký</Link>
                  <Link className={style.dropdownItem} href="#">Quản lý tài khoản</Link>
                </div>
              </div>
              <a className='text-white' href=""><i className="bi bi-receipt fs-5"></i></a>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
