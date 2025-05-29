import { WebsiteContent } from "../../types/websitecontent";

export function New1({ new1 }: { new1: WebsiteContent }) {
    return (
        <>
            <div className="row">
                <h3 className="text-center mt-5 mb-5" style={{ letterSpacing: '5px' }}>{new1.TieuDe}</h3>
                <div className="col">
                    <p style={{ color: '#FAB320' }}>{new1.LoaiNoiDung?.TenND} - {new1.NgayDang.toLocaleDateString('vi-VN')}</p>
                    <p className="lh-lg fs-6" style={{ textAlign: 'justify' }}>
                        {new1.NoiDung}
                    </p>
                </div>
                <div className="col">
                    <img className="w-100" style={{ height: '350px', objectFit: 'cover' }} src={`/img/${new1.HinhAnh}`} alt="" />
                </div>
            </div>
        </>
    )
}

export function New2({ new2 }: { new2: WebsiteContent }) {
    return (
        <>
            <div className="row">
                <h3 className="mt-4 mb-4" style={{ letterSpacing: '5px' }}>{new2.TieuDe}</h3>
                <p style={{ color: '#FAB320' }}>{new2.LoaiNoiDung?.TenND} - {new2.NgayDang.toLocaleDateString('vi-VN')}</p>
                <div className="col">
                    <img className="w-100" src={`/img/${new2.HinhAnh}`} alt="" />
                </div>
                <div className="col">
                    <p style={{ textAlign: 'justify', lineHeight: '30px' }}>
                        {new2.NoiDung}
                    </p>
                </div>
            </div>
        </>
    )
}

export function New3({ new3 }: { new3: WebsiteContent }) {
    return (
        <>
            <div className="row">
                <h3 className="mt-4 mb-4" style={{ letterSpacing: '5px' }}>{new3.TieuDe}</h3>
                <p style={{ color: '#FAB320' }}>{new3.LoaiNoiDung?.TenND} - {new3.NgayDang.toLocaleDateString('vi-VN')}</p>
                <div className="col">
                    <p style={{ textAlign: 'justify', lineHeight: '30px' }}>
                        {new3.NoiDung}
                    </p>
                </div>
                <div className="col">
                    <img className="w-100" src={`/img/${new3.HinhAnh}`} alt="" />
                </div>
            </div>
        </>
    )
}

export function New4({ new4 }: { new4: WebsiteContent }) {
    return (
        <>
            <img className="mt-4 w-100" style={{ height: '380px', objectFit: 'cover' }} src={`/img/${new4.HinhAnh}`} alt="" />
            <h3 className="mt-4 mb-4" style={{ letterSpacing: '5px' }}>{new4.TieuDe}</h3>
            <p style={{ color: '#FAB320' }}>{new4.LoaiNoiDung?.TenND} - {new4.NgayDang.toLocaleDateString('vi-VN')}</p>
            <p style={{ textAlign: 'justify', lineHeight: '30px' }}>
                {new4.NoiDung}
            </p>
        </>
    )
}