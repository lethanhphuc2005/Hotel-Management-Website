import { WebsiteContent } from "../types/websitecontent";

export async function getWebsiteContents(url: string) {
  let res = await fetch(url);
  let data = await res.json();
  let websitecontents: WebsiteContent[] = data.map((p: any) => {
    return {
      _id: p._id,
      TieuDe: p.TieuDe,
      NoiDung: p.NoiDung,
      MaND: p.MaND,
      NgayDang: p.NgayDang,
      HinhAnh: p.HinhAnh
    };
  });
  return websitecontents;
}