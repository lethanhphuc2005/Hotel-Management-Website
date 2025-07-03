"use client";
import { useParams } from "next/navigation";
import { useRoomClassDetail } from "@/hooks/useRoomClassDetail";
import ImageAlbum from "@/components/pages/roomClassDetail/ImageAlbum";
import InformationSection from "@/components/pages/roomClassDetail/InformationSection";
import FeatureSection from "@/components/pages/roomClassDetail/FeatureSection";
import ReviewSection from "@/components/pages/roomClassDetail/ReviewSection";
import FAQSection from "@/components/pages/roomClassDetail/FaqSection";
import ImportantInfoSection from "@/components/pages/roomClassDetail/ImportantInfoSection";

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
      <InformationSection
        roomClass={roomClass}
        mainRoomClass={mainRoomClass}
        images={images}
      />
      <FeatureSection features={features} />
      <ReviewSection reviews={reviews} />
      <FAQSection roomClassId={roomClass.id} comments={comments} />
      <ImportantInfoSection />
    </div>
  );
};

export default RoomDetailPage;
