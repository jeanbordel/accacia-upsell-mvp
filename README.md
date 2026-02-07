# ACCACIA Upsell MVP (Hotel Digital Signage → Mobile Upsell)
QR-driven upsell platform for hotels (Bacolux pilot): scan on in-hotel displays → offer landing → pay (Stripe / Netopia Hosted) → order tracking + KPI funnel.

## Key Features (MVP)
- **QR → Offer landing** (per screen / zone)
- **Payments:** Stripe + Netopia (Hosted) in **RON**
- **Orders:** NEW → PAID / FAILED (webhooks)
- **Events/KPI funnel:** QR_SCAN, PAGE_VIEW, CHECKOUT_START, PAYMENT_SUCCESS, PAYMENT_FAILED
- **Admin:** basic internal pages for Orders / Offers

## Tech Stack
- Next.js (App Router) + TypeScript
- Prisma + PostgreSQL
- Stripe Checkout + Webhooks
- Netopia Hosted Payment + Notify (Webhook)
- Docker (local Postgres)

---

## Local Development

### 1) Requirements
- Node.js **>= 20**
- Docker + Docker Compose
- npm

### 2) Start Postgres (local)
From repo root:
```bash
docker compose -f infra/docker/docker-compose.yml up -d
