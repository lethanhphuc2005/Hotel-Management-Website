import { Review } from "@/types/review";
import { Comment, CommentWithReplies } from "@/types/comment";

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

export function nestComments(comments: Comment[]): CommentWithReplies[] {
  const map: Record<string, CommentWithReplies> = {};

  // Gán từng comment vào map
  comments.forEach((comment) => {
    map[comment.id] = { ...comment, replies: [] };
  });

  const roots: CommentWithReplies[] = [];

  comments.forEach((comment) => {
    const parentId = comment.parent_id;
    if (parentId && map[parentId]) {
      // Gắn vào replies của parent
      map[parentId].replies!.push(map[comment.id]);
    } else {
      // Nếu không có parent, là root comment
      roots.push(map[comment.id]);
    }
  });

  return roots;
}
