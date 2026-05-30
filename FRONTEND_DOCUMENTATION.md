# Altioda Frontend Documentation

**Date:** May 2026  
**Version:** 1.0  
**Tech Stack:** React 18+ | TypeScript | React Router v6 | Vite | Plain CSS

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Routing & Layout](#routing--layout)
3. [User Pages](#user-pages)
4. [Admin Pages](#admin-pages)
5. [Components](#components)
6. [Context & Services](#context--services)
7. [Data Types & Interfaces](#data-types--interfaces)
8. [Required API Endpoints](#required-api-endpoints)
9. [State Management](#state-management)
10. [Authentication Flow](#authentication-flow)

---

## Project Structure

```
src/
├── App.tsx                          # Main routing configuration
├── main.tsx                         # React entry point
├── index.css                        # Global styles
├── App.css                          # App-level styles
│
├── pages/
│   ├── user/
│   │   ├── login/Login.tsx         # User login page (placeholder)
│   │   ├── register/Register.tsx   # User registration (placeholder)
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx       # User home with balance & activity
│   │   │   └── Dashboard.css
│   │   ├── deposit/
│   │   │   ├── Deposit.tsx         # User deposit form
│   │   │   └── Deposit.css
│   │   ├── withdraw/
│   │   │   ├── Withdraw.tsx        # User withdrawal form
│   │   │   └── Withdraw.css
│   │   ├── transactions/
│   │   │   ├── Transactions.tsx    # User transaction history
│   │   │   └── Transactions.css
│   │   ├── kyc/
│   │   │   ├── Kyc.tsx             # User KYC form submission
│   │   │   └── Kyc.css
│   │   └── settings/
│   │       ├── Settings.tsx        # User account settings
│   │       └── Settings.css
│   │
│   └── admin/
│       ├── dashboard/
│       │   ├── Dashboard.tsx       # Admin overview metrics
│       │   └── Dashboard.css
│       ├── users/
│       │   ├── Users.tsx           # User management & KYC
│       │   └── Users.css
│       ├── deposits/
│       │   ├── Deposits.tsx        # Deposit approval workflow
│       │   └── Deposits.css
│       ├── withdrawals/
│       │   ├── Withdrawals.tsx     # Withdrawal approval workflow
│       │   └── Withdrawals.css
│       ├── transactions/
│       │   ├── Transactions.tsx    # All system transactions
│       │   └── Transactions.css
│       ├── kyc/
│       │   ├── Kyc.tsx             # KYC submission review
│       │   └── Kyc.css
│       └── settings/
│           ├── Settings.tsx        # Admin system config
│           └── Settings.css
│
├── components/
│   └── user/
│       ├── Sidebar.tsx             # Desktop navigation
│       ├── BottomNav.tsx           # Mobile navigation
│       ├── Navbar.tsx              # Top navigation bar
│       ├── BalanceCard.tsx         # Balance display component
│       ├── MarketSidebar.tsx       # Market widget (TradingView)
│       └── *.css
│
├── context/
│   └── AuthContext.tsx             # Authentication context (empty - ready for setup)
│
├── services/
│   ├── api.ts                      # API client setup (empty)
│   ├── admin.api.ts                # Admin API calls (empty)
│   └── auth.ts                     # Authentication service (empty)
│
├── styles/
│   └── globals.css                 # Design system & variables
│
└── assets/                         # Images, icons, etc.
```

---

## Routing & Layout

### Route Structure

```
/
├── /user/login                 → Login page
├── /user/register              → Register page
├── /user/*                     → Protected routes (UserLayout wrapper)
│   ├── /user/dashboard         → Dashboard
│   ├── /user/deposit           → Deposit
│   ├── /user/withdraw          → Withdraw
│   ├── /user/transactions      → Transactions
│   ├── /user/kyc               → KYC Form
│   └── /user/settings          → Settings
└── /admin/*                    → Protected admin routes (UserLayout wrapper)
    ├── /admin/dashboard        → Admin Dashboard
    ├── /admin/users            → Users Management
    ├── /admin/deposits         → Deposits Approval
    ├── /admin/withdrawals      → Withdrawals Approval
    ├── /admin/transactions     → Transaction History
    ├── /admin/kyc              → KYC Review
    └── /admin/settings         → Admin Settings
```

### Layout Components

#### `UserLayout` (src/App.tsx)

**Purpose:** Wraps protected user routes with theme, sidebar, navbar, and market widget

**Props:** None (uses internal hooks)

**Functions:**

- `useTheme()` - Manages dark/light theme with localStorage persistence
- `RequireAuth()` - Guards routes requiring authentication token

**Returns:**

```tsx
<div className="app-shell">
  <Sidebar theme={theme} onThemeToggle={toggle} userName="Alex Turner" />
  <div className="app-content">
    <main>
      <Outlet />
    </main>
  </div>
  <MarketSidebar />
  <BottomNav />
</div>
```

---

## User Pages

### 1. Dashboard (src/pages/user/dashboard/Dashboard.tsx)

**Purpose:** User home screen with account overview

**State:**

```typescript
const [balanceVisible, setBalanceVisible] = useState(true);
const [copied, setCopied] = useState(false);
```

**Functions:**

- `copyAddress()` - Copy wallet address to clipboard
- `toggleBalance()` - Toggle balance visibility (eye icon)

**Rendered Elements:**

```
├── Balance Hero Card
│   ├── "Your Balance" label
│   ├── Balance display with visibility toggle
│   ├── "Copy Address" button
│   └── "Deposit / Withdraw" buttons
├── Account Stats (3 cards)
│   ├── Total Deposited
│   ├── Total Withdrawn
│   └── Net Balance
├── Recent Activity List
│   ├── Transaction rows
│   ├── Type (Deposit/Withdraw)
│   ├── Amount & date
│   └── Status badge
└── "View All" link to transactions
```

**Data Used:**

- Wallet address (hardcoded or from API)
- Balance (USD value)
- Recent transactions

---

### 2. Deposit (src/pages/user/deposit/Deposit.tsx)

**Purpose:** User deposit form with multiple network support

**State:**

```typescript
const [netId, setNetId] = useState("eth"); // Selected network
const [open, setOpen] = useState(false); // Dropdown open
const [copied, setCopied] = useState(false); // Copy feedback
const [qr, setQr] = useState(false); // Show QR code
```

**Functions:**

- `copy()` - Copy deposit address to clipboard
- `QRCode({ value, color })` - Generates QR SVG visualization

**Networks:**

```typescript
interface Network {
  id: string; // 'eth', 'btc', 'bep20', 'trc20'
  name: string; // "Ethereum (ERC-20)"
  symbol: string; // "ETH / USDT"
  confirmations: number; // Blockchain confirmations needed
  minDeposit: number; // Minimum deposit amount
  address: string; // Deposit address
  color: string; // Brand color for QR
}
```

**Steps Display:**

- Select network
- Copy address
- Send crypto to address
- Wait for confirmations
- Balance credited

**Required API:** GET `/api/deposits/networks`

---

### 3. Withdraw (src/pages/user/withdraw/Withdraw.tsx)

**Purpose:** User withdrawal form with address validation

**State:**

```typescript
const [netId, setNetId] = useState("eth");
const [open, setOpen] = useState(false);
const [amount, setAmount] = useState("");
const [address, setAddress] = useState("");
const [loading, setLoading] = useState(false);
```

**Functions:**

- `handleWithdraw()` - Process withdrawal request
- Network selector logic
- Form validation

**Form Fields:**

- Network dropdown
- Amount input
- Recipient address input
- Fee display
- Submit button (with loading state)

**Required API:** POST `/api/withdrawals/submit`

---

### 4. Transactions (src/pages/user/transactions/Transactions.tsx)

**Purpose:** User transaction history with filtering

**State:**

```typescript
const [search, setSearch] = useState("");
const [type, setType] = useState("all"); // 'all', 'deposit', 'withdrawal'
```

**Functions:**

- `filteredTransactions()` - Filter by search & type
- Transaction rendering with status badges

**Transaction Interface:**

```typescript
interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  currency: string;
  status: "confirmed" | "pending" | "failed";
  date: string;
  hash?: string;
}
```

**Required API:** GET `/api/user/transactions?type=all|deposit|withdrawal`

---

### 5. KYC (src/pages/user/kyc/Kyc.tsx)

**Purpose:** User KYC submission form

**State:**

```typescript
const [level, setLevel] = useState("basic"); // 'basic', 'intermediate', 'advanced'
const [documents, setDocuments] = useState<File[]>([]);
```

**Functions:**

- `handleSubmit()` - Submit KYC application
- `handleFileUpload()` - Handle document upload
- `removeFile(index)` - Remove uploaded file

**KYC Levels:**

- **Basic:** Name, Email, Phone
- **Intermediate:** + ID verification
- **Advanced:** + Address proof, Bank info

**Required API:** POST `/api/kyc/submit` (multipart/form-data)

---

### 6. Settings (src/pages/user/settings/Settings.tsx)

**Purpose:** User account settings

**State:**

```typescript
const [emailNotif, setEmailNotif] = useState(true);
const [pushNotif, setPushNotif] = useState(true);
const [twoFa, setTwoFa] = useState(false);
const [apiKey, setApiKey] = useState("");
```

**Functions:**

- `handleSave()` - Save user preferences
- `handleGenerateApiKey()` - Generate new API key
- `handleChangePassword()` - Trigger password change

**Settings Categories:**

- Notifications (Email, Push)
- Two-Factor Authentication
- API Configuration
- Account Security

**Required API:**

- PUT `/api/user/settings`
- POST `/api/user/api-key/generate`
- POST `/api/user/password/change`

---

## Admin Pages

### 1. Admin Dashboard (src/pages/admin/dashboard/Dashboard.tsx)

**Purpose:** Admin system overview with key metrics

**State:**

```typescript
// No state - all mock data
```

**Functions:**

- Statistics calculation (mocked)
- Navigation to detail pages via Link

**Stat Cards (4):**

```typescript
interface StatCard {
  label: string; // "Total Users"
  value: string; // "1,284"
  change: string; // "+12% this month"
  icon: JSX.Element; // Icon component
  trend: "up" | "down" | "neutral";
}

STATS = [
  { label: "Total Users", value: "1,284", change: "+12%", trend: "up" },
  { label: "Total Volume", value: "$2.47M", change: "+8.2%", trend: "up" },
  {
    label: "Pending Reviews",
    value: "47",
    change: "8 KYC, 39 Tx",
    trend: "neutral",
  },
  {
    label: "Success Rate",
    value: "98.7%",
    change: "All types",
    trend: "neutral",
  },
];
```

**Quick Actions:**

- Link to Users page
- Link to Deposits page
- Link to Withdrawals page
- Link to KYC page

**Recent Transactions Widget:**

- Last 5 transactions
- User, Type, Amount, Status

**Required API:** GET `/api/admin/dashboard/metrics`

---

### 2. Admin Users (src/pages/admin/users/Users.tsx)

**Purpose:** Manage user accounts and KYC status

**State:**

```typescript
const [search, setSearch] = useState("");
const [kycFilter, setKycFilter] = useState("all"); // 'all', 'verified', 'pending', 'rejected'
const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'inactive', 'suspended'
```

**Functions:**

- `filteredUsers()` - Filter by search, KYC, status
- `handleApproveKyc(userId)` - Approve user KYC
- `handleRejectKyc(userId)` - Reject user KYC
- `handleViewDetails(userId)` - Navigate to detail page
- `handleSuspendUser(userId)` - Suspend user account

**User Interface:**

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  kycStatus: "verified" | "pending" | "rejected";
  accountStatus: "active" | "inactive" | "suspended";
  balance: number;
  volume24h: number;
  joinedDate: string;
}
```

**Table Columns:**

- Name & Email
- KYC Status badge
- Account Status badge
- Balance
- 24h Volume
- Joined Date
- Action buttons (Approve/Reject/View/Suspend)

**Required API:**

- GET `/api/admin/users?search=&kycFilter=&statusFilter=`
- POST `/api/admin/users/:id/kyc/approve`
- POST `/api/admin/users/:id/kyc/reject`
- POST `/api/admin/users/:id/suspend`
- GET `/api/admin/users/:id`

---

### 3. Admin Deposits (src/pages/admin/deposits/Deposits.tsx)

**Purpose:** Review and approve user deposits

**State:**

```typescript
const [search, setSearch] = useState("");
const [status, setStatus] = useState("all"); // 'all', 'pending', 'confirmed', 'rejected'
```

**Functions:**

- `filteredDeposits()` - Filter by search & status
- `handleApprove(depositId)` - Approve pending deposit
- `handleReject(depositId)` - Reject pending deposit
- `handleViewDetails(depositId)` - Show full details

**Deposit Interface:**

```typescript
interface Deposit {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  network: string;
  transactionHash: string;
  status: "pending" | "confirmed" | "rejected";
  submittedAt: string;
}
```

**Table Columns:**

- Deposit icon & User name
- Amount & Currency
- Network
- Transaction hash (truncated)
- Status badge
- Submitted date
- Action buttons (Approve/Reject for pending only)

**Stats Bar:**

- Pending deposits count
- Confirmed deposits count
- Total value

**Required API:**

- GET `/api/admin/deposits?status=all|pending|confirmed|rejected&search=`
- POST `/api/admin/deposits/:id/approve`
- POST `/api/admin/deposits/:id/reject`

---

### 4. Admin Withdrawals (src/pages/admin/withdrawals/Withdrawals.tsx)

**Purpose:** Review and approve user withdrawals

**State:**

```typescript
const [search, setSearch] = useState("");
const [status, setStatus] = useState("all"); // 'all', 'pending', 'confirmed', 'rejected'
```

**Functions:**

- `filteredWithdrawals()` - Filter by search & status
- `handleApprove(withdrawalId)` - Approve pending withdrawal
- `handleReject(withdrawalId)` - Reject pending withdrawal
- `handleViewDetails(withdrawalId)` - Show full details

**Withdrawal Interface:**

```typescript
interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  network: string;
  recipientAddress: string;
  status: "pending" | "confirmed" | "rejected";
  submittedAt: string;
}
```

**Table Layout:** Similar to Deposits but with red (danger) icons

**Action Buttons:** Only visible for 'pending' withdrawals

**Required API:**

- GET `/api/admin/withdrawals?status=all|pending|confirmed|rejected&search=`
- POST `/api/admin/withdrawals/:id/approve`
- POST `/api/admin/withdrawals/:id/reject`

---

### 5. Admin Transactions (src/pages/admin/transactions/Transactions.tsx)

**Purpose:** View all system transactions with filtering

**State:**

```typescript
const [type, setType] = useState("all"); // 'all', 'deposits', 'withdrawals'
const [status, setStatus] = useState("all"); // 'all', 'confirmed', 'pending', 'failed'
const [search, setSearch] = useState("");
```

**Functions:**

- `filteredTransactions()` - Filter by type, status, search
- `handleViewDetails(txId)` - Show transaction details

**Transaction Interface:**

```typescript
interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: "deposit" | "withdrawal";
  amount: number;
  currency: string;
  status: "confirmed" | "pending" | "failed";
  date: string;
  hash?: string;
}
```

**Filter Buttons:**

- All Transactions
- Deposits only
- Withdrawals only

**Status Filter Dropdown:**

- All statuses
- Confirmed
- Pending
- Failed

**Stats Display:**

- Total Deposits
- Total Withdrawals
- Total Records

**Required API:**

- GET `/api/admin/transactions?type=all|deposits|withdrawals&status=all|confirmed|pending|failed&search=`

---

### 6. Admin KYC (src/pages/admin/kyc/Kyc.tsx)

**Purpose:** Review and approve KYC submissions

**State:**

```typescript
const [search, setSearch] = useState("");
const [status, setStatus] = useState("all"); // 'all', 'pending', 'approved', 'rejected'
```

**Functions:**

- `filteredRequests()` - Filter by search & status
- `handleApprove(kycId)` - Approve KYC
- `handleReject(kycId)` - Reject KYC
- `handleViewDetails(kycId)` - Show full KYC documents

**KYC Request Interface:**

```typescript
interface KycRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  level: "basic" | "intermediate" | "advanced";
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  documentsVerified: number;
}
```

**KYC Row Display:**

- User name & email
- KYC level badge
- Status badge
- Document count
- Submitted date
- Action buttons

**Status Filter:**

- All statuses
- Pending
- Approved
- Rejected

**Approve/Reject Buttons:** Only visible for 'pending' KYC

**Required API:**

- GET `/api/admin/kyc?status=all|pending|approved|rejected&search=`
- POST `/api/admin/kyc/:id/approve`
- POST `/api/admin/kyc/:id/reject`
- GET `/api/admin/kyc/:id` (for details)

---

### 7. Admin Settings (src/pages/admin/settings/Settings.tsx)

**Purpose:** Configure admin system preferences

**State:**

```typescript
const [emailNotif, setEmailNotif] = useState(true);
const [pushNotif, setPushNotif] = useState(true);
const [maintenanceMode, setMaintenanceMode] = useState(false);
const [saved, setSaved] = useState(false);
```

**Functions:**

- `handleSave()` - Save all settings
- `handleToggle(setting)` - Toggle switches

**Settings Groups:**

**Notifications:**

- Email Notifications (toggle)
- Push Notifications (toggle)

**System:**

- Maintenance Mode (toggle)
- System Status (read-only badge)

**API Configuration:**

- API Rate Limit (input: requests/min)
- Webhook URL (input: URL string)

**Save Button:**

- Triggers save on click
- Shows "✓ Saved successfully" confirmation
- Auto-hides after 2 seconds

**Required API:** PUT `/api/admin/settings`

---

## Components

### 1. Sidebar (src/components/user/Sidebar.tsx)

**Props:**

```typescript
interface Props {
  theme: "dark" | "light";
  onThemeToggle: () => void;
  userName?: string;
  userAvatar?: string;
}
```

**Functions:**

- `handleLogout()` - Clear token and navigate to login

**Features:**

- User profile section with avatar & name
- Navigation links (icon + label)
- Theme toggle (sun/moon icon)
- Logout button

**Navigation Items:**

- Overview (Dashboard)
- Deposit
- Withdraw
- Transactions
- KYC
- Settings

---

### 2. BottomNav (src/components/user/BottomNav.tsx)

**Props:** None (uses useLocation from React Router)

**Functions:**

- `isActive()` - Check if route is current

**Features:**

- Mobile-only bottom navigation bar
- 6 navigation items same as Sidebar
- Icon + label display

---

### 3. Navbar (src/components/user/Navbar.tsx)

**Props:** None (placeholder component)

**Features:**

- Top navigation bar (not heavily used in current layout)

---

### 4. BalanceCard (src/components/user/BalanceCard.tsx)

**Props:**

```typescript
interface Props {
  balance: number;
  visible: boolean;
  onToggle: () => void;
  onCopy: () => void;
  address: string;
}
```

**Functions:**

- `handleToggleVisibility()` - Show/hide balance
- `handleCopyAddress()` - Copy to clipboard

**Features:**

- Balance display with visibility toggle
- Copy address button
- Currency symbol (USD)

---

### 5. MarketSidebar (src/components/user/MarketSidebar.tsx)

**Props:** None

**State:**

```typescript
const ref = useRef<HTMLDivElement>(null);
```

**Functions:**

- `useEffect()` - Inject TradingView widget on mount
- `cleanup()` - Clear widget on unmount

**Features:**

- Embeds TradingView market widget
- Shows live crypto market data
- Desktop only (hidden on mobile)

**Required:**

- External script: `https://widgets.tradingview-widget.com/w/en/tv-market-summary.js`

---

## Context & Services

### AuthContext (src/context/AuthContext.tsx)

**Status:** Empty - Ready for implementation

**Expected Interface:**

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  isAuthenticated: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  kycStatus: "pending" | "verified" | "rejected";
}
```

---

### API Service (src/services/api.ts)

**Status:** Empty - Ready for implementation

**Expected Setup:**

```typescript
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### Admin API Service (src/services/admin.api.ts)

**Status:** Empty - Ready for implementation

**Expected Functions:**

```typescript
export const adminApi = {
  // Dashboard
  getDashboardMetrics(): Promise<DashboardMetrics>,

  // Users
  getUsers(filters: UserFilters): Promise<User[]>,
  approveUserKyc(userId: string): Promise<void>,
  rejectUserKyc(userId: string, reason: string): Promise<void>,
  suspendUser(userId: string): Promise<void>,

  // Deposits
  getDeposits(filters: DepositFilters): Promise<Deposit[]>,
  approveDeposit(depositId: string): Promise<void>,
  rejectDeposit(depositId: string, reason: string): Promise<void>,

  // Withdrawals
  getWithdrawals(filters: WithdrawalFilters): Promise<Withdrawal[]>,
  approveWithdrawal(withdrawalId: string): Promise<void>,
  rejectWithdrawal(withdrawalId: string, reason: string): Promise<void>,

  // Transactions
  getTransactions(filters: TransactionFilters): Promise<Transaction[]>,

  // KYC
  getKycRequests(filters: KycFilters): Promise<KycRequest[]>,
  approveKyc(kycId: string): Promise<void>,
  rejectKyc(kycId: string, reason: string): Promise<void>,
  getKycDetails(kycId: string): Promise<KycDetail>,

  // Settings
  getSettings(): Promise<AdminSettings>,
  updateSettings(settings: AdminSettings): Promise<void>,
};
```

---

### Auth Service (src/services/auth.ts)

**Status:** Empty - Ready for implementation

**Expected Functions:**

```typescript
export const authService = {
  login(email: string, password: string): Promise<{ token: string; user: User }>,
  register(data: RegisterData): Promise<{ token: string; user: User }>,
  logout(): void,
  getCurrentUser(): Promise<User | null>,
  refreshToken(): Promise<string>,
  changePassword(oldPassword: string, newPassword: string): Promise<void>,
  generateApiKey(): Promise<string>,
};
```

---

## Data Types & Interfaces

### Authentication

```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  balance: number;
  walletAddress: string;
  kycStatus: "pending" | "verified" | "rejected";
  accountStatus: "active" | "inactive" | "suspended";
  createdAt: string;
}
```

### Deposits & Withdrawals

```typescript
interface Deposit {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  network: string;
  transactionHash: string;
  status: "pending" | "confirmed" | "rejected";
  submittedAt: string;
  confirmedAt?: string;
  confirmations: number;
  minConfirmations: number;
}

interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  network: string;
  recipientAddress: string;
  status: "pending" | "confirmed" | "rejected";
  submittedAt: string;
  processedAt?: string;
  transactionHash?: string;
}

interface Network {
  id: string;
  name: string;
  symbol: string;
  confirmations: number;
  minDeposit: number;
  address: string;
  color: string;
}
```

### Transactions

```typescript
interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: "deposit" | "withdrawal";
  amount: number;
  currency: string;
  status: "confirmed" | "pending" | "failed";
  date: string;
  hash?: string;
  network?: string;
}
```

### KYC

```typescript
interface KycRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  level: "basic" | "intermediate" | "advanced";
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  documentsVerified: number;
  rejectionReason?: string;
}

interface KycDetail extends KycRequest {
  documents: KycDocument[];
  personalInfo: PersonalInfo;
}

interface KycDocument {
  id: string;
  type: "id" | "address_proof" | "selfie" | "bank_statement";
  url: string;
  verified: boolean;
  rejectionReason?: string;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
```

### Admin

```typescript
interface DashboardMetrics {
  totalUsers: number;
  totalVolume: number;
  pendingReviews: number;
  successRate: number;
  pendingKyc: number;
  pendingTransactions: number;
  recentTransactions: Transaction[];
}

interface AdminSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  maintenanceMode: boolean;
  apiRateLimit: number;
  webhookUrl: string;
}
```

---

## Required API Endpoints

### Authentication

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh
```

### User Account

```
GET    /api/user/profile
PUT    /api/user/profile
POST   /api/user/password/change
POST   /api/user/api-key/generate
GET    /api/user/api-key
DELETE /api/user/api-key/:id
PUT    /api/user/settings
GET    /api/user/settings
```

### Deposits

```
GET    /api/user/deposits
GET    /api/user/deposits/:id
POST   /api/user/deposits/submit
GET    /api/deposits/networks
GET    /api/user/deposits/verify-hash/:hash
```

### Withdrawals

```
GET    /api/user/withdrawals
GET    /api/user/withdrawals/:id
POST   /api/user/withdrawals/submit
POST   /api/user/withdrawals/estimate-fee
```

### Transactions

```
GET    /api/user/transactions
GET    /api/user/transactions/:id
GET    /api/user/transactions/export
```

### KYC

```
GET    /api/user/kyc/status
POST   /api/user/kyc/submit
GET    /api/user/kyc/document/:id
DELETE /api/user/kyc/document/:id
```

### Admin - Dashboard

```
GET    /api/admin/dashboard/metrics
GET    /api/admin/dashboard/recent-transactions
```

### Admin - Users

```
GET    /api/admin/users
GET    /api/admin/users/:id
POST   /api/admin/users/:id/kyc/approve
POST   /api/admin/users/:id/kyc/reject
POST   /api/admin/users/:id/suspend
DELETE /api/admin/users/:id
```

### Admin - Deposits

```
GET    /api/admin/deposits
GET    /api/admin/deposits/:id
POST   /api/admin/deposits/:id/approve
POST   /api/admin/deposits/:id/reject
```

### Admin - Withdrawals

```
GET    /api/admin/withdrawals
GET    /api/admin/withdrawals/:id
POST   /api/admin/withdrawals/:id/approve
POST   /api/admin/withdrawals/:id/reject
```

### Admin - Transactions

```
GET    /api/admin/transactions
GET    /api/admin/transactions/:id
GET    /api/admin/transactions/export
```

### Admin - KYC

```
GET    /api/admin/kyc
GET    /api/admin/kyc/:id
POST   /api/admin/kyc/:id/approve
POST   /api/admin/kyc/:id/reject
GET    /api/admin/kyc/:id/documents
```

### Admin - Settings

```
GET    /api/admin/settings
PUT    /api/admin/settings
POST   /api/admin/settings/maintenance-mode/toggle
```

---

## State Management

### Local Storage

```typescript
{
  'cb_theme': 'dark' | 'light',           // Theme preference
  'token': string,                        // JWT auth token
  'user_id': string,                      // Current user ID
  'user_role': 'user' | 'admin',          // User role
}
```

### React State (Per Component)

**User Pages:**

- Search queries
- Filter selections
- Form inputs (deposit address, amount, etc.)
- UI toggles (visibility, dropdowns, modals)

**Admin Pages:**

- Search queries
- Filter selections (by status, KYC, date range)
- Modal/detail view states
- Confirmation dialogs

**Global:**

- Theme (localStorage + React state)
- Authentication (localStorage token + context)

---

## Authentication Flow

### Login Process

1. User enters email/password on `/user/login`
2. Frontend calls `POST /api/auth/login`
3. Backend returns `{ token, user }`
4. Token stored in localStorage
5. `RequireAuth` guard validates token
6. User redirected to `/user/dashboard`

### Protected Routes

- Routes under `/user/*` and `/admin/*` require valid token
- `RequireAuth` component checks localStorage for token
- If missing, redirects to `/user/login`
- If present, validates with backend on app load

### Logout

- Clear token from localStorage
- Redirect to `/user/login`
- API call: `POST /api/auth/logout`

### Admin Routes

- Requires `user.role === 'admin'`
- Same `RequireAuth` guard (extend with role check)
- Recommend: Check role in backend on route access

---

## Design System

**See:** `src/styles/globals.css`

**CSS Variables:**

```css
--brand-purple: #3b9eff --brand-success: #14c784 --brand-danger: #ff5370
  --brand-warning: #f5a524 --text-primary: #e8e8ee --text-secondary: #a8a8b8
  --text-tertiary: #888896 --bg-base: #0f0f1e --bg-surface: #191928
  --bg-elevated: #252536 --bg-overlay: #2e2e42 --border-default: #3e3e52
  --border-subtle: #2e2e42 --radius-xs: 6px --radius-sm: 8px --radius-md: 12px;
```

**Breakpoints:**

```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

---

## Build & Deployment

**Build Command:**

```bash
npm run build
```

**Dev Server:**

```bash
npm run dev
```

**Output:** `dist/` folder

---

## Next Steps for Backend Development

1. **Set up Express/Node.js server** with authentication middleware
2. **Implement JWT** token generation and validation
3. **Create database schema** for users, deposits, withdrawals, KYC, transactions
4. **Build API endpoints** (see Required API Endpoints section)
5. **Integrate payment processors** (blockchain RPC, exchange APIs)
6. **Set up admin controls** for approval workflows
7. **Create notification system** (email, push notifications)
8. **Add rate limiting** and security measures
9. **Set up logging** and monitoring
10. **Connect KYC verification** service (third-party provider)

---

**Document Version:** 1.0  
**Last Updated:** May 28, 2026  
**Ready for Backend Development:** Yes ✓
