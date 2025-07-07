import {
  getDiscounts as getDiscountsApi,
  getDiscountById as getDiscountByIdApi,
  getPreviewDiscountBookingPrice as getPreviewDiscountBookingPriceApi,
} from "@/api/discountApi";
import { Discount } from "@/types/discount";

export const fetchDiscounts = async (): Promise<{
  success: boolean;
  message?: string;
  data: Discount[];
}> => {
  try {
    const response = await getDiscountsApi();
    const data = response.data;
    const discounts: Discount[] = data.map((d: any) => ({
      id: d.id,
      name: d.name,
      image: d.image || "",
      description: d.description || "",
      type: d.type || "",
      value: d.value || 0,
      value_type: d.value_type || "percent",
      promo_code: d.promo_code || "",
      conditions: {
        min_advance_days: d.conditions?.min_advance_days || 0,
        max_advance_days: d.conditions?.max_advance_days || 0,
        min_stay_nights: d.conditions?.min_stay_nights || 0,
        max_stay_nights: d.conditions?.max_stay_nights || 0,
        min_rooms: d.conditions?.min_rooms || 0,
        user_levels: d.conditions?.user_levels || [],
      },
      valid_from: new Date(d.valid_from),
      valid_to: new Date(d.valid_to),
      apply_to_room_class_ids: d.apply_to_room_class_ids || [],
      can_be_stacked: d.can_be_stacked || false,
      priority: d.priority || 0,
      status: d.status || false,
      created_at: d.createdAt ? new Date(d.createdAt) : undefined,
      updated_at: d.updatedAt ? new Date(d.updatedAt) : undefined,
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

export const fetchDiscountById = async (
  id: string
): Promise<{
  success: boolean;
  message?: string;
  data: Discount;
}> => {
  try {
    const response = await getDiscountByIdApi(id);
    const data = response.data;
    const discount: Discount = {
      id: data.id,
      name: data.name,
      image: data.image || "",
      description: data.description || "",
      type: data.type || "",
      value: data.value || 0,
      value_type: data.value_type || "percent",
      promo_code: data.promo_code || "",
      conditions: {
        min_advance_days: data.conditions?.min_advance_days || 0,
        max_advance_days: data.conditions?.max_advance_days || 0,
        min_stay_nights: data.conditions?.min_stay_nights || 0,
        max_stay_nights: data.conditions?.max_stay_nights || 0,
        min_rooms: data.conditions?.min_rooms || 0,
        user_levels: data.conditions?.user_levels || [],
      },
      valid_from: new Date(data.valid_from),
      valid_to: new Date(data.valid_to),
      apply_to_room_class_ids: data.apply_to_room_class_ids || [],
      can_be_stacked: data.can_be_stacked || false,
      priority: data.priority || 0,
      status: data.status || false,
      created_at: new Date(data.createdAt),
      updated_at: new Date(data.updatedAt),
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
      data: {} as Discount,
    };
  }
};

export const fetchPreviewDiscountBookingPrice = async (bookingInfo: {
  baseTotal: number;
  checkInDate: string;
  checkOutDate: string;
  roomClassId: string;
  totalRooms: number;
}): Promise<{
  success: boolean;
  message?: string;
  data: {
    originalPrice: number;
    finalPrice: number;
    appliedDiscounts: string[];
    isPromo?: boolean; // Optional field to indicate if a promo code was applied
  };
}> => {
  try {
    const response = await getPreviewDiscountBookingPriceApi(bookingInfo);
    const data = response.data;

    return {
      success: true,
      message: response.message || "Preview booking price fetched successfully",
      data: {
        originalPrice: data.originalPrice || 0,
        finalPrice: data.finalPrice || 0,
        appliedDiscounts: data.appliedDiscounts || [],
        isPromo: data.isPromo || false, // Include isPromo field if available
      },
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching the preview booking price";
    return {
      success: false,
      message,
      data: { originalPrice: 0, finalPrice: 0, appliedDiscounts: [] },
    };
  }
};
