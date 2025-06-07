import { Modal } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/thumbs";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Thumbs } from "swiper/modules";
import { Service } from "../types/service";

export default function ServiceDetailModal({
    show,
    onHide,
    service,
}: {
    show: boolean;
    onHide: () => void;
    service: Service | null;
}) {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    // Reset thumbsSwiper về null khi modal đóng để tránh lỗi Swiper
    useEffect(() => {
        if (!show) setThumbsSwiper(null);
    }, [show]);

    const images = [
        "r1.jpg",
        "r2.jpg",
        "r3.jpg",
        "r4.jpg",
        "r5.jpg",
    ];

    if (!service || images.length === 0) return null;

    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Body className="p-0 d-flex justify-content-center" style={{ minHeight: 500 }}>
                <div
                    style={{
                        flex: 2,
                        background: "#000",
                        maxWidth: 700,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Swiper
                        style={{ width: "100%", height: 400, maxWidth: 700 }}
                        spaceBetween={10}
                        watchSlidesProgress
                        {...(thumbsSwiper ? { thumbs: { swiper: thumbsSwiper } } : {})}
                        modules={[Thumbs]}
                    >
                        {images.map((img: any, idx: number) => (
                            <SwiperSlide key={idx}>
                                <div style={{ position: "relative", width: "100%", height: 400, maxWidth: 700 }}>
                                    <Image
                                        src={`/img/${typeof img === "string" ? img : img.url}`}
                                        alt={service.name}
                                        layout="fill"
                                        objectFit="cover"
                                        sizes="700px"
                                    />
                                    <div
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            bottom: 0,
                                            color: "#fff",
                                            background: "rgba(0,0,0,0.4)",
                                            width: "100%",
                                            padding: 8,
                                        }}
                                    >
                                        {service.name}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {images.length > 1 && (
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={8}
                            slidesPerView={Math.min(5, images.length)}
                            freeMode
                            watchSlidesProgress
                            slideToClickedSlide={true} // Thêm dòng này
                            style={{ width: "100%", height: 80, marginTop: 8, padding: 8, maxWidth: 700 }}
                            modules={[Thumbs]}
                        >
                            {images.map((img: any, idx: number) => (
                                <SwiperSlide key={idx} style={{ height: 64, width: 100 }}>
                                    <div style={{ position: "relative", width: "100%", height: 64 }}>
                                        <Image
                                            src={`/img/${typeof img === "string" ? img : img.url}`}
                                            alt={service.name}
                                            layout="fill"
                                            objectFit="cover"
                                            sizes="100px"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
                <div style={{ flex: 1, background: "#fff", padding: 24, minWidth: 320 }}>
                    <h5>{service.name}</h5>
                    <div style={{ borderTop: "1px solid #eee", margin: "12px 0" }} />
                    <div style={{ fontSize: 15, marginBottom: 16 }}>
                        {service.description}
                    </div>
                    <div className="mb-2 d-flex align-items-center gap-2">
                        <span>
                            <i className="bi bi-geo-alt-fill"></i>
                        </span>
                        <span>Vị trí:</span>
                        <span style={{ marginLeft: 8 }}>Tầng 1</span>
                    </div>
                    <div className="mb-2 d-flex align-items-center gap-2">
                        <span>
                            <i className="bi bi-alarm-fill"></i>
                        </span>
                        <span>Giờ mở cửa:</span>
                        <span style={{ marginLeft: 8 }}>06:00 – 22:00</span>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}