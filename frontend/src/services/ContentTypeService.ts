import {
  getContentTypes as getContentTypesApi,
  getContentTypeById as getContentTypeByIdApi,
} from "@/api/contentTypeApi";
import { ContentType } from "@/types/contentType";

export const fetchContentTypes = async (): Promise<{
  success: boolean;
  message?: string;
  data: ContentType[];
}> => {
  try {
    const response = await getContentTypesApi();
    const data = response.data;
    const contentTypes: ContentType[] = data.map((ct: any) => ({
      id: ct.id || ct._id,
      name: ct.name,
      description: ct.description || "",
      status: ct.status || false,
      created_at: new Date(ct.createdAt),
      updated_at: new Date(ct.updatedAt),
    }));

    return {
      success: true,
      message: response.message || "Content types fetched successfully",
      data: contentTypes,
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
    };
  }
};

export const fetchContentTypeById = async (
  id: string
): Promise<{
  success: boolean;
  message?: string;
  data: ContentType | null;
}> => {
  try {
    const response = await getContentTypeByIdApi(id);
    const data = response.data;
    const contentType: ContentType = {
      id: data.id || data._id,
      name: data.name,
      description: data.description || "",
      status: data.status || false,
      created_at: new Date(data.createdAt),
      updated_at: new Date(data.updatedAt),
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
      data: null,
    };
  }
};
