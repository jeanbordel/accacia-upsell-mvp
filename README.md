# ACCACIA Upsell MVP — Production-Ready

**QR-driven hotel upsell platform** for Bacolux Hotels pilot: scan displays → offer landing → pay (Stripe/Netopia) → order tracking + KPI analytics.

## 🎯 Features

### Core Flow
- **QR Scan → Offer Landing**: Guests scan QR codes placed in hotel areas (lobby, elevator, room)
- **Per-Hotel Payment Providers**: Each hotel connects their own Stripe/Netopia/PayU account
- **Order Lifecycle**: NEW → PAID/FAILED → FULFILLED with webhook idempotency
- **Event Tracking**: QR_SCAN, PAGE_VIEW, PAYMENT_SUCCESS, PAYMENT_FAILED

### Payment Architecture (NEW - Feb 2026)
- **ACCACIA does NOT handle money**: Hotels connect their own payment providers
- **Multi-Provider Support**: Stripe, Netopia, PayU (coming soon)
- **Admin Configuration**: `/admin/payments` UI for payment setup
- **Provider Options**: Cards, Apple Pay, Google Pay (provider-dependent)
- **See:** [Payment Architecture Migration Guide](../../docs/PAYMENT_ARCHITECTURE_MIGRATION.md)

### Business Intelligence
- **KPI Dashboard** (`/admin/kpi`):
  - Conversion funnel: scans → views → orders → revenue
  - Performance by QR code location
  - Performance by offer
  - Daily revenue breakdown
- **CSV Exports**: Orders and KPIs for external analysis

### Operational
- **Fulfillment Notifications**: Email/WhatsApp hooks on paid orders (stub ready for integration)
- **Admin Panel**: Orders, offers, payments, KPIs with password gate
- **Structured Logging**: JSON logs in production, pretty-print in dev
- **Health Check**: `/api/health` for monitoring
- **Error Handling**: Graceful failures with user-friendly messages

---

## 📚 Documentation

- **[Payment Architecture Migration Guide](../../docs/PAYMENT_ARCHITECTURE_MIGRATION.md)** - Complete migration details
- **[Quick Reference](../../docs/QUICK_REFERENCE.md)** - Commands, API endpoints, troubleshooting

---

## 🛠 Tech Stack

- **Framework**: Next.js 16.1.6 (App Router) + TypeScript
- **Database**: Prisma 6.19.2 + PostgreSQL 16
- **Payments**: Stripe SDK + Netopia Hosted Payment + PayU (coming soon)
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel-ready (no Node.js-specific APIs)

---

## 🚀 Quick Start

### Prerequisites
- Node.js **>= 20**
- Docker + Docker Compose
- npm

### 1. Clone & Install
```bash
cd apps/web
npm install
```

### 2. Start Database
```bash
# From repo root
docker compose -f infra/docker/docker-compose.yml up -d
```

### 3. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your values (see Configuration section below)
```

### 4. Database Migration
```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Seed Data (Optional)
```bash
node prisma/seed.js
```

Creates:
- Hotel: Bacolux
- Screen: Lobby (QR slug: `bacolux-lobby`)
- Offer: Spa & Wellness Upgrade (150 RON)

### 6. Start Development Server
```bash
npm run dev
# Or: bash start-dev.sh
```

Visit: **http://localhost:3001**

---

## ⚙️ Configuration

### Required Environment Variables

Create `.env.local` in `apps/web/` (see `.env.example` for template):

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/accacia_upsell?schema=public"

# Application
APP_URL="http://localhost:3001"

# Admin Panel
ADMIN_PASSWORD="your-secure-password"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Netopia (Romanian Payment Provider)
NETOPIA_SIGNATURE="39LG-KNE8-7JOC-EJRO-P02Q"
NETOPIA_TEST_MODE="true"
NETOPIA_PRIVATE_KEY_PEM=""  # TODO: Add real key
NETOPIA_PUBLIC_KEY_PEM=""   # TODO: Add real key

# Notifications (Optional)
NOTIFICATION_EMAIL="hotel@example.com"
WHATSAPP_WEBHOOK_URL=""
WHATSAPP_NOTIFICATION_PHONE=""
```

### Database Port
PostgreSQL runs on **port 5433** (not default 5432) to avoid conflicts.

---

## 📍 Routes & Endpoints

### Guest-Facing
| Route | Purpose |
|-------|---------|
| `GET /` | Home page with demo link |
| `GET /api/qr?s=<screenSlug>` | QR scan handler → redirects to offer |
| `GET /o/[slug]?s=<screenSlug>` | Offer landing page |
| `POST /api/checkout` | Create Stripe Checkout Session |
| `POST /api/netopia/create` | Create Netopia payment form |
| `GET /o/success` | Payment confirmation page |

### Admin Panel
| Route | Purpose |
|-------|---------|
| `GET /admin-login` | Login page (password gate) |
| `GET /admin/kpi` | KPI dashboard with metrics |
| `GET /admin/orders` | Orders list (last 50) |
| `GET /admin/offers` | Offers management |
| `GET /api/admin/export/orders` | CSV export of orders |
| `GET /api/admin/export/kpi` | CSV export of KPIs |

### Webhooks
| Route | Purpose |
|-------|---------|
| `POST /api/webhooks/stripe` | Stripe webhook handler (idempotent) |
| `POST /api/webhooks/netopia` | Netopia IPN handler (idempotent) |

### Operations
| Route | Purpose |
|-------|---------|
| `GET /api/health` | Health check (database connectivity) |

---

## 🏗 Architecture Decisions

### Idempotent Webhooks
Both Stripe and Netopia webhook handlers check if an order is already in the target state (PAID/FAILED) before updating. This prevents double-processing if webhooks are delivered multiple times.

**Implementation**:
- `Order.providerRef` has unique constraint
- State check before DB updates
- Structured logging for audit trail

### Structured Logging
All critical operations (payments, webhooks, QR scans) use the logger utility:
- **Development**: Pretty-printed with emojis
- **Production**: JSON format for log aggregation

**Usage**:
```typescript
import { logger } from "@/lib/logger";

