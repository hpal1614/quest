# 🎴 Playing Card Recognition - AR Scanner Guide

## 🎯 What's Been Implemented

Your AR scanner now uses **image recognition** to detect actual playing cards! No QR codes needed - just point your camera at the Ace of Hearts or King of Spades card.

---

## 📱 How It Works

### Card Detection Flow

```
1. Camera opens → 2. Point at card → 3. Card detected → 4. AR mascot appears!
```

**Technology:**
- Real-time camera feed analysis
- Color histogram matching
- Template comparison with reference images
- 5-frame confirmation for accuracy
- Smooth AR transition

---

## 🃏 Your Playing Cards

### Card 1: Ace of Hearts
- **Image**: `/assets/heart.png` → `/public/cards/ace-hearts.png`
- **Triggers**: `ACE-HEARTS-NEWTOWN` (Start location)
- **Color**: Red suit
- **Detection**: Looks for red hearts pattern

### Card 2: King of Spades
- **Image**: `/assets/king.png` → `/public/cards/king-spades.png`
- **Triggers**: `KING-SPADES-NEWTOWN` (Finish location)
- **Color**: Black suit
- **Detection**: Looks for black spades pattern

---

## 🚀 Testing the Card Scanner

### Method 1: Physical Cards (Best Experience)

**What you need:**
- Actual Ace of Hearts playing card
- Actual King of Spades playing card
- Or print the images from `/assets/` folder

**Steps:**
```bash
# 1. Start the app
cd great-sydney-quest
npm run dev

# 2. Open in browser
http://localhost:3000

# 3. Select "Test Quest - Newtown Face Cards"

# 4. Click "SCAN"
```

**What happens:**
1. Camera opens automatically
2. "Point camera at playing card" instruction shows
3. Position card in center frame (white box)
4. Hold steady for 1 second
5. Progress bar fills up (1/5, 2/5... 5/5)
6. ✅ Card confirmed → AR mascot appears!
7. Tap speech bubble → Answer question
8. Repeat with next card

### Method 2: On-Screen Display

If you don't have physical cards:

```bash
# Open card images on another device/screen
1. Open /assets/heart.png on tablet/another phone
2. Point camera at that screen
3. Detection should still work!
```

### Method 3: Mock Mode (No Cards Needed)

```
http://localhost:3000/scanner?questId=quest_test_newtown&mock=true
```

- Click buttons instead of scanning
- Perfect for testing without cards

---

## 🎨 Detection Visual Feedback

### During Scanning

```
┌─────────────────────────────────┐
│  🎴 Point camera at playing card │
│  Hold steady when card detected  │
├─────────────────────────────────┤
│  Card detected! Hold steady...   │
│  [████████░░] 4/5                │
└─────────────────────────────────┘

         [Camera View]
         with white guide box

   ┌──────────────────┐
   │                  │
   │   [Your Card]    │  ← Position here
   │                  │
   └──────────────────┘

   "Position card in frame"
```

### When Card is Detected

- White guide box turns **green**
- Progress bar appears
- "Card detected! Hold steady..." message
- Counter shows 1/5, 2/5, etc.
- Box pulses gently

### On Confirmation (5/5 frames)

- AR mascot appears immediately
- Floating animation
- Speech bubble with question
- GPS proximity indicator
- Location badge

---

## ⚙️ Detection Settings

### Confidence Threshold

Currently set to **40%** (0.4):

```typescript
// In card-detector.ts
if (confidence > 0.4) {
  // Card match!
}
```

**Lower threshold** (e.g., 0.3) → Detects easier but more false positives
**Higher threshold** (e.g., 0.6) → More accurate but harder to detect

### Frame Confirmation

Currently requires **5 consecutive frames**:

```typescript
// In ARCardScanner.tsx
if (newCount >= 5) {
  // Card confirmed!
}
```

**Fewer frames** (e.g., 3) → Faster detection, less stable
**More frames** (e.g., 7) → More stable, slower confirmation

