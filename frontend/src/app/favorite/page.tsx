"use client";
import { motion } from "framer-motion";
import React from "react";
import { Heart } from "lucide-react"; // icon đẹp hơn từ lucide

export default function FavoritesPage() {
    return (
        <motion.div
            className="container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginTop: "120px", marginBottom: "120px" }}
        >
            <h2 className="mb-5 text-center text-light">
                <span style={{ color: "#FAB320" }}>❤️</span> Danh sách yêu thích
            </h2>

            <div className="row g-4">
                <motion.div
                    className="col-12 col-md-6 col-lg-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="card bg-black text-light h-100 position-relative overflow-hidden"
                        style={{
                            border: "0.5px solid rgba(255, 255, 255, 0.4)"
                        }}
                    >
                        {/* Nút tim ở góc phải */}
                        <button
                            className="position-absolute top-0 end-0 m-2 btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                background: "rgba(255, 255, 255, 0.9)",
                                zIndex: 10,
                                width: 35,
                                height: 35,
                            }}
                        >
                            <Heart size={18} color="#e74c3c" fill="#e74c3c" />
                        </button>

                        <img
                            src={`/img/r1.jpg`}
                            className="card-img-top"
                            alt="Room"
                            style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body d-flex flex-column border-top-0">
                            <h6 className="card-title fw-bold">Deluxe Ocean View</h6>
                            <div className="d-flex gap-1 align-items-center mb-2" style={{ color: "#FAB320", fontSize: "12px" }}>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                            </div>

                            <div className="text-secondary">
                                <p>Basic room for budget travelers of 2 ppl and city view</p>
                            </div>

                            <div className="pt-3"
                                style={{
                                    borderTop: "0.5px solid rgba(255, 255, 255, 0.4)"
                                }}
                            >
                                <p className="mb-0 text-white">
                                    Giá chỉ từ: <span className="fw-bold text-warning ms-2">1200.000/đêm</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="col-12 col-md-6 col-lg-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="card bg-black text-light h-100 position-relative overflow-hidden"
                        style={{
                            border: "0.5px solid rgba(255, 255, 255, 0.4)"
                        }}
                    >
                        {/* Nút tim ở góc phải */}
                        <button
                            className="position-absolute top-0 end-0 m-2 btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                background: "rgba(255, 255, 255, 0.9)",
                                zIndex: 10,
                                width: 35,
                                height: 35,
                            }}
                        >
                            <Heart size={18} color="#e74c3c" fill="#e74c3c" />
                        </button>

                        <img
                            src={`/img/r1.jpg`}
                            className="card-img-top"
                            alt="Room"
                            style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body d-flex flex-column border-top-0">
                            <h6 className="card-title fw-bold">Deluxe Ocean View</h6>
                            <div className="d-flex gap-1 align-items-center mb-2" style={{ color: "#FAB320", fontSize: "12px" }}>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                            </div>

                            <div className="text-secondary">
                                <p>Basic room for budget travelers of 2 ppl and city view</p>
                            </div>

                            <div className="pt-3"
                                style={{
                                    borderTop: "0.5px solid rgba(255, 255, 255, 0.4)"
                                }}
                            >
                                <p className="mb-0 text-white">
                                    Giá chỉ từ: <span className="fw-bold text-warning ms-2">1200.000/đêm</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="col-12 col-md-6 col-lg-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div className="card bg-black text-light h-100 position-relative overflow-hidden"
                        style={{
                            border: "0.5px solid rgba(255, 255, 255, 0.4)"
                        }}
                    >
                        {/* Nút tim ở góc phải */}
                        <button
                            className="position-absolute top-0 end-0 m-2 btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                background: "rgba(255, 255, 255, 0.9)",
                                zIndex: 10,
                                width: 35,
                                height: 35,
                            }}
                        >
                            <Heart size={18} color="#e74c3c" fill="#e74c3c" />
                        </button>

                        <img
                            src={`/img/r1.jpg`}
                            className="card-img-top"
                            alt="Room"
                            style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body d-flex flex-column border-top-0">
                            <h6 className="card-title fw-bold">Deluxe Ocean View</h6>
                            <div className="d-flex gap-1 align-items-center mb-2" style={{ color: "#FAB320", fontSize: "12px" }}>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                            </div>

                            <div className="text-secondary">
                                <p>Basic room for budget travelers of 2 ppl and city view</p>
                            </div>

                            <div className="pt-3"
                                style={{
                                    borderTop: "0.5px solid rgba(255, 255, 255, 0.4)"
                                }}
                            >
                                <p className="mb-0 text-white">
                                    Giá chỉ từ: <span className="fw-bold text-warning ms-2">1200.000/đêm</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="col-12 col-md-6 col-lg-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <div className="card bg-black text-light h-100 position-relative overflow-hidden"
                        style={{
                            border: "0.5px solid rgba(255, 255, 255, 0.4)"
                        }}
                    >
                        {/* Nút tim ở góc phải */}
                        <button
                            className="position-absolute top-0 end-0 m-2 btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                background: "rgba(255, 255, 255, 0.9)",
                                zIndex: 10,
                                width: 35,
                                height: 35,
                            }}
                        >
                            <Heart size={18} color="#e74c3c" fill="#e74c3c" />
                        </button>

                        <img
                            src={`/img/r1.jpg`}
                            className="card-img-top"
                            alt="Room"
                            style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body d-flex flex-column border-top-0">
                            <h6 className="card-title fw-bold">Deluxe Ocean View</h6>
                            <div className="d-flex gap-1 align-items-center mb-2" style={{ color: "#FAB320", fontSize: "12px" }}>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                            </div>

                            <div className="text-secondary">
                                <p>Basic room for budget travelers of 2 ppl and city view</p>
                            </div>

                            <div className="pt-3"
                                style={{
                                    borderTop: "0.5px solid rgba(255, 255, 255, 0.4)"
                                }}
                            >
                                <p className="mb-0 text-white">
                                    Giá chỉ từ: <span className="fw-bold text-warning ms-2">1200.000/đêm</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
