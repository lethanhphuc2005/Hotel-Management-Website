import { useState } from "react";
import Image from "next/image";
import Modal from "@/components/common/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const ImageAlbum = ({ images }: { images: { id: string; url: string }[] }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMainClick = (index: number) => {
    setCurrentIndex(index);
    setShowModal(true);
  };

  return (
    <>
      <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-3 tw-h-auto md:tw-h-[50vh]">
        {/* Swiper chính - ảnh lớn */}
        <div
          className={`tw-w-full ${
            images.length <= 1 ? "md:tw-w-[100%]" : "md:tw-w-[60%]"
          } tw-aspect-[4/3] md:tw-aspect-[4/3] tw-rounded-xl tw-overflow-hidden tw-cursor-pointer`}
          onClick={() => handleMainClick(0)}
        >
          <Image
            src={images[0].url}
            alt="main"
            className="tw-w-full tw-h-full tw-object-cover"
            width={800}
            height={600}
          />
        </div>

        {/* Thumbnails bên phải */}
        {images.length > 1 ? (
          <div className="tw-w-full md:tw-w-[40%] tw-grid tw-grid-cols-2 tw-gap-2 tw-max-h-[300px] md:tw-max-h-[500px] tw-overflow-y-auto">
            {images.slice(1).map((img, index) => (
              <div
                key={img.id}
                className="tw-h-full tw-rounded-lg tw-overflow-hidden tw-cursor-pointer"
                onClick={() => handleMainClick(index + 1)}
              >
                <Image
                  src={img.url}
                  alt={`thumb-${index}`}
                  className="tw-w-full tw-h-full tw-object-cover"
                  width={300}
                  height={300}
                />
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>

      {/* Modal xem ảnh lớn */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <Swiper
            initialSlide={currentIndex}
            navigation
            modules={[Navigation]}
            className="tw-aspect-[4/3] tw-rounded-xl tw-overflow-hidden"
          >
            {images.map((img) => (
              <SwiperSlide key={img.id}>
                <img
                  src={img.url}
                  alt="preview"
                  className="tw-w-full tw-h-full tw-object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Modal>
      )}
    </>
  );
};

export default ImageAlbum;
