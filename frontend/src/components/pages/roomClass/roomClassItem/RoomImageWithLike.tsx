"use client";
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
      <a href={`/roomdetail/${roomId}`}>
        <img
          src={`/img/${imageUrl}`}
          alt=""
          className="rounded-4 h-100"
          style={{ width: "250px" }}
        />
      </a>
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
