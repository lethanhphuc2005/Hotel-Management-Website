/**
 * Viết hoa chữ cái đầu tiên của một từ.
 * Ví dụ: "phúc" => "Phúc"
 */
export const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Viết hoa chữ cái đầu của từng từ trong chuỗi.
 * Ví dụ: "hướng núi phía tây" => "Hướng Núi Phía Tây"
 */
export const capitalizeWords = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => capitalizeFirst(word))
    .join(" ");

export const formantPrice = (price: number) => {
  if (price < 1000) return `${price}₫`;
  if (price < 1000000) return `${(price / 1000).toFixed(1)}K₫`;
  return `${(price / 1000000).toFixed(1)}M₫`;
};

export function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}
