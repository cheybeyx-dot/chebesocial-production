export interface AccountSupportRequest {
  id: number;
  service: string;
  issue: string;
  status: "pending" | "resolved";
}

export const accountSupportRequests: AccountSupportRequest[] = [];
