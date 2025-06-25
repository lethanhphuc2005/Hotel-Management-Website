import {
  getContentTypes as getContentTypesApi,
  getContentTypeById as getContentTypeByIdApi,
} from "@/api/contentTypeApi";
import { ContentType } from "@/types/contentType";

export const fetchContentTypes = async () => {
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

    return contentTypes;
  } catch (error) {
    console.error("Error fetching  content types:", error);
    throw error;
  }
};

export const fetchContentTypeById = async (id: string) => {
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

    return contentType;
  } catch (error) {
    console.error("Error fetching content type by ID:", error);
    throw error;
  }
};
