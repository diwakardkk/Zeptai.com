export type ContactSubmissionStatus = "new" | "contacted" | "closed";
export type ContactInquiryType = "contact" | "demo_request";

export interface ContactSubmissionInput {
  name: string;
  email: string;
  mobile: string;
  message: string;
  sourcePage?: string;
  inquiryType?: ContactInquiryType;
}

export interface ContactSubmission extends ContactSubmissionInput {
  id: string;
  sourcePage: string;
  inquiryType: ContactInquiryType;
  status: ContactSubmissionStatus;
  createdAt: string;
}
