import { New1, New2, New3, New4 } from "../components/news/newsItem";
import { getWebsiteContents } from "../services/websitecontentService";
import { WebsiteContent } from "../types/websitecontent";

export default async function News() {
    const news: WebsiteContent[] = await getWebsiteContents('http://localhost:8000/v1/websitecontent');
    return (
        <>
            <div className="container text-white" style={{ marginTop: '130px', marginBottom: '100px' }}>
                <div className="row border-top border-bottom">
                    <h1 className="mt-4 mb-4 text-center" style={{ letterSpacing: '10px' }}>TIN TỨC VỀ CHÚNG TÔI</h1>
                </div>
                <div className="row border-bottom">
                    <img className="w-100 mt-3 mb-3" style={{ height: '300px', objectFit: 'cover' }} src="/img/bannernew.png" alt="" />
                </div>
                <New1 new1={news[0]} />
                <div className="row mt-4 border-top">
                    <div className="col-8 border-end">
                        <New2 new2={news[3]}/>
                        <New3 new3={news[4]}/>
                    </div>
                    <div className="col-4">
                        <New4 new4={news[5]}/>
                    </div>
                </div>
            </div>
        </>
    )
}