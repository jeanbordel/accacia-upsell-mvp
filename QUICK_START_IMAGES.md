# 🚀 QUICK START: Product Images Upload

## Step 1: Save Your Images (2 minutes)

Copy your product photos to this folder:
```
/home/roland/Proiecte/accacia-upsell-mvp/apps/web/public/products/
```

## Step 2: Rename Files (Recommended naming)

```
smart-mirror-fitness-1.jpg    → Smart mirror with person exercising
smart-mirror-fitness-2.jpg    → Interactive fitness display

portable-totem-wheels-1.jpg   → Black portable display with wheels
portable-totem-wheels-2.jpg   → Fashion model on wheeled stand
portable-totem-specs.jpg      → Dimensions diagram (60x175cm)

white-kiosk-fashion.jpg       → "Haine de gama" display
white-kiosk-beauty.jpg        → Beauty/cosmetics display
white-kiosk-summer.jpg        → "Summer Sale" promotional

rotating-display-1.jpg        → 360° rotation capability
rotating-display-2.jpg        → Portrait/landscape options

slim-white-stand-1.jpg        → Modern white pedestal
slim-white-stand-2.jpg        → Adjustable height display
slim-white-stand-3.jpg        → Minimal design boutique

large-black-totem-1.jpg       → "Deschidem in curand" store
large-black-totem-2.jpg       → Robust commercial display
large-black-totem-touch.jpg   → Touch-enabled version

mobile-stand-bakery.jpg       → Bakery/pastry display
mobile-stand-jewelry.jpg      → Jewelry "Noua Colecție"
```

## Step 3: Update Image References (10 minutes)

Open: `/apps/web/src/app/page.tsx`

Find and replace these 9 Unsplash URLs:

### Line ~176: Totem Digital SLIM
```tsx
// REPLACE:
src="https://images.unsplash.com/photo-1612538498456-e861df91d4d0?w=800&q=80"
// WITH:
src="/products/slim-white-stand-1.jpg"
```

### Line ~202: Totem Digital Rotativ
```tsx
// REPLACE:
src="https://images.unsplash.com/photo-1607827448452-6fda561309b1?w=800&q=80"
// WITH:
src="/products/rotating-display-1.jpg"
```

### Line ~228: Poster Digital
```tsx
// REPLACE:
src="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80"
// WITH:
src="/products/slim-white-stand-2.jpg"
```

### Line ~254: Totem Portabil cu Rotile
```tsx
// REPLACE:
src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80"
// WITH:
src="/products/portable-totem-wheels-1.jpg"
```

### Line ~280: Large Format Displays
```tsx
// REPLACE:
src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
// WITH:
src="/products/large-black-totem-1.jpg"
```

### Line ~306: Smart Mirror Fitness
```tsx
// REPLACE:
src="https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&q=80"
// WITH:
src="/products/smart-mirror-fitness-1.jpg"
```

### Line ~332: Totemuri Exterioare
```tsx
// REPLACE:
src="https://images.unsplash.com/photo-1504711331083-9c895941bf81?w=800&q=80"
// WITH:
src="/products/large-black-totem-2.jpg"
```

### Line ~358: Kiosk Premium Alb
```tsx
// REPLACE:
src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80"
// WITH:
src="/products/white-kiosk-fashion.jpg"
```

### Line ~384: Elevator Displays
```tsx
// REPLACE:
src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
// WITH:
src="/products/slim-white-stand-3.jpg"
```

## Step 4: Test Locally (2 minutes)

```bash
cd /home/roland/Proiecte/accacia-upsell-mvp/apps/web
npm run dev
```

Visit: http://localhost:3001  
Scroll to: "Professional Digital Signage" section  
Check: All 9 product images display correctly

## Step 5: Commit & Push (1 minute)

```bash
git add .
git commit -m "feat: add real product images to digital signage portfolio"
git push accacia main
```

## ✅ Done!

Your landing page now shows actual product images with accurate specifications.

---

## 📞 Need Help?

**Contact:**  
office@horecadepo.com | +40745601215

**Documentation:**  
- Full catalog: `/docs/PRODUCT_CATALOG.md`
- Detailed guide: `/docs/PRODUCT_IMAGES_GUIDE.md`
- Summary: `/docs/PRODUCT_UPDATE_SUMMARY.md`
