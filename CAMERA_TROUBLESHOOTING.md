# Camera Troubleshooting Guide

## 🔧 Issue Fixed: Canvas IndexSizeError

The "IndexSizeError: Failed to execute 'getImageData'" error has been **resolved** with the following improvements:

### What Was Fixed

1. **Element Ready Check**: Added polling to ensure DOM element exists with valid dimensions before initializing scanner
2. **Explicit Dimensions**: Set explicit min-width and min-height on the QR reader element
3. **Better Error Handling**: Added initialization error state with helpful messages
4. **Loading State**: Shows "Initializing camera..." while waiting for element to be ready
5. **Graceful Degradation**: Provides option to switch to mock mode if camera fails

---

## 🚀 How to Use

### Option 1: Real Camera (Default)

Navigate to scanner without any parameters:
```
http://localhost:3000/scanner?questId=quest_test_newtown
```

**What to expect:**
1. Scanner page opens
2. "Initializing camera..." appears for 100-500ms
3. Browser requests camera permission
4. Camera preview starts
5. Point at QR code to scan

### Option 2: Mock Mode (Testing/Fallback)

Add `?mock=true` to the URL:
```
http://localhost:3000/scanner?questId=quest_test_newtown&mock=true
```

**What you get:**
- No camera required
- Click buttons to simulate scanning
- Perfect for testing without QR codes
- Works without camera permission

---

## 🐛 Troubleshooting Steps

### Problem: Camera Won't Start

**Symptoms:**
- Black screen
- "Failed to initialize camera" error
- Camera permission denied

**Solutions:**

1. **Check Browser Permissions**
   ```
   Chrome: Click lock icon in address bar → Site settings → Camera → Allow
   Safari: Safari → Settings → Websites → Camera → Allow
   Firefox: Click shield icon → Permissions → Camera → Allow
   ```

2. **Use HTTPS in Production**
   - Camera API requires secure context (localhost or HTTPS)
   - If deploying, ensure SSL certificate is configured

3. **Try Different Browser**
   - Chrome/Edge usually have best camera support
   - Safari on iOS requires HTTPS even for testing

4. **Check Camera Usage**
   - Close other apps using camera (Zoom, Teams, etc.)
   - Restart browser
   - Check camera works in other apps

5. **Use Mock Mode**
   - Add `?mock=true` to URL
   - Continue testing without camera

### Problem: QR Code Not Detected

**Symptoms:**
- Camera works but doesn't recognize QR codes
- "Scanning..." status but no detection

**Solutions:**

1. **QR Code Quality**
   - Ensure QR code is clear and well-lit
   - Minimum size: 2cm x 2cm on screen
   - Print on white background with black code

2. **Distance**
   - Hold phone 15-30cm from QR code
   - Ensure code fills about 50% of scanning box

3. **Test QR Codes**
   Use these codes for Newtown quest:
   - Start: `ACE-HEARTS-NEWTOWN`
   - Finish: `KING-SPADES-NEWTOWN`

   Generate at: https://www.qr-code-generator.com/

4. **Lighting**
   - Ensure good lighting
   - Avoid shadows on QR code
   - Avoid glare from glossy surfaces

### Problem: GPS Validation Failing

**Symptoms:**
- QR code scans but shows "You're XXXm away" error

**Solutions:**

1. **Enable GPS**
   - Browser → Settings → Location → Allow
   - Check device location services are on

2. **GPS Accuracy**
   - Move outdoors for better signal
   - Wait 10-30 seconds for GPS to stabilize
   - Typical accuracy: 5-50m

3. **Increase Radius (For Testing)**
   Edit quest in `src/data/quests.ts`:
   ```typescript
   radius: 1000, // Changed from 100 to 1000m
   ```

4. **Mock GPS (Development)**
   Use browser dev tools:
   ```
   Chrome → Settings (⋮) → More tools → Sensors
   Set custom location to Newtown coordinates
   ```

---

## 📱 Browser Compatibility

