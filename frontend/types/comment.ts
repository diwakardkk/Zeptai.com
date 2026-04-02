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
  status?: "visible" | "hidden" | "pending";
}

