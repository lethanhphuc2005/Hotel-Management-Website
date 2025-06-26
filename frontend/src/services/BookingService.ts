import {
  createBooking as getBookingApi,
  getBookings as getBookingsApi,
  getBookingById as getBookingByIdApi,
  cancelBooking as cancelBookingApi,
} from "@/api/bookingApi";
import { Booking } from "@/types/booking";

export const createBooking = async (
  bookingData: Booking
): Promise<{
  success: boolean;
  message: string;
  data?: Booking;
}> => {
  try {
    const response = await getBookingApi(bookingData);
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
      total_price: data.total_price,
      discount_value: data.discount_value || 0,
      cancel_reason: data.cancel_reason || null,
      cancel_date: new Date(data.cancel_date) || null,
      created_at: new Date(data.createdAt || data.created_at),
      updated_at: new Date(data.updatedAt || data.updated_at),
      booking_status: data.booking_status
        ? data.booking_status.map((status: any) => ({
            id: status.id,
            name: status.name,
          }))
        : [],
      booking_method: data.booking_method
        ? data.booking_method.map((method: any) => ({
            id: method.id,
            name: method.name,
          }))
        : [],
      user: data.user
        ? data.user.map((user: any) => ({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address || "",
            request: user.request || "",
          }))
        : [],
      discount: data.discount
        ? data.discount.map((discount: any) => ({
            id: discount.id,
            name: discount.name,
            value: discount.value,
            type: discount.type, // e.g., 'percentage' or 'fixed'
            status: discount.status || true,
            created_at: new Date(discount.createdAt || discount.created_at),
            updated_at: new Date(discount.updatedAt || discount.updated_at),
          }))
        : [],
      payment: data.payment
        ? data.payment.map((payment: any) => ({
            id: payment.payment.id,
            booking_id: payment.payment.booking_id,
            payment_method_id: payment.payment.payment_method_id,
            amount: payment.payment.amount,
            status: payment.payment.status || "pending",
            created_at: new Date(
              payment.payment.createdAt || payment.payment.created_at
            ),
            updated_at: new Date(
              payment.payment.updatedAt || payment.payment.updated_at
            ),
            payment_method: payment.payment.payment_method
              ? payment.payment.payment_method.map((method: any) => ({
                  id: method.id,
                  name: method.name,
                }))
              : [],
          }))
        : [],
      employee: data.employee
        ? data.employee.map((emp: any) => ({
            id: emp.id,
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            phone_number: emp.phone_number || "",
          }))
        : [],
      booking_details: data.booking_details
        ? data.booking_details.map((detail: any) => ({
            id: detail.id,
            booking_id: detail.booking_id,
            room_class_id: detail.room_class_id,
            room_id: detail.room_id || null,
            price_per_night: detail.price_per_night,
            nights: detail.nights,
            room: detail.room
              ? detail.room.map((room: any) => ({
                  id: room.id,
                  floor: room.floor,
                  room_class_id: room.room_class_id,
                  name: room.name,
                }))
              : [],
            services: detail.services
              ? detail.services.map((service: any) => ({
                  id: service.id,
                  amount: service.amount,
                  service_id: {
                    id: service.service_id.id,
                    name: service.service_id.name,
                    price: service.service_id.price,
                    used_at: new Date(service.service_id.used_at),
                  },
                }))
              : [],
          }))
        : [],
    };
    return {
      success: true,
      message: "Booking created successfully",
      data: booking,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while creating the booking";
    return {
      success: false,
      message,
    };
  }
};

