# Admin Dashboard: Token Packages & Subscriptions

This document is for **admin dashboard** developers. It describes how to manage **one-off token packages** (Purchase tab) and **subscription plans** (Subscribe tab) so the mobile app can offer them to users.

---

## 1. Overview

- **Base URL:** `{API_BASE}` (e.g. `https://api.koko.com` or your backend URL)
- **Auth:** All endpoints below require a logged-in user with role **admin** and permission **`manageTokenPackages`**. Send: `Authorization: Bearer <access_token>` (or `x-auth-token`).
- **Response envelope:** Success responses use:
  ```json
  { "code": 200, "message": "...", "data": { ... } }
  ```
  Errors use the same structure with `code` (e.g. 400, 404) and `message`.

**Behaviour:**

- **One data model** is used for both one-off packages and subscription plans. You set **type** and related fields when creating/editing.
- **No active/inactive.** If a package exists in the database, it is shown to users. There is no “deactivate” or “activate”.
- **Delete is permanent.** When you delete a package, it is **removed from the server** (hard delete). It will no longer appear in the app. The `package_id` can be used again when creating a new package.

---

## 2. Data model: Token Package

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `package_id` | string | Yes | Unique ID (e.g. `pkg_10`, `plan_monthly_10`). Used by the app when the user taps Buy / Subscribe. |
| `name` | string | Yes | Display name (e.g. "10 Tokens", "10 Tokens Monthly"). |
| `type` | string | Yes | `one_time` = Purchase tab. `subscription` = Subscribe tab. |
| `token_count` | number | One-off: yes (≥1). Subscription: optional (null if unlimited). | Tokens per pack or per billing period. |
| `price` | number | Yes | Price (e.g. 2.49). |
| `currency` | string | No | Default `GBP`. |
| `sort_order` | number | No | Default `0`. Lower = listed first in the app. |
| `duration_days` | number | No | For subscription: period length in days (e.g. 30, 365). |
| `billing_interval` | string | For subscription | `monthly` or `annual`. |
| `unlimited_tokens` | boolean | No | For subscription only. Default `false`. `true` = unlimited tokens per period. |

**Rules:**

- **One-off (Purchase):** `type: "one_time"`, `token_count` ≥ 1. Do not set `billing_interval` or `unlimited_tokens`.
- **Subscription (limited):** `type: "subscription"`, `billing_interval`: `"monthly"` or `"annual"`, `token_count` ≥ 1, `unlimited_tokens: false`.
- **Subscription (unlimited):** `type: "subscription"`, `billing_interval`, `unlimited_tokens: true`. `token_count` can be null or 0.

---

## 3. API endpoints

### 3.1 List all token packages

