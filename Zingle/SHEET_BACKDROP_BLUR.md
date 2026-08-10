# Sheet Backdrop Blur — Zingle Reference

Working reference for using **live backdrop blur** behind bottom sheets with `react-native-parity-blur`.

## Project path (share this)

```
/Users/amansharma/Desktop/apps/Zingle/Zingle
```

Repo root for the RN app is the inner `Zingle` folder (where `package.json` lives).

---

## What “Filter” is in Zingle

| Term | Meaning in this app |
|------|---------------------|
| **Screen** | A navigator route (e.g. Swipe tab) |
| **Sheet** | Bottom-sheet UI that slides up |
| **Modal** | RN `<Modal>` used to present the sheet |

Filter is a **sheet inside a transparent Modal** — **not** a navigation screen.

Component: `src/components/molecules/FilterBottomSheet/index.tsx`  
Opened from: `src/screens/Home/SwipeScreen.tsx` (`filterOpen` state)

---

## Package

```bash
yarn add react-native-parity-blur
```

**Requirements**

- React Native **0.76+** with **New Architecture / Fabric** enabled  
  - Android: `android/gradle.properties` → `newArchEnabled=true`
- Native rebuild after install (JS reload is **not** enough)
  - Android: `yarn android`
  - iOS: `cd ios && pod install && cd .. && yarn ios`
- Android real blur: **API 31+** (`RenderEffect`). Below that → `fallbackColor` only.

Version used in Zingle: `react-native-parity-blur@0.1.3`

---

## The critical rule (why blur fails in most apps)

`react-native-parity-blur` captures content **in the same native window**.

React Native’s `<Modal>` is a **separate native window**.

So this **does not work** for real app blur:

```tsx
// ❌ WRONG — BlurView inside Modal cannot see the app behind it
<Modal transparent>
  <BlurView mode="live" style={StyleSheet.absoluteFill} />
  <SheetPanel />
</Modal>
```

You only get empty/fallback behind the sheet.

### Correct pattern (what Zingle uses)

1. Render **`BlurView` outside the Modal** (underlay in the app tree).
2. Keep Modal **`transparent`**.
3. Put only the **sheet panel** + an invisible **dismiss layer** inside the Modal.
4. Transparent Modal shows the blurred app underneath.

```
App screen (Swipe / Profile / Chat)
├── SheetBlurBackdrop  ← outside Modal, mode="live", pointerEvents="none"
└── Modal (transparent)
    ├── SheetDismissLayer  ← full-screen Pressable to close
    └── Sheet panel        ← opaque / surface UI on top
```

---

## Shared component in Zingle

**File:** `src/components/molecules/SheetBlurBackdrop/index.tsx`

```tsx
import React from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BlurView } from 'react-native-parity-blur';

interface SheetBlurBackdropProps {
  opacity: Animated.Value | Animated.AnimatedInterpolation<number>;
  onPress?: () => void;
  /** Prefer "underlay" for real blur of app content */
  placement?: 'underlay' | 'modal';
  style?: StyleProp<ViewStyle>;
}

export const SheetBlurBackdrop: React.FC<SheetBlurBackdropProps> = ({
  opacity,
  onPress,
  placement = 'underlay',
  style,
}) => {
  const blur = (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }, style]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        mode="live"                 // live = continuously recapture
        blurRadius={22}             // Gaussian sigma in dp (cross-platform)
        saturation={1.25}
        overlayColor="rgba(16, 16, 16, 0.38)"
        fallbackColor="rgba(20, 20, 20, 0.78)" // Android <31 / Reduce Transparency
        quality="balanced"
        maxFps={30}
      />
    </Animated.View>
  );

  if (placement === 'underlay') {
    return (
      <View style={styles.underlay} pointerEvents="none">
        {blur}
      </View>
    );
  }

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onPress}>
      {blur}
    </Pressable>
  );
};

export const SheetDismissLayer: React.FC<{ onPress: () => void }> = ({
  onPress,
}) => <Pressable style={StyleSheet.absoluteFill} onPress={onPress} />;

const styles = StyleSheet.create({
  underlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 900,
    elevation: 900,
  },
});
```

