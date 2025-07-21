export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return "default-image.png";

  const baseUrl =
    process.env.NEXT_PUBLIC_API_IMAGE_URL?.replace(/\/+$/, "") || "";

  return `${baseUrl}/${imagePath}`;
}

export default getImageUrl;
