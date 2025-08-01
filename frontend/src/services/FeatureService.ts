import {
  getFeatures as getFeaturesApi,
  getFeatureById as getFeatureByIdApi,
} from "@/api/featureApi";
import { Feature, FeatureListResponse, FeatureResponse } from "@/types/feature";

export const fetchFeatures = async (params = {}): Promise<FeatureListResponse> => {
  try {
    const response = await getFeaturesApi(params);
    const data = response.data;
    const features: Feature[] = data.map((feature: any) => ({
      id: feature.id,
      name: feature.name,
      image: feature.image,
      icon: feature.icon || "", // Ensure icon is included
      description: feature.description,
      status: feature.status,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    }));

    return {
      success: true,
      message: response.message || "Features fetched successfully",
      data: features,
      pagination: response.pagination || undefined,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.message ||
      "Failed to fetch features";
    return {
      success: false,
      message,
      data: [],
      pagination: undefined,
    };
  }
};

export const fetchFeatureById = async (
  id: string
): Promise<{
  success: boolean;
  message?: string;
  data: Feature | null;
}> => {
  try {
    const response = await getFeatureByIdApi(id);
    const data = response.data;
    const feature: Feature = {
      id: data.id,
      name: data.name,
      image: data.image,
      icon: data.icon || "", // Ensure icon is included
      description: data.description,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
    return {
      success: true,
      message: response.message || "Feature fetched successfully",
      data: feature,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.message ||
      "Failed to fetch feature";
    return {
      success: false,
      message,
      data: null,
    };
  }
};
