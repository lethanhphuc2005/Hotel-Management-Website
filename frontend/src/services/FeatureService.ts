import {
  getFeatures as getFeaturesApi,
  getFeatureById as getFeatureByIdApi,
} from "@/api/featureApi";
import { Feature } from "@/types/feature";

export const fetchFeatures = async (): Promise<{
  success: boolean;
  message?: string;
  data: Feature[];
}> => {
  try {
    const response = await getFeaturesApi();
    const data = response.data;
    const features: Feature[] = data.map((feature: any) => ({
      id: feature.id,
      name: feature.name,
      image: feature.image,
      icon: feature.icon || "", // Ensure icon is included
      description: feature.description,
      status: feature.status,
      created_at: feature.createdAt,
      updated_at: feature.updatedAt,
    }));
    return {
      success: true,
      message: response.message || "Features fetched successfully",
      data: features,
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
    const featureData = response.data;
    if (!featureData) {
      return {
        success: false,
        message: "Feature not found",
        data: null,
      };
    }
    const feature: Feature = {
      id: featureData.id,
      name: featureData.name,
      image: featureData.image,
      icon: featureData.icon || "", // Ensure icon is included
      description: featureData.description,
      status: featureData.status,
      created_at: featureData.createdAt,
      updated_at: featureData.updatedAt,
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
