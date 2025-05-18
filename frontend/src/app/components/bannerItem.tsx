import style from "../page.module.css";
import { WebsiteContent } from "../types/websitecontent";
export function Banner({ banner }: { banner: WebsiteContent }) {
    return (
        <>
            <section className={style.banner}>
                <img src={`/img/${banner.HinhAnh}`} alt="" className={style.bannerImage} />
                <div className={style.bannerContent}>
                    <h2 className={`fw-bold ${style.text}`}>WELCOME TO THE MOON</h2>
                    <button className={`bg-transparent p-2 mt-3 ${style.btnBooking} fw-bold border-1`}>BOOKING</button>
                </div>
            </section>
        </>
    )
}