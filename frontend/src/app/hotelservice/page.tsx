"use client";
import { HotelServiceList } from "@/components/hotelservice/List";
import { useLoading } from "@/contexts/LoadingContext";
import { fetchServices } from "@/services/ServiceService";
import { Service } from "@/types/service";
import { useEffect, useState } from "react";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const { setLoading } = useLoading();
  useEffect(() => {
    const fetchServicesData = async () => {
      setLoading(true);
      try {
        const response = await fetchServices();
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch services");
        }
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicesData();
  }, []);
  return (
    <>
      <div
        className="container"
        style={{ marginTop: "130px", marginBottom: "100px" }}
      >
        <h4 className="mb-4 fw-bold text-white">CÁC DỊCH VỤ CÓ PHÍ</h4>
        <div className="d-flex justify-content-between gap-3">
          <HotelServiceList list={services.slice(0, 4)} />
        </div>
        <div className="mt-4 d-flex justify-content-between gap-3">
          <HotelServiceList list={services.slice(4, 8)} />
        </div>
        <h4 className="mt-5 fw-bold text-white">CÁC DỊCH VỤ MIỄN PHÍ</h4>
        <div className="row p-5 text-white">
          <div className="col">
            <p>
              {" "}
              <i className="bi bi-lock-fill"></i> Khóa ở cửa phòng ngủ
            </p>
            <p>
              {" "}
              <i className="bi bi-basket-fill"></i> Bếp
            </p>
            <p>
              {" "}
              <i className="bi bi-archive-fill"></i> Tủ lạnh
            </p>
            <p>
              {" "}
              <i className="bi bi-fan"></i> Máy điều hòa
            </p>
            <p>
              {" "}
              <i className="bi bi-wrench-adjustable-circle"></i> Mấy sấy tóc
            </p>
          </div>
          <div className="col">
            <p>
              {" "}
              <i className="bi bi-lock-fill"></i> Khóa ở cửa phòng ngủ
            </p>
            <p>
              {" "}
              <i className="bi bi-basket-fill"></i> Bếp
            </p>
            <p>
              {" "}
              <i className="bi bi-archive-fill"></i> Tủ lạnh
            </p>
            <p>
              {" "}
              <i className="bi bi-fan"></i> Máy điều hòa
            </p>
            <p>
              {" "}
              <i className="bi bi-wrench-adjustable-circle"></i> Mấy sấy tóc
            </p>
          </div>
          <div className="col">
            <p>
              {" "}
              <i className="bi bi-lock-fill"></i> Khóa ở cửa phòng ngủ
            </p>
            <p>
              {" "}
              <i className="bi bi-basket-fill"></i> Bếp
            </p>
            <p>
              {" "}
              <i className="bi bi-archive-fill"></i> Tủ lạnh
            </p>
            <p>
              {" "}
              <i className="bi bi-fan"></i> Máy điều hòa
            </p>
            <p>
              {" "}
              <i className="bi bi-wrench-adjustable-circle"></i> Mấy sấy tóc
            </p>
          </div>
          <div className="col">
            <p>
              {" "}
              <i className="bi bi-lock-fill"></i> Khóa ở cửa phòng ngủ
            </p>
            <p>
              {" "}
              <i className="bi bi-basket-fill"></i> Bếp
            </p>
            <p>
              {" "}
              <i className="bi bi-archive-fill"></i> Tủ lạnh
            </p>
            <p>
              {" "}
              <i className="bi bi-fan"></i> Máy điều hòa
            </p>
            <p>
              {" "}
              <i className="bi bi-wrench-adjustable-circle"></i> Mấy sấy tóc
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
