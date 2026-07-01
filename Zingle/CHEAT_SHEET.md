# ⚡ Zingle Swipe Implementation - Cheat Sheet

## 🎯 Core Implementation Files

### 1. Swipe Gesture Handler
**File:** `src/screens/Home/SwipeScreen.tsx`

```typescript
// Key Constants
const SWIPE_THRESHOLD = 100;        // px to register swipe
const VELOCITY_THRESHOLD = 0.5;     // velocity units
const ANIMATION_DURATION = 300;     // ms

// Swipe Detection
if (dy < -100 || velocityY < -0.5)       // UP = SUPERLIKE
if (dx > 100 || velocityX > 0.5)         // RIGHT = LIKE
if (dx < -100 || velocityX < -0.5)       // LEFT = PASS

// Animation
Animated.timing(pan, {
  toValue: { x: width, y: 0 },  // RIGHT
  duration: 300,
  useNativeDriver: false,
}).start();
```

### 2. Icon System
**File:** `src/navigation/BottomTabNavigator/index.tsx`

```typescript
const tabIconMap = {
  Home: 'heart',        // ❤️
  Likes: 'star',        // ⭐
  Chat: 'message-text', // 💬
  Profile: 'account',   // 👤
} as const;

// Using MaterialCommunityIcons
<Icon name={iconName} size={24} color={color} />
```

### 3. Colors for Actions
**File:** `src/styling/globalStyles/colors.ts`

```typescript
like: #FF4458          // Red
pass: #9CA3AF          // Gray
superlike: #FAB938     // Gold
match: #3FD4B4         // Teal
```

## 🚀 Quick Implementation Guide

### Adding a New Swipe Action
1. Update threshold in `SwipeScreen.tsx`
2. Add action handler
3. Update animation logic
4. Add status display
5. Update store integration

### Customizing Colors
1. Edit `colors.ts`
2. Update in `SwipeScreen.tsx` status display
3. Run type check
4. Test on device

### Changing Tab Icons
1. Find icon name in MaterialCommunityIcons
2. Update `tabIconMap` in `BottomTabNavigator.tsx`
3. Run type check

## 📱 Testing Patterns

### Manual Test Command
```bash
npm start
# Then tap the app
# Swipe any direction on card
```

### Debug Mode
```typescript
console.log('Velocity X:', velocityX);
console.log('Distance X:', dx);
console.log('Action:', action);
```

## 🔍 Common Tweaks

### Speed/Responsiveness
- `ANIMATION_DURATION`: Lower = faster exit
- Velocity threshold: Lower = more sensitive
- Distance threshold: Lower = quicker trigger

### Visual Feel
- Card rotation: Change -30 to ±X degrees
- Next card scale: 0.95 → adjust opacity/scale
- Spring tension: Change Animated.spring() tension

### Colors
- Update hex codes in `colors.ts`
- Theme auto-applies to all screens

## 📊 File Quick Links

| Feature | File | Key Function |
|---------|------|--------------|
| Swipe Animation | `SwipeScreen.tsx` | `panResponder` |
| Bottom Icons | `BottomTabNavigator/index.tsx` | `tabIconMap` |
| Colors | `colors.ts` | `like`, `pass`, `superlike` |
| SafeArea | `App.tsx` | `SafeAreaProvider` |
| Types | `react-native-vector-icons.d.ts` | Icon declarations |

## 🎬 Animation Timeline

```
0ms   → User touches card
0-Xms → Drag tracking (PanResponder.onMove)
Xms   → User releases
Xms+5 → Check velocity/distance
Xms+10 → Start animation (Animated.timing)
Xms+310 → Animation complete, load next card
Xms+315 → Card stack preview animates up
```

## 🐛 Debugging Checklist

- [ ] Check `vx` and `vy` values being captured
- [ ] Verify thresholds are reasonable
- [ ] Test on multiple devices (different sizes)
- [ ] Check SafeArea on notched devices
- [ ] Verify icons render (check Icon imports)
- [ ] Confirm colors match design
- [ ] Test with slow/fast swipes
- [ ] Check memory in DevTools

## 💡 Pro Tips

1. **Use `useWindowDimensions()`** - Gets screen width for calculations
2. **Use `PanResponder`** - Better than `GestureHandler` for simple swipes
3. **Native driver** - Set `useNativeDriver: false` for XY transforms
4. **Velocity** - More reliable than distance for quick flicks
5. **Spring animations** - Better feel for "reset" than timing

## 🎨 CSS-like Flexbox Reference

```typescript
// Container
container: {
  flex: 1,
  justifyContent: 'center',    // Vertical
  alignItems: 'center',         // Horizontal
}

// Card
card: {
  width: '100%',
  aspectRatio: 9/16,            // Ratio-based sizing
  borderRadius: 20,
}
```

## 🔄 State Management Integration

```typescript
// Use Zustand store
const { setProfiles } = useMatchStore();

// Update on action
setProfiles(updatedProfiles);

// Listen in other screens
const { profiles } = useMatchStore();
```

## 📦 Dependencies Used

```json
{
  "react-native": "0.81.0",
  "react-native-vector-icons": "^10.3.0",
  "@react-navigation/bottom-tabs": "^7.18.2",
  "react-native-safe-area-context": "^5.8.0"
}
```

---

**Keep this handy for quick reference while developing! 🚀**
