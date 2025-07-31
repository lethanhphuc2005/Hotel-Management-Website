import {
  getServices as getServicesApi,
  getServiceById as getServiceByIdApi,
} from "@/api/serviceApi";
import { Service, ServiceListResponse, ServiceResponse } from "@/types/service";

export const fetchServices = async (
  params = {}
): Promise<ServiceListResponse> => {
  try {
    const response = await getServicesApi(params);
    const data = response.data;
    const services: Service[] = data.map((item: any) => ({
      id: item.id || item._id,
      name: item.name,
      price: item.price,
      description: item.description || "",
      image: item.image || "",
      status: item.status || false,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));

    return {
      success: true,
      message: response.message || "Services fetched successfully",
      data: services,
      pagination: response.pagination || undefined,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching services";
    return {
      success: false,
      message,
      data: [],
      pagination: undefined,
    };
  }
};

export const fetchServiceById = async (
  id: string
): Promise<ServiceResponse> => {
  try {
    const response = await getServiceByIdApi(id);
    const data = response.data;
    const service: Service = {
      id: data.id || data._id,
      name: data.name,
      price: data.price,
      description: data.description || "",
      image: data.image || "",
      status: data.status || false,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };

    return {
      success: true,
      message: response.message || "Service fetched successfully",
      data: service,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching the service";
    return {
      success: false,
      message,
      data: {} as Service,
    };
  }
};
