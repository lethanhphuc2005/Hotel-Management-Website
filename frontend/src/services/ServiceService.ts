import {
  getServices as getServicesApi,
  getServiceById as getServiceByIdApi,
} from "@/api/serviceApi";
import { Service } from "@/types/service";

export const fetchServices = async (): Promise<{
  success: boolean;
  message?: string;
  data: Service[];
}> => {
  try {
    const response = await getServicesApi();
    const data = response.data;
    const services: Service[] = data.map((s: any) => ({
      id: s.id || s._id,
      name: s.name,
      price: s.price,
      description: s.description || "",
      image: s.image || "",
      status: s.status || false,
      created_at: new Date(s.createdAt),
      updated_at: new Date(s.updatedAt),
    }));

    return {
      success: true,
      message: response.message || "Services fetched successfully",
      data: services,
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
    };
  }
};

export const fetchServiceById = async (
  id: string
): Promise<{
  success: boolean;
  message?: string;
  data: Service;
}> => {
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
      created_at: new Date(data.createdAt),
      updated_at: new Date(data.updatedAt),
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
