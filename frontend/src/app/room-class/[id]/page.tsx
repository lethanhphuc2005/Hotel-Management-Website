"use client";
import { useParams } from "next/navigation";
import { useRoomClassDetail } from "@/hooks/useRoomClassDetail";
import ImageAlbum from "@/components/pages/roomClass/detail/ImageAlbum";
import InformationSection from "@/components/pages/roomClass/detail/InformationSection";
import FeatureSection from "@/components/pages/roomClass/detail/FeatureSection";
import ReviewSection from "@/components/pages/roomClass/detail/ReviewSection";
import BookingSummarySection from "@/components/pages/roomClass/detail/BookingForm";

const RoomDetailPage = () => {
  const params = useParams();
  const roomId = params.id as string;
  const { roomClass, mainRoomClass, features, images, reviews, comments } =
    useRoomClassDetail(roomId);
  if (!roomClass || !mainRoomClass || !features || !images) {
    return <div className="tw-text-center tw-mt-10">Loading...</div>;
  }
  return (
    <div className="tw-mx-[15%] tw-my-[100px]">
      <ImageAlbum images={images} />
      <InformationSection roomClass={roomClass} mainRoomClass={mainRoomClass} />
      <FeatureSection features={features} />
      <ReviewSection reviews={reviews} />
    </div>
  );
};

export default RoomDetailPage;
