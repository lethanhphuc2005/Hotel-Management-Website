import {
  getWebsiteContents as getWebsiteContentsApi,
  getWebsiteContentById as getWebsiteContentByIdApi,
} from "@/api/websiteContentApi";
import { WebsiteContent, WebsiteContentListResponse, WebsiteContentResponse } from "@/types/websiteContent";

export const fetchWebsiteContents =
  async (): Promise<WebsiteContentListResponse> => {
    try {
      const response = await getWebsiteContentsApi();
      const data = response.data;
      const websiteContents: WebsiteContent[] = data.map((item: any) => ({
        id: item.id || item._id,
        title: item.title,
        content_type_id: item.content_type_id,
        content: item.content,
        image: item.image || "",
        content_type: item.content_type || [],
        status: item.status || false,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return {
        success: true,
        message: response.message || "Website contents fetched successfully",
        data: websiteContents,
        pagination: response.pagination || undefined,
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
        pagination: undefined,
      };
    }
  };

export const fetchWebsiteContentById = async (
  id: string
): Promise<WebsiteContentResponse> => {
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
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
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
