import style from "../page.module.css";
import { WebsiteContent } from "../types/websitecontent";
export function Banner({ banner }: { banner?: WebsiteContent }) {
    if (!banner) return null; // hoặc render fallback UI
    return (
        <>
            <section className={style.banner}>
                <img src={`/img/${banner.image}`} alt="" className={style.bannerImage} />
                <div className={style.bannerContent}>
                    <h2 className={`fw-bold ${style.text}`}>{banner.title}</h2>
                    <button className={`bg-transparent p-2 mt-3 ${style.btnBooking} fw-bold border-1`}>BOOKING</button>
                </div>
            </section>
        </>
    )
}