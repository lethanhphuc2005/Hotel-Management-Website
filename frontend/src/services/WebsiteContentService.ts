import {
  getWebsiteContents as getWebsiteContentsApi,
  getWebsiteContentById as getWebsiteContentByIdApi,
} from "@/api/websiteContentApi";
import { WebsiteContent } from "@/types/websiteContent";

export const fetchWebsiteContents = async (): Promise<{
  success: boolean;
  message?: string;
  data: WebsiteContent[];
}> => {
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

    return {
      success: true,
      message: response.message || "Website contents fetched successfully",
      data: websiteContents,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching website contents";
    return {
      success: false,
      message,
      data: [],
    };
  }
};

export const fetchWebsiteContentById = async (
  id: string
): Promise<{
  success: boolean;
  message?: string;
  data: WebsiteContent;
}> => {
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

    return {
      success: true,
      message: response.message || "Website content fetched successfully",
      data: websiteContent,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching website content";
    return {
      success: false,
      message,
      data: {} as WebsiteContent, // Return an empty object on error
    };
  }
};
