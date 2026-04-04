export interface LeadInput {
  name: string;
  email: string;
  mobile: string;
  sourcePage: string;
}

export interface LeadSubmission extends LeadInput {
  id: string;
  createdAt: string;
}
