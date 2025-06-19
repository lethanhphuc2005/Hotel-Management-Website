import { Service } from "@/types/service";
import style from "@/app/hotelservice/hotelservice.module.css";
import { useRouter } from "next/navigation";

export function HotelServiceItem({ item }: { item: Service }) {
  const router = useRouter();

  return (
    <>
      <div
        className={`col p-0 rounded text-white ${style.box}`}
        style={{ backgroundColor: "#1F1F1F" }}
      >
        <a href="">
          <img
            className="p-2 object-fit-cover"
            style={{ borderRadius: "15px", width: "100%", height: "200px" }}
            src={`/img/${item.image}`}
            alt=""
          />
        </a>
        <h5 className="mt-2 ms-2">{item.name}</h5>
        <p className="ms-2" style={{ fontSize: "14px" }}>
          {item.description}
        </p>
        <div className="d-flex gap-3 ms-2">
          <p className="">Giá chỉ từ:</p>
          <p className="fw-bold" style={{ color: "#FAB320" }}>
            {item.price.toLocaleString("vi-VN")} VNĐ
          </p>
        </div>
        <div className={style.btnWrapper}>
          <button className={style.bookingBtn}>Thêm</button>
        </div>
      </div>
    </>
  );
}
