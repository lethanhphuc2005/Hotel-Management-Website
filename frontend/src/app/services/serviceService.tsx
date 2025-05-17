import { Service } from "../types/service";

export async function getServices(url: string) {
  let res = await fetch(url);
  let data = await res.json();
  let services: Service[] = data.map((p: any) => {
    return {
      _id: p._id,
      TenDV: p.TenDV,
      GiaDV: p.GiaDV,
      MoTa: p.MoTa,
      HinhAnh: p.HinhAnh
    };
  });
  return services;
}