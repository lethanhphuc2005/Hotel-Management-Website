import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useState } from "react";
import { fetchRoomClassById } from "@/services/RoomClassService";
import { RoomClass } from "@/types/roomClass";
import { MainRoomClass } from "@/types/mainRoomClass";
import { Review } from "@/types/review";
import { Comment } from "@/types/comment";
import { Feature, RoomClassFeature } from "@/types/feature";
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
          name: data.name || "",
          bed_amount: data.bed_amount || 0,
          capacity: data.capacity || 0,
          description: data.description || "",
          price: data.price || 0,
          price_discount: data.price_discount || 0,
          view: data.view || "",
          status: data.status || false,
          main_room_class_id: data.main_room_class_id || "",
          main_room_class: data.main_room_class || [],
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
