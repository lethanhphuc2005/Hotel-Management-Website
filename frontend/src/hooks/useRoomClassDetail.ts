import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useState } from "react";
import { fetchRoomClassById } from "../services/RoomClassService";
import { RoomClass } from "@/types/roomClass";
import { MainRoomClass } from "@/types/mainRoomClass";
import { Review } from "@/types/review";
import { Comment } from "@/types/comment";
import { RoomClassFeature } from "@/types/feature";
import { Image } from "@/types/image";

export const useRoomClassDetail = (roomId: string) => {
  const { setLoading } = useLoading();
  const [roomClass, setRoomClass] = useState<RoomClass>();
  const [mainRoomClass, setMainRoomClass] = useState<MainRoomClass>();
  const [features, setFeatures] = useState<RoomClassFeature[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [didFetch, setDidFetch] = useState(false);

  useEffect(() => {
    const fetchRoomClassDetail = async () => {
      setLoading(true);
      try {
        const response = await fetchRoomClassById(roomId);
        if (!response.success) {
          console.error("Error fetching room class:", response.message);
          return;
        }
        const data = response.data;
        setRoomClass({
          id: data.id,
          main_room_class_id: data.main_room_class_id,
          name: data.name,
          bed: data.bed,
          capacity: data.capacity,
          price: data.price,
          price_discount: data.price_discount,
          view: data.view,
          description: data.description,
          status: data.status,
          main_room_class: data.main_room_class || {},
          images: data.images || [],
        });
        setMainRoomClass(data.main_room_class || []);
        setFeatures(data.features || []);
        setImages(data.images || []);
        setReviews(data.reviews || []);
        setComments(data.comments || []);
        setDidFetch(true);
      } catch (error) {
        console.error("Error fetching room class detail:", error);
      }
      setLoading(false);
    };
    if (!didFetch) {
      fetchRoomClassDetail();
    }
  }, [roomId, setLoading, didFetch]);
  return {
    roomClass,
    mainRoomClass,
    features,
    images,
    reviews,
    comments,
  };
};
