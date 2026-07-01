# 🧪 Swipe Animation Testing Guide

## Quick Start
```bash
cd Zingle
npm install  # if needed
npm start    # Start Metro bundler
```

Then select your platform (iOS/Android)

## Test Scenarios

### 1. Home Screen Swipe Gestures
**Objective:** Verify smooth swipe animations with proper card transitions

#### Test Case 1.1: Swipe Left (Pass)
- [ ] Drag card left by 150+ pixels
- [ ] Card should rotate counter-clockwise (-30°)
- [ ] "✕ PASS" status should appear
- [ ] Next card should slide up smoothly
- [ ] Previous card should exit left and disappear

#### Test Case 1.2: Swipe Right (Like)
- [ ] Drag card right by 150+ pixels
- [ ] Card should rotate clockwise (+30°)
- [ ] "❤️ LIKE" status should appear in red
- [ ] Next card should slide up smoothly
- [ ] Card exits right and disappears

#### Test Case 1.3: Swipe Up (Super Like)
- [ ] Drag card upward by 150+ pixels
- [ ] Card should move upward
- [ ] "⭐ SUPERLIKE" status should appear in gold
- [ ] Next card should slide up smoothly
- [ ] Card exits upward and disappears

#### Test Case 1.4: Quick Swipe with Velocity
- [ ] Quickly flick card in any direction (minimal drag distance)
- [ ] Card should exit based on velocity direction
- [ ] Animation should be smooth and not feel laggy

#### Test Case 1.5: Cancelled Swipe (Spring Back)
- [ ] Drag card ~50 pixels (less than threshold)
- [ ] Release finger
- [ ] Card should spring back to center position smoothly
- [ ] No action should be recorded

#### Test Case 1.6: Card Stack Preview
- [ ] Observe card while swiping
- [ ] Next card should be visible underneath at:
  - [ ] Slightly smaller scale (0.95)
  - [ ] Slightly lower position (20px down)
  - [ ] Slight opacity reduction (0.7)

### 2. Action Buttons
**Objective:** Verify fallback button interactions

#### Test Case 2.1: Pass Button (❌)
- [ ] Tap pass button
- [ ] Current card should animate out left
- [ ] Next card should appear

#### Test Case 2.2: Super Like Button (⭐)
- [ ] Tap super like button
- [ ] Current card should animate upward
- [ ] Status shows "SUPERLIKE"

#### Test Case 2.3: Like Button (❤️)
- [ ] Tap like button
- [ ] Current card should animate out right
- [ ] Next card should appear

#### Test Case 2.4: Message Button (💬)
- [ ] Tap message button (optional - can log or navigate)

### 3. Bottom Tabs Navigation
**Objective:** Verify tab icons and navigation

#### Test Case 3.1: Tab Icons Display
- [ ] Home tab shows heart icon ❤️
- [ ] Likes tab shows star icon ⭐
- [ ] Chat tab shows message icon 💬
- [ ] Profile tab shows account icon 👤
- [ ] No emoji fallbacks visible
- [ ] Icons are properly colored (red when active)

#### Test Case 3.2: Tab Switching
- [ ] Tap each tab
- [ ] Navigation should be instant
- [ ] No visual glitches
- [ ] Active tab indicator works

### 4. Content/Status Bar
**Objective:** Verify proper safe area handling

#### Test Case 4.1: Status Bar Not Covered
- [ ] Content should not overlap status bar
- [ ] Top padding visible on all screens
- [ ] Notch handled correctly (if applicable)

#### Test Case 4.2: Safe Area on All Screens
- [ ] Home/Swipe screen: Logo visible, not under status bar
- [ ] Chat screen: "Messages" title not covered
- [ ] Likes screen: "Likes" title not covered
- [ ] Profile screen: Content properly spaced
- [ ] Matches screen: Content properly spaced

### 5. Empty State
**Objective:** Verify proper handling when no profiles exist

#### Test Case 5.1: No More Profiles
- [ ] Swipe through all available cards
- [ ] Empty state should display:
  - [ ] "No more profiles" message
  - [ ] "Come back later for more matches" subtitle
  - [ ] Clean, centered layout

### 6. Performance & Smoothness
**Objective:** Verify animations are smooth and performant

#### Test Case 6.1: 60 FPS Consistency
- [ ] Swipes should be buttery smooth
- [ ] No frame drops or stuttering
- [ ] Rotation should be smooth and linear
- [ ] Next card appearance should be instant

#### Test Case 6.2: Multiple Rapid Swipes
- [ ] Swipe 5+ cards rapidly
- [ ] No crashes or errors
- [ ] Animation performance maintains

#### Test Case 6.3: Long Sessions
- [ ] Use app for 5+ minutes
- [ ] Memory usage should remain stable
- [ ] No degradation in performance

## Expected Behavior Summary

| Action | Expected Result |
|--------|-----------------|
| Swipe Left | Card exits left with -30° rotation, "PASS" appears, next card slides up |
| Swipe Right | Card exits right with +30° rotation, "LIKE" appears in red |
| Swipe Up | Card exits upward, "SUPERLIKE" appears in gold |
| Partial Drag | Card springs back to center |
| Rapid Flick | Card exits based on velocity direction |
| Button Tap | Same animation as corresponding swipe |
| Empty State | Clean message with proper spacing |
| Tab Switch | Instant navigation, icon properly highlighted |
| Bottom of Screen | No white space, proper padding |

## Bug Report Format

If you encounter issues:

```
**Issue:** [Brief description]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]

**Expected:** [What should happen]
**Actual:** [What actually happened]
**Device:** [iOS/Android, version, device type]
**Video/Screenshot:** [Attach if possible]
```

## Success Criteria ✅

All tests pass when:
- [x] All swipe gestures work smoothly
- [x] All buttons animate correctly
- [x] Icons display (no emojis)
- [x] Content doesn't overlap status bar
- [x] 60 FPS performance maintained
- [x] Zero crashes in extended usage
- [x] Empty state displays properly

## Need Help?

Check these files for implementation details:
- Swipe logic: `src/screens/Home/SwipeScreen.tsx`
- Bottom tabs: `src/navigation/BottomTabNavigator/index.tsx`
- Colors: `src/styling/globalStyles/colors.ts`
- Types: `src/types/react-native-vector-icons.d.ts`