### Detection Speed

Runs at **5 FPS** (every 200ms):

```typescript
// In ARCardScanner.tsx
setInterval(() => {
  detectCard();
}, 200);
```

**Lower interval** (e.g., 100ms) → Faster but more CPU
**Higher interval** (e.g., 300ms) → Slower but efficient

---

## 🔧 Troubleshooting

### Problem: Card Not Detected

**Symptoms:**
- Camera works but no green box
- Progress never starts
- "Scanning for cards..." stays indefinitely

**Solutions:**

1. **Improve Lighting**
   - Ensure bright, even lighting
   - Avoid shadows on card
   - Don't backlight the card

2. **Card Distance**
   - Hold card 20-40cm from camera
   - Fill about 60-80% of guide box
   - Not too close, not too far

3. **Card Orientation**
   - Hold card upright (portrait)
   - Face forward toward camera
   - Avoid tilting/rotating

4. **Card Condition**
   - Use clean, crisp cards
   - Avoid bent/damaged cards
   - Print high-quality if using images

5. **Adjust Threshold**
   Edit `src/lib/scanner/card-detector.ts`:
   ```typescript
   if (confidence > 0.3) { // Changed from 0.4
   ```

### Problem: False Detections

**Symptoms:**
- Detects wrong cards
- Detects when no card present
- Random confirmations

**Solutions:**

1. **Increase Threshold**
   ```typescript
   if (confidence > 0.6) { // Changed from 0.4
   ```

2. **More Confirmation Frames**
   Edit `src/components/scanner/ARCardScanner.tsx`:
   ```typescript
   if (newCount >= 7) { // Changed from 5
   ```

3. **Better Reference Images**
   - Ensure `/assets/heart.png` and `/assets/king.png` are clear
   - High resolution (current: ~9-12MB each is good!)
   - Clean background

### Problem: Slow Detection

**Symptoms:**
- Takes 5+ seconds to confirm
- Feels sluggish

**Solutions:**

1. **Reduce Confirmation Frames**
   ```typescript
   if (newCount >= 3) { // Changed from 5
   ```

2. **Increase Detection FPS**
   ```typescript
   setInterval(() => {
     detectCard();
   }, 100); // Changed from 200ms
   ```

3. **Check Device Performance**
   - Close other apps
   - Use modern browser (Chrome/Edge)
   - Ensure good CPU/GPU

### Problem: Camera Won't Start

**See CAMERA_TROUBLESHOOTING.md** for camera-specific issues.

---

## 📊 Detection Algorithm

### How It Works

1. **Capture Frame**: Take snapshot from camera video feed
2. **Load Template**: Get reference card image (heart.png or king.png)
3. **Calculate Histograms**: Create color distribution profiles
4. **Compare**: Use histogram correlation
5. **Score**: Calculate confidence (0-1)
6. **Threshold**: Accept if > 0.4
7. **Confirm**: Require 5 consecutive matches
8. **Trigger**: Show AR mascot!

### Color Detection Bonus

The detector also checks for dominant colors:
- **Red** → Likely hearts
- **Black** → Likely spades

This adds extra validation for suit detection.

---

## 🎯 Three Scanner Modes

### 1. Card Recognition Mode (Default) ⭐

```
http://localhost:3000/scanner?questId=quest_test_newtown
```

**Features:**
- Real playing card detection
- Image recognition
- AR experience
- Most realistic!

### 2. QR Code Mode (Fallback)

```
http://localhost:3000/scanner?questId=quest_test_newtown&qr=true
```

**Features:**
- Scan QR codes instead
- Faster detection
- Good for testing
- Use if cards don't work

### 3. Mock Mode (Testing)

```
http://localhost:3000/scanner?questId=quest_test_newtown&mock=true
```

**Features:**
- No camera needed
- Click buttons
- Instant
- Perfect for dev testing

**Switching modes:**
- If card detection fails, error message shows "Try QR Mode" and "Try Mock Mode" buttons
- Or manually add `&qr=true` or `&mock=true` to URL

