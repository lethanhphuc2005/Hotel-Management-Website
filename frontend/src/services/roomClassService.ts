import {
  getRoomClasses as getRoomClassesApi,
  getRoomClassById as getRoomClassByIdApi,
} from "@/api/roomClassApi";
import { Review } from "@/types/review";
import {
  RoomClass,
  RoomClassListResponse,
  RoomClassResponse,
} from "@/types/roomClass";
import { Comment } from "@/types/comment";

export const fetchRoomClasses = async (
  memoizedParams = {}
): Promise<RoomClassListResponse> => {
  try {
    const response = await getRoomClassesApi(memoizedParams);
    const data = response.data;
    const roomClasses: RoomClass[] = data.map((item: any) => ({
      id: item.id || item._id,
      main_room_class_id: item.main_room_class_id || "",
      name: item.name,
      bed_type: item.bed_type,
      bed_amount: item.bed_amount || 0,
      capacity: item.capacity || 0,
      price: item.price || 0,
      price_discount: item.price_discount || 0,
      view: item.view || "",
      description: item.description || "",
      status: item.status || false,
      createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
      main_room_class: item.main_room_class || [],
      images: item.images
        ? item.images.map((img: any) => ({
            id: img.id || img._id,
            url: img.url,
            target: img.target || "",
            createdAt: img.createdAt ? new Date(img.createdAt) : undefined,
            updatedAt: img.updatedAt ? new Date(img.updatedAt) : undefined,
          }))
        : [],
      features: item.features
        ? item.features.map((feature: any) => ({
            id: feature.id || feature._id,
            room_class_id: feature.room_class_id || "",
            feature_id: feature.feature_id,
            feature: feature.feature
              ? {
                  id: feature.feature.id || feature.feature._id,
                  name: feature.feature.name,
                  icon: feature.feature.icon || "",
                  image: feature.feature.image || "",
                  description: feature.feature.description || "",
                }
              : undefined,
          }))
        : [],
      reviews:
        item.reviews?.map((review: Review) => ({
          ...review,
          createdAt: review.createdAt && new Date(review.createdAt),
          updatedAt: review.updatedAt && new Date(review.updatedAt),
        })) || [],
      comments:
        item.comments?.map((comment: Comment) => ({
          ...comment,
          createdAt: comment.createdAt && new Date(comment.createdAt),
          updatedAt: comment.updatedAt && new Date(comment.updatedAt),
        })) || [],
    }));

    const pagination = response.pagination 

    return {
      success: true,
      message: response.message || "Room classes fetched successfully",
      data: roomClasses,
      pagination
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching room classes";
    return {
      success: false,
      message,
      data: [],
    };
  }
};

export const fetchRoomClassById = async (
  id: string
): Promise<RoomClassResponse> => {
  try {
    const response = await getRoomClassByIdApi(id);
    const data = response.data;
    const roomClass: RoomClass = {
      id: data.id || data._id,
      main_room_class_id: data.main_room_class_id || "",
      name: data.name,
      bed_type: data.bed_type,
      bed_amount: data.bed_amount || 0,
      capacity: data.capacity || 0,
      price: data.price || 0,
      price_discount: data.price_discount || 0,
      view: data.view || "",
      description: data.description || "",
      status: data.status || false,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      main_room_class: data.main_room_class || [],
      images: data.images
        ? data.images.map((img: any) => ({
            id: img.id || img._id,
            url: img.url,
            target: img.target || "",
            createdAt: img.createdAt ? new Date(img.createdAt) : undefined,
            updatedAt: img.updatedAt ? new Date(img.updatedAt) : undefined,
          }))
        : [],
      features: data.features
        ? data.features.map((feature: any) => ({
            id: feature.id || feature._id,
            room_class_id: feature.room_class_id || "",
            feature_id: feature.feature_id,
            features: feature.feature
              ? {
                  id: feature.feature.id || feature.feature._id,
                  name: feature.feature.name,
                  icon: feature.feature.icon || "",
                  image: feature.feature.image || "",
                  description: feature.feature.description || "",
                }
              : undefined,
          }))
        : [],
      reviews:
        data.reviews?.map((review: Review) => ({
          ...review,
          createdAt: review.createdAt && new Date(review.createdAt),
          updatedAt: review.updatedAt && new Date(review.updatedAt),
        })) || [],
      comments:
        data.comments?.map((comment: Comment) => ({
          ...comment,
          createdAt: comment.createdAt && new Date(comment.createdAt),
          updatedAt: comment.updatedAt && new Date(comment.updatedAt),
        })) || [],
    };

    return {
      success: true,
      message: response.message || "Room class fetched successfully",
      data: roomClass,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "An error occurred while fetching the room class";
    return {
      success: false,
      message,
      data: {} as RoomClass, // Return an empty RoomClass object on error
    };
  }
};
