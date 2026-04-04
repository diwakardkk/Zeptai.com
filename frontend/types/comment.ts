export type BlogCommentStatus = "visible" | "hidden" | "pending";

export interface BlogCommentInput {
  postSlug: string;
  name: string;
  email: string;
  mobile: string;
  comment: string;
}

export interface BlogComment extends BlogCommentInput {
  id: string;
  createdAt: string;
  status: BlogCommentStatus;
}
