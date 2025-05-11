import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import style from './header.module.css';

export default function Header() {
  return (
    <>
      <header className={`container ${style.bgColor} text-white ${style.marginTop}`}>
        <div className='container-fluid d-flex justify-content-between'>
          <div>
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
              <img className={`${style.avt} rounded-5 bg-white`} src="/img/about.jpg" alt="" />
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
