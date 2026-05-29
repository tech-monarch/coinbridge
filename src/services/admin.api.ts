// Admin API Service
// All admin endpoints require Bearer token authorization

const API = import.meta.env.VITE_API_DOMAIN;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

// ─────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  balance: number;
  wallet_address: string;
  kyc_status: "pending" | "approved" | "rejected";
  account_status: "active" | "suspended";
  created_at: string;
}

export interface UserDetail extends User {
  kyc?: KycSubmission;
  deposits?: Deposit[];
  withdrawals?: Withdrawal[];
}

export interface Deposit {
  id: number;
  user_id: number;
  network_id: number;
  amount: number;
  currency: string;
  transaction_hash: string;
  status: "pending" | "confirmed" | "rejected";
  confirmations: number;
  confirmed_at: string | null;
  credited_at: string | null;
  created_at: string;
  user?: { id: number; name: string; email: string };
  network?: { id: number; name: string; symbol: string };
}

export interface Withdrawal {
  id: number;
  user_id: number;
  network_id: number;
  amount: number;
  currency: string;
  recipient_address: string;
  status: "pending" | "approved" | "rejected";
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  user?: { id: number; name: string; email: string };
  network?: { id: number; name: string; symbol: string };
}

export interface Transaction {
  id: number;
  user_id: number;
  type: "deposit" | "withdrawal";
  amount: number;
  currency: string;
  hash: string;
  status: "pending" | "confirmed" | "failed";
  reference_type: string;
  reference_id: number;
  note: string | null;
  created_at: string;
  user?: { id: number; name: string; email: string };
}

export interface KycSubmission {
  id: number;
  user_id: number;
  status: "pending" | "approved" | "rejected";
  document_type: string;
  document_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  country: string;
  document_image_url: string;
  selfie_url: string;
  reviewed_at: string | null;
  reviewed_by: number | null;
  rejection_reason: string | null;
  created_at: string;
  user?: { id: number; name: string; email: string; kyc_status: string };
}

export interface Network {
  id: number;
  name: string;
  slug: string;
  symbol: string;
  color: string;
  confirmations: number;
  min_deposit: number;
  fee: number;
  deposit_address: string;
  is_active: boolean;
  created_at: string;
}

export interface DashboardMetrics {
  total_users: number;
  total_volume: number;
  pending_withdrawals: number;
  pending_kyc: number;
  pending_deposits: number;
  confirmed_deposits: number;
  total_deposits_value: number;
  recent_transactions: Transaction[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface AdminSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  maintenance_mode: boolean;
  api_rate_limit: number;
  webhook_url: string;
  deposit_wallet_eth: string;
  deposit_wallet_btc: string;
}

// ─────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const res = await fetch(`${API}/api/admin/dashboard/metrics`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard metrics: ${res.statusText}`);
  }

  return res.json();
};

// ─────────────────────────────────────────────────────────────
// User Management
// ─────────────────────────────────────────────────────────────

export interface ListUsersParams {
  search?: string;
  kyc_status?: "pending" | "approved" | "rejected" | "all";
  account_status?: "active" | "suspended" | "all";
  page?: number;
}

export const listUsers = async (
  params?: ListUsersParams,
): Promise<PaginatedResponse<User>> => {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.kyc_status) query.append("kyc_status", params.kyc_status);
  if (params?.account_status)
    query.append("account_status", params.account_status);
  if (params?.page) query.append("page", params.page.toString());

  const url = `${API}/api/admin/users${query.toString() ? `?${query}` : ""}`;
  const res = await fetch(url, { method: "GET", headers: authHeaders() });

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.statusText}`);
  }

  return res.json();
};

export const getUserDetail = async (id: number): Promise<UserDetail> => {
  const res = await fetch(`${API}/api/admin/users/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.statusText}`);
  }

  return res.json();
};

export const suspendUser = async (id: number): Promise<{ message: string }> => {
  const res = await fetch(`${API}/api/admin/users/${id}/suspend`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to suspend user: ${res.statusText}`);
  }

  return res.json();
};

