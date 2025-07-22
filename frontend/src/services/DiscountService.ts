import {
  getDiscounts as getDiscountsApi,
  getDiscountById as getDiscountByIdApi,
  getPreviewDiscountBookingPrice as getPreviewDiscountBookingPriceApi,
} from "@/api/discountApi";
import {
  Discount,
  DiscountListResponse,
  DiscountResponse,
  PreviewDiscountBookingPriceRequest,
  PreviewDiscountBookingPriceResponse,
} from "@/types/discount";

export const fetchDiscounts = async (): Promise<DiscountListResponse> => {
  try {
    const response = await getDiscountsApi();
    const data = response.data;
    const discounts: Discount[] = data.map((discount: any) => ({
      id: discount.id,
      name: discount.name,
      image: discount.image || "",
      description: discount.description || "",
      type: discount.type || "promo_code",
      value: discount.value || 0,
      value_type: discount.value_type || "percent",
      promo_code: discount.promo_code || "",
      conditions: {
        min_advance_days: discount.conditions?.min_advance_days || 0,
        max_advance_days: discount.conditions?.max_advance_days || 0,
        min_stay_nights: discount.conditions?.min_stay_nights || 0,
        max_stay_nights: discount.conditions?.max_stay_nights || 0,
        min_rooms: discount.conditions?.min_rooms || 0,
        user_levels: discount.conditions?.user_levels || [],
      },
      valid_from: new Date(discount.valid_from),
      valid_to: new Date(discount.valid_to),
      apply_to_room_class_ids: discount.apply_to_room_class_ids || [],
      can_be_stacked: discount.can_be_stacked || false,
      priority: discount.priority || 0,
      status: discount.status || false,
      createdAt: new Date(discount.createdAt),
      updatedAt: new Date(discount.updatedAt),
    }));

    return {
      success: true,
      message: response.message || "Discounts fetched successfully",
      data: discounts,
      pagination: response.pagination,
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
      pagination: undefined,
    };
  }
};

export const fetchDiscountById = async (
  id: string
): Promise<DiscountResponse> => {
  try {
    const response = await getDiscountByIdApi(id);
    const data = response.data;
    const discount: Discount = {
      id: data.id,
      name: data.name,
      image: data.image || "",
      description: data.description || "",
      type: data.type || "promo_code",
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
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
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

export const fetchPreviewDiscountBookingPrice = async (
  bookingInfo: PreviewDiscountBookingPriceRequest
): Promise<PreviewDiscountBookingPriceResponse> => {
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
