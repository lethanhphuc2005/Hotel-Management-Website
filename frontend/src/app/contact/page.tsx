export default function Contact() {
    return (
        <>
            <div className="container text-white" style={{ marginTop: '100px', marginBottom: '100px' }}>
                <h2 className="mb-4 text-center">Liện hệ với chúng tôi</h2>
                <div className="row border p-4">
                    <div className="col">
                        <h5 className="mt-4 mb-4">Thông tin khách sạn</h5>
                        <p><i className="bi bi-geo-alt-fill"></i> Phường Tân Đông Hiệp, Dĩ An, Bình Dương</p>
                        <p><i className="bi bi-telephone-fill"></i> 0385473364</p>
                        <p><i className="bi bi-envelope"></i> contact@themoon.vn</p>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.442726556137!2d106.62322047480609!3d10.85389238929962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b6c59ba4c97%3A0x535e784068f1558b!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1748352244640!5m2!1svi!2s"
                            width="90%"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                    <div className="col">
                        <h5 className="mt-4 mb-4">Gửi tin nhắn</h5>
                        <p className="mb-2">Họ và tên</p>
                        <input className="w-100 bg-black ps-3" style={{ height: '50px', border: '1px solid white' }} type="text" placeholder="Nguyễn Văn A" />
                        <p className="mb-2 mt-3">Email</p>
                        <input className="w-100 bg-black ps-3" style={{ height: '50px', border: '1px solid white' }} type="text" placeholder="abc@gmail.com" />
                        <p className="mb-2 mt-3">Nội dung</p>
                        <textarea
                            className="w-100 bg-black ps-3 pt-2 h-25 text-white"
                            style={{ border: '1px solid white', resize: 'none' }}
                            placeholder="Viết tin nhắn tại đây..."
                        />
                        <button className="mt-3 w-25 text-black border-0" style={{ height: '46px', backgroundColor: '#FAB320' }}>Gửi</button>
                    </div>
                </div>
            </div>
        </>
    )
}