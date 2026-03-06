# Privy setup (Google, X/Twitter, profile)

For **login with Google and X (Twitter)** and for **profile/API** to work:

## 1. Enable login methods in Privy Dashboard

1. Go to [dashboard.privy.io](https://dashboard.privy.io) → your app.
2. Open **Login methods** (or **User management → Authentication**).
3. Turn **on** the methods you want:
   - **Email**
   - **Wallet** (optional)
   - **Google**
   - **X (Twitter)**
   - **Apple** (optional)

Without this, Google and X buttons will not appear or will fail.

## 2. Enable identity tokens (required for profile & backend auth)

1. In Privy Dashboard go to **User management → Authentication → Advanced**.
2. Enable **“Return user data in an identity token”** (or similar).

If this is off, the backend cannot read your wallet address from the token and profile (and other protected APIs) will return “Could not load profile” / 401.

## 3. Embedded wallet (Web3 account)

The app is configured so that **createOnLogin: 'all-users'** (under `embeddedWallets.ethereum`) creates an embedded wallet when users log in via the Privy modal.

If a user signs in but doesn’t yet have a wallet (e.g. some OAuth flows), the app will **create one automatically** after login and show “Creating your PayEcho wallet…”, or a “Create wallet” button if creation was skipped. Every user gets a PayEcho wallet address for profile and payments.

---

**Summary:** Enable **Google** and **X** (and any other methods) under Login methods, and turn **on** identity tokens under Advanced. Then restart the app and try again.
