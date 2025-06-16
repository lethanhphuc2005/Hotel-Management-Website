import { Discount } from "../types/discount";

export async function getDiscount(url: string) {
  let res = await fetch(url);
  let data = await res.json();
  let discounts: Discount[] = data.data.map((p: any) => {
    return {
        _id: p._id,
        name: p.name,
        image: p.image,
        description: p.description,
        type: p.type,
        value: p.value,
        start_day: new Date(p.start_day),
        end_day: new Date(p.end_day),
        quantity: p.quantity,
        limit: p.limit
    };
  });
  return discounts;
}