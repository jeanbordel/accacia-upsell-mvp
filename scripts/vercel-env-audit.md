# Vercel Environment Variables Audit

## Required for Production

### Database
- **DATABASE_URL** (Production only)
  - Format: `postgresql://user:pass@host.neon.tech/db?sslmode=require`
  - Source: Neon dashboard → Connection String
  - ⚠️ Must start with `postgresql://` not `psql ...`
  - ⚠️ Must include `?sslmode=require` for Neon

### Application
- **APP_URL** (All environments)
  - Production: `https://upsell.horecadepo.com`
  - Preview: `https://[deployment-url].vercel.app`
  - Development: `http://localhost:3001`

### Admin Authentication
- **ADMIN_PASSWORD** (Production + Preview)
  - Used for `/admin-login` access
  - Should be strong and unique

### Stripe Configuration
- **STRIPE_SECRET_KEY** (Production + Preview)
  - Format: `sk_live_...` (production) or `sk_test_...` (development)
  - Source: Stripe Dashboard → API Keys

- **STRIPE_WEBHOOK_SECRET** (Production + Preview)
  - Format: `whsec_...`
  - Source: Stripe Dashboard → Webhooks
  - Endpoint: `https://upsell.horecadepo.com/api/webhooks/stripe`

### Netopia Configuration
- **NETOPIA_SIGNATURE** (Production + Preview)
  - Merchant signature from Netopia
  
- **NETOPIA_HOSTED_URL_TEST** (Preview + Development)
  - Test environment URL: `http://sandboxsecure.mobilpay.ro`
  
- **NETOPIA_HOSTED_URL_LIVE** (Production only)
  - Live environment URL: `https://secure.mobilpay.ro`
  
- **NETOPIA_PUBLIC_KEY_PEM** (Production + Preview)
  - Public key for encryption
  
- **NETOPIA_PRIVATE_KEY_PEM** (Production + Preview)
  - Private key for signing
  
- **NETOPIA_NOTIFY_URL** (All environments)
  - Production: `https://upsell.horecadepo.com/api/webhooks/netopia`
  
- **NETOPIA_RETURN_URL** (All environments)
  - Production: `https://upsell.horecadepo.com/o/success`

### PayU Configuration (Future)
- **PAYU_MERCHANT_ID** (when implemented)
- **PAYU_SECRET_KEY** (when implemented)
- **PAYU_ENV** (when implemented)
  - Values: `test` or `live`

## How to Set Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable with:
   - **Key**: Variable name (e.g., `DATABASE_URL`)
   - **Value**: The actual value
   - **Environment**: Select appropriate environment(s):
     - Production (for main branch)
     - Preview (for PRs and non-main branches)
     - Development (local dev)
3. Click "Save"
4. **Important**: Redeploy after adding new variables

## Verification Commands

### Check if variables are set:
```bash
# Using Vercel CLI
vercel env ls

# Or check a specific variable (without revealing value)
vercel env pull .env.vercel
grep DATABASE_URL .env.vercel
```

### Test in production:
```bash
curl https://upsell.horecadepo.com/api/health
curl https://upsell.horecadepo.com/api/version
```

## Common Mistakes

❌ **DATABASE_URL set to local value**
  - Wrong: `postgresql://postgres:postgres@localhost:5433/db`
  - Right: `postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require`

❌ **Variables only set for Preview, not Production**
  - Always check "Production" checkbox when setting critical vars

❌ **Forgetting to redeploy after adding variables**
  - New variables only apply to new deployments

❌ **Using development keys in production**
  - Stripe: `sk_test_...` should be `sk_live_...`
  - Netopia: test URLs should be live URLs

## Environment-Specific Notes

### Production
- Use live payment provider credentials
- Use production database (Neon)
- Enable error reporting/monitoring
- Set strong admin password

### Preview
- Can use test payment credentials
- Can use separate preview database
- Useful for testing PRs before merge

### Development
- Use local database or development Neon instance
- Use test payment credentials
- Can use `.env.local` file (not committed to git)
