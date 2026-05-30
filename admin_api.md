# Altioda Admin API Documentation

## Overview

The Altioda Admin API provides comprehensive endpoints for administrators to manage users, deposits, withdrawals, KYC submissions, transactions, networks, and system settings. All admin endpoints require **authentication** via a Sanctum token and the user must have the `admin` role.

### Authentication

All admin endpoints require:

- **Bearer Token**: Include the admin's API token in the `Authorization` header
- **Admin Role**: The authenticated user must have `role = 'admin'`
- **CSRF Exemption**: All `/api/*` routes are exempt from CSRF validation

**Header Format:**

```
Authorization: Bearer {admin_token}
```

### Response Format

All responses are in JSON format with the following structure:

**Success Response:**

```json
{
  "data": {...},
  "message": "Operation successful"
}
```

**Error Response:**

```json
{
  "message": "Error message",
  "errors": {
    "field": ["Error details"]
  }
}
```

### Status Codes

- `200 OK` - Successful GET, PUT, or POST operation
- `201 Created` - Resource successfully created
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not an admin
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation failed
- `500 Internal Server Error` - Server error

---

## 1. Dashboard Metrics

### Get Dashboard Metrics

Retrieves key metrics and statistics about the platform.

**Endpoint:** `GET /api/admin/dashboard/metrics`

**Authentication:** Required (Admin)

**Request Parameters:** None

**Response:**

```json
{
  "total_users": 150,
  "total_volume": 5234567.89,
  "pending_withdrawals": 5,
  "pending_kyc": 3,
  "pending_deposits": 2,
  "confirmed_deposits": 45,
  "total_deposits_value": 125000.5,
  "recent_transactions": [
    {
      "id": 1,
      "user_id": 10,
      "type": "deposit",
      "amount": 1000.0,
      "currency": "BTC",
      "status": "confirmed",
      "created_at": "2026-05-28T10:30:00Z",
      "user": {
        "id": 10,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not admin)

**Example Request:**

```bash
curl -X GET http://localhost:8000/api/admin/dashboard/metrics \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** Display admin dashboard with platform overview and recent activity.

---

## 2. User Management

### 2.1 List Users

Retrieve all users with filtering, searching, and pagination.

**Endpoint:** `GET /api/admin/users`

**Authentication:** Required (Admin)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search by name or email |
| `kyc_status` | string | No | Filter by KYC status: `pending`, `approved`, `rejected`, `all` |
| `account_status` | string | No | Filter by account status: `active`, `suspended`, `all` |
| `page` | integer | No | Page number (default: 1) |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "balance": 500.5,
      "wallet_address": "0x123...",
      "kyc_status": "approved",
      "account_status": "active",
      "created_at": "2026-05-20T14:30:00Z"
    }
  ],
  "current_page": 1,
  "per_page": 25,
  "total": 150,
  "last_page": 6
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden

**Example Requests:**

```bash
# Get all users (page 1)
curl -X GET http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer {admin_token}"

# Search users by name/email
curl -X GET "http://localhost:8000/api/admin/users?search=john&kyc_status=approved" \
  -H "Authorization: Bearer {admin_token}"

# Get specific page
curl -X GET "http://localhost:8000/api/admin/users?page=2" \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** Display user list with filters for admin dashboard.

---

### 2.2 Show User Details

Retrieve detailed information about a specific user including KYC, deposits, and withdrawals.

**Endpoint:** `GET /api/admin/users/{id}`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID |

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "balance": 500.5,
  "wallet_address": "0x123...",
  "kyc_status": "approved",
  "account_status": "active",
  "created_at": "2026-05-20T14:30:00Z",
  "kyc": {
    "id": 1,
    "user_id": 1,
    "status": "approved",
    "document_type": "passport",
    "document_number": "ABC123",
    "verified_at": "2026-05-22T10:00:00Z"
  },
  "deposits": [
    {
      "id": 1,
      "amount": 100.0,
      "currency": "BTC",
      "status": "confirmed",
      "created_at": "2026-05-21T12:00:00Z"
    }
  ],
  "withdrawals": [
    {
      "id": 1,
      "amount": 50.0,
      "currency": "BTC",
      "status": "approved",
      "created_at": "2026-05-23T15:30:00Z"
    }
  ]
}
```

**Status Codes:**