logger.payment("Stripe checkout completed", { orderId, amount });
logger.error("Payment failed", error);
```

### Fulfillment Notifications
When an order is marked PAID, the system triggers notification hooks:
- Email notification (stub ready for SendGrid/Resend)
- WhatsApp notification (stub ready for Twilio/WhatsApp API)

**Integration**:
- Edit `src/lib/notifications.ts`
- Replace stub functions with real API calls
- Set `NOTIFICATION_EMAIL` and/or `WHATSAPP_*` env vars

---

## 📊 Database Schema

### Core Models
- **Hotel**: Properties in the system
- **Screen**: Physical QR code locations (lobby, elevator, rooms)
- **Offer**: Upsell products with pricing and fulfillment notes
- **Order**: Payment transactions with lifecycle tracking
- **Event**: Analytics events for funnel analysis

### Order Lifecycle
```
NEW → (payment) → PAID → (hotel staff) → FULFILLED
    └→ (timeout/failure) → FAILED
```

### Event Types
- `QR_SCAN`: QR code scanned
- `PAGE_VIEW`: Offer page viewed
- `PAYMENT_SUCCESS`: Payment completed
- `PAYMENT_FAILED`: Payment failed/expired

---

## 🧪 Testing

### Manual Testing Flow
1. **QR Scan**: http://localhost:3001/api/qr?s=bacolux-lobby
2. **Offer Landing**: Should redirect to offer page
3. **Payment**: Click "Pay with Stripe" (test mode)
4. **Confirmation**: Should show success page
5. **Admin**: Check http://localhost:3001/admin/orders

### Health Check
```bash
curl http://localhost:3001/api/health
# Expected: {"status":"healthy","timestamp":"...","database":"connected"}
```

### Build Test
```bash
npx next build
# Should complete without errors
```

---

## 🚢 Production Deployment

### Vercel Deployment
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Configure PostgreSQL (e.g., Neon, Supabase, or managed Postgres)
5. Run migrations: `npx prisma migrate deploy`

### Environment Variables (Production)
Update these for production:
- `APP_URL`: Your production domain
- `DATABASE_URL`: Production database connection string
- `NETOPIA_TEST_MODE="false"`: Use live Netopia endpoint
- `NETOPIA_PRIVATE_KEY_PEM` / `NETOPIA_PUBLIC_KEY_PEM`: Real keys
- `STRIPE_SECRET_KEY`: Live Stripe key
- `STRIPE_WEBHOOK_SECRET`: Production webhook secret

### Webhook URLs
Configure these in payment provider dashboards:
- **Stripe**: `https://yourdomain.com/api/webhooks/stripe`
- **Netopia**: `https://yourdomain.com/api/webhooks/netopia`

---

## 🔒 Security

### Secrets Management
- **Never commit**: `.env`, `.env.local`, `*.pem`, `*.key` files
- **Git ignored**: Check `.gitignore` includes these patterns
- **Production**: Use Vercel environment variables or secret managers

### Admin Access
- Password-gated via `ADMIN_PASSWORD` env var
- Cookie-based session (httpOnly, sameSite)
- For production: Consider OAuth or proper auth service

### Webhook Security
- Stripe: Signature verification via `STRIPE_WEBHOOK_SECRET`
- Netopia: Decryption with private key (TODO: implement real crypto)

---

## 📝 TODO & Known Limitations

### High Priority
- [ ] **Netopia Crypto**: Replace stub encryption/decryption in `src/lib/netopia.ts` with real RSA+RC4/AES
- [ ] **Email Integration**: Connect real email service (SendGrid/Resend) in `src/lib/notifications.ts`
- [ ] **Stripe Keys**: Add real `STRIPE_SECRET_KEY` for live testing

### Medium Priority
- [ ] **XML Parser**: Replace regex-based parsing in Netopia webhook with proper XML library
- [ ] **Multi-Hotel Support**: Currently assumes single hotel (Bacolux)
- [ ] **Date Range Filters**: KPI dashboard fixed to last 30 days (add date pickers)
- [ ] **Order Fulfillment UI**: Add button to mark orders as FULFILLED in admin

### Nice to Have
- [ ] **Charts**: Add visual charts to KPI dashboard (Chart.js, Recharts)
- [ ] **Email Templates**: Design HTML email templates for order notifications
- [ ] **Rate Limiting**: Add rate limiting to public endpoints
- [ ] **Audit Log**: Track admin actions (who changed what)

---

## 🛟 Troubleshooting

### Database Connection Failed
```bash
# Check if Postgres is running
docker ps | grep postgres

# Restart Postgres
docker compose -f infra/docker/docker-compose.yml restart
```

### Port 5433 Conflict
If port 5433 is taken, edit `infra/docker/docker-compose.yml` and change the port mapping.

### Migration Errors
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Re-apply migrations
npx prisma migrate deploy
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npx next build
```

---

## 📄 License

Proprietary — ACCACIA Upsell MVP for Bacolux Hotels
