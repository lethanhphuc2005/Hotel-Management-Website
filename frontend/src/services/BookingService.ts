import {
  createBooking as getBookingApi,
  getBookings as getBookingsApi,
  getBookingById as getBookingByIdApi,
  getBookingForUser as getBookingForUserApi,
  previewCancellationFee as previewCancellationFeeApi,
  cancelBooking as cancelBookingApi,
} from "@/api/bookingApi";
import {
  Booking,
  BookingCancelResponse,
  BookingListResponse,
  BookingResponse,
  CreateBookingRequest,
} from "@/types/booking";

export const createBooking = async (
  bookingData: CreateBookingRequest
): Promise<BookingResponse> => {
  try {
    const response = await getBookingApi(bookingData);
    const data = response.data;

    return {
      success: true,
      message: "Booking created successfully",
      data: data,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while creating the booking";
    return {
      success: false,
      message,
      data: null as any, // Adjust type as necessary
    };
  }
};

export const getBookings = async (): Promise<BookingListResponse> => {
  try {
    const response = await getBookingsApi();
    const data = response.data;
    const bookings: Booking[] = data.map((booking: any) => ({
      id: booking.id,
      employee_id: booking.employee_id,
      user_id: booking.user_id,
      discount_id: booking.discount_id || null,
      booking_method_id: booking.booking_method_id,
      booking_status_id: booking.booking_status_id,
      full_name: booking.full_name,
      email: booking.email,
      phone_number: booking.phone_number,
      booking_date: new Date(booking.booking_date),
      check_in_date: new Date(booking.check_in_date),
      check_out_date: new Date(booking.check_out_date),
      adult_amount: booking.adult_amount,
      child_amount: booking.child_amount || 0,
      request: booking.request || "",
      extra_fee: booking.extra_fee || 0,
      note: booking.note || "",
      original_price: booking.original_price,
      total_price: booking.total_price,
      discount_value: booking.discount_value || 0,
      cancel_reason: booking.cancel_reason || null,
      cancel_date: booking.cancel_date ? new Date(booking.cancel_date) : null,
      createdAt: new Date(booking.createdAt || booking.created_at),
      updatedAt: new Date(booking.updatedAt || booking.updated_at),
      booking_status: booking.booking_status,
      booking_method: booking.booking_method,
      user: booking.user,
      discounts: booking.discounts
        ? booking.discounts.map((discount: any) => ({
            id: discount.id,
            name: discount.name,
            value: discount.value,
            type: discount.type,
            value_type: discount.value_type,
            status: discount.status ? discount.status : true,
            createdAt: new Date(discount.createdAt || discount.created_at),
            updatedAt: new Date(discount.updatedAt || discount.updated_at),
          }))
        : [],
      payments: booking.payments
        ? booking.payments.map((payment: any) => ({
            id: payment.id,
            booking_id: payment.booking_id,
            payment_method_id: payment.payment_method_id,
            amount: payment.amount,
            status: payment.status || "pending",
            createdAt: new Date(payment.createdAt),
            updatedAt: new Date(payment.updatedAt),
            payment_method: payment.payment_method,
          }))
        : [],
      employee: booking.employee,
      booking_details: booking.booking_details
        ? booking.booking_details.map((detail: any) => ({
            id: detail.id,
            booking_id: detail.booking_id,
            room_id: detail.room_id || null,
            room_class_id: detail.room_class_id,
            price_per_night: detail.price_per_night,
            nights: detail.nights,
            room: detail.room,
            room_class: detail.room_class,
            services: detail.services,
          }))
        : [],
    }));

    return {
      success: true,
      message: response.message || "Bookings fetched successfully",
      data: bookings,
      pagination: response.pagination,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching bookings";
    return {
      success: false,
      message,
      data: [],
      pagination: undefined,
    };
  }
};

export const getBookingById = async (
  bookingId: string
): Promise<BookingResponse> => {
  try {
    const response = await getBookingByIdApi(bookingId);
    const data = response.data;
    const booking: Booking = {
      id: data.id,
      employee_id: data.employee_id,
      user_id: data.user_id,
      discount_id: data.discount_id || null,
      booking_method_id: data.booking_method_id,
      booking_status_id: data.booking_status_id,
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      booking_date: new Date(data.booking_date),
      check_in_date: new Date(data.check_in_date),
      check_out_date: new Date(data.check_out_date),
      adult_amount: data.adult_amount,
      child_amount: data.child_amount || 0,
      request: data.request || "",
      extra_fee: data.extra_fee || 0,
      note: data.note || "",
      original_price: data.original_price,
      total_price: data.total_price,
      discount_value: data.discount_value || 0,
      cancel_reason: data.cancel_reason || null,
      cancel_date: data.cancel_date ? new Date(data.cancel_date) : undefined,
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at),
      booking_status: data.booking_status,
      booking_method: data.booking_method,
      user: data.user,
      discounts: data.discounts
        ? data.discounts.map((discount: any) => ({
            id: discount.id,
            name: discount.name,
            value: discount.value,
            type: discount.type,
            value_type: discount.value_type,
            status: discount.status ? discount.status : true,
            createdAt: new Date(discount.createdAt || discount.created_at),
            updatedAt: new Date(discount.updatedAt || discount.updated_at),
          }))
        : [],
      payments: data.payments
        ? data.payments.map((payment: any) => ({
            id: payment.id,
            booking_id: payment.booking_id,
            payment_method_id: payment.payment_method_id,
            amount: payment.amount,
            status: payment.status || "pending",
            createdAt: new Date(payment.createdAt),
            updatedAt: new Date(payment.updatedAt),
            payment_method: payment.payment_method,
          }))
        : [],
      employee: data.employee,
      booking_details: data.booking_details
        ? data.booking_details.map((detail: any) => ({
            id: detail.id,
            booking_id: detail.booking_id,
            room_id: detail.room_id || null,
            room_class_id: detail.room_class_id,
            price_per_night: detail.price_per_night,
            nights: detail.nights,
            room: detail.room,
            room_class: detail.room_class,
            services: detail.services,
          }))
        : [],
    };
    return {
      success: true,
      message: response.message || "Booking fetched successfully",
      data: booking,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching the booking";
    return {
      success: false,
      message,
      data: null as any, // Adjust type as necessary
    };
  }
};

export const getBookingsForUser = async (
  userId: string,
  params = {}
): Promise<BookingListResponse> => {
  try {
    const response = await getBookingForUserApi(userId, params);
    const data = response.data;
    const bookings: Booking[] = data.map((booking: any) => ({
      id: booking.id,
      employee_id: booking.employee_id,
      user_id: booking.user_id,
      discount_id: booking.discount_id || null,
      booking_method_id: booking.booking_method_id,
      booking_status_id: booking.booking_status_id,
      full_name: booking.full_name,
      email: booking.email,
      phone_number: booking.phone_number,
      booking_date: new Date(booking.booking_date),
      check_in_date: new Date(booking.check_in_date),
      check_out_date: new Date(booking.check_out_date),
      adult_amount: booking.adult_amount,
      child_amount: booking.child_amount || 0,
      request: booking.request || "",
      extra_fee: booking.extra_fee || 0,
      note: booking.note || "",
      original_price: booking.original_price,
      total_price: booking.total_price,
      discount_value: booking.discount_value || 0,
      cancel_reason: booking.cancel_reason || null,
      cancel_date: booking.cancel_date ? new Date(booking.cancel_date) : null,
      createdAt: new Date(booking.createdAt || booking.created_at),
      updatedAt: new Date(booking.updatedAt || booking.updated_at),
      booking_status: booking.booking_status,
      booking_method: booking.booking_method,
      user: booking.user,
      discounts: booking.discounts,
      payments: booking.payments,
      employee: booking.employee,
      booking_details: booking.booking_details,
    }));

    return {
      success: true,
      message: response.message || "Bookings for user fetched successfully",
      data: bookings,
      pagination: response.pagination,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching bookings for user";
    return {
      success: false,
      message,
      data: [],
      pagination: undefined,
    };
  }
};

export const previewCancellationFee = async (
  bookingId: string,
  userId: string
): Promise<BookingCancelResponse> => {
  try {
    const response = await previewCancellationFeeApi({
      bookingId,
      userId,
    });
    const data = response.data;

    return {
      success: true,
      message: response.message || "Cancellation fee previewed successfully",
      data: {
        can_cancel: data.can_cancel,
        fee_percent: data.fee_percent,
        fee_amount: data.fee_amount,
      },
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while previewing the cancellation fee";
    return {
      success: false,
      message,
      data: { can_cancel: false, fee_percent: 0, fee_amount: 0 },
    };
  }
};

export const cancelBooking = async (
  bookingId: string,
  userId: string,
  cancelReason: string
): Promise<BookingResponse> => {
  try {
    const response = await cancelBookingApi({
      bookingId,
      userId,
      cancelReason,
    });

    return {
      success: true,
      message: response.message || "Booking cancelled successfully",
      data: response.data,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while cancelling the booking";
    return {
      success: false,
      message,
      data: null as any, // Adjust type as necessary
    };
  }
};
