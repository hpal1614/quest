# Quick Testing Guide - The Great Sydney Quest

## ✅ Pre-Test Checklist

### 1. Is the server running?
```bash
npm run dev
```
Should see: `Ready on http://localhost:3000` (or port 3006)

### 2. TypeScript errors?
```bash
npx tsc --noEmit
```
Should see: No output (means no errors) ✅

### 3. Browser access?
Open: `http://localhost:3000` or `http://localhost:3006`

---

## 🧪 Test Scenarios

### **Test 1: Basic App Load** ✅
**Steps:**
1. Open `http://localhost:3000`
2. Should see onboarding screen
3. Click "Skip for now"
4. Should see quest list

**Expected:**
- ✅ Page loads without errors
- ✅ Quest cards visible
- ✅ Test Quest (🃏) appears at top

---

### **Test 2: Mock Scanner (No Camera Needed)** ✅
**Steps:**
1. Find "Test Quest - Face Cards" (green card with 🃏)
2. Click "START QUEST"
3. Click "📷 SCAN" button
4. Should see card selection buttons
5. Click "ACE-HEARTS"
6. Quest should start

**Expected:**
- ✅ Scanner opens with card buttons
- ✅ Clicking ACE-HEARTS works
- ✅ Progress updates
- ✅ Returns to quest detail

**URL to test directly:**
```
http://localhost:3000/scanner?questId=quest_test_newtown&mock=true
```

---

### **Test 3: QR Scanner (Needs Camera)** ⚠️
**Steps:**
1. Start any quest
2. Click "SCAN"
3. Change URL to include `?qr=true`
4. Allow camera permission
5. Point at QR code

**Expected:**
- ⚠️ Needs camera permission
- ⚠️ Needs actual QR code
- ✅ Camera should open
- ✅ Scanner overlay visible

**URL to test:**
```
http://localhost:3000/scanner?questId=quest_test_newtown&qr=true
```

**Create test QR code:**
- Go to: https://www.qr-code-generator.com/
- Enter text: `ACE-HEARTS-NEWTOWN`
- Generate and scan

---

### **Test 4: Card Recognition AR (Needs Camera + Cards)** ⚠️
**Steps:**
1. URL: `http://localhost:3000/scanner?questId=quest_test_newtown`
2. Allow camera permission
3. Point at playing card (Ace of Hearts or King of Spades)
4. Hold steady

**Expected:**
- ⚠️ Needs real playing cards
- ⚠️ Detection is basic (may not work well)
- ⚠️ Lighting dependent
- ✅ Camera opens
- ⚠️ Detection progress shows if card recognized

**Limitations:**
- Only detects 2 cards: Ace of Hearts, King of Spades
- Uses simple color histogram (not ML)
- May not work reliably

---

### **Test 5: Marker AR (True AR!)** ✅⚠️
**Steps:**
1. Print the marker image: `/public/assets/targets/postcard.png`
2. URL: `http://localhost:3000/scanner?questId=quest_test_newtown&marker=true`
3. Allow camera permission
4. Point camera at printed postcard

**Expected:**
- ✅ MindAR loads
- ✅ Detects marker
- ⚠️ No 3D model displayed (not implemented)
- ✅ Triggers scan callback

**This is ACTUAL AR but underutilized**

---

### **Test 6: Question System** ✅
**Steps:**
1. Start Test Quest
2. Scan ACE-HEARTS (mock mode)
3. Scan KING-SPADES (mock mode)
4. Question overlay should appear
5. Type wrong answer: "hearts"
6. Should see Hint 1
7. Type correct answer: "spades"
8. Should proceed

**Expected:**
- ✅ Question overlay displays
- ✅ Wrong answers show hints
- ✅ Correct answer proceeds
- ✅ Fuzzy matching works ("spade" = "spades")

---

### **Test 7: GPS Validation** ⚠️
**Currently mocked!** Location is hardcoded to Haymarket.

**Check:**
- Open browser console
- Should see: `lat: -33.8795, lng: 151.2025`

**To test real GPS:**
1. Edit `hooks/useGeolocation.ts`
2. Remove mock location
3. Uncomment real geolocation code
4. Test at actual Sydney locations

---

### **Test 8: Progress Persistence** ✅
**Steps:**
1. Start quest
2. Scan 2 cards (ACE and KING)
3. Refresh browser (F5)
4. Quest should resume from where you left off

**Expected:**
- ✅ Progress saved to localStorage
- ✅ Returns to same location
- ✅ Hint count preserved
- ✅ No data loss

---

### **Test 9: Quest Completion** ✅
**Steps:**
1. Complete all 5 cards in Test Quest:
   - ACE-HEARTS
   - KING-SPADES
   - QUEEN-HEARTS
   - JACK-DIAMONDS
   - JOKER
