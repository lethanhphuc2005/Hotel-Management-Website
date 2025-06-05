import { WebsiteContent } from "../types/websitecontent";

export async function getWebsiteContents(url: string): Promise<WebsiteContent[]> {
  const res = await fetch(url);
  const data = await res.json();
  const websitecontent: WebsiteContent[] = data.data.map((p: any) => ({
    _id: p._id,
    title: p.title,
    content: p.content,
    content_type_id: p.content_type_id,
    image: p.image,
    content_type: p.content_type
  }));
  return websitecontent;
}