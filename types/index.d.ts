
export interface ClerkUser {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: { emailAddress: string }[];
  imageUrl: string;
  createdAt: number;
  lastSignInAt: number;
}

export interface FirestoreUser {
  id: string;
  balance: number;
  balanceHistory: BalanceHistoryEntry[];
  pendingOrders?: number;
  totalOrders?: number;
}

export interface BalanceHistoryEntry {
  amount: number;
  type: "credit" | "debit";
  description: string;
  category: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface UserOrder {
  id: string;
  userId: string;
  status: string;
  price: number;
  service: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
}

export interface UserSearchParams {
  query: string;
  limit: number;
  offset: number;
}
