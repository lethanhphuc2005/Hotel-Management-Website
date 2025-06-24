import { Comment } from "@/types/comment";

export function nestComments(comments: Comment[]): Comment[] {
  const commentMap: { [key: string]: Comment } = {};
  const nestedComments: Comment[] = [];

  // Create a map of comments by their ID
  comments.forEach(comment => {
    commentMap[comment.id] = { ...comment, parent_comment: [] };
  });

  // Build the nested structure
  comments.forEach(comment => {
    if (comment.parent_id) {
      // If it has a parent, add it to the parent's parent_comment array
      const parentComment = commentMap[comment.parent_id];
      if (parentComment) {
        parentComment.parent_comment!.push(commentMap[comment.id]);
      }
    } else {
      // If it has no parent, it's a top-level comment
      nestedComments.push(commentMap[comment.id]);
    }
  });

  return nestedComments;
}
