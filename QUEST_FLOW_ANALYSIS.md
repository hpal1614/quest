# 🎯 Complete Quest Flow Analysis - Start to End

## 📊 **Quest Flow Overview**

The Sydney Quest system follows a **sequential, location-based progression** with GPS validation, AR scanning, and interactive questions. Here's the complete flow:

---

## 🚀 **Phase 1: App Initialization**

### **1.1 App Launch**
```
User opens app → Onboarding screen (first time only)
```

**Files:** `src/app/page.tsx`, `src/components/ui/Onboarding.tsx`

**Flow:**
- ✅ Check if onboarding completed (`useUserStore`)
- ✅ Show onboarding if first time
- ✅ Request GPS permissions
- ✅ Request camera permissions (optional)

### **1.2 GPS & Location Setup**
```
GPS initialization → Location detection → Quest sorting
```

**Files:** `hooks/useGeolocation.ts`, `lib/gps/distance.ts`

**Flow:**
- ✅ Get user's current location
- ✅ Calculate distances to all quest start points
- ✅ Sort quests by proximity (nearest first)
- ✅ Show distance indicators (🔥🔥🔥 Very close, 🔥🔥 Getting warmer, etc.)

---

## 🏠 **Phase 2: Quest Discovery**

### **2.1 Quest List Display**
```
Location detected → Filter active quests → Sort by distance → Display cards
```

**Files:** `src/app/page.tsx`, `src/components/quest/QuestCard.tsx`

**Quest States:**
- 🟢 **Available** (within 50m) - Pulsing animation, "START QUEST" button
- 🟡 **Nearby** (50-200m) - "Getting warmer" indicator
- 🔴 **Far** (>200m) - "Keep searching" indicator

**Test Quest Example:**
```typescript
{
  id: 'quest_test_cards',
  title: 'Test Quest - Face Cards',
  locations: [
    { id: 'start', qrCode: 'ACE-HEARTS', name: 'Office - CBD Sydney' },
    { id: 'location_a', qrCode: 'KING-SPADES', name: 'King of Spades' },
    { id: 'location_b', qrCode: 'QUEEN-HEARTS', name: 'Queen of Hearts' },
    { id: 'location_c', qrCode: 'JACK-DIAMONDS', name: 'Jack of Diamonds' },
    { id: 'finish', qrCode: 'JOKER', name: 'Joker Card' }
  ]
}
```

---

## 🎮 **Phase 3: Quest Start**

### **3.1 Quest Selection**
```
User clicks quest → Quest detail page → Progress check → Start button
```

**Files:** `src/app/quest/[id]/page.tsx`, `src/components/quest/ProgressTracker.tsx`

**Flow:**
- ✅ Show quest details and locations
- ✅ Display progress tracker (dots for each location)
- ✅ Show current clue
- ✅ Check GPS proximity to start location
- ✅ Enable "START QUEST" or "SCAN" button

### **3.2 Quest Initialization**
```
Start quest → Create progress record → Set current location → Show first clue
```

**Files:** `src/store/questStore.ts`

**State Creation:**
```typescript
{
  questId: 'quest_test_cards',
  status: 'in_progress',
  startedAt: '2024-10-27T...',
  currentLocationId: 'start',
  completedLocationIds: [],
  hintsUsed: {},
  questStarted: true
}
```

---

## 📱 **Phase 4: AR Scanning**

### **4.1 Scanner Launch**
```
Scan button → GPS validation → Scanner page → AR initialization
```

**Files:** `src/app/scanner/page.tsx`, `src/components/scanner/EnhancedARImageScanner.tsx`

**Scanner Modes:**
1. **Enhanced AR** (Default) - True AR with 3D models
2. **Mock Scanner** - Button-based testing
3. **QR Scanner** - Standard QR code scanning
4. **Card Scanner** - Playing card recognition

### **4.2 AR Experience**
```
Camera opens → Target detection → 3D models appear → Quest continues
```

**AR Flow:**
- ✅ Camera opens with instructions
- ✅ "Point camera at the postcard"
- ✅ MindAR detects postcard.mind target
- ✅ 3D models appear: Rooey, Griffin, Burj Khalifa
- ✅ Animations start (building rotates, bird flies)
- ✅ After 2 seconds: Quest continues

### **4.3 Validation Process**
```
Scan detected → QR validation → GPS check → Sequence check → Success/Error
```

**Files:** `src/lib/scanner/validator.ts`

**Validation Steps:**
1. ✅ **QR Code Recognition** - Is it a valid quest code?
2. ✅ **GPS Proximity** - Within radius (50m default)?
3. ✅ **Quest Started** - Has quest been initiated?
4. ✅ **Sequence Check** - Scanning in correct order?

