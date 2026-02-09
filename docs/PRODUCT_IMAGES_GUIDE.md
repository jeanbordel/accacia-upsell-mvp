# Product Image Implementation Guide

This guide explains how to integrate the product images you provided into the landing page.

## 📁 Image Files Provided

Based on your attachments, you have the following product images:

### 1. **Smart Mirror / Fitness Displays** (2 images)
- Smart mirror with person exercising
- Interactive body tracking display
- Location: Fitness/gym displays

### 2. **Portable Totems with Wheels** (3 images)
- Black portable display with wheels
- Fashion model display on wheeled stand
- Specifications diagram (60x175cm)

### 3. **White Premium Kiosks** (multiple images)
- White-framed elegant displays
- "Haine de gama" beauty/fashion displays
- "Summer Sale" promotional display
- "Consultatii Gratuite" service kiosk

### 4. **Rotating Displays** (2 images)
- 360° rotation capability displays
- Portrait/landscape orientation options

### 5. **Slim White Stands** (3 images)
- Modern white pedestal stands
- Adjustable height displays
- Minimal design for boutiques

### 6. **Large Format Black Totems** (3 images)
- "Deschidem in curand" store opening display
- Robust commercial displays
- Touch-enabled versions

### 7. **Mobile Stands** (multiple images)
- Bakery/pastry display ("Noutățile noastre")
- Jewelry display ("Noua Colecție")
- White modern design

## 🔧 Implementation Steps

### Step 1: Save Images to Public Folder

Save your product images to:
```
/home/roland/Proiecte/accacia-upsell-mvp/apps/web/public/products/
```

Recommended naming convention:
- `smart-mirror-fitness-1.jpg`
- `smart-mirror-fitness-2.jpg`
- `portable-totem-wheels-1.jpg`
- `portable-totem-wheels-specs.jpg`
- `white-kiosk-fashion.jpg`
- `white-kiosk-beauty.jpg`
- `white-kiosk-summer-sale.jpg`
- `rotating-display-1.jpg`
- `rotating-display-2.jpg`
- `slim-white-stand-1.jpg`
- `large-black-totem-1.jpg`
- `large-black-totem-touch.jpg`
- `mobile-stand-bakery.jpg`
- `mobile-stand-jewelry.jpg`

### Step 2: Update Landing Page Image References

Replace the Unsplash placeholder images in `/apps/web/src/app/page.tsx`:

#### Current (Unsplash):
```tsx
<Image
  src="https://images.unsplash.com/photo-1612538498456-e861df91d4d0?w=800&q=80"
  alt="Totem Digital SLIM Display"
  fill
  className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
/>
```

#### Replace with (Local images):
```tsx
<Image
  src="/products/slim-white-stand-1.jpg"
  alt="Totem Digital SLIM Display"
  fill
  className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
/>
```

### Step 3: Image Mapping

Here's the mapping for each product section:

| Product Section | Current Image (Unsplash) | Replace With (Your Images) |
|----------------|-------------------------|----------------------------|
| Totem Digital SLIM | `photo-1612538498456-e861df91d4d0` | `/products/slim-white-stand-1.jpg` |
| Totem Digital Rotativ | `photo-1607827448452-6fda561309b1` | `/products/rotating-display-1.jpg` |
| Poster Digital | `photo-1555421689-491a97ff2040` | `/products/slim-white-stand-2.jpg` |
| Totem Portabil cu Rotile | `photo-1573164713714-d95e436ab8d6` | `/products/portable-totem-wheels-1.jpg` |
| Large Format Displays | `photo-1558494949-ef010cbdcc31` | `/products/large-black-totem-1.jpg` |
| Smart Mirror Fitness | `photo-1588508065123-287b28e013da` | `/products/smart-mirror-fitness-1.jpg` |
| Totemuri Exterioare | `photo-1504711331083-9c895941bf81` | `/products/large-black-totem-outdoor.jpg` |
| Kiosk Premium | `photo-1517245386807-bb43f82c33c4` | `/products/white-kiosk-fashion.jpg` |
| Elevator Displays | `photo-1600880292203-757bb62b4baf` | `/products/slim-white-stand-vertical.jpg` |

### Step 4: Optimize Images

Before uploading, optimize images for web:

**Recommended specifications:**
- Format: JPG (for photos), PNG (for graphics with transparency)
- Dimensions: 1200px x 800px (or maintain aspect ratio)
- File size: Under 300KB per image
- Quality: 80-85% compression

**Tools:**
- ImageOptim (Mac)
- TinyPNG/TinyJPG (Online)
- Squoosh (Google's web tool)

### Step 5: Test Display

After updating:

```bash
cd /home/roland/Proiecte/accacia-upsell-mvp/apps/web
npm run dev
```

Visit http://localhost:3001 and scroll to the "Professional Digital Signage" section to verify all images load correctly.

## 🎨 Alternative: Use Next.js Image Optimization

For better performance, your images are already set up to use Next.js Image component with automatic optimization.

The `fill` prop makes images responsive and the `object-cover` class ensures proper cropping.

## 📱 Responsive Considerations

Current implementation already handles responsive display:
- Desktop: Full grid layout
- Tablet: 2 columns
- Mobile: Single column

Images automatically scale with `aspect-video` container.

## ✅ Quality Checklist

Before going live, verify:
- [ ] All product images match correct product descriptions
- [ ] Images are clear and professional quality
- [ ] File sizes are optimized (< 300KB each)
- [ ] Alt text is descriptive and accurate
- [ ] Images load fast on all devices
- [ ] No Unsplash watermarks or credits visible
- [ ] Romanian text in images is readable
- [ ] Brand colors match your design system

## 🔄 Future Updates

To add new product images:

1. Add image to `/public/products/`
2. Update the `<Image src="/products/your-image.jpg" />` reference
3. Update alt text to describe the product
4. Test locally before pushing to production

## 📞 Support

If you need help with image optimization or implementation:
- Email: office@horecadepo.com
- Phone: +40745601215

---

**Created:** February 9, 2026  
**Last Updated:** February 9, 2026  
**Status:** Ready for image upload
