# Backend Architecture Plan for Tamara Jewelries

## Recommendation: Use NestJS

For this project, I recommend **NestJS** rather than a plain Node.js + Express setup.

### Why NestJS fits better

- It gives you a clear structure for a real production backend.
- It supports modules, controllers, services, guards, DTOs, validation, anad dependency injection out of the box.
- It scales better when you add authentication, admin roles, orders, payment plans, KYC, notifications, and inventory.
- It is still Node.js underneath, so you are not leaving the Node ecosystem.

### When plain Node.js is enough

Use plain Node.js with Express or Fastify only if:

- the backend will stay very small,
- you want the fastest possible prototype,
- you do not care much about structure or long-term maintainability.

For this project, the frontend already suggests multiple business flows, so NestJS is the safer choice.

---

## Product Goal

Build a backend for a gold/jewelry store with:

- product browsing
- product details
- authentication and account creation
- customer dashboard
- KYC submission
- payment plan management
- order tracking
- transaction receipt generation and audit trail
- refund policy support
- WhatsApp-assisted payment checkout
- admin management for products, plans, users, and orders

---

## Suggested Tech Stack

### Core backend

- **NestJS** for the application framework
- **TypeScript** for safety and maintainability
- **PostgreSQL** for relational data
- **Prisma** as the ORM
- **JWT** for access tokens
- **bcrypt** for password hashing
- **class-validator** and **class-transformer** for request validation
- **Swagger/OpenAPI** for API docs
- **Cloudinary or S3** for file uploads like KYC documents and product images

### Optional but useful

- **Redis** for caching sessions, rate limiting, and background jobs
- **BullMQ** for queues and async tasks

- **Nodemailer** or a transactional email service for email verification and notifications
- **WhatsApp Business API** or a WhatsApp click-to-chat flow for payment initiation and order confirmation

---

## Backend Responsibilities

The backend should own all business logic. The frontend should only display data and send user actions.

### The backend should handle

- user (admins & customers) registration and login
- password hashing and token issuance
- role-based access control
- product CRUD
- category and collection management
- payment plan CRUD
- contribution group creation and lifecycle (start date, rotation rank, payout queue)
- order creation and status tracking
- transaction receipt issuance (orders, installment payments, contribution payments, contribution payouts)
- KYC submission and approval
- refund requests
- dashboard statistics
- notifications and audit logs

### The frontend should not handle

- direct database access
- secret keys
- payment logic
- role checks
- business rules for plan eligibility

---

## Main Modules

### 1. Authentication Module

Handles:

- sign up
- login
- logout
- refresh token flow
- password reset
- email verification

Endpoints:

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`

### 2. Users Module

Handles customer profiles, role management, and account settings.

Endpoints:

- `GET /users/me`
- `PATCH /users/me`
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id/role`

### 3. Products Module

Manages jewelry products.

Fields may include:

- name
- description
- price
- category
- weight
- karat
- image URLs
- available payment plans
- featured flag
- stock status

Endpoints:

- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PATCH /products/:id`
- `DELETE /products/:id`

### 4. Categories/Collections Module

Manages product groupings such as rings, necklaces, bracelets, earrings.

Endpoints:

- `GET /categories`
- `POST /categories`
- `PATCH /categories/:id`
- `DELETE /categories/:id`

### 5. Payment Plans Module

Handles installment and thrift plan offerings.

Fields may include:

- name
- monthly contribution
- total amount
- duration
- member limit
- active status
- eligibility rules

Endpoints:

- `GET /plans`
- `GET /plans/:id`
- `POST /plans`
- `PATCH /plans/:id`
- `DELETE /plans/:id`

### 5b. Contribution Groups Module

Handles the rotating community contribution model.

Business rules:

- each group has a start date, monthly contribution amount, duration, and member cap
- members have a payout rank (1..n)
- payout is manual-confirmation by admin
- if any required contribution is overdue, rotation pauses until catch-up
- cycle can restart when all members have received payout

Endpoints:

- `GET /contributions/groups`
- `POST /contributions/groups`
- `PATCH /contributions/groups/:id`
- `PATCH /contributions/groups/:id/start-date`
- `POST /contributions/groups/:id/members`
- `DELETE /contributions/groups/:id/members/:userId`
- `PATCH /contributions/groups/:id/members/:userId/rank`
- `POST /contributions/groups/:id/payments/:paymentNumber/approve`
- `POST /contributions/groups/:id/payout/confirm`
- `POST /contributions/groups/:id/restart-cycle`

### 6. Orders Module

Tracks customer purchases.

For this project, the payment experience should be WhatsApp-first:

- a customer places an order on the website
- the backend creates a pending order record
- the frontend redirects the customer to WhatsApp with the order summary
- the customer completes payment through the WhatsApp conversation or shared payment instructions
- an admin confirms the payment and updates the order status

Possible statuses:

- pending
- awaiting_whatsapp_payment
- awaiting_confirmation
- processing
- paid
- shipped
- completed
- cancelled

Endpoints:

- `GET /orders`
- `GET /orders/:id`
- `POST /orders`
- `PATCH /orders/:id/status`
- `PATCH /orders/:id/cancel`

Admin requirements for this module:

- admin must be able to update order status directly
- order status updates must be audited (who changed it and when)
- order status and payment status updates must be separate but linked

Suggested helper endpoints:

- `POST /orders/:id/whatsapp-link`
- `POST /orders/:id/payment-proof`
- `POST /orders/:id/receipt`
- `GET /orders/:id/receipts`

### 6b. Installment Transactions

Installment approvals should be handled as transaction records, not only as order metadata.

Endpoints:

- `GET /installments`
- `GET /installments/:id`
- `POST /installments/:id/payments/:paymentNumber/initiate`
- `POST /installments/:id/payments/:paymentNumber/approve`
- `POST /installments/:id/payments/:paymentNumber/reject`
- `POST /installments/:id/payments/:paymentNumber/receipt`

### 7. KYC Module

Handles customer identity verification.

Fields may include:

- full name
- date of birth
- phone number
- address
- document type
- document upload URL
- verification status

Endpoints:

- `POST /kyc`
- `GET /kyc/me`
- `GET /kyc`
- `PATCH /kyc/:id/approve`
- `PATCH /kyc/:id/reject`

### 8. Refunds Module

Handles refund requests and policy tracking.

Endpoints:

- `POST /refunds`
- `GET /refunds/me`
- `GET /refunds`
- `PATCH /refunds/:id/status`

### 9. Dashboard Module

Provides summarized metrics for customers and admins.

Examples:

- total orders
- pending orders
- active plans
- total committed amount
- recent activity
- account verification status

Endpoints:

- `GET /dashboard/me`
- `GET /dashboard/admin`

### 10. Notifications Module

Optional, but recommended.

Handles:

- order confirmations
- payment reminders
- KYC approval updates
- refund status updates
- password reset emails
- WhatsApp order and payment reminders

### 11. Transactions & Receipts Module

Provides a single source of truth for all monetary events.

Covers:

- order payments
- installment payment approvals
- contribution payment approvals
- contribution payout confirmations

Endpoints:

- `GET /transactions`
- `GET /transactions/:id`
- `GET /receipts`
- `GET /receipts/:id`
- `POST /receipts/generate`
- `GET /receipts/:id/pdf`

---

## Data Model

These models describe the expected data shapes for users, products, orders and receipts. Use them as a reference when designing Prisma schema or DTOs.

### User (AdminUser)

- id: number
- fullName: string
- email: string
- phone: string
- role: "customer" | "admin" | "super_admin"
- isEmailVerified: boolean
- isKycVerified: boolean
- isSuspended: boolean
- kycDocType?: string
- kycDocNumber?: string
- kycDocUrl?: string
- createdAt: string (ISO)
- updatedAt: string (ISO)

### Product (AdminProduct)

- id: number
- name: string
- slug: string
- description: string
- price: number (minor currency unit / integer)
- categoryId: number
- category?: string
- weight: string
- karat: string
- image?: string
- imageUrl: string
- plans?: string[] (e.g. ["Full","Installment","Thrift"])
- installmentDurations?: Array<3 | 6>
- isFeatured: boolean
- isActive: boolean
- createdAt: string (ISO)
- updatedAt: string (ISO)

### Category

- id: number
- name: string
- slug?: string
- createdAt: string
- updatedAt: string

### PaymentPlan (concept / listing)

- id: number
- name: string
- description?: string
- monthlyAmount?: number
- durationMonths?: number
- totalAmount?: number
- maxMembers?: number
- currentMembers?: number
- isActive?: boolean

### Installment (AdminInstallment)

- id: number
- orderId: string (order-level identifier like "ORD-005")
- customerId: number
- customerName: string
- customerEmail: string
- productName: string
- totalAmount: number
- installmentPlan: 3 | 6
- amountPerPayment: number
- totalPaid: number
- remainingBalance: number
- payments: InstallmentPayment[]
- createdAt: string
- updatedAt: string

InstallmentPayment:

- paymentNumber: number
- dueDate: string
- amountDue: number
- amountPaid: number
- status: "pending" | "processing" | "paid" | "overdue"
- paidDate?: string

### ContributionGroup (AdminContributionGroup)

- id: number
- name: string
- description?: string
- targetAmount: number
- contributionPerMonth: number
- durationMonths: number
- startDate: string
- currentAmount: number
- maxMembers: number
- members: UserContributionProfile[]
- status: "active" | "completed" | "closed"
- rotationStatus: "active" | "paused" | "completed"
- currentRecipientUserId?: number
- currentRecipientRank: number
- pausedMemberId?: number
- cycleNumber: number
- repeatsEnabled: boolean
- createdAt: string
- updatedAt: string

UserContributionProfile:

- userId: number
- userName: string
- userEmail: string
- groupId: number
- rank: number
- totalContributed: number
- targetAmount: number
- percentageComplete: number
- payments: ContributionPayment[]
- status: "active" | "completed" | "suspended"
- payoutStatus: "waiting" | "current" | "received"
- payoutReceivedAt?: string
- joinedDate: string
- updatedDate: string

ContributionPayment:

- paymentNumber: number
- dueDate: string
- amountDue: number
- amountPaid: number
- status: "pending" | "processing" | "paid" | "overdue"
- paidDate?: string

### Order (AdminOrder)

Aligns with the app's WhatsApp-first flow and stores both order metadata and a human-friendly order identifier.

- id: number
- orderId: string (human-friendly id like "ORD-001")
- customerId: number
- customerName: string
- customerEmail: string
- productId: number
- productName: string
- quantity: number
- totalPrice: number
- status: "pending" | "awaiting_whatsapp" | "confirmed" | "shipped" | "completed" | "cancelled"
- paymentStatus: "pending" | "confirmed" | "refunded"
- whatsappMessageSent: boolean
- createdAt: string
- updatedAt: string

Note: The code treats order status and paymentStatus as separate fields and uses `whatsappMessageSent` to track if the handoff occurred.

### TransactionReceipt

- id: number
- receiptNumber: string
- kind: "order" | "installment_payment" | "contribution_payment" | "contribution_payout"
- transactionRef: string
- customerId: number
- customerName: string
- customerEmail: string
- amount: number
- status: string
- issuedAt: string
- issuedBy: string
- notes?: string

### KYCRecord

Based on KYC-related fields stored on the user in the mock data.

- id: number
- userId: number
- fullName?: string
- dob?: string
- address?: string
- documentType?: string
- documentUrl?: string
- status?: string
- reviewedBy?: number
- reviewedAt?: string

### RefundRequest

- id: number
- userId: number
- orderId: string
- reason: string
- status: string
- createdAt: string
- resolvedAt?: string

### Notification

- id: number
- userId?: number
- title: string
- message: string
- isRead: boolean
- createdAt: string

---

## Role Structure

### Customer

Can:

- register and log in
- browse products
- view plans
- place orders
- submit KYC
- request refunds
- view own dashboard

### Admin

Can:

- manage products
- register and log in
- manage categories
- manage payment plans
- manage contribution groups and member rotation ranks
- view all users
- approve/reject KYC
- process refunds
- update order statuses
- generate receipts for all confirmed transactions
- view business analytics

### Super Admin

Optional role for full system control, including admin management.

---

## API Security

Use these controls from day one:

- hashed passwords with bcrypt
- JWT access tokens
- refresh tokens stored securely
- role guards for admin-only routes
- audit log guard/interceptor for status and financial actions
- validation pipes for every request body and query
- rate limiting on login and password reset routes
- file upload limits for KYC documents
- CORS configured for the frontend domain only
- environment variables for secrets

---

## Suggested Folder Structure

```txt
src/
  app.module.ts
  main.ts
  config/
  common/
    guards/
    decorators/
    filters/
    interceptors/
    pipes/
  modules/
    auth/
    users/
    products/
    categories/
    plans/
    orders/
    kyc/
    refunds/
    dashboard/
    notifications/
    uploads/