**Error Handling:**
- ❌ "QR code not recognized"
- ❌ "You're 250m away. Move within 50m to scan"
- ❌ "Scan the Start QR code first"
- ❌ "Complete previous locations first"

---

## ❓ **Phase 5: Question & Answer**

### **5.1 Question Display**
```
Valid scan → AR mascot view → Speech bubble → Question overlay
```

**Files:** `src/components/ar/ARMascotView.tsx`, `src/components/quest/QuestionOverlay.tsx`

**Question Flow:**
- ✅ Show AR mascot with floating animation
- ✅ Display speech bubble with question preview
- ✅ User taps bubble → Question overlay opens
- ✅ Show full question text and answer input

### **5.2 Answer Processing**
```
User submits answer → Validation → Correct/Wrong → Progress update
```

**Answer Validation:**
```typescript
// Fuzzy matching with alternatives
const correct = fuzzyMatch(userAnswer, [
  location.question.answer,
  ...location.question.alternativeAnswers
]);
```

**Correct Answer Flow:**
- ✅ Show "CORRECT!" feedback
- ✅ Update progress to next location
- ✅ If finish location: Generate voucher
- ✅ Return to quest detail page

**Wrong Answer Flow:**
- ❌ Show "Not Quite..." feedback
- ✅ Increment hint level (1-3)
- ✅ Show progressive hint
- ✅ Allow retry (unlimited attempts)

### **5.3 Progressive Hints**
```
Wrong answer 1 → Hint 1 → Wrong answer 2 → Hint 2 → Wrong answer 3 → Hint 3
```

**Hint System:**
- **Hint 1:** Broad hint ("It's a black suit")
- **Hint 2:** Narrower hint ("It looks like an upside down heart")
- **Hint 3:** Almost the answer ("The answer is Spades")

---

## 📈 **Phase 6: Progress Tracking**

### **6.1 Location Completion**
```
Correct answer → Update progress → Move to next location → Show new clue
```

**Files:** `src/store/questStore.ts`, `src/hooks/useQuestProgress.ts`

**Progress Update:**
```typescript
updateProgress(questId, nextLocationId);
// Updates: currentLocationId, completedLocationIds
```

### **6.2 Quest Detail Updates**
```
Progress change → Re-render quest page → Update progress tracker → Show new clue
```

**Visual Updates:**
- ✅ Progress dots fill in sequence
- ✅ Completion percentage updates
- ✅ Current clue changes
- ✅ Distance to next location updates

---

## 🏁 **Phase 7: Quest Completion**

### **7.1 Final Location**
```
Last question answered → Quest completion → Voucher generation → Celebration
```

**Completion Flow:**
- ✅ Detect finish location (`location.type === 'finish'`)
- ✅ Generate unique voucher code: `SQ-W1-${timestamp}`
- ✅ Create completion record
- ✅ Show celebration animation
- ✅ Redirect to quest detail

### **7.2 Voucher System**
```
Quest complete → Generate voucher → Save to history → Show voucher code
```

**Voucher Generation:**
```typescript
const voucherCode = `SQ-${quest.id.substring(7, 9).toUpperCase()}-${Date.now().toString(36)}`;
completeQuest(quest.id, voucherCode);
```

**Completion Record:**
```typescript
{
  questId: 'quest_test_cards',
  completedAt: '2024-10-27T...',
  voucherCode: 'SQ-TC-abc123',
  hintsUsed: { 'location_a': 2, 'location_b': 1 },
  completionTime: '00:15:30'
}
```

---

## 📚 **Phase 8: History & Persistence**

### **8.1 Progress Persistence**
```
All actions → Zustand store → localStorage → Browser refresh survival
```

**Files:** `src/store/questStore.ts`, `src/lib/storage/localStorage.ts`

**Persistence:**
- ✅ Quest progress saved automatically
- ✅ Hint usage tracked
- ✅ Completion status preserved
- ✅ Survives browser refresh/close

### **8.2 Quest History**
```
Completed quests → History page → Voucher display → Replay option
```

**Files:** `src/app/history/page.tsx`

**History Features:**
- ✅ List all completed quests
- ✅ Show completion dates
- ✅ Display voucher codes
- ✅ Show hints used per quest
- ✅ Completion time tracking

---

## 🔄 **Complete Flow Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                        QUEST FLOW DIAGRAM                       │
└─────────────────────────────────────────────────────────────────┘

1. APP LAUNCH
   ↓
   Onboarding (first time) → GPS Setup → Quest List

2. QUEST DISCOVERY
   ↓
   Location Detection → Distance Calculation → Quest Sorting
   ↓
   Quest Cards (Available/Nearby/Far) → Quest Selection

