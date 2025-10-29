# 🛠️ Complete Debugging Guide for AR/QR Scanner Issues

## 📋 **Essential Files to Keep**

### **Core Application Files (DO NOT DELETE)**
- `src/` - All source code
- `public/` - All public assets
- `package.json` - Dependencies
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Styling configuration
- `vercel.json` - Deployment configuration

### **Critical AR/QR Files (DO NOT DELETE)**
- `src/app/scanner/page.tsx` - Main scanner page
- `src/components/scanner/CleanARScanner.tsx` - MindAR implementation
- `src/components/scanner/SimpleARScanner.tsx` - Simple AR fallback
- `src/components/scanner/ARDebugger.tsx` - Debug tool
- `src/components/ar/ARMascotView.tsx` - AR mascot display
- `src/lib/scanner/qr-scanner.ts` - QR scanner service
- `src/lib/scanner/validator.ts` - QR validation
- `src/hooks/useQRScanner.ts` - QR scanner hook
- `public/assets/targets/` - AR target files
- `src/data/quests.ts` - Quest definitions

## 🔍 **Common Issues & Solutions**

### **1. AR Scanner Not Working**

#### **Symptoms:**
- `mindarMod: undefined` error
- `SyntaxError: Cannot use import statement outside a module`
- `ReferenceError: MindARThree is not defined`
- `Error: Failed to load MindAR library from any CDN source`

#### **Solutions:**
```bash
# Check if MindAR CDN is accessible
curl -I https://unpkg.com/mind-ar@1.2.5/dist/mindar-image-three.prod.js

# Alternative CDN sources:
# https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js
# https://cdn.skypack.dev/mind-ar@1.2.5/dist/mindar-image-three.prod.js
```

#### **Debug Steps:**
1. Open browser console
2. Check `ARDebugger` component output
3. Verify `window.THREE` and `window.MINDAR` exist
4. Check network tab for failed script loads
5. Use Simple AR fallback if MindAR fails

### **2. QR Scanner Not Working**

#### **Symptoms:**
- Camera permission denied
- `Html5Qrcode` not found
- Scanner not detecting QR codes

#### **Solutions:**
```bash
# Install QR scanner dependency
npm install html5-qrcode

# Check camera permissions in browser
navigator.mediaDevices.getUserMedia({ video: true })
```

#### **Debug Steps:**
1. Check camera permissions in browser settings
2. Verify `html5-qrcode` is installed
3. Test with mock scanner first
4. Check console for permission errors

### **3. 3D Models Not Loading**

#### **Symptoms:**
- `GLTFLoader` not found
- 3D models not appearing
- `Error loading 3D model`

#### **Solutions:**
```bash
# Check if GLTF files exist
ls -la public/assets/targets/*.glb

# Verify file sizes (should be > 0)
stat public/assets/targets/Rooey.glb
```

#### **Debug Steps:**
1. Check if `.glb` files exist in `public/assets/targets/`
2. Verify file sizes are not 0 bytes
3. Check network tab for 404 errors
4. Test GLTF loading in browser console

### **4. GPS Location Issues**

#### **Symptoms:**
- Location not available
- Distance calculation errors
- Proximity validation failing

#### **Solutions:**
```bash
# Test geolocation API
navigator.geolocation.getCurrentPosition(
  (pos) => console.log(pos.coords),
  (err) => console.error(err)
)
```

#### **Debug Steps:**
1. Check browser location permissions
2. Test on HTTPS (required for geolocation)
3. Verify GPS coordinates format
4. Check distance calculation logic

## 🚨 **Emergency Recovery**

### **If AR Scanner Completely Breaks:**

1. **Force Simple AR Mode:**
```typescript
// In src/app/scanner/page.tsx
const [useSimpleAR, setUseSimpleAR] = useState(true); // Force simple AR
```

2. **Disable MindAR Completely:**
```typescript
// In src/components/scanner/CleanARScanner.tsx
export function CleanARScanner({ onScan, onClose, questTheme }: CleanARScannerProps) {
  // Always use simple AR
  return <SimpleARScanner onScan={onScan} onClose={onClose} questTheme={questTheme} />;
}
```

3. **Use Mock Scanner for Testing:**
```typescript
// Replace scanner with mock
<MockScanner onScan={handleScanSuccess} onClose={handleClose} questTheme={quest.theme} />
```

### **If QR Scanner Breaks:**

1. **Use Mock Scanner:**
```typescript
// In src/app/scanner/page.tsx
import { MockScanner } from '@/components/scanner/MockScanner';
// Replace QR scanner with mock
```

2. **Disable Camera Requirements:**
```typescript
// Skip camera permission checks
const handleScanSuccess = (scannedCode: string) => {
  // Direct validation without camera
  validateQRCode(scannedCode, quest, progress, location);
};
```

## 🔧 **Development Commands**

### **Essential Commands:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for issues
npm run lint
```

### **Debug Commands:**
```bash
# Check package versions
npm list html5-qrcode
npm list mind-ar

# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check file permissions
ls -la public/assets/targets/
```

## 📱 **Browser Testing**

### **Required Browser Features:**
- Camera API support
- Geolocation API support
- WebGL support (for 3D models)
- HTTPS support (for geolocation)

### **Test URLs:**
- Local: `http://localhost:3000/scanner`
- Production: `https://your-domain.com/scanner`

### **Browser Console Commands:**
```javascript
// Check AR libraries
console.log('THREE:', window.THREE);
console.log('MINDAR:', window.MINDAR);

// Test camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => console.log('Camera OK'))
  .catch(err => console.error('Camera Error:', err));

// Test geolocation
navigator.geolocation.getCurrentPosition(
  pos => console.log('GPS OK:', pos.coords),
  err => console.error('GPS Error:', err)
);
```

## 🎯 **Quick Fixes**

### **AR Scanner Issues:**
1. **CDN Problems:** Use Simple AR mode
2. **Library Loading:** Check network tab, try different CDN
3. **3D Models:** Verify file paths and sizes
4. **Target Detection:** Check postcard.mind file

### **QR Scanner Issues:**
1. **Camera Permission:** Check browser settings
2. **Library Missing:** Run `npm install html5-qrcode`
3. **Detection Failing:** Use mock scanner for testing
4. **Validation Errors:** Check QR code format

### **General Issues:**
1. **Build Errors:** Clear cache and reinstall
2. **Runtime Errors:** Check browser console
3. **Performance:** Use Simple AR for better performance
4. **Mobile Issues:** Test on actual device, not just browser

## 📞 **Support Information**

### **Key Files for Support:**
- `src/app/scanner/page.tsx` - Main scanner logic
- `src/components/scanner/CleanARScanner.tsx` - MindAR implementation
- `src/components/scanner/SimpleARScanner.tsx` - Fallback AR
- `src/lib/scanner/qr-scanner.ts` - QR scanning
- `DEBUGGING_GUIDE.md` - This file

### **Log Locations:**
- Browser Console: F12 → Console tab
- Network Tab: F12 → Network tab
- Application Tab: F12 → Application tab

### **Error Patterns:**
- `mindarMod: undefined` → MindAR CDN issue
- `Camera permission denied` → Browser permission issue
- `GLTFLoader not found` → Three.js loading issue
- `Location not available` → GPS permission issue

---

**Remember:** Always test on actual devices, not just browser. AR and camera features require real hardware and permissions.

