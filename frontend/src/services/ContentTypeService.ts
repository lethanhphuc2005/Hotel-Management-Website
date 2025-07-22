import {
  getContentTypes as getContentTypesApi,
  getContentTypeById as getContentTypeByIdApi,
} from "@/api/contentTypeApi";
import { ContentType, ContentTypeListResponse, ContentTypeResponse } from "@/types/contentType";

export const fetchContentTypes = async (): Promise<ContentTypeListResponse> => {
  try {
    const response = await getContentTypesApi();
    const data = response.data;
    const contentTypes: ContentType[] = data.map((item: any) => ({
      id: item.id || item._id,
      name: item.name,
      description: item.description || "",
      status: item.status || false,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));

    return {
      success: true,
      message: response.message || "Content types fetched successfully",
      data: contentTypes,
      pagination: response.pagination,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching content types";
    return {
      success: false,
      message,
      data: [],
      pagination: undefined, // Assuming pagination is not handled here
    };
  }
};

export const fetchContentTypeById = async (
  id: string
): Promise<ContentTypeResponse> => {
  try {
    const response = await getContentTypeByIdApi(id);
    const data = response.data;
    const contentType: ContentType = {
      id: data.id || data._id,
      name: data.name,
      description: data.description || "",
      status: data.status || false,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };

    return {
      success: true,
      message: response.message || "Content type fetched successfully",
      data: contentType,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching content type";
    return {
      success: false,
      message,
      data: null as any, // Adjust type as necessary
    };
  }
};
