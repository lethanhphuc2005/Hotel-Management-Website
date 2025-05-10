import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import style from './header.module.css';

export default function Header() {
  return (
    <>
      <header className={`container ${style.bgColor} text-white ${style.marginTop}`}>
        <div className='container-fluid d-flex justify-content-between'>
          <div className="logo">
            <img className='ms-4 pt-1' width="203px" height="57px" src="/img/image.png" alt="" />
          </div>
          <div className="pt-1">
            <input className={`${style.search} border-0 rounded-start-4`} type="text" placeholder='      Tìm kiếm....' />
            <button className={`${style.btnSearch} border-0 rounded-end-3`}>Tìm Kiếm</button>
          </div>
          <div className='d-flex gap-2'>
            <div className={`${style.notifycation} mt-1 rounded-5 text-center d-flex justify-content-center align-items-center`}>
              <i className="bi bi-bell"></i>
            </div>
            <div className='d-flex gap-3'>
              <img className={`${style.avt} rounded-5 bg-white`} src="data:image/png;base64,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" alt="" />
              <div className='d-flex flex-column'>
                <h5 className='mb-0 mt-2'>HuyHoang <i className="bi bi-chevron-down fs-6"></i></h5>
                <p>Hạng thành viên</p>
              </div>
            </div>
          </div>
        </div>
        <nav className={`${style.nav} rounded-5`}>
          <div className='d-flex justify-content-center align-items-center' style={{ height: '110px' }}>
            <ul className={`d-flex list-unstyled justify-content-between ${style.spacing}`}>
              <li className={`${style.widthA} rounded-4 d-flex justify-content-center align-items-center`}><a href="" className='text-decoration-none' style={{ color: 'black' }}><i className="bi bi-house-door me-2"></i>Trang chủ</a></li>
              <li className={`${style.widthB} rounded-4 d-flex justify-content-center align-items-center`}><a href="" className="text-decoration-none" style={{ color: '#D0D4E7' }}><i className="bi bi-door-closed me-2"></i>Phòng</a></li>
              <li className={`${style.widthB} rounded-4 d-flex justify-content-center align-items-center`}><a href="" className="text-decoration-none" style={{ color: '#D0D4E7' }}><i className="bi bi-gear me-2"></i>Dịch vụ</a></li>
              <li className={`${style.widthB} rounded-4 d-flex justify-content-center align-items-center`}><a href="" className="text-decoration-none" style={{ color: '#D0D4E7' }}><i className="bi bi-envelope me-2"></i>Liên hệ</a></li>
              <li className={`${style.widthB} rounded-4 d-flex justify-content-center align-items-center`}><a href="" className="text-decoration-none" style={{ color: '#D0D4E7' }}><i className="bi bi-newspaper me-2"></i>Tin tức</a></li>
            </ul>
          </div>
        </nav>

      </header>
    </>
  )
}
