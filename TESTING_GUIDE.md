# Testing Guide - Face Cards Quest

## 🎯 What's Been Set Up

I've created a **Test Quest** using playing cards so you can test all functionality!

---

## 🃏 Your Test Quest

**Quest:** "Test Quest - Face Cards" (Green gradient with 🃏 icon)
**Location:** Paddy's Markets, Haymarket (your current mock location)
**Cards to Scan:** 5 playing cards in sequence

---

## 📝 Card Sequence & Questions

### 1. ACE OF HEARTS (Start)
- **Location:** Paddy's Markets
- **Action:** Scan to start quest
- **Question:** None (it's the start)

### 2. KING OF SPADES
- **Question:** "What suit is the King card?"
- **Answer:** Spades
- **Hints:** 
  - It's a black suit
  - It looks like an upside down heart
  - The answer is Spades

### 3. QUEEN OF HEARTS
- **Question:** "What color is the Hearts suit?"
- **Answer:** Red
- **Hints:**
  - It's one of two colors in a deck
  - Not black
  - The answer is Red

### 4. JACK OF DIAMONDS
- **Question:** "How many cards are in a standard deck?"
- **Answer:** 52
- **Hints:**
  - It's between 50 and 55
  - Think 52 weeks in a year
  - The answer is 52

### 5. JOKER (Finish)
- **Question:** "What is the wild card in most games?"
- **Answer:** Joker
- **Hints:**
  - It's the card you're holding
  - Starts with J
  - The answer is Joker

---

## 🚀 How to Test

### Step 1: Refresh Browser
**http://localhost:3006**

### Step 2: Skip Permissions
- Click "Skip for now" on permission screen
- You'll go straight to Quest List

### Step 3: Find Test Quest
- Look for **"🃏 Test Quest - Face Cards"**
- It should be **GREEN and GLOWING** (available)
- Should say "0m away" since you're "at" the location

### Step 4: Start the Quest
- Click **"START QUEST"**
- You'll see the quest detail page
- Click **"📷 SCAN"** button

### Step 5: Mock Scanning
Instead of camera, you'll see a card selector:
1. Click **ACE-HEARTS** (to start)
2. Click **"Scan ACE-HEARTS"**
3. No question (start location)
4. Returns to quest detail

### Step 6: Continue Quest
1. Click **SCAN** again
2. Select **KING-SPADES**
3. Answer the question
4. Try wrong answer first to see hints!
5. Type the correct answer
6. Move to next card

### Step 7: Complete All Cards
- Work through all 5 cards
- Test hints system (try wrong answers)
- Test fuzzy matching (try "spade" vs "spades")
- Complete the quest!

---

## ✅ What to Test

### Quest Flow
- [ ] Quest list shows test quest as available
- [ ] Can start the quest
- [ ] Progress tracker updates (shows dots)
- [ ] GPS status shows "At Location"

### Scanning
- [ ] Mock scanner opens
- [ ] Can select cards from list
- [ ] Can type custom codes
- [ ] Validation works (wrong card = error)
- [ ] Sequential order enforced

### Questions
- [ ] Question overlay appears
- [ ] Can type answers
- [ ] Wrong answer shows hint level 1
- [ ] Second wrong shows hint level 2
- [ ] Third wrong shows hint level 3
- [ ] Correct answer moves to next location

### Answer Matching
- [ ] Case insensitive (red = Red = RED)
- [ ] Typo tolerance (spade = spades)
- [ ] Alternative answers work

### Progress
- [ ] Progress saves (refresh page)
- [ ] Can resume quest
- [ ] Hint count tracked
- [ ] Quest completes after last card

### Completion
- [ ] Celebration screen appears
- [ ] Voucher code generated
- [ ] Shows stats (time, hints)
- [ ] Quest marked as completed
- [ ] Appears in history

---

## 🎨 Testing Different Scenarios

### Test Wrong Sequence
1. Start quest with ACE-HEARTS
2. Try to scan QUEEN-HEARTS (skipping KING-SPADES)
3. Should show error: "Complete previous locations first"

### Test GPS Validation
All cards are within 50m of your mock location, so they should all work!

### Test Hint Progression
1. On KING-SPADES, type wrong answer: "diamonds"
2. See Hint 1
3. Type wrong again: "clubs"
4. See Hint 2
5. Type wrong again: "hearts"
6. See Hint 3
7. Type correct: "spades"
8. Moves to next!

### Test Fuzzy Matching
- Try "spade" instead of "spades" ✅
- Try "RED" instead of "red" ✅
- Try "52 cards" instead of "52" ✅
- Try "joker card" instead of "joker" ✅

---

## 🐛 If Something Breaks

1. **Open DevTools** (F12)
2. **Check Console** for errors
3. **Try refreshing** (Cmd/Ctrl + Shift + R)
4. **Check localStorage** (Application tab)

---

## 🔄 Reset Testing

If you want to start over:

### Option 1: In Browser Console
```javascript
localStorage.clear();
location.reload();
```

### Option 2: In Quest History
- Go to "Quest History"
- Click "Clear History"

---

## 📱 Mobile Testing

To test on your phone:
1. Find your local IP: `ifconfig | grep "inet "`
2. On phone: `http://YOUR_IP:3006`
3. Same testing flow!

---

## 🎉 Success Criteria

You've successfully tested when:
- ✅ Can complete full quest (5 cards)
- ✅ Hints work properly
- ✅ Progress saves
- ✅ Validation works
- ✅ Get voucher at end
- ✅ Quest appears in history

---

**Happy Testing!** 🃏🎯


