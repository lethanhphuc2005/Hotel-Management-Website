"use client";
import Link from "next/link";
import Image from "next/image";
export default function RoomImageWithLike({
  imageUrl,
  roomId,
  liked,
  onLikeClick,
}: {
  imageUrl: string;
  roomId: string;
  liked: boolean;
  onLikeClick: () => void;
}) {
  return (
    <div className="position-relative tw-aspect-square tw-w-full tw-max-w-[300px] tw-min-w-[200px] tw-rounded-2xl tw-overflow-hidden">
      <Link href={`/room-class/${roomId}`}>
        <Image
          fill
          src={imageUrl}
          alt={roomId}
          quality={100}
          loading="lazy"
          className="tw-w-full tw-h-full tw-object-cover tw-rounded-2xl"
        />
      </Link>
      <button
        type="button"
        className="btn btn-light position-absolute top-0 end-0 m-1 rounded-circle shadow"
        onClick={onLikeClick}
      >
        <i
          className={`bi bi-heart-fill ${liked ? "text-danger" : "text-dark"}`}
        ></i>
      </button>
    </div>
  );
}
