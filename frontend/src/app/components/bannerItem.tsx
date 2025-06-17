'use client';

import style from "../page.module.css";
import { WebsiteContent } from "../types/websitecontent";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

export function Banner({ banners }: { banners: WebsiteContent[] }) {
    if (!banners || banners.length === 0) return <p>No banner</p>;

    const banner = banners[2];
    const mongoImage = banner.image;
    const titles = [
        banner.title,
        "Experience Luxury",
        "Relax and Enjoy"
    ];

    const defaultImages = ['banner2.jpg', 'banner4.jpg'];
    // Tạo danh sách ảnh: ảnh từ Mongo + ảnh mặc định
    const images = [mongoImage, ...defaultImages];

    return (
        <section className={style.banner}>
            <Swiper
                loop={true}
                autoplay={{ delay: 5000 }}
                modules={[Autoplay, Navigation]}
                navigation={true}
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <section className={style.banner}>
                            <img src={`/img/${img}`} alt={`Banner ${index + 1}`} className={style.bannerImage} />
                            <div className={style.bannerContent}>
                                <h2 className={`fw-bold ${style.text}`}>{titles[index]}</h2>
                                <button className={`bg-transparent p-2 mt-3 ${style.btnBooking} fw-bold border-1`}>
                                    BOOKING
                                </button>
                            </div>
                        </section>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