---

## 🧪 Testing Checklist

### Card Recognition Mode
- [ ] Camera opens without errors
- [ ] Instructions show: "Point camera at playing card"
- [ ] White guide box visible in center
- [ ] Hold Ace of Hearts card in frame
- [ ] Guide box turns green
- [ ] Progress bar appears and fills (1/5 → 5/5)
- [ ] "Card confirmed!" message
- [ ] AR mascot appears with floating animation
- [ ] Speech bubble shows question preview
- [ ] GPS proximity indicator shows
- [ ] Tap speech bubble → Question overlay opens
- [ ] Answer "Spades" → Success
- [ ] Navigate to next location
- [ ] Repeat with King of Spades

### Error Handling
- [ ] Point at wrong card → No detection or wrong card error
- [ ] Too far away (GPS) → Distance error message
- [ ] Try to scan King before Ace → Sequential error
- [ ] Camera permission denied → Error with helpful message

---

## 📸 Best Practices for Card Scanning

### ✅ DO:
- Use clean, standard playing cards
- Ensure good, even lighting
- Hold card steady in center of frame
- Wait for 5-frame confirmation
- Position card 20-40cm from camera

### ❌ DON'T:
- Move card around quickly
- Use bent/damaged cards
- Scan in very dark or very bright conditions
- Tilt card at extreme angles
- Hold too close (<10cm) or too far (>50cm)

---

## 🔬 Advanced: Improving Detection

### Option 1: Use TensorFlow.js (Future Enhancement)

For even better detection, consider:
```bash
npm install @tensorflow/tfjs @tensorflow-models/coco-ssd
```

Train a custom model on your specific cards for 95%+ accuracy.

### Option 2: Feature Detection

Use OpenCV.js for feature matching:
```bash
npm install opencv.js
```

Detect card corners, edges, and patterns.

### Option 3: ARCore/ARKit

For true AR with 3D tracking:
- Use native AR frameworks
- Better lighting compensation
- 3D object placement
- Gesture recognition

---

## 📁 File Structure

```
src/
├── lib/scanner/
│   ├── card-detector.ts          ← Card recognition logic
│   ├── qr-scanner.ts             ← QR fallback
│   └── validator.ts              ← Location validation
├── components/scanner/
│   ├── ARCardScanner.tsx         ← Card camera component
│   ├── RealQRScanner.tsx         ← QR camera component
│   └── MockScanner.tsx           ← Testing component
├── components/ar/
│   └── ARMascotView.tsx          ← AR mascot display
└── app/scanner/
    └── page.tsx                  ← Scanner page router

public/cards/
├── ace-hearts.png                ← Reference image
└── king-spades.png               ← Reference image
```

---

## 🎉 Success Criteria

You'll know it's working when:

1. ✅ Camera opens smoothly
2. ✅ Guide box appears
3. ✅ Card in frame turns box green
4. ✅ Progress fills to 5/5
5. ✅ AR mascot pops up with animation
6. ✅ Question works correctly
7. ✅ GPS validation succeeds
8. ✅ Quest completes

---

## 🆘 Need Help?

### Check Console Logs

Look for:
```
✓ Loaded template: Ace of Hearts
✓ Loaded template: King of Spades
✓ Card detection service initialized
✓ Camera started successfully
✓ Card confirmed: ACE-HEARTS-NEWTOWN
```

### Common Console Errors

1. **"Failed to load template"** → Check images in `/public/cards/`
2. **"Camera access denied"** → Grant camera permission
3. **"Detection error"** → Check browser compatibility

### Still Not Working?

1. Try **QR Mode**: Add `&qr=true` to URL
2. Try **Mock Mode**: Add `&mock=true` to URL
3. Check **CAMERA_TROUBLESHOOTING.md**
4. Verify card images exist in `/public/cards/`

---

**Your AR card scanner is ready! Point camera at your Ace of Hearts or King of Spades card to start the quest!** 🎴✨