```

This structure keeps each business area isolated and easier to test.

---

## Frontend Integration Map

Your current frontend routes can connect to the backend like this:

- `/login` -> `POST /auth/login`
- `/signup` -> `POST /auth/signup`
- `/shop` -> `GET /products`
- `/product/:id` -> `GET /products/:id`
- `/plans` -> `GET /plans`
- `/contributions` -> `GET /contributions/groups` (member-scoped view)
- `/dashboard` -> `GET /dashboard/me`
- `/kyc` -> `POST /kyc` and `GET /kyc/me`
- `/refunds` -> `POST /refunds` and `GET /refunds/me`
- checkout -> create order, generate WhatsApp link, then confirm payment through WhatsApp
- admin order modal -> `PATCH /orders/:id/status`
- admin receipt action -> `POST /receipts/generate`

---

## Build Phases

### Phase 1: Foundation

- initialize NestJS project
- configure environment variables
- connect PostgreSQL
- set up Prisma
- create auth module
- create user model

### Phase 2: Core Commerce

- create product and category modules
- create payment plan module
- create contribution groups module
- build public listing endpoints
- seed initial product data

### Phase 3: Customer Operations

- orders module
- dashboard module
- KYC module
- refund module

### Phase 4: Admin Tools

- admin-only endpoints
- status management
- receipt issuance endpoints
- analytics summary
- audit logs

### Phase 5: Hardening

- validation
- error handling
- rate limiting
- file upload protection
- API documentation
- tests

---

## Deployment Plan

### Recommended deployment stack

- backend: Render, Railway, Fly.io, or AWS
- database: managed PostgreSQL
- file storage: S3 or Cloudinary
- frontend: Vercel, Netlify, or similar

### Operational needs

- environment variables
- database migrations
- backups
- logging
- monitoring
- health checks

---

## Testing Plan

You should add:

- unit tests for services
- integration tests for controllers
- auth tests
- permission tests
- request validation tests
- payment flow tests
- KYC submission tests

---

## Final Recommendation

If your goal is to build a real backend that can grow with this storefront, choose **NestJS**.

If your goal is to make something tiny and fast with minimal structure, choose **Express/Fastify on Node.js**.

For this project, the better long-term choice is **NestJS + PostgreSQL + Prisma**.

## Next Step

If you want, the next thing I can do is turn this document into an actual backend starter structure with:

- NestJS project files
- Prisma schema
- auth module
- product module
- sample API endpoints
- env configuration
