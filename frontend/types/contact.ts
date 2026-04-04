export type ContactSubmissionStatus = "new" | "contacted" | "closed";

export interface ContactSubmissionInput {
  name: string;
  email: string;
  mobile: string;
  message: string;
  sourcePage?: string;
}

export interface ContactSubmission extends ContactSubmissionInput {
  id: string;
  sourcePage: string;
  inquiryType: "contact";
  status: ContactSubmissionStatus;
  createdAt: string;
}
