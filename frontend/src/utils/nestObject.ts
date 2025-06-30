import { Review } from "@/types/review";

type ReviewWithReplies = Review & { replies?: Review[] };

export function nestReplies(reviews: Review[]): ReviewWithReplies[] {
  const reviewMap: Record<string, ReviewWithReplies> = {};

  // Tạo map để dễ tra cứu
  for (const review of reviews) {
    reviewMap[review.id] = { ...review, replies: [] };
  }

  const nested: ReviewWithReplies[] = [];

  for (const review of reviews) {
    const parentId = review.parent_id;

    if (parentId && reviewMap[parentId]) {
      // Nếu là phản hồi, thêm vào replies của review cha
      reviewMap[parentId].replies?.push(review);
    } else {
      // Nếu là review gốc, đưa vào danh sách chính
      nested.push(reviewMap[review.id]);
    }
  }

  return nested;
}