Exported from: `src/components/molecules/index.ts`

---

## How every sheet wires it (Filter example)

**File:** `src/components/molecules/FilterBottomSheet/index.tsx`

```tsx
if (!visible) return null;

return (
  <>
    {/* 1) Live blur UNDER the modal (app window) */}
    <SheetBlurBackdrop
      opacity={backdropOpacity}
      placement="underlay"
    />

    {/* 2) Transparent modal = sheet only */}
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.modalRoot} pointerEvents="box-none">
        {/* 3) Tap outside to dismiss (no dark View — blur is the backdrop) */}
        <SheetDismissLayer onPress={() => closeSheet()} />

        {/* 4) The actual sheet panel */}
        <Animated.View
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              backgroundColor: theme.colors.surface,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* sheet content */}
        </Animated.View>
      </View>
    </Modal>
  </>
);
```

Same pattern is used in:

- `FilterBottomSheet`
- `BoostBottomSheet`
- `PaywallBottomSheet`
- `SettingsBottomSheet`
- `AttachmentSheet`
- `VerifiedBottomSheet`
- `SafetyPrivacyBottomSheet`
- `ProfileSectionSheet`
- `BottomSheet` (shared base)

---

## Blur props we use (quick reference)

| Prop | Zingle value | Notes |
|------|--------------|--------|
| `mode` | `"live"` | Recaptures while visible (`"static"` = one snapshot) |
| `blurRadius` | `22` | Cross-platform sigma in dp |
| `saturation` | `1.25` | Slight color boost after blur |
| `overlayColor` | `rgba(16,16,16,0.38)` | Dark tint over blur |
| `fallbackColor` | `rgba(20,20,20,0.78)` | Flat color when real blur unavailable |
| `maxFps` | `30` | Cap for live mode |

Docs from the package: `docs/BOTTOM_SHEET_BACKDROP.md` inside `node_modules/react-native-parity-blur` (or the package README on npm).

---

## Where to open sheets in Zingle to verify

1. **Swipe** → filter (tune) icon → Filter sheet  
2. **Swipe** → Boost (flash) → Boost sheet  
3. **Profile** → Settings → Settings sheet  
4. **Chat thread** → `+` → Attachment sheet  

---

## Checklist for the other project

- [ ] New Architecture enabled  
- [ ] `react-native-parity-blur` installed + **native rebuild**  
- [ ] Blur is **outside** Modal (`placement="underlay"`), not inside  
- [ ] Modal is `transparent`  
- [ ] Dismiss pressable is inside Modal; blur underlay has `pointerEvents="none"`  
- [ ] Sheet panel sits on top of the dismiss layer  
- [ ] Parent of the underlay can fill the screen (`absoluteFill` / flex screen)  

---

## Common failure modes

1. **BlurView only inside Modal** → no real app content captured → flat/fallback look.  
2. **Forgot native rebuild** after adding the package.  
3. **New Arch off** → package won’t work (Fabric-only).  
4. **Android API &lt; 31** → only `fallbackColor` (by design).  
5. **Underlay parent collapsed / not full screen** → blur area height 0.  
6. **`react-native-screens` too new for RN 0.81** → codegen break; Zingle pins `react-native-screens@4.25.2`.

---

## Files to copy / read first

```
/Users/amansharma/Desktop/apps/Zingle/Zingle/src/components/molecules/SheetBlurBackdrop/index.tsx
/Users/amansharma/Desktop/apps/Zingle/Zingle/src/components/molecules/FilterBottomSheet/index.tsx
/Users/amansharma/Desktop/apps/Zingle/Zingle/package.json   # dependency + screens pin
/Users/amansharma/Desktop/apps/Zingle/Zingle/android/gradle.properties  # newArchEnabled=true
```