3. QUEST START
   ↓
   Quest Detail → Progress Check → Start Quest
   ↓
   Progress Record Created → First Location Set

4. AR SCANNING LOOP
   ┌─────────────────────────────────────────────────────────────┐
   │  Scan Button → GPS Check → Scanner Page                     │
   │       ↓                                                     │
   │  Enhanced AR → Camera → Target Detection                    │
   │       ↓                                                     │
   │  3D Models → Animations → Validation                       │
   │       ↓                                                     │
   │  Valid Scan → AR Mascot → Speech Bubble                    │
   │       ↓                                                     │
   │  Question Overlay → Answer Input → Validation               │
   │       ↓                                                     │
   │  Correct? → Progress Update → Next Location                 │
   │       ↓                                                     │
   │  Wrong? → Hint System → Retry                              │
   └─────────────────────────────────────────────────────────────┘
   │
   ↓ (Repeat for each location)

5. QUEST COMPLETION
   ↓
   Final Question → Voucher Generation → Celebration
   ↓
   Completion Record → History Update → Quest Detail

6. PERSISTENCE
   ↓
   All Progress → Zustand Store → localStorage → History Page
```

---

## 🎯 **Key Features Analysis**

### **✅ GPS Integration**
- **Real-time location tracking**
- **Distance-based quest sorting**
- **Proximity validation (50m radius)**
- **Distance indicators with emojis**

### **✅ AR Experience**
- **True AR with MindAR + Three.js**
- **3D models: Rooey, Griffin, Burj Khalifa**
- **Animations and interactions**
- **Fallback to QR/Mock modes**

### **✅ Question System**
- **Fuzzy answer matching**
- **Progressive hints (3 levels)**
- **Unlimited retries**
- **Alternative answers support**

### **✅ Progress Tracking**
- **Sequential location progression**
- **Visual progress indicators**
- **Hint usage tracking**
- **Completion time measurement**

### **✅ Persistence**
- **Browser localStorage**
- **Survives refresh/close**
- **Quest history**
- **Voucher management**

---

## 🧪 **Test Quest Flow Example**

### **Test Quest: Face Cards**
```
1. START: Office - CBD Sydney
   QR: ACE-HEARTS
   Action: Scan → No question → Progress to next

2. CHECKPOINT: King of Spades
   QR: KING-SPADES
   Question: "What suit is the King card?"
   Answer: "Spades" (or "spade")
   Hints: "It's a black suit" → "It looks like an upside down heart" → "The answer is Spades"

3. CHECKPOINT: Queen of Hearts
   QR: QUEEN-HEARTS
   Question: "What color is the Hearts suit?"
   Answer: "Red"

4. CHECKPOINT: Jack of Diamonds
   QR: JACK-DIAMONDS
   Question: "How many cards are in a standard deck?"
   Answer: "52"

5. FINISH: Joker Card
   QR: JOKER
   Question: "What is the wild card in most games?"
   Answer: "Joker"
   Result: Quest Complete → Voucher Generated
```

---

## 📊 **State Management Flow**

### **Quest Store State:**
```typescript
{
  activeQuests: [
    {
      questId: 'quest_test_cards',
      status: 'in_progress',
      currentLocationId: 'location_a',
      completedLocationIds: ['start'],
      hintsUsed: { 'location_a': 1 }
    }
  ],
  completedQuests: [
    {
      questId: 'quest_week1_urban',
      completedAt: '2024-10-26T...',
      voucherCode: 'SQ-W1-xyz789'
    }
  ]
}
```

### **Progress Calculation:**
```typescript
completionPercentage = (completedLocationIds.length / totalLocations) * 100
currentLocation = quest.locations.find(l => l.id === currentLocationId)
nextLocation = quest.locations[currentIndex + 1]
```

---

## 🎉 **Quest Flow Summary**

**The Sydney Quest system provides a complete, immersive experience:**

1. **📍 Location-Based Discovery** - GPS-powered quest finding
2. **🎯 AR-Enhanced Scanning** - True AR with 3D models
3. **❓ Interactive Questions** - Progressive hints and fuzzy matching
4. **📈 Progress Tracking** - Visual indicators and persistence
5. **🏆 Completion Rewards** - Voucher generation and history
6. **🔄 Robust Fallbacks** - Multiple scanner modes for reliability

**The flow is designed to be:**
- ✅ **Intuitive** - Clear progression and feedback
- ✅ **Robust** - Multiple fallback options
- ✅ **Persistent** - Survives browser refresh
- ✅ **Engaging** - AR, animations, and gamification
- ✅ **Accessible** - Works with or without AR

**Ready for testing and production deployment!** 🚀