- `200` - Success
- `404` - User not found
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X GET http://localhost:8000/api/admin/users/1 \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** View complete user profile and history for verification/investigation.

---

### 2.3 Suspend User

Suspend a user account and revoke all active tokens.

**Endpoint:** `POST /api/admin/users/{id}/suspend`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID |

**Request Body:** None

**Response:**

```json
{
  "message": "User suspended."
}
```

**Status Codes:**

- `200` - Success
- `404` - User not found
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X POST http://localhost:8000/api/admin/users/1/suspend \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json"
```

**Use Case:** Temporarily disable a user account due to suspicious activity or policy violation.

---

### 2.4 Activate User

Reactivate a suspended user account.

**Endpoint:** `POST /api/admin/users/{id}/activate`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID |

**Request Body:** None

**Response:**

```json
{
  "message": "User activated."
}
```

**Status Codes:**

- `200` - Success
- `404` - User not found
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X POST http://localhost:8000/api/admin/users/1/activate \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json"
```

**Use Case:** Re-enable a previously suspended user account.

---

### 2.5 Adjust User Balance

Manually adjust a user's balance (add or subtract funds).

**Endpoint:** `PUT /api/admin/users/{id}/balance`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID |

**Request Body:**

```json
{
  "amount": 100.5,
  "note": "Compensation for transaction fee"
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | numeric | Yes | Amount to add/subtract (positive or negative) |
| `note` | string | No | Reason for adjustment |

**Response:**

```json
{
  "message": "Balance adjusted.",
  "new_balance": 600.5
}
```

**Status Codes:**

- `200` - Success
- `404` - User not found
- `422` - Validation error
- `401` - Unauthorized
- `403` - Forbidden

**Example Requests:**

```bash
# Add funds
curl -X PUT http://localhost:8000/api/admin/users/1/balance \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.50,
    "note": "Compensation for failed transaction"
  }'

# Subtract funds
curl -X PUT http://localhost:8000/api/admin/users/1/balance \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": -50.00,
    "note": "Chargeback resolution"
  }'
```

**Use Case:** Compensate users, resolve disputes, or adjust balances for administrative reasons.

---

## 3. Deposit Management

### 3.1 List Deposits

Retrieve all deposits with filtering, searching, and pagination.

**Endpoint:** `GET /api/admin/deposits`

**Authentication:** Required (Admin)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status: `pending`, `confirmed`, `rejected`, `all` |
| `search` | string | No | Search by transaction hash or user name/email |
| `page` | integer | No | Page number (default: 1) |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 10,
      "network_id": 1,
      "amount": 1000.5,
      "currency": "BTC",
      "transaction_hash": "0xabc123def456...",
      "status": "pending",
      "confirmations": 3,
      "confirmed_at": null,
      "credited_at": null,
      "created_at": "2026-05-28T10:30:00Z",
      "user": {
        "id": 10,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "network": {
        "id": 1,
        "name": "Bitcoin",
        "symbol": "BTC"
      }
    }
  ],
  "current_page": 1,
  "per_page": 25,
  "total": 50
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden

**Example Requests:**

```bash
# Get all pending deposits
curl -X GET "http://localhost:8000/api/admin/deposits?status=pending" \
  -H "Authorization: Bearer {admin_token}"

# Search deposits
curl -X GET "http://localhost:8000/api/admin/deposits?search=john" \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** Monitor pending deposits and manage deposit approvals.

---

### 3.2 Show Deposit Details

Retrieve detailed information about a specific deposit.

**Endpoint:** `GET /api/admin/deposits/{id}`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Deposit ID |

**Response:**

```json
{
  "id": 1,
  "user_id": 10,
  "network_id": 1,
  "amount": 1000.5,
  "currency": "BTC",
  "transaction_hash": "0xabc123def456...",
  "status": "pending",
  "confirmations": 3,
  "confirmed_at": null,
  "credited_at": null,
  "created_at": "2026-05-28T10:30:00Z",
  "user": {
    "id": 10,
    "name": "John Doe",
    "email": "john@example.com",
    "wallet_address": "0x123..."
  },
  "network": {
    "id": 1,
    "name": "Bitcoin",
    "symbol": "BTC",
    "confirmations": 6
  }
}
```

**Status Codes:**

