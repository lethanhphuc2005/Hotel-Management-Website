import {
  getWebsiteContents as getWebsiteContentsApi,
  getWebsiteContentById as getWebsiteContentByIdApi,
} from "@/api/websiteContentApi";
import { WebsiteContent } from "@/types/websiteContent";

export const fetchWebsiteContents = async (): Promise<WebsiteContent[]> => {
  try {
    const response = await getWebsiteContentsApi();
    const data = response.data;
    const websiteContents: WebsiteContent[] = data.map((wc: any) => ({
      id: wc.id || wc._id,
      title: wc.title,
      content_type_id: wc.content_type_id,
      content: wc.content,
      image: wc.image || "",
      content_type: wc.content_type || [],
      status: wc.status || false,
      created_at: new Date(wc.createdAt),
      updated_at: new Date(wc.updatedAt),
    }));

    return websiteContents;
  } catch (error) {
    console.error("Error fetching website contents:", error);
    throw error;
  }
};

export const fetchWebsiteContentById = async (
  id: string
): Promise<WebsiteContent> => {
  try {
    const response = await getWebsiteContentByIdApi(id);
    const data = response.data;
    const websiteContent: WebsiteContent = {
      id: data.id || data._id,
      title: data.title,
      content_type_id: data.content_type_id,
      content: data.content,
      image: data.image || "",
      content_type: data.content_type || [],
      status: data.status || false,
      created_at: new Date(data.createdAt),
      updated_at: new Date(data.updatedAt),
    };

    return websiteContent;
  } catch (error) {
    console.error("Error fetching website content by ID:", error);
    throw error;
  }
};
