# 📐 Spacing & Layout Reference Guide

## Quick Navigation
- [Spacing Scale](#spacing-scale)
- [Abbreviations](#abbreviations)
- [Common Patterns](#common-patterns)
- [Examples](#examples)
- [Responsive Scaling](#responsive-scaling)

---

## Spacing Scale

All spacing values are responsive and scale based on device size:

```
xs   →  4px    (minimal gaps)
sm   →  8px    (small spacing)
md   → 12px    (standard)
lg   → 16px    (comfortable)
xl   → 20px    (emphasized)
2xl  → 24px    (large)
3xl  → 32px    (section)
4xl  → 40px    (major)
```

### Usage Pattern
```typescript
import { metrics } from '@styling/metrics';

metrics.spacing.xs      // 4px
metrics.spacing.sm      // 8px
metrics.spacing.md      // 12px
metrics.spacing.lg      // 16px
metrics.spacing.xl      // 20px
metrics.spacing['2xl']  // 24px
metrics.spacing['3xl']  // 32px
metrics.spacing['4xl']  // 40px
```

---

## Abbreviations

### **VS** - Vertical Spacing
Gap between vertically stacked elements (top-to-bottom)

```typescript
// Between two elements
<View>
  <Text>First</Text>
  <View style={{ height: metrics.spacing.lg }} />  {/* VS: lg gap */}
  <Text>Second</Text>
</View>

// Using margin
<View style={{ marginVertical: metrics.spacing.lg }}>
  Content
</View>

// Using padding
<View style={{ paddingVertical: metrics.spacing.lg }}>
  Content
</View>
```

### **HS** - Horizontal Spacing
Gap between horizontally aligned elements (left-to-right)

```typescript
// Between two elements
<View style={{ flexDirection: 'row' }}>
  <Icon />
  <View style={{ width: metrics.spacing.md }} />  {/* HS: md gap */}
  <Text>Label</Text>
</View>

// Using margin
<View style={{ marginHorizontal: metrics.spacing.md }}>
  Content
</View>

// Using padding
<View style={{ paddingHorizontal: metrics.spacing.md }}>
  Content
</View>
```

### **MS** - Margin/Spacing
General margin or padding (both directions or specific)

```typescript
// All sides
<View style={{ margin: metrics.spacing.lg }}>
  Content
</View>

// Padding
<View style={{ padding: metrics.spacing.lg }}>
  Content
</View>

// Specific sides
<View style={{
  marginTop: metrics.spacing.xl,
  marginBottom: metrics.spacing.lg,
  marginHorizontal: metrics.spacing.md
}}>
  Content
</View>
```

### **WS** - Width Scale
Responsive width calculation

```typescript
// Responsive width
const scaledWidth = metrics.horizontalScale(300);

// Use case
<View style={{ width: scaledWidth }}>
  Content
</View>
```

### **HeS** - Height Scale
Responsive height calculation

```typescript
// Responsive height
const scaledHeight = metrics.verticalScale(200);

// Use case
<View style={{ height: scaledHeight }}>
  Content
</View>
```

---

## Common Patterns

### 1. Container with Horizontal Padding (HS)

**Use case**: Main content area with side padding

```typescript
<View style={{
  width: '100%',
  paddingHorizontal: metrics.spacing.lg,  // HS: lg (16px on each side)
}}>
  {/* Main content */}
</View>
```

### 2. Stacked Elements with Vertical Gaps (VS)

**Use case**: Form with inputs

```typescript
<View>
  <BaseInput label="Email" />
  <View style={{ height: metrics.spacing.lg }} />  {/* VS: lg gap */}
  
  <BaseInput label="Password" />
  <View style={{ height: metrics.spacing.lg }} />  {/* VS: lg gap */}
  
  <BaseButton label="Login" />
</View>
```

### 3. Card Layout (MS)

**Use case**: Profile card or match item

```typescript
<View style={{
  backgroundColor: theme.colors.surface,
  borderRadius: metrics.radius.lg,
  padding: metrics.spacing.lg,           // MS: lg all sides
  marginVertical: metrics.spacing.xl     // VS: xl between cards
}}>
  <Image source={{ uri: imageUrl }} />
  <View style={{ height: metrics.spacing.md }} />  {/* VS: md */}
  <Text style={{ fontWeight: 'bold' }}>Name</Text>
</View>
```

### 4. Horizontal List with Gap (HS & VS)

**Use case**: Horizontal scrolling swipe cards

```typescript
<ScrollView
  horizontal
  scrollEventThrottle={16}
  contentContainerStyle={{
    paddingHorizontal: metrics.spacing.lg,  // HS: lg side padding
    gap: metrics.spacing.md                  // Both HS & VS: md between items
  }}
>
  {cards.map(card => (
    <View
      key={card.id}
      style={{
        width: 300,
        marginRight: metrics.spacing.md  // HS: md between cards (alternative to gap)
      }}
    >
      {/* Card */}
    </View>
  ))}
</ScrollView>
```

### 5. Grid Layout with Gap (HS & VS)

**Use case**: Profile photos grid

```typescript
<View style={{
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: metrics.spacing.md,                // Both HS & VS: md between items
  paddingHorizontal: metrics.spacing.lg   // HS: lg side padding
}}>
  {photos.map(photo => (
    <View
      key={photo.id}
      style={{
        width: '48%',  // Two columns with gap
        aspectRatio: 1
      }}
    >
      {/* Photo */}
    </View>
  ))}
</View>
```

### 6. Button Row with Spacing (HS)

**Use case**: Action buttons (Like, Pass, Super Like)

```typescript
<View style={{
  flexDirection: 'row',
  justifyContent: 'center',
  gap: metrics.spacing.lg,              // HS: lg between buttons
  marginVertical: metrics.spacing.xl    // VS: xl above/below
}}>
  <BaseButton variant="outline" size="lg" label="Pass" />
  <BaseButton variant="primary" size="lg" label="Like" />
  <BaseButton variant="secondary" size="lg" label="Super Like" />
</View>
```

### 7. Section Divider (VS)

**Use case**: Between different sections

```typescript
<View>
  {/* Section 1 */}
  <Text style={{ fontWeight: 'bold' }}>Matched Profiles</Text>
  {/* Content */}
  
  <View style={{ height: metrics.spacing['3xl'] }} />  {/* VS: 3xl divider */}
  
  {/* Section 2 */}
  <Text style={{ fontWeight: 'bold' }}>Messages</Text>
  {/* Content */}
</View>
```

### 8. Header with Bottom Spacing (VS)

**Use case**: Page header

```typescript
<View style={{
  paddingHorizontal: metrics.spacing.lg,  // HS: lg side padding
  paddingTop: metrics.spacing.lg,         // VS: lg top padding
  paddingBottom: metrics.spacing.xl       // VS: xl bottom spacing
}}>
  <Text variant="h1">Welcome</Text>
</View>
```

---

## Examples

### Example 1: Complete Screen Layout

```typescript
import { metrics } from '@styling/metrics';
import { useThemeStore } from '@stores';

const HomeScreen = () => {
  const { theme } = useThemeStore();

  return (
    <ScrollView 
      style={{
        flex: 1,
        backgroundColor: theme.colors.background
      }}
      contentContainerStyle={{
        paddingHorizontal: metrics.spacing.lg  // HS: lg side padding
      }}
    >
      {/* Header */}
      <View style={{
        paddingVertical: metrics.spacing.xl    // VS: xl above/below
      }}>
        <Text variant="h1">Discover</Text>
        <Text variant="body" style={{ marginTop: metrics.spacing.sm }}>
          HS: sm
        </Text>
      </View>

      {/* Cards Stack */}
      {profiles.map((profile, index) => (
        <View
          key={profile.id}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: metrics.radius.lg,
            overflow: 'hidden',
            marginBottom: metrics.spacing['3xl']  // VS: 3xl between cards
          }}
        >
          <Image
            source={{ uri: profile.image }}
            style={{
              width: '100%',
              height: metrics.verticalScale(400)  // HeS: responsive height
            }}
          />
          <View style={{
            padding: metrics.spacing.lg  // MS: lg all sides
          }}>
            <Text variant="h2">{profile.name}</Text>
            <Text
              variant="body"
              style={{
                marginTop: metrics.spacing.sm  // VS: sm gap
              }}
            >
              {profile.bio}
            </Text>
          </View>
        </View>
      ))}

      {/* Action Buttons */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        gap: metrics.spacing.lg,            // HS: lg between buttons
        marginVertical: metrics.spacing['3xl']  // VS: 3xl above/below
      }}>
        <BaseButton variant="outline" label="Pass" />
        <BaseButton variant="primary" label="Like" />
        <BaseButton variant="secondary" label="Super Like" />
      </View>
    </ScrollView>
  );
};
```

### Example 2: Custom Component with Spacing

```typescript
const ProfileCard = ({ profile }) => {
  const { theme } = useThemeStore();

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: metrics.radius.lg,
        padding: metrics.spacing.lg  // MS: lg padding all sides
      }}
    >
      {/* Header with icon */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: profile.avatar }}
          style={{
            width: metrics.horizontalScale(48),  // WS: responsive
            height: metrics.horizontalScale(48)  // WS: responsive
          }}
        />
        <View style={{ marginLeft: metrics.spacing.md }}>  {/* HS: md gap */}
          <Text>{profile.name}</Text>
        </View>
      </View>

      {/* Body text with spacing */}
      <Text
        variant="body"
        style={{
          marginVertical: metrics.spacing.lg  // VS: lg top/bottom
        }}
      >
        {profile.bio}
      </Text>

      {/* Tags with horizontal spacing */}
      <View
        style={{
          flexDirection: 'row',
          gap: metrics.spacing.sm,  // HS: sm between tags
          marginVertical: metrics.spacing.md  // VS: md top/bottom
        }}
      >
        {profile.tags.map(tag => (
          <View
            key={tag}
            style={{
              backgroundColor: theme.colors.primaryContainer,
              paddingHorizontal: metrics.spacing.md,  // HS: md sides
              paddingVertical: metrics.spacing.sm,    // VS: sm top/bottom
              borderRadius: metrics.radius.full
            }}
          >
            <Text>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
```

---

## Responsive Scaling

### Device-Specific Adjustments

```typescript
import { metrics } from '@styling/metrics';

// Use these for responsive layouts
const containerStyle = {
  width: '100%',
  paddingHorizontal: metrics.spacing.lg
};

// For small devices (iPhone SE)
if (metrics.isSmallDevice) {
  containerStyle.paddingHorizontal = metrics.spacing.md;
}

// For large devices (iPhone 14 Pro Max, iPad)
if (metrics.isLargeDevice) {
  containerStyle.maxWidth = 800;
  containerStyle.alignSelf = 'center';
}
```

### Screen Dimensions

```typescript
metrics.screenWidth   // Current device width
metrics.screenHeight  // Current device height
metrics.isSmallDevice // width < 375
metrics.isLargeDevice // width > 414

// Example
const componentWidth = metrics.screenWidth - (metrics.spacing.lg * 2);
```

### Scaling Functions

```typescript
// Horizontal scaling (width-based)
metrics.horizontalScale(100)  // Scales based on device width

// Vertical scaling (height-based)
metrics.verticalScale(100)    // Scales based on device height

// Moderate scaling (balanced 50/50)
metrics.moderateScale(100, 0.5)  // Custom factor
```

---

## Decision Tree

**When to use what?**

```
Need gap between vertical elements?
  → Use VS (Vertical Spacing)
    → marginVertical: metrics.spacing.lg

Need gap between horizontal elements?
  → Use HS (Horizontal Spacing)
    → marginHorizontal: metrics.spacing.md
    → or gap: metrics.spacing.md

Need to add padding inside a container?
  → Use MS (Margin/Spacing)
    → padding: metrics.spacing.lg

Need responsive width calculation?
  → Use WS (Width Scale)
    → width: metrics.horizontalScale(300)

Need responsive height calculation?
  → Use HeS (Height Scale)
    → height: metrics.verticalScale(200)
```

---

## Quick Copy-Paste Blocks

### Page Container
```typescript
<View style={{
  flex: 1,
  paddingHorizontal: metrics.spacing.lg,  // HS
  paddingVertical: metrics.spacing.xl     // VS
}}>
  {/* Content */}
</View>
```

### Card Container
```typescript
<View style={{
  backgroundColor: theme.colors.surface,
  borderRadius: metrics.radius.lg,
  padding: metrics.spacing.lg,           // MS
  marginVertical: metrics.spacing.xl     // VS
}}>
  {/* Content */}
</View>
```

### Horizontal List
```typescript
<ScrollView
  horizontal
  contentContainerStyle={{
    paddingHorizontal: metrics.spacing.lg,  // HS
    gap: metrics.spacing.md                 // Both HS & VS
  }}
>
  {/* Items */}
</ScrollView>
```

### Button Row
```typescript
<View style={{
  flexDirection: 'row',
  gap: metrics.spacing.lg,              // HS
  marginVertical: metrics.spacing.xl    // VS
}}>
  {/* Buttons */}
</View>
```

### Vertical Stack
```typescript
<View style={{
  gap: metrics.spacing.lg  // Both HS & VS for vertical
}}>
  {/* Items */}
</View>
```

---

## Troubleshooting

**Items too close?**
- Increase spacing: `metrics.spacing.lg` instead of `metrics.spacing.sm`

**Items too far apart?**
- Decrease spacing: `metrics.spacing.sm` instead of `metrics.spacing.lg`

**Different look on small devices?**
- Use responsive scaling: `metrics.moderateScale()`

**Inconsistent on iPad?**
- Use `metrics.isLargeDevice` for device-specific adjustments

---

**Version**: 1.0  
**Last Updated**: June 23, 2026  
**Status**: ✅ Production Ready
