import React from 'react';
import styles from './footer.module.css';

export default function Footer() {
    return (
        <footer className={`${styles.footerWrapper} container-fluid`}>
            <div className='container d-flex justify-content-between'>
                <div className='col-md-4'>
                    <div className={`mt-4 mb-3`}>
                        <img width="203px" height="57px" src="/img/image.png" alt="" />
                    </div>
                    <p className='pb-1'>Địa chỉ: số 22 đường 29, Phường An Khánh, Thành phố Thủ Đức</p>
                    <p className='pb-1'>Số điện thoại: 0385473364</p>
                    <p>Email: prosdmusic06@gmail.com</p>
                    <div className={`${styles.socialIcons} mt-4 d-flex gap-4`}>
                        <a href="#"><i className="bi bi-facebook fs-4"></i></a>
                        <a href="#"><i className="bi bi-instagram fs-4"></i></a>
                        <a href="#"><i className="bi bi-twitter fs-4"></i></a>
                        <a href="#"><i className="bi bi-telegram fs-4"></i></a>
                    </div>
                </div>
                <div className={`col-md-4 ${styles.quick}`}>
                    <h2 className='fs-4 mb-3'>LIÊN KẾT NHANH</h2>
                    <p>Giới thiệu</p>
                    <p>Chính sách bảo mật</p>
                    <p>Điều khoản dịch vụ</p>
                    <p>Liên hệ</p>
                </div>
                <div className={`col-md-4 ${styles.send}`}>
                    <h2 className='fs-4 mb-3'>ĐĂNG KÝ NHẬN TIN</h2>
                    <p className='mb-4'>
                        Hãy nhập địa chỉ email của bạn vào ô dưới đây để có
                        thể nhận được tất cả các tin tức mới nhất của Suplo về
                        các sản phẩm mới, các chương trình khuyến mãi mới.
                        Suplo xin đảm bảo sẽ không gửi mail rác, mail spam tới bạn.
                    </p>
                    <div>
                        <input type="email" placeholder="      Nhập email của bạn" className={`${styles.emailInput} border-0 rounded-start-4`} />
                        <button className={`${styles.sendButton} border-0 rounded-end-4`}>
                            <i className="bi bi-send text-black"></i>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};