2. Answer all questions correctly

**Expected:**
- ✅ Celebration animation
- ✅ Voucher code generated
- ✅ Stats displayed (time, hints)
- ✅ Quest marked complete
- ✅ Appears in History

---

### **Test 10: Sequential Validation** ✅
**Steps:**
1. Start Test Quest
2. Try to scan KING-SPADES first (skip ACE)
3. Should see error

**Expected:**
- ✅ Error: "Complete previous locations first"
- ✅ Cannot skip ahead
- ✅ Must scan in order

---

## 🔍 What to Check in Console

### No Errors:
```
✅ No red errors in console
✅ No 404s for assets
✅ No TypeScript warnings
```

### Expected Warnings (OK to ignore):
```
⚠️ Node version warning (app still works)
⚠️ npm vulnerability (dev dependency)
```

### Debug Output:
```javascript
// Should see GPS location:
console: { lat: -33.8795, lng: 151.2025 }

// Should see quest loaded:
console: Quest loaded: quest_test_newtown

// Should see scan validation:
console: Validating code: ACE-HEARTS-NEWTOWN
```

---

## 📱 Mobile Testing

### Test on Phone:
1. **Find your IP:**
   ```bash
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. **Update Next.js config:**
   ```bash
   npm run dev -- -H 0.0.0.0
   ```

3. **Access from phone:**
   ```
   http://[YOUR_IP]:3000
   Example: http://192.168.1.100:3000
   ```

4. **Test camera features:**
   - QR scanner should work better on mobile
   - Card recognition needs good lighting
   - GPS more accurate than desktop

---

## ✅ Success Criteria

### Minimum Working Features:
- [x] App loads without errors
- [x] Quest list displays
- [x] Mock scanner works
- [x] Question system works
- [x] Progress saves
- [x] Quest completion works

### Nice to Have:
- [ ] Real QR scanner works
- [ ] Card recognition works reliably
- [ ] Marker AR detects images
- [ ] Real GPS (not mocked)

### True AR Features:
- [ ] 3D models load
- [ ] Camera stays active during mascot view
- [ ] AR overlay on real world
- [ ] World tracking

---

## 🐛 Common Issues

### Issue 1: "Cannot find module"
**Fix:** Run `npm install`

### Issue 2: Port 3000 already in use
**Fix:** Check if server is already running, or use different port:
```bash
npm run dev -- -p 3006
```

### Issue 3: Camera not working
**Causes:**
- No camera permission
- HTTPS required (use localhost in dev)
- Camera in use by another app

**Fix:**
- Grant permissions in browser settings
- Close other apps using camera
- Try different browser

### Issue 4: QR codes not scanning
**Causes:**
- Poor lighting
- QR code too small
- Camera out of focus

**Fix:**
- Improve lighting
- Print QR code larger (min 5cm x 5cm)
- Hold phone steady

### Issue 5: GPS not accurate
**This is normal!**
- Indoor GPS: ±50m accuracy
- Outdoor GPS: ±5-15m accuracy
- Solution: Use mock mode for testing

---

## 📊 Test Results Template

```
Date: _______________
Tester: _______________

[ ] App loads without errors
[ ] Quest list displays correctly
[ ] Mock scanner works
[ ] QR scanner opens camera
[ ] Card recognition attempted
[ ] Marker AR tested
[ ] Questions display correctly
[ ] Hints show progressively
[ ] Quest completion works
[ ] Progress persists on refresh
[ ] Sequential validation works
[ ] History page shows completed quests

Notes:
_________________________________
_________________________________
_________________________________

Issues Found:
_________________________________
_________________________________
_________________________________
```

---

## 🚀 Quick Test Command

**Copy-paste this in terminal:**
```bash
# Check if everything compiles
npx tsc --noEmit

# Start dev server
npm run dev

# Then open in browser:
# http://localhost:3000/scanner?questId=quest_test_newtown&mock=true
```

**If you see the card selection screen, it's working!** ✅

---

## 📞 Summary

### ✅ **What Definitely Works:**
- Quest system (100%)
- Mock scanner (100%)
- Question/hint system (100%)
- Progress tracking (100%)
- GPS validation (100% mocked)

### ⚠️ **What Might Work:**
- QR scanner (needs camera)
- Card recognition (basic algorithm)
- Marker AR (code exists, underused)

### ❌ **What Doesn't Work:**
- True 3D AR (not implemented)
- Real GPS (currently mocked)
- 3D mascot models (not loaded)

### 🎯 **Bottom Line:**
**The app is a fully functional location-based quest game** with some camera-based features. It's not true AR, but it works well as an interactive scavenger hunt!

---

**Last Updated:** October 27, 2025  
**Test Status:** ✅ Ready for testing  
**Recommended Start:** Mock mode for quick verification

