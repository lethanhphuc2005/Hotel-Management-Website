import {
  getServices as getServicesApi,
  getServiceById as getServiceByIdApi,
} from "@/api/serviceApi";
import { Service } from "@/types/service";

export const fetchServices = async (): Promise<Service[]> => {
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

    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const fetchServiceById = async (id: string): Promise<Service> => {
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

    return service;
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    throw error;
  }
};