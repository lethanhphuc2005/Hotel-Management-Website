import { Service } from "@/types/service";

export async function getServices(url: string) {
  let res = await fetch(url);
  let data = await res.json();
  let services: Service[] = data.data.map((p: any) => {
    return {
      _id: p._id,
      name: p.name,
      price: p.price,
      description: p.description,
      image: p.image,
      status: p.status,
    };
  });
  return services;
}