- `200` - Success
- `404` - Deposit not found
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X GET http://localhost:8000/api/admin/deposits/1 \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** Review deposit details before approval or rejection.

---

### 3.3 Approve Deposit

Approve a pending deposit and credit the user's balance.

**Endpoint:** `POST /api/admin/deposits/{id}/approve`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Deposit ID |

**Request Body:** None

**Response:**

```json
{
  "message": "Deposit approved and balance credited."
}
```

**Effects:**

- Deposit status changed to `confirmed`
- User's balance increased by deposit amount
- Transaction record updated to `confirmed`
- `confirmed_at` and `credited_at` timestamps set

**Status Codes:**

- `200` - Success
- `404` - Deposit not found (or not pending)
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X POST http://localhost:8000/api/admin/deposits/1/approve \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json"
```

**Use Case:** Confirm received deposits and credit user accounts.

---

### 3.4 Reject Deposit

Reject a pending deposit.

**Endpoint:** `POST /api/admin/deposits/{id}/reject`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Deposit ID |

**Request Body:**

```json
{
  "reason": "Transaction hash not found on blockchain"
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reason` | string | No | Reason for rejection |

**Response:**

```json
{
  "message": "Deposit rejected."
}
```

**Effects:**

- Deposit status changed to `rejected`
- Transaction record marked as `failed`
- Rejection reason stored

**Status Codes:**

- `200` - Success
- `404` - Deposit not found (or not pending)
- `422` - Validation error
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X POST http://localhost:8000/api/admin/deposits/1/reject \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Invalid transaction hash"
  }'
```

**Use Case:** Reject fraudulent or invalid deposits.

---

## 4. Withdrawal Management

### 4.1 List Withdrawals

Retrieve all withdrawals with filtering, searching, and pagination.

**Endpoint:** `GET /api/admin/withdrawals`

**Authentication:** Required (Admin)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status: `pending`, `approved`, `rejected`, `all` |
| `search` | string | No | Search by recipient address or user name/email |
| `page` | integer | No | Page number (default: 1) |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 10,
      "network_id": 1,
      "amount": 500.0,
      "currency": "BTC",
      "recipient_address": "0xdef789...",
      "status": "pending",
      "approved_by": null,
      "approved_at": null,
      "created_at": "2026-05-28T12:00:00Z",
      "user": {
        "id": 10,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "network": {
        "id": 1,
        "name": "Bitcoin",
        "symbol": "BTC"
      }
    }
  ],
  "current_page": 1,
  "per_page": 25,
  "total": 15
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden

**Example Requests:**

```bash
# Get all pending withdrawals
curl -X GET "http://localhost:8000/api/admin/withdrawals?status=pending" \
  -H "Authorization: Bearer {admin_token}"

# Search withdrawals
curl -X GET "http://localhost:8000/api/admin/withdrawals?search=john" \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** Monitor pending withdrawal requests.

---

### 4.2 Show Withdrawal Details

Retrieve detailed information about a specific withdrawal.

**Endpoint:** `GET /api/admin/withdrawals/{id}`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Withdrawal ID |

**Response:**

```json
{
  "id": 1,
  "user_id": 10,
  "network_id": 1,
  "amount": 500.0,
  "currency": "BTC",
  "recipient_address": "0xdef789...",
  "status": "pending",
  "approved_by": null,
  "approved_at": null,
  "created_at": "2026-05-28T12:00:00Z",
  "user": {
    "id": 10,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "network": {
    "id": 1,
    "name": "Bitcoin",
    "symbol": "BTC"
  },
  "approver": null
}
```

**Status Codes:**

- `200` - Success
- `404` - Withdrawal not found
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X GET http://localhost:8000/api/admin/withdrawals/1 \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** Review withdrawal details before approval/rejection.

---

### 4.3 Approve Withdrawal

Approve a pending withdrawal request.

**Endpoint:** `POST /api/admin/withdrawals/{id}/approve`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Withdrawal ID |

**Request Body:** None

**Response:**

```json
{
  "message": "Withdrawal approved."
}
```

**Effects:**

- Withdrawal status changed to `approved`
- Admin ID stored in `approved_by`
- `approved_at` timestamp set
- Transaction record marked as `confirmed`

**Status Codes:**

- `200` - Success
- `404` - Withdrawal not found (or not pending)
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X POST http://localhost:8000/api/admin/withdrawals/1/approve \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json"
```

**Use Case:** Approve legitimate withdrawal requests.

---

### 4.4 Reject Withdrawal

Reject a pending withdrawal and refund the user's balance.

**Endpoint:** `POST /api/admin/withdrawals/{id}/reject`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Withdrawal ID |

**Request Body:**

```json
{
  "reason": "Invalid recipient address"
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reason` | string | No | Reason for rejection |

**Response:**

```json
{
  "message": "Withdrawal rejected. Balance refunded."
}
```

**Effects:**

- Withdrawal status changed to `rejected`
- User's balance increased by withdrawal amount (refunded)
- Admin ID stored in `approved_by`
- `approved_at` timestamp set
- Transaction record marked as `failed`
- Rejection reason stored

**Status Codes:**

- `200` - Success
- `404` - Withdrawal not found (or not pending)
- `422` - Validation error
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X POST http://localhost:8000/api/admin/withdrawals/1/reject \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Invalid recipient address format"
  }'
