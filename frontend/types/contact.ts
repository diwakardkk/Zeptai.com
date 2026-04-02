export interface ContactSubmissionInput {
  name: string;
  email: string;
  mobile: string;
  message: string;
}

export interface ContactSubmission extends ContactSubmissionInput {
  id: string;
  sourcePage: string;
  inquiryType: "contact";
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

