// services/roomService.ts
import { RoomClass } from "@/types/roomclass";

export async function getRoomClass(url: string): Promise<RoomClass[]> {
  const res = await fetch(url);
  const data = await res.json();

  const roomclass: RoomClass[] = data.data.map((p: any) => ({
    price_discount: p.price_discount,
    _id: p._id,
    bed_amount: p.bed_amount,
    description: p.description,
    view: p.view,
    name: p.name,
    status: p.status,
    main_room_class_id: p.main_room_class_id,
    capacity: p.capacity,
    price: p.price,
    main_room_class: p.main_room_class.map((mrc: any) => ({
      _id: mrc._id,
      name: mrc.name,
      description: mrc.description,
    })),
    features: p.features.map((f: any) => ({
      _id: f._id,
      room_class_id: f.room_class_id,
      feature_id: {
        _id: f.feature_id._id,
        name: f.feature_id.name,
        description: f.feature_id.description,
        image: f.feature_id.image,
      },
    })),
    images: p.images.map((img: any) => ({
      _id: img._id,
      room_class_id: img.room_class_id,
      url: img.url,
    })),
        comments: p.comments?.map((cmt: any) => ({
      _id: cmt._id,
      room_class_id: cmt.room_class_id,
      parent_id: cmt.parent_id,
      user_id: cmt.user_id,
      content: cmt.content,
      createdAt: cmt.createdAt,
      updatedAt: cmt.updatedAt,
      rating: cmt.rating,
    })) || [],
  }));

  return roomclass;
}