```

**Use Case:** Reject fraudulent or invalid withdrawals with automatic refund.

---

## 5. Transaction Management

### 5.1 List Transactions

Retrieve all transactions with filtering and pagination.

**Endpoint:** `GET /api/admin/transactions`

**Authentication:** Required (Admin)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | No | Filter by type: `deposit`, `withdrawal`, `all` |
| `status` | string | No | Filter by status: `pending`, `confirmed`, `failed`, `all` |
| `search` | string | No | Search by hash, currency, or user name/email |
| `page` | integer | No | Page number (default: 1) |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 10,
      "type": "deposit",
      "amount": 1000.5,
      "currency": "BTC",
      "hash": "0xabc123...",
      "status": "confirmed",
      "reference_type": "deposit",
      "reference_id": 1,
      "note": null,
      "created_at": "2026-05-28T10:30:00Z",
      "user": {
        "id": 10,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "current_page": 1,
  "per_page": 25,
  "total": 200
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden

**Example Requests:**

```bash
# Get all transactions
curl -X GET http://localhost:8000/api/admin/transactions \
  -H "Authorization: Bearer {admin_token}"

# Filter by type
curl -X GET "http://localhost:8000/api/admin/transactions?type=deposit&status=confirmed" \
  -H "Authorization: Bearer {admin_token}"

# Search transactions
curl -X GET "http://localhost:8000/api/admin/transactions?search=BTC" \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** View transaction history and audit trail.

---

### 5.2 Show Transaction Details

Retrieve detailed information about a specific transaction.

**Endpoint:** `GET /api/admin/transactions/{id}`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Transaction ID |

**Response:**

```json
{
  "id": 1,
  "user_id": 10,
  "type": "deposit",
  "amount": 1000.5,
  "currency": "BTC",
  "hash": "0xabc123...",
  "status": "confirmed",
  "reference_type": "deposit",
  "reference_id": 1,
  "note": null,
  "created_at": "2026-05-28T10:30:00Z",
  "user": {
    "id": 10,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Status Codes:**

- `200` - Success
- `404` - Transaction not found
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X GET http://localhost:8000/api/admin/transactions/1 \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** View complete transaction details for reconciliation and auditing.

---

## 6. KYC Management

### 6.1 List KYC Submissions

Retrieve all KYC submissions with filtering and pagination.

**Endpoint:** `GET /api/admin/kyc`

**Authentication:** Required (Admin)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status: `pending`, `approved`, `rejected`, `all` |
| `search` | string | No | Search by user name or email |
| `page` | integer | No | Page number (default: 1) |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 10,
      "status": "pending",
      "document_type": "passport",
      "document_number": "ABC123456",
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1990-01-15",
      "country": "US",
      "document_image_url": "https://...",
      "selfie_url": "https://...",
      "reviewed_at": null,
      "reviewed_by": null,
      "rejection_reason": null,
      "created_at": "2026-05-28T08:00:00Z",
      "user": {
        "id": 10,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "current_page": 1,
  "per_page": 25,
  "total": 50
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden

**Example Requests:**

```bash
# Get all pending KYC submissions
curl -X GET "http://localhost:8000/api/admin/kyc?status=pending" \
  -H "Authorization: Bearer {admin_token}"

# Search KYC
curl -X GET "http://localhost:8000/api/admin/kyc?search=john" \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** Manage KYC verification queue.

