# How to Navigate Through Zingle App

## Authentication Flow

### 1. **Landing Screen**
- Shows when app first opens
- Click **"Continue with Email"** → Goes to **Signup Screen**
- Click **"Login"** (bottom) → Goes to **Login Screen**
- Click **"Sign Up"** (bottom) → Goes to **Signup Screen**

### 2. **Login Screen**
Demo credentials (pre-filled):
- Email: `demo@example.com`
- Password: `password123`

**How to proceed:**
- Enter email and password
- Click **"Login"** button
- Wait for 1 second animation
- ✅ Automatically enters the main app (Home Screen)

**Or navigate to Signup:**
- Click **"Sign Up"** link at the bottom

### 3. **Signup Screen**
**How to proceed:**
- Enter **Name**
- Enter **Email**
- Enter **Password**
- Click **"Sign Up"** button
- Wait for 1 second animation
- ✅ Automatically enters the main app (Home Screen)

**Or navigate to Login:**
- Click **"Login"** link at the bottom

---

## What Happens After Login/Signup

Once you login or signup successfully:
- ✅ Auth data is saved in Zustand store
- ✅ You automatically navigate to the **Main App**
- ✅ You see the **Home Screen** with swipe cards

---

## Demo Testing

### Quick Test Flow:
1. **Landing Screen** → Click "Continue with Email"
2. **Signup Screen** → Enter name (e.g., "John") + email + password
3. **Click Sign Up**
4. ✅ **Home Screen** appears with swipe cards!

### Or Test Login:
1. **Landing Screen** → Click "Login"
2. **Login Screen** → Pre-filled credentials ready
3. **Click Login** button
4. ✅ **Home Screen** appears with swipe cards!

---

## Main App Features (After Login)

Once you're logged in, you can:

### Bottom Tabs:
1. **Home** - Swipe cards
2. **Likes** - Users who liked you
3. **Chat** - Messages
4. **Profile** - Your profile

### Home Screen Actions:
- ❌ **Pass** button - Skip this profile
- ⭐ **Super Like** - Favorite profile
- ❤️ **Like** - Express interest
- 💬 **Message** - Send message

---

## To Logout & Test Auth Again:
Go to **Profile** tab → Scroll down → **"Logout"** button

---

## Important Notes:

- 🎯 **Auth is mocked** - Uses dummy data for demo
- 🔄 **Real backend** - Replace mock login with your API calls
- 💾 **Data persists** - Auth data saved until logout
- 🚀 **Ready for backend** - Replace the mock `login()` call with real API

---

## Code to Update for Real Backend:

In `LoginScreen.tsx` and `SignupScreen.tsx`:

Replace this mock code:
```typescript
// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 1000));

// Mock user data
const mockUser = {
  id: '1',
  name: email.split('@')[0],
  email: email,
  avatar: 'https://...',
};

login(mockUser, 'mock-token-' + Date.now());
```

With your real API:
```typescript
// Call your actual backend API
const response = await authService.login(email, password);
const { user, token } = response.data;

// Store real auth data
login(user, token);
```

---

Enjoy testing your premium dating app! 🚀