### ✅ Fully Supported
- Chrome 90+ (Desktop & Mobile)
- Edge 90+
- Safari 14+ (with HTTPS)
- Firefox 88+

### ⚠️ Limited Support
- Safari < 14 (camera API limited)
- Older Android browsers (use Chrome)

### ❌ Not Supported
- IE 11 (use Edge)
- Very old mobile browsers (update browser)

---

## 🧪 Testing Checklist

Use this checklist to verify everything works:

### Real Camera Mode
- [ ] Scanner page opens without errors
- [ ] "Initializing camera..." shows briefly
- [ ] Camera permission prompt appears
- [ ] Camera preview displays
- [ ] Scanning guides (corners) visible
- [ ] "Scanning..." status shows
- [ ] QR code detection works
- [ ] AR mascot appears after valid scan
- [ ] GPS proximity indicator shows
- [ ] Question overlay opens on tap

### Mock Mode
- [ ] Add `?mock=true` to URL
- [ ] Mock scanner shows card buttons
- [ ] Click ACE-HEARTS button
- [ ] AR mascot appears
- [ ] GPS proximity works
- [ ] Question overlay opens
- [ ] Answer validation works
- [ ] Quest completion works

### Error Handling
- [ ] Invalid QR shows error message
- [ ] GPS out of range shows distance
- [ ] Sequential validation works (can't skip)
- [ ] Camera failure shows helpful error
- [ ] Error messages auto-dismiss or have close button

---

## 🔍 Debug Mode

### Enable Console Logging

Check browser console for helpful logs:

```
✓ QR Reader element ready: { width: 300, height: 300 }
✓ Starting QR scanner...
✓ QR code scanned: ACE-HEARTS-NEWTOWN
```

### Common Console Errors

1. **"QR Reader element never became ready"**
   - Element doesn't have dimensions
   - Check CSS/styling
   - Wait longer (increase maxAttempts)

2. **"QR reader element not found"**
   - DOM element missing
   - React re-render issue
   - Hard refresh page (Cmd+Shift+R)

3. **"NotAllowedError: Permission denied"**
   - User denied camera access
   - Check browser permissions
   - Clear site data and try again

4. **"NotReadableError: Could not start video source"**
   - Camera in use by another app
   - Camera hardware error
   - Restart device

---

## 🎯 Quick Solutions

### For Development
```bash
# Use mock mode by default in development
# Edit your quest detail page to add mock parameter
http://localhost:3000/scanner?questId=quest_test_newtown&mock=true
```

### For Production
```bash
# Ensure HTTPS is configured
# Update your hosting to use SSL certificate
# Vercel/Netlify automatically provide HTTPS
```

### For Testing Without Location
```typescript
// Temporarily increase radius in src/data/quests.ts
radius: 10000, // 10km for testing
```

---

## 📊 Performance Tips

1. **Slower devices**: Reduce FPS in `qr-scanner.ts`
   ```typescript
   fps: 5, // Changed from 10
   ```

2. **Better detection**: Increase box size
   ```typescript
   qrbox: { width: 300, height: 300 }, // Changed from 250
   ```

3. **Battery saving**: Stop scanner when not in use
   - Already handled automatically
   - Scanner stops on successful scan
   - Cleanup on component unmount

---

## ✅ Verification

After applying fixes, verify:

1. **No console errors** about canvas or IndexSizeError
2. **"Initializing camera..." shows** for brief moment
3. **Camera starts** without errors
4. **QR detection works** smoothly
5. **Error messages** are clear and helpful

---

## 🆘 Still Having Issues?

1. **Check browser console** for specific errors
2. **Try mock mode** to isolate camera issues
3. **Test on different device** to rule out hardware
4. **Check quest data** in `src/data/quests.ts`
5. **Verify QR code format** matches expected codes

---

**The camera initialization fix should resolve the IndexSizeError. If you still encounter issues, use mock mode as a reliable fallback!** 🚀