---

### 6.2 Show KYC Details

Retrieve detailed information about a specific KYC submission.

**Endpoint:** `GET /api/admin/kyc/{id}`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | KYC Submission ID |

**Response:**

```json
{
  "id": 1,
  "user_id": 10,
  "status": "pending",
  "document_type": "passport",
  "document_number": "ABC123456",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-15",
  "country": "US",
  "document_image_url": "https://...",
  "selfie_url": "https://...",
  "reviewed_at": null,
  "reviewed_by": null,
  "rejection_reason": null,
  "created_at": "2026-05-28T08:00:00Z",
  "user": {
    "id": 10,
    "name": "John Doe",
    "email": "john@example.com",
    "kyc_status": "pending"
  }
}
```

**Status Codes:**

- `200` - Success
- `404` - KYC submission not found
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X GET http://localhost:8000/api/admin/kyc/1 \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** Review KYC documents and user information for verification.

---

### 6.3 Approve KYC

Approve a pending KYC submission.

**Endpoint:** `POST /api/admin/kyc/{id}/approve`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | KYC Submission ID |

**Request Body:** None

**Response:**

```json
{
  "message": "KYC approved."
}
```

**Effects:**

- KYC submission status changed to `approved`
- User's `kyc_status` updated to `approved`
- Admin ID stored in `reviewed_by`
- `reviewed_at` timestamp set

**Status Codes:**

