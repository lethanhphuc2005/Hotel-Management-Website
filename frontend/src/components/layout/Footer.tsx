import React from "react";
import style from "@/styles/layout/footer.module.css";

export default function Footer() {
  return (
    <footer className={`${style.footerWrapper} container-fluid`}>
      <div className="container d-flex justify-content-between">
        <div className="col-md-4">
          <div className={`mt-4 mb-3`}>
            <img width="203px" height="57px" src="/img/image.png" alt="" />
          </div>
          <p className="pb-1 text-white">
            Địa chỉ: số 22 đường 29, Phường An Khánh, Thành phố Thủ Đức
          </p>
          <p className="pb-1 text-white">Số điện thoại: 0385473364</p>
          <p className="text-white">Email: themoon@gmail.com</p>
          <div className={`${style.socialIcons} mt-4 d-flex gap-4`}>
            <a href="#">
              <i className="bi bi-facebook fs-4"></i>
            </a>
            <a href="#">
              <i className="bi bi-instagram fs-4"></i>
            </a>
            <a href="#">
              <i className="bi bi-twitter fs-4"></i>
            </a>
            <a href="#">
              <i className="bi bi-telegram fs-4"></i>
            </a>
          </div>
        </div>
        <div className={`col-md-4 ${style.quick}`}>
          <h2 className="fs-4 mb-3 text-white">LIÊN KẾT NHANH</h2>
          <p className="text-white">Giới thiệu</p>
          <p className="text-white">Chính sách bảo mật</p>
          <p className="text-white">Điều khoản dịch vụ</p>
          <p className="text-white">Liên hệ</p>
        </div>
        <div className={`col-md-4 ${style.send}`}>
          <h2 className="fs-4 mb-3 text-white">ĐĂNG KÝ NHẬN TIN</h2>
          <p className="mb-4 text-white">
            Hãy nhập địa chỉ email của bạn vào ô dưới đây để có thể nhận được
            tất cả các tin tức mới nhất của The Moon về các sản phẩm mới, các
            chương trình khuyến mãi mới. The Moon xin đảm bảo sẽ không gửi mail
            rác, mail spam tới bạn.
          </p>
          <div className="tw-flex">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className={`${style.emailInput} border-0 rounded-start-4`}
            />
            <button className={`${style.sendButton} border-0 rounded-end-4`}>
              <i className="bi bi-send text-black"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
