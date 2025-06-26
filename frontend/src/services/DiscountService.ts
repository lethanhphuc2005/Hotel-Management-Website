import {
  getDiscounts as getDiscountsApi,
  getDiscountById as getDiscountByIdApi,
} from "@/api/discountApi";
import { Discount } from "@/types/discount";

export const fetchDiscounts = async (): Promise<{
  success: boolean;
  message?: string;
  data: Discount[];
}>  => {
  try {
    const response = await getDiscountsApi();
    const data = response.data;
    const discounts: Discount[] = data.map((d: any) => ({
      id: d.id || d._id,
      name: d.name,
      image: d.image || "",
      description: d.description || "",
      type: d.type || "",
      value: d.value || 0,
      start_day: new Date(d.start_day),
      end_day: new Date(d.end_day),
      quantity: d.quantity || 0,
      created_at: d.createdAt ? new Date(d.createdAt) : undefined,
      updated_at: d.updatedAt ? new Date(d.updatedAt) : undefined,
      limit: d.limit || 0,
      status: d.status,
    }));

    return {
      success: true,
      message: response.message || "Discounts fetched successfully",
      data: discounts,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching discounts";
    return {
      success: false,
      message,
      data: [],
    };
  }
};

export const fetchDiscountById = async (id: string): Promise<{
  success: boolean;
  message?: string;
  data: Discount | null;
}> => {
  try {
    const response = await getDiscountByIdApi(id);
    const data = response.data;
    const discount: Discount = {
      id: data.id || data._id,
      name: data.name,
      image: data.image || "",
      description: data.description || "",
      type: data.type || "",
      value: data.value || 0,
      start_day: new Date(data.start_day),
      end_day: new Date(data.end_day),
      quantity: data.quantity || 0,
      created_at: data.createdAt ? new Date(data.createdAt) : undefined,
      updated_at: data.updatedAt ? new Date(data.updatedAt) : undefined,
      limit: data.limit || 0,
      status: data.status,
    };

    return {
      success: true,
      message: response.message || "Discount fetched successfully",
      data: discount,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching the discount";
    return {
      success: false,
      message,
      data: null,
    };
  }
};