- `200` - Success
- `404` - KYC submission not found (or not pending)
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X POST http://localhost:8000/api/admin/kyc/1/approve \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json"
```

**Use Case:** Approve verified user KYC submissions.

---

### 6.4 Reject KYC

Reject a pending KYC submission.

**Endpoint:** `POST /api/admin/kyc/{id}/reject`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | KYC Submission ID |

**Request Body:**

```json
{
  "reason": "Document is not clear enough"
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reason` | string | No | Reason for rejection |

**Response:**

```json
{
  "message": "KYC rejected."
}
```

**Effects:**

- KYC submission status changed to `rejected`
- User's `kyc_status` updated to `rejected`
- Admin ID stored in `reviewed_by`
- `reviewed_at` timestamp set
- Rejection reason stored

**Status Codes:**

- `200` - Success
- `404` - KYC submission not found (or not pending)
- `422` - Validation error
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X POST http://localhost:8000/api/admin/kyc/1/reject \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Document is expired"
  }'
```

**Use Case:** Reject invalid or incomplete KYC submissions.

---

## 7. Settings Management

### 7.1 Get Settings

Retrieve all admin settings.

**Endpoint:** `GET /api/admin/settings`

**Authentication:** Required (Admin)

**Request Parameters:** None

**Response:**

```json
{
  "email_notifications": true,
  "push_notifications": true,
  "maintenance_mode": false,
  "api_rate_limit": 100,
  "webhook_url": "https://example.com/webhook",
  "deposit_wallet_eth": "0x123...",
  "deposit_wallet_btc": "1A1z7agoat..."
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X GET http://localhost:8000/api/admin/settings \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** Retrieve current admin configuration.

---

### 7.2 Update Settings

Update admin settings.

**Endpoint:** `PUT /api/admin/settings`

**Authentication:** Required (Admin)

**Request Body:**

```json
{
  "email_notifications": true,
  "push_notifications": false,
  "maintenance_mode": false,
  "api_rate_limit": 150,
  "webhook_url": "https://example.com/webhook",
  "deposit_wallet_eth": "0x456...",
  "deposit_wallet_btc": "1A1z7agoat..."
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email_notifications` | boolean | No | Enable email notifications |
| `push_notifications` | boolean | No | Enable push notifications |
| `maintenance_mode` | boolean | No | Enable maintenance mode (pauses certain operations) |
| `api_rate_limit` | integer | No | API rate limit (1-10000 requests) |
| `webhook_url` | string | No | Webhook URL for events |
| `deposit_wallet_eth` | string | No | Ethereum deposit wallet address |
| `deposit_wallet_btc` | string | No | Bitcoin deposit wallet address |

**Response:**

```json
{
  "message": "Settings saved.",
  "settings": {
    "email_notifications": true,
    "push_notifications": false,
    "maintenance_mode": false,
    "api_rate_limit": 150,
    "webhook_url": "https://example.com/webhook",
    "deposit_wallet_eth": "0x456...",
    "deposit_wallet_btc": "1A1z7agoat..."
  }
}
```

**Status Codes:**

- `200` - Success
- `422` - Validation error
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X PUT http://localhost:8000/api/admin/settings \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "email_notifications": true,
    "api_rate_limit": 150,
    "deposit_wallet_eth": "0x456..."
  }'
```

**Use Case:** Configure admin preferences and platform settings.

---

## 8. Network Management

### 8.1 List Networks

Retrieve all available networks.

**Endpoint:** `GET /api/admin/networks`

**Authentication:** Required (Admin)

**Request Parameters:** None

**Response:**

```json
[
  {
    "id": 1,
    "name": "Bitcoin",
    "slug": "bitcoin",
    "symbol": "BTC",
    "color": "#F7931A",
    "confirmations": 6,
    "min_deposit": 0.001,
    "fee": 0.0001,
    "deposit_address": "1A1z7agoat...",
    "is_active": true,
    "created_at": "2026-05-20T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Ethereum",
    "slug": "ethereum",
    "symbol": "ETH",
    "color": "#627EEA",
    "confirmations": 12,
    "min_deposit": 0.01,
    "fee": 0.001,
    "deposit_address": "0x123...",
    "is_active": true,
    "created_at": "2026-05-20T00:00:00Z"
  }
]
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X GET http://localhost:8000/api/admin/networks \
  -H "Authorization: Bearer {admin_token}"
```

**Use Case:** View all supported networks.

---

### 8.2 Create Network

Create a new blockchain network.

**Endpoint:** `POST /api/admin/networks`

**Authentication:** Required (Admin)

**Request Body:**

```json
{
  "name": "Litecoin",
  "slug": "litecoin",
  "symbol": "LTC",
  "color": "#345D9D",
  "confirmations": 4,
  "min_deposit": 0.01,
  "fee": 0.00001,
  "deposit_address": "LjrXiTXb5...",
  "is_active": true
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Network name (max 100) |
| `slug` | string | Yes | Unique network slug (must be unique) |
| `symbol` | string | Yes | Cryptocurrency symbol (max 20) |
| `color` | string | Yes | Hex color code (max 10) |
| `confirmations` | integer | Yes | Required block confirmations (min 1) |
| `min_deposit` | numeric | Yes | Minimum deposit amount (min 0) |
| `fee` | numeric | Yes | Network fee (min 0) |
| `deposit_address` | string | Yes | Platform's deposit address |
| `is_active` | boolean | No | Network active status (default: false) |

**Response:**

```json
{
  "id": 3,
  "name": "Litecoin",
  "slug": "litecoin",
  "symbol": "LTC",
  "color": "#345D9D",
  "confirmations": 4,
  "min_deposit": 0.01,
  "fee": 0.00001,
  "deposit_address": "LjrXiTXb5...",
  "is_active": true,
  "created_at": "2026-05-28T14:30:00Z"
}
```

**Status Codes:**

- `201` - Created
- `422` - Validation error (duplicate slug)
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X POST http://localhost:8000/api/admin/networks \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Litecoin",
    "slug": "litecoin",
    "symbol": "LTC",
    "color": "#345D9D",
    "confirmations": 4,
    "min_deposit": 0.01,
    "fee": 0.00001,
    "deposit_address": "LjrXiTXb5...",
    "is_active": true
  }'
```

**Use Case:** Add new blockchain networks to the platform.

---

### 8.3 Update Network

Update an existing network.

**Endpoint:** `PUT /api/admin/networks/{id}`

**Authentication:** Required (Admin)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Network ID |

**Request Body:**

```json
{
  "name": "Litecoin",
  "deposit_address": "LjrXiTXb5...",
  "fee": 0.00002,
  "min_deposit": 0.02,
  "confirmations": 5,
  "is_active": true
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Network name (max 100) |
| `deposit_address` | string | No | Platform's deposit address |
| `fee` | numeric | No | Network fee (min 0) |
| `min_deposit` | numeric | No | Minimum deposit amount (min 0) |
| `confirmations` | integer | No | Required block confirmations (min 1) |
| `is_active` | boolean | No | Network active status |

**Response:**

```json
{
  "message": "Network updated.",
  "network": {
    "id": 3,
    "name": "Litecoin",
    "slug": "litecoin",
    "symbol": "LTC",
    "color": "#345D9D",
    "confirmations": 5,
    "min_deposit": 0.02,
    "fee": 0.00002,
    "deposit_address": "LjrXiTXb5...",
    "is_active": true,
    "created_at": "2026-05-28T14:30:00Z"
  }
}
```

**Status Codes:**

- `200` - Success
- `404` - Network not found
- `422` - Validation error
- `401` - Unauthorized
- `403` - Forbidden

**Example Request:**

```bash
curl -X PUT http://localhost:8000/api/admin/networks/3 \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "fee": 0.00002,
    "min_deposit": 0.02,
    "confirmations": 5
  }'
```

**Use Case:** Adjust network settings (fees, confirmations, addresses).

---

## Error Handling

### Common Error Responses

**Unauthorized (401):**

```json
{
  "message": "Unauthorized"
}
```

**Forbidden (403):**

```json
{
  "message": "This action is unauthorized."
}
```

**Not Found (404):**

```json
{
  "message": "Not Found"
}
```

**Validation Error (422):**

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "amount": ["The amount must be a number."]
  }
}
```

---

## Authentication Flow

### Getting Admin Token

1. Admin user logs in via the standard auth endpoint
2. Receives authentication token with `role = 'admin'`
3. Uses token in `Authorization: Bearer {token}` header for all admin requests

```bash
# Login as admin
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@Altioda.com",
    "password": "secure_password"
  }'

# Response
{
  "token": "3|admin_token_here...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@Altioda.com",
    "role": "admin",
    "balance": 0
  }
}
```

---

## Rate Limiting

- API requests are limited based on `api_rate_limit` setting (default: 100 requests)
- Rate limits can be adjusted via settings endpoint
- Exceeding rate limits returns `429 Too Many Requests`

---

## Pagination

All list endpoints support pagination with the following parameters:

| Parameter  | Type    | Default | Description    |
| ---------- | ------- | ------- | -------------- |
| `page`     | integer | 1       | Page number    |
| `per_page` | integer | 25      | Items per page |

**Pagination Response:**

```json
{
  "data": [...],
  "current_page": 1,
  "per_page": 25,
  "total": 150,
  "last_page": 6
}
```

---

## Best Practices

1. **Always validate input** - Check for valid data before submission
2. **Use proper HTTP methods** - GET for retrieval, POST for actions, PUT for updates
3. **Handle errors gracefully** - Check status codes and error messages
4. **Log all actions** - Track who approved/rejected what and when
5. **Secure tokens** - Keep admin tokens secure and rotate regularly
6. **Audit trail** - Maintain records of all admin actions
7. **Double-check operations** - Verify details before approving/rejecting
8. **Use filtering** - Filter results to find specific items faster

---

## Quick Reference

| Action             | Endpoint                              | Method |
| ------------------ | ------------------------------------- | ------ |
| Get Dashboard      | `/api/admin/dashboard/metrics`        | GET    |
| List Users         | `/api/admin/users`                    | GET    |
| List Deposits      | `/api/admin/deposits`                 | GET    |
| Approve Deposit    | `/api/admin/deposits/{id}/approve`    | POST   |
| Reject Deposit     | `/api/admin/deposits/{id}/reject`     | POST   |
| List Withdrawals   | `/api/admin/withdrawals`              | GET    |
| Approve Withdrawal | `/api/admin/withdrawals/{id}/approve` | POST   |
| Reject Withdrawal  | `/api/admin/withdrawals/{id}/reject`  | POST   |
| List Transactions  | `/api/admin/transactions`             | GET    |
| List KYC           | `/api/admin/kyc`                      | GET    |
| Approve KYC        | `/api/admin/kyc/{id}/approve`         | POST   |
| Reject KYC         | `/api/admin/kyc/{id}/reject`          | POST   |
| Get Settings       | `/api/admin/settings`                 | GET    |
| Update Settings    | `/api/admin/settings`                 | PUT    |
| List Networks      | `/api/admin/networks`                 | GET    |
| Create Network     | `/api/admin/networks`                 | POST   |
| Update Network     | `/api/admin/networks/{id}`            | PUT    |

---

**Last Updated:** May 28, 2026  
**Version:** 1.0