export const activateUser = async (
  id: number,
): Promise<{ message: string }> => {
  const res = await fetch(`${API}/api/admin/users/${id}/activate`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to activate user: ${res.statusText}`);
  }

  return res.json();
};

export interface AdjustBalanceParams {
  amount: number;
  note?: string;
}

export const adjustUserBalance = async (
  id: number,
  params: AdjustBalanceParams,
): Promise<{ message: string; new_balance: number }> => {
  const res = await fetch(`${API}/api/admin/users/${id}/balance`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Failed to adjust balance: ${res.statusText}`);
  }

  return res.json();
};

// ─────────────────────────────────────────────────────────────
// Deposit Management
// ─────────────────────────────────────────────────────────────

export interface ListDepositsParams {
  status?: "pending" | "confirmed" | "rejected" | "all";
  search?: string;
  page?: number;
}

export const listDeposits = async (
  params?: ListDepositsParams,
): Promise<PaginatedResponse<Deposit>> => {
  const query = new URLSearchParams();
  if (params?.status) query.append("status", params.status);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", params.page.toString());

  const url = `${API}/api/admin/deposits${query.toString() ? `?${query}` : ""}`;
  const res = await fetch(url, { method: "GET", headers: authHeaders() });

  if (!res.ok) {
    throw new Error(`Failed to fetch deposits: ${res.statusText}`);
  }

  return res.json();
};

export const getDepositDetail = async (id: number): Promise<Deposit> => {
  const res = await fetch(`${API}/api/admin/deposits/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch deposit: ${res.statusText}`);
  }

  return res.json();
};

export const approveDeposit = async (
  id: number,
): Promise<{ message: string }> => {
  const res = await fetch(`${API}/api/admin/deposits/${id}/approve`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to approve deposit: ${res.statusText}`);
  }

  return res.json();
};

export interface RejectDepositParams {
  reason?: string;
}

export const rejectDeposit = async (
  id: number,
  params?: RejectDepositParams,
): Promise<{ message: string }> => {
  const res = await fetch(`${API}/api/admin/deposits/${id}/reject`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(params ?? {}),
  });

  if (!res.ok) {
    throw new Error(`Failed to reject deposit: ${res.statusText}`);
  }

  return res.json();
};

// ─────────────────────────────────────────────────────────────
// Withdrawal Management
// ─────────────────────────────────────────────────────────────

export interface ListWithdrawalsParams {
  status?: "pending" | "approved" | "rejected" | "all";
  search?: string;
  page?: number;
}

export const listWithdrawals = async (
  params?: ListWithdrawalsParams,
): Promise<PaginatedResponse<Withdrawal>> => {
  const query = new URLSearchParams();
  if (params?.status) query.append("status", params.status);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", params.page.toString());

  const url = `${API}/api/admin/withdrawals${
    query.toString() ? `?${query}` : ""
  }`;
  const res = await fetch(url, { method: "GET", headers: authHeaders() });

  if (!res.ok) {
    throw new Error(`Failed to fetch withdrawals: ${res.statusText}`);
  }

  return res.json();
};

export const getWithdrawalDetail = async (id: number): Promise<Withdrawal> => {
  const res = await fetch(`${API}/api/admin/withdrawals/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch withdrawal: ${res.statusText}`);
  }

  return res.json();
};

export const approveWithdrawal = async (
  id: number,
): Promise<{ message: string }> => {
  const res = await fetch(`${API}/api/admin/withdrawals/${id}/approve`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to approve withdrawal: ${res.statusText}`);
  }

  return res.json();
};

export interface RejectWithdrawalParams {
  reason?: string;
}

export const rejectWithdrawal = async (
  id: number,
  params?: RejectWithdrawalParams,
): Promise<{ message: string }> => {
  const res = await fetch(`${API}/api/admin/withdrawals/${id}/reject`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(params ?? {}),
  });

  if (!res.ok) {
    throw new Error(`Failed to reject withdrawal: ${res.statusText}`);
  }

  return res.json();
};

// ─────────────────────────────────────────────────────────────
// Transaction Management
// ─────────────────────────────────────────────────────────────

export interface ListTransactionsParams {
  type?: "deposit" | "withdrawal" | "all";
  status?: "pending" | "confirmed" | "failed" | "all";
  search?: string;
  page?: number;
}