Use this to show the full list in the admin dashboard (both one-off and subscription).

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/token-packages` | `manageTokenPackages` |

**Response (200):**
```json
{
  "code": 200,
  "message": "Token packages retrieved successfully",
  "data": {
    "packages": [
      {
        "_id": "...",
        "package_id": "pkg_10",
        "name": "10 Tokens",
        "type": "one_time",
        "token_count": 10,
        "price": 2.49,
        "currency": "GBP",
        "sort_order": 1,
        "duration_days": null,
        "billing_interval": null,
        "unlimited_tokens": false,
        "createdAt": "...",
        "updatedAt": "..."
      },
      {
        "_id": "...",
        "package_id": "plan_unlimited_annual",
        "name": "Unlimited Annual",
        "type": "subscription",
        "token_count": null,
        "price": 12.49,
        "currency": "GBP",
        "sort_order": 2,
        "duration_days": 365,
        "billing_interval": "annual",
        "unlimited_tokens": true,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

**UI:** Split the list into two sections (or tabs): **One-off packages (Purchase)** (`type === 'one_time'`) and **Subscription plans (Subscribe)** (`type === 'subscription'`).

---

### 3.2 Create a token package

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/token-packages` | `manageTokenPackages` |

**Request body (JSON):**

**One-off package:**
```json
{
  "package_id": "pkg_10",
  "name": "10 Tokens",
  "type": "one_time",
  "token_count": 10,
  "price": 2.49,
  "currency": "GBP",
  "sort_order": 1
}
```

**Subscription plan (limited tokens):**
```json
{
  "package_id": "plan_monthly_10",
  "name": "10 Tokens Monthly",
  "type": "subscription",
  "token_count": 10,
  "price": 2.49,
  "currency": "GBP",
  "sort_order": 1,
  "billing_interval": "monthly",
  "unlimited_tokens": false,
  "duration_days": 30
}
```

**Subscription plan (unlimited):**
```json
{
  "package_id": "plan_unlimited_annual",
  "name": "Unlimited Annual",
  "type": "subscription",
  "token_count": null,
  "price": 12.49,
  "currency": "GBP",
  "sort_order": 2,
  "billing_interval": "annual",
  "unlimited_tokens": true,
  "duration_days": 365
}
```

**Response (201):**
```json
{
  "code": 201,
  "message": "Token package created successfully",
  "data": {
    "package": { ... }
  }
}
```

**Errors:** `400` if `package_id` already exists or validation fails.

---

### 3.3 Get a single token package

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/token-packages/:id` | `manageTokenPackages` |

`id` = MongoDB `_id` of the package.

**Response (200):** `data.package` = the full package object.

**Errors:** `404` if not found.

---

### 3.4 Update a token package

| Method | Path | Auth |
|--------|------|------|
| PATCH | `/api/token-packages/:id` | `manageTokenPackages` |

`id` = MongoDB `_id`. Send only the fields you want to change (e.g. `name`, `price`, `sort_order`, `token_count`).

**Response (200):** `data.package` = updated package.

**Errors:** `404` if not found; `400` if e.g. changing `package_id` to one that already exists.

---

### 3.5 Delete a token package (permanent)

| Method | Path | Auth |
|--------|------|------|
| DELETE | `/api/token-packages/:id` | `manageTokenPackages` |

**The package is removed from the database.** It will no longer appear in the mobile app’s Purchase or Subscribe lists. This cannot be undone.

**Response (200):**
```json
{
  "code": 200,
  "message": "Token package deleted successfully",
  "data": {}
}
```

**Errors:** `404` if not found.

**UI:** Show a confirmation dialog before calling DELETE (e.g. “Delete this package? This cannot be undone.”).

---

## 4. Suggested admin screens

### 4.1 Token packages list

1. Call **GET /api/admin/token-packages**.
2. Split into:
   - **One-off (Purchase):** `type === 'one_time'`
   - **Subscription plans (Subscribe):** `type === 'subscription'`
3. Display: name, type, price, currency, token count (or “Unlimited”), billing interval (for plans), sort order.
4. Actions: **Edit** (navigate to edit form), **Delete** (confirm then **DELETE /api/token-packages/:id**).

### 4.2 Create package

- **One-off:** Form fields: `package_id`, `name`, `token_count`, `price`, `currency`, `sort_order`. Submit → **POST /api/token-packages**.
- **Subscription:** Form fields: `package_id`, `name`, `billing_interval` (monthly/annual), `token_count` or “Unlimited” (`unlimited_tokens`), `price`, `currency`, `duration_days` (optional), `sort_order`. Submit → **POST /api/token-packages**.

### 4.3 Edit package

- Load package with **GET /api/token-packages/:id**.
- Same fields as create. Submit → **PATCH /api/token-packages/:id** with only changed fields.

---

## 5. Quick reference

| Action | Method | Path |
|--------|--------|------|
| List all | GET | `/api/admin/token-packages` |
| Create | POST | `/api/token-packages` |
| Get one | GET | `/api/token-packages/:id` |
| Update | PATCH | `/api/token-packages/:id` |
| Delete (permanent) | DELETE | `/api/token-packages/:id` |

All require **admin** user with permission **`manageTokenPackages`**.