export const getBookings = async (): Promise<{
  success: boolean;
  message?: string;
  data: Booking[];
}> => {
  try {
    const response = await getBookingsApi();
    const data = response.data;
    const bookings: Booking[] = data.map((b: any) => ({
      id: b.id,
      employee_id: b.employee_id,
      user_id: b.user_id,
      discount_id: b.discount_id || null,
      booking_method_id: b.booking_method_id,
      booking_status_id: b.booking_status_id,
      full_name: b.full_name,
      email: b.email,
      phone_number: b.phone_number,
      booking_date: new Date(b.booking_date),
      check_in_date: new Date(b.check_in_date),
      check_out_date: new Date(b.check_out_date),
      adult_amount: b.adult_amount,
      child_amount: b.child_amount || 0,
      request: b.request || "",
      extra_fee: b.extra_fee || 0,
      note: b.note || "",
      total_price: b.total_price,
      discount_value: b.discount_value || 0,
      cancel_reason: b.cancel_reason || null,
      cancel_date: new Date(b.cancel_date) || null,
      created_at: new Date(b.createdAt || b.created_at),
      updated_at: new Date(b.updatedAt || b.updated_at),
      booking_status: b.booking_status
        ? b.booking_status.map((status: any) => ({
            id: status.id,
            name: status.name,
          }))
        : [],
      booking_method: b.booking_method
        ? b.booking_method.map((method: any) => ({
            id: method.id,
            name: method.name,
          }))
        : [],
      user: b.user
        ? b.user.map((user: any) => ({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address || "",
            request: user.request || "",
          }))
        : [],
      discount: b.discount
        ? b.discount.map((discount: any) => ({
            id: discount.id,
            name: discount.name,
            value: discount.value,
            type: discount.type, // e.g., 'percentage' or 'fixed'
            status: discount.status || true,
            created_at: new Date(discount.createdAt || discount.created_at),
            updated_at: new Date(discount.updatedAt || discount.updated_at),
          }))
        : [],
      payment: b.payment
        ? b.payment.map((payment: any) => ({
            id: payment.payment.id,
            booking_id: payment.payment.booking_id,
            payment_method_id: payment.payment.payment_method_id,
            amount: payment.payment.amount,
            status: payment.payment.status || "pending",
            created_at: new Date(
              payment.payment.createdAt || payment.payment.created_at
            ),
            updated_at: new Date(
              payment.payment.updatedAt || payment.payment.updated_at
            ),
            payment_method: payment.payment.payment_method
              ? payment.payment.payment_method.map((method: any) => ({
                  id: method.id,
                  name: method.name,
                }))
              : [],
          }))
        : [],
      employee: b.employee
        ? b.employee.map((emp: any) => ({
            id: emp.id,
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            phone_number: emp.phone_number || "",
          }))
        : [],
      booking_details: b.booking_details
        ? b.booking_details.map((detail: any) => ({
            id: detail.id,
            booking_id: detail.booking_id,
            room_class_id: detail.room_class_id,
            room_id: detail.room_id || null,
            price_per_night: detail.price_per_night,
            nights: detail.nights,
            room: detail.room
              ? detail.room.map((room: any) => ({
                  id: room.id,
                  floor: room.floor,
                  room_class_id: room.room_class_id,
                  name: room.name,
                }))
              : [],
            services: detail.services
              ? detail.services.map((service: any) => ({
                  id: service.id,
                  amount: service.amount,
                  service_id: {
                    id: service.service_id.id,
                    name: service.service_id.name,
                    price: service.service_id.price,
                    used_at: new Date(service.service_id.used_at),
                  },
                }))
              : [],
          }))
        : [],
    }));
    return {
      success: true,
      message: response.message || "Bookings fetched successfully",
      data: bookings,
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
    };
  }
};

export const getBookingById = async (
  bookingId: string,
  userId: string
): Promise<{
  success: boolean;
  message?: string;
  data: Booking | null;
}> => {
  try {
    const response = await getBookingByIdApi(bookingId, userId);
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
      total_price: data.total_price,
      discount_value: data.discount_value || 0,
      cancel_reason: data.cancel_reason || null,
      cancel_date: new Date(data.cancel_date) || null,
      created_at: new Date(data.createdAt || data.created_at),
      updated_at: new Date(data.updatedAt || data.updated_at),
      booking_status: data.booking_status
        ? data.booking_status.map((status: any) => ({
            id: status.id,
            name: status.name,
          }))
        : [],
      booking_method: data.booking_method
        ? data.booking_method.map((method: any) => ({
            id: method.id,
            name: method.name,
          }))
        : [],
      user: data.user
        ? data.user.map((user: any) => ({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address || "",
            request: user.request || "",
          }))
        : [],
      discount: data.discount
        ? data.discount.map((discount: any) => ({
            id: discount.id,
            name: discount.name,
            value: discount.value,
            type: discount.type, // e.g., 'percentage' or 'fixed'
            status: discount.status ? discount.status : true, // Default to true if status is not provided
            created_at: new Date(discount.createdAt || discount.created_at),
            updated_at: new Date(discount.updatedAt || discount.updated_at),
          }))
        : [],
      payment: data.payment
        ? data.payment.map((payment: any) => ({
            id: payment.payment.id,
            booking_id: payment.payment.booking_id,
            payment_method_id: payment.payment.payment_method_id,
            amount: payment.payment.amount,
            status: payment.payment.status || "pending",
            created_at: new Date(
              payment.payment.createdAt || payment.payment.created_at
            ),
            updated_at: new Date(
              payment.payment.updatedAt || payment.payment.updated_at
            ),
            payment_method: payment.payment.payment_method
              ? payment.payment.payment_method.map((method: any) => ({
                  id: method.id,
                  name: method.name,
                }))
              : [],
          }))
        : [],
      employee: data.employee
        ? data.employee.map((emp: any) => ({
            id: emp.id,
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            phone_number: emp.phone_number || "",
          }))
        : [],
      booking_details: data.booking_details
        ? data.booking_details.map((detail: any) => ({
            id: detail.id,
            booking_id: detail.booking_id,
            room_class_id: detail.room_class_id,
            room_id: detail.room_id || null,
            price_per_night: detail.price_per_night,
            nights: detail.nights,
            room: detail.room
              ? detail.room.map((room: any) => ({
                  id: room.id,
                  floor: room.floor,
                  room_class_id: room.room_class_id,
                  name: room.name,
                }))
              : [],
            services: detail.services
              ? detail.services.map((service: any) => ({
                  id: service.id,
                  amount: service.amount,
                  service_id: {
                    id: service.service_id.id,
                    name: service.service_id.name,
                    price: service.service_id.price,
                    used_at: new Date(service.service_id.used_at),
                  },
                }))
              : [],
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
      data: null,
    };
  }
};

export const cancelBooking = async (
  bookingId: string,
  userId: string,
  cancelReason: string
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const response = await cancelBookingApi(bookingId, userId, cancelReason);
    return {
      success: true,
      message: response.message || "Booking cancelled successfully",
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while cancelling the booking";
    return {
      success: false,
      message,
    };
  }
};
