import styles from './cart.module.css';

export default function Cart() {

    return (
        <div className={`container ${styles.cartContainer}`}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className={styles.cartTitle}>Giỏ Hàng</div>

                <button className="btn bg-black border text-white" >
                    ← Tiếp tục đặt phòng
                </button>
            </div>
            <div className="table-responsive">
                <table className={`table align-middle ${styles.darkTable}`}>
                    <thead>
                        <tr>
                            <th></th>
                            <th  className='fw-normal'>PHÒNG</th>
                            <th className='fw-normal'>GIÁ/ĐÊM</th>
                            <th className='fw-normal'>SỐ ĐÊM</th>
                            <th className='fw-normal'>TỔNG</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Phòng 1 */}
                        <tr>
                            <td>
                                <img src="/img/r1.jpg" alt="Phòng Deluxe Hướng Biển" className={styles.roomImg} />
                            </td>
                            <td>
                                <div className={styles.roomName}>Phòng Deluxe - View Sea</div>
                                <div className={styles.roomDesc}>2 người lớn, 1 trẻ em dưới 6 tuổi | 1 giường đôi</div>
                                <div style={{ fontSize: '0.95rem', color: '#888' }}>Nhận phòng: 13-04-2005</div>
                                <div style={{ fontSize: '0.95rem', color: '#888' }}>Trả phòng: 15-06-2025</div>
                                <div style={{ fontSize: '0.92rem', color: '#aaa' }}>Mã phòng: DLX-SEA-001</div>
                            </td>
                            <td>100đ</td>
                            <td>2 đêm</td>
                            <td>200.000đ</td>
                            <td>
                                <button className={styles.removeBtn} disabled title="Xóa khỏi giỏ">×</button>
                            </td>
                        </tr>
                        {/* Phòng 2 */}
                        <tr>
                            <td>
                                <img src="/img/r2.jpg" alt="Phòng Gia Đình View Thành Phố" className={styles.roomImg} />
                            </td>
                            <td>
                                <div className={styles.roomName}>Phòng Gia Đình - View City</div>
                                <div className={styles.roomDesc}>4 người lớn, 2 trẻ em | 2 giường đôi</div>
                                <div style={{ fontSize: '0.95rem', color: '#888' }}>Nhận phòng: 13-04-2005</div>
                                <div style={{ fontSize: '0.95rem', color: '#888' }}>Trả phòng: 15-06-2025</div>
                                <div style={{ fontSize: '0.92rem', color: '#aaa' }}>Mã phòng: FAM-CITY-002</div>
                            </td>
                            <td>100đ</td>
                            <td>1 đêm</td>
                            <td>300.000đ</td>
                            <td>
                                <button className={styles.removeBtn} disabled title="Xóa khỏi giỏ">×</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className={styles.shippingBox + " mt-3"}>
                <div className={styles.summaryBox}>
                    <div className={styles.summaryRow}>
                        <span>Tạm tính</span>
                        <span>700.000đ</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Phí dịch vụ</span>
                        <span>Miễn phí</span>
                    </div>
                    <div className={styles.summaryRow + ' ' + styles.summaryTotal}>
                        <span>Tổng cộng</span>
                        <span>1200.000đ</span>
                    </div>
                </div>
                <div className="text-end mt-4 mb-1">
                    <a href='/payment' className={styles.checkoutBtn}>
                        Đặt phòng
                    </a>
                </div>
            </div>
        </div>
    );
}