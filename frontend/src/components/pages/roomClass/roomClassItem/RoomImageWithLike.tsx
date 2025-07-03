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
    <div className="position-relative">
      <Link href={`/room-class/${roomId}`}>
        <Image
          width={250}
          height={150}
          src={`/img/${imageUrl}`}
          alt={roomId}
          quality={100}
          loading="lazy"
          className="rounded-4 h-100"
          style={{ width: "250px" }}
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