export const listTransactions = async (
  params?: ListTransactionsParams,
): Promise<PaginatedResponse<Transaction>> => {
  const query = new URLSearchParams();
  if (params?.type) query.append("type", params.type);
  if (params?.status) query.append("status", params.status);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", params.page.toString());

  const url = `${API}/api/admin/transactions${
    query.toString() ? `?${query}` : ""
  }`;
  const res = await fetch(url, { method: "GET", headers: authHeaders() });

  if (!res.ok) {
    throw new Error(`Failed to fetch transactions: ${res.statusText}`);
  }

  return res.json();
};

export const getTransactionDetail = async (
  id: number,
): Promise<Transaction> => {
  const res = await fetch(`${API}/api/admin/transactions/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch transaction: ${res.statusText}`);
  }

  return res.json();
};

// ─────────────────────────────────────────────────────────────
// KYC Management
// ─────────────────────────────────────────────────────────────

export interface ListKycParams {
  status?: "pending" | "approved" | "rejected" | "all";
  search?: string;
  page?: number;
}

export const listKyc = async (
  params?: ListKycParams,
): Promise<PaginatedResponse<KycSubmission>> => {
  const query = new URLSearchParams();
  if (params?.status) query.append("status", params.status);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", params.page.toString());

  const url = `${API}/api/admin/kyc${query.toString() ? `?${query}` : ""}`;
  const res = await fetch(url, { method: "GET", headers: authHeaders() });

  if (!res.ok) {
    throw new Error(`Failed to fetch KYC submissions: ${res.statusText}`);
  }

  return res.json();
};

export const getKycDetail = async (id: number): Promise<KycSubmission> => {
  const res = await fetch(`${API}/api/admin/kyc/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch KYC: ${res.statusText}`);
  }

  return res.json();
};

export const approveKyc = async (id: number): Promise<{ message: string }> => {
  const res = await fetch(`${API}/api/admin/kyc/${id}/approve`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to approve KYC: ${res.statusText}`);
  }

  return res.json();
};

export interface RejectKycParams {
  reason?: string;
}

export const rejectKyc = async (
  id: number,
  params?: RejectKycParams,
): Promise<{ message: string }> => {
  const res = await fetch(`${API}/api/admin/kyc/${id}/reject`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(params ?? {}),
  });

  if (!res.ok) {
    throw new Error(`Failed to reject KYC: ${res.statusText}`);
  }

  return res.json();
};

// ─────────────────────────────────────────────────────────────
// Settings Management
// ─────────────────────────────────────────────────────────────

export const getSettings = async (): Promise<AdminSettings> => {
  const res = await fetch(`${API}/api/admin/settings`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch settings: ${res.statusText}`);
  }

  return res.json();
};

export const updateSettings = async (
  settings: Partial<AdminSettings>,
): Promise<{ message: string; settings: AdminSettings }> => {
  const res = await fetch(`${API}/api/admin/settings`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(settings),
  });

  if (!res.ok) {
    throw new Error(`Failed to update settings: ${res.statusText}`);
  }

  return res.json();
};

// ─────────────────────────────────────────────────────────────
// Network Management
// ─────────────────────────────────────────────────────────────

export const listNetworks = async (): Promise<Network[]> => {
  const res = await fetch(`${API}/api/admin/networks`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch networks: ${res.statusText}`);
  }

  return res.json();
};

export interface CreateNetworkParams {
  name: string;
  slug: string;
  symbol: string;
  color: string;
  confirmations: number;
  min_deposit: number;
  fee: number;
  deposit_address: string;
  is_active?: boolean;
}

export const createNetwork = async (
  params: CreateNetworkParams,
): Promise<Network> => {
  const res = await fetch(`${API}/api/admin/networks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Failed to create network: ${res.statusText}`);
  }

  return res.json();
};

export interface UpdateNetworkParams {
  name?: string;
  deposit_address?: string;
  fee?: number;
  min_deposit?: number;
  confirmations?: number;
  is_active?: boolean;
}

export const updateNetwork = async (
  id: number,
  params: UpdateNetworkParams,
): Promise<{ message: string; network: Network }> => {
  const res = await fetch(`${API}/api/admin/networks/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Failed to update network: ${res.statusText}`);
  }

  return res.json();
};
