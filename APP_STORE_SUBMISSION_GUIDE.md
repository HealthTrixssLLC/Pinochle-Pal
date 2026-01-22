# Pinochle Scorekeeper - App Store Submission Guide

## What's Already Done ✅

The following has been completed and is ready:

| Item | Status | Location |
|------|--------|----------|
| App code & functionality | ✅ Complete | `client/src/` |
| PWA manifest | ✅ Complete | `client/public/manifest.json` |
| App icons (192px, 512px, 1024px) | ✅ Complete | `client/public/icon-*.png` |
| iOS UIScene lifecycle fix | ✅ Complete | `ios-setup/` |
| iOS asset catalog template | ✅ Complete | `ios-setup/Assets.xcassets/` |
| Icon generation script | ✅ Complete | `ios-setup/generate-icons.sh` |
| iOS meta tags | ✅ Complete | `client/index.html` |
| Error handling | ✅ Complete | `client/src/components/error-boundary.tsx` |
| Offline support | ✅ Complete | LocalStorage persistence |
| Privacy policy template | ✅ Complete | `PRIVACY_POLICY.md` |
| Ad harness placeholders | ✅ Complete | `client/src/pages/game-stats.tsx` |
| Data validation | ✅ Complete | `client/src/pages/round-wizard.tsx` |

---

## Step-by-Step Submission Instructions

### Phase 1: Prepare Your Mac Environment

**Estimated time: 30 minutes**

1. **Install Xcode** (if not already installed)
   - Open the Mac App Store
   - Search for "Xcode"
   - Click "Get" and install (this takes 10-20 minutes)
   - After installation, open Xcode once to accept the license agreement

2. **Install Node.js** (if not already installed)
   - Visit https://nodejs.org
   - Download the LTS version
   - Run the installer

3. **Install Capacitor CLI globally**
   ```bash
   npm install -g @capacitor/cli
   ```

---

### Phase 2: Build the Production App

**Estimated time: 10 minutes**

1. **Download this project** from Replit
   - Click the three dots menu in the file browser
   - Select "Download as ZIP"
   - Extract to a folder on your Mac (e.g., `~/Desktop/pinochle-app`)

2. **Open Terminal** and navigate to the project folder
   ```bash
   cd ~/Desktop/pinochle-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Build the production version**
   ```bash
   npm run build
   ```
   
   This creates optimized files in the `dist/public` folder.

---

### Phase 3: Convert to Native iOS App with Capacitor

**Estimated time: 20 minutes**

1. **Initialize Capacitor** in your project
   ```bash
   npm install @capacitor/core @capacitor/ios
   npx cap init "Pinochle Scorekeeper" "com.yourname.pinochle" --web-dir dist/public
   ```
   
   > Replace `com.yourname.pinochle` with your own bundle ID (e.g., `com.johndoe.pinochle`)

2. **Add iOS platform**
   ```bash
   npx cap add ios
   ```

3. **Copy your web app to iOS**
   ```bash
   npx cap sync ios
   ```

4. **Apply UIScene Lifecycle Fix (IMPORTANT - iOS 26.x)**
   ```bash
   # Copy the scene-based lifecycle files
   cp ios-setup/AppDelegate.swift ios/App/App/AppDelegate.swift
   cp ios-setup/SceneDelegate.swift ios/App/App/SceneDelegate.swift
   ```
   Then add the UIApplicationSceneManifest to `ios/App/App/Info.plist` (see `ios-setup/README.md` for exact XML)

5. **Generate and apply app icons**
   ```bash
   cd ios-setup
   ./generate-icons.sh
   cd ..
   cp -R ios-setup/Assets.xcassets ios/App/App/
   ```

6. **Sync again and open in Xcode**
   ```bash
   npx cap sync ios
   npx cap open ios
   ```

---

### Phase 4: Configure the iOS Project in Xcode

**Estimated time: 15 minutes**

1. **Select your project** in the left sidebar (the top item with the blue icon)

2. **Set the Bundle Identifier**
   - Under "Signing & Capabilities"
   - Change "Bundle Identifier" to your chosen ID (e.g., `com.yourname.pinochle`)

3. **Set the Display Name**
   - Under "General" tab
   - Set "Display Name" to: `Pinochle`

4. **Add your Apple Developer Team**
   - Under "Signing & Capabilities"
   - Select your Team from the dropdown
   - If you don't have one, you'll need to enroll in the Apple Developer Program ($99/year)

5. **Set the Deployment Target**
   - Under "General" → "Minimum Deployments"
   - Set iOS version to `15.0` (covers most iPhones in use)

6. **Verify App Icons**
   - In the left sidebar, expand your project and click "Assets"
   - Click "AppIcon" - all icon slots should be filled (if you ran the generate-icons.sh script)
   - If icons are missing, run `ios-setup/generate-icons.sh` and copy the assets folder again

7. **Set the App Orientation**
   - Under "General" → "Deployment Info"
   - Check only "Portrait" (uncheck Landscape Left and Landscape Right)

8. **Enable Full Screen**
   - Under "General" → "Deployment Info"
   - Check "Requires full screen"

---

### Phase 5: Test on Your iPhone

**Estimated time: 15 minutes**

1. **Connect your iPhone** to your Mac with a USB cable

2. **Trust your Mac** on your iPhone when prompted

3. **Select your iPhone** as the build target
   - In Xcode's toolbar, click on the device selector (next to the Play button)
   - Select your connected iPhone

4. **Build and run**
   - Click the Play button (▶) or press `Cmd + R`
   - First time may take a few minutes

5. **Trust the Developer** on your iPhone
   - Go to Settings → General → VPN & Device Management
   - Find your Developer App and tap "Trust"

6. **Test all features:**
   - [ ] Create a new 2-handed game
   - [ ] Create a new 3-handed game
   - [ ] Create a new 4-handed game with team setup
   - [ ] Add players
   - [ ] Use the meld calculator
   - [ ] Enter trick scores
   - [ ] Verify validation warnings work
   - [ ] Complete a full game
   - [ ] View game history
   - [ ] View analytics
   - [ ] Check rules page
   - [ ] Close and reopen app (verify data persists)
   - [ ] Test in airplane mode (offline)

---

### Phase 6: Take App Store Screenshots

**Estimated time: 20 minutes**

You need screenshots for these iPhone sizes:
- 6.7" (iPhone 15 Pro Max, 14 Pro Max)
- 6.5" (iPhone 11 Pro Max, Xs Max)
- 5.5" (iPhone 8 Plus, 7 Plus)

**Screenshots to capture:**

1. **Home Screen** - Shows the main menu with game options
2. **New Game Setup** - Player selection screen
3. **Active Game** - Scoreboard with round history
4. **Meld Calculator** - The visual meld entry dialog
5. **Game Analytics** - Charts showing scoring breakdown
6. **Rules Reference** - The rules page

**How to take screenshots:**
- On iPhone: Press Side Button + Volume Up simultaneously
- In Xcode Simulator: `Cmd + S`

**Screenshot requirements:**
- No status bar changes needed (Apple adds device frames)
- Make sure scores look realistic
- Use descriptive player names (e.g., "Mom", "Dad", "You", "Bro")

---

### Phase 7: Create App Store Listing

**Estimated time: 30 minutes**

1. **Log in to App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Sign in with your Apple Developer account

2. **Create a New App**
   - Click the "+" button → "New App"
   - Platform: iOS
   - Name: `Pinochle Scorekeeper`
   - Primary Language: English (US)
   - Bundle ID: Select the one you created
   - SKU: `pinochle-scorekeeper-001`
   - User Access: Full Access

3. **Fill in App Information**

   **Subtitle:**
   ```
   Score Pinochle Games with Ease
   ```

   **Description:**
   ```
   Pinochle Scorekeeper is the ultimate companion for your card game nights. Designed specifically for Pinochle players, this elegant app eliminates the need for paper scorecards and mental math.

   GAME MODES
   • 2-Handed Pinochle
   • 3-Handed Pinochle  
   • 4-Handed Partnership Pinochle with full team configuration

   SMART MELD CALCULATOR
   Stop memorizing point values! Just tap the meld icons to calculate your score:
   • Run, Royal Marriage, Common Marriage, Dix
   • Aces Around, Kings Around, Queens Around, Jacks Around
   • Pinochle, Double Pinochle

   BUILT-IN QUALITY CHECKS
   • Automatic validation ensures trick points add up correctly
   • Warnings for unusual meld scores
   • Never submit incorrect scores again

   COMPLETE GAME TRACKING
   • Full game history
   • Player statistics across all games
   • Analytics with scoring breakdowns and bid performance

   DESIGNED FOR iPhone
   • Intuitive touch interface
   • Works perfectly offline
   • All data stays private on your device
   • Beautiful card table aesthetic

   Perfect for family game nights, tournaments, or casual play!
   ```

   **Keywords (100 character limit):**
   ```
   pinochle,cards,scorekeeper,card games,score tracker,trick taking,meld,family games
   ```

   **Support URL:**
   - Create a simple support page or use your email

   **Marketing URL (optional):**
   - Can leave blank

4. **Set Age Rating**
   - Click "Age Rating"
   - Answer all questions (should all be "None" or "No")
   - Result should be: **4+**

5. **Upload Screenshots**
   - Go to your app version
   - Scroll to "App Preview and Screenshots"
   - Upload screenshots for each device size

6. **Set App Category**
   - Primary: Games → Card
   - Secondary: Utilities

---

### Phase 8: Host Your Privacy Policy

**Estimated time: 15 minutes**

Apple requires a publicly accessible privacy policy URL.

**Option A: Use GitHub Pages (Free)**

1. Create a new GitHub repository called `pinochle-privacy`
2. Copy the contents of `PRIVACY_POLICY.md` 
3. Rename to `index.md`
4. Go to Settings → Pages → Enable GitHub Pages
5. Your URL will be: `https://yourusername.github.io/pinochle-privacy`

**Option B: Use Notion (Free)**

1. Create a new Notion page
2. Paste the privacy policy content
3. Click "Share" → "Share to web"
4. Copy the public URL

**Option C: Use your own website**

Upload the privacy policy to any publicly accessible URL.

---

### Phase 9: Submit for Review

**Estimated time: 15 minutes**

1. **Archive your app in Xcode**
   - In Xcode menu: Product → Archive
   - Wait for the build to complete

2. **Upload to App Store Connect**
   - In the Organizer window, click "Distribute App"
   - Select "App Store Connect"
   - Click "Upload"
   - Wait for processing (5-15 minutes)

3. **Select the build in App Store Connect**
   - Go to your app in App Store Connect
   - Under "Build", click the + and select your uploaded build

4. **Complete the submission form**
   - Review all information
   - Set the price (Free)
   - Add release notes: "Initial release"
   - Answer export compliance questions (No encryption = "No")
   
5. **Submit for Review**
   - Click "Submit for Review"

---

### Phase 10: Wait for Review

**Typical timeline: 24-48 hours**

Apple will review your app. You'll receive an email when:
- Your app is approved (🎉)
- Your app needs changes (they'll explain what)

**Common rejection reasons and how to avoid them:**

| Issue | Prevention |
|-------|------------|
| Crashes | Test thoroughly on real device |
| Incomplete features | All buttons must work |
| Placeholder content | Remove any "Lorem ipsum" or test data |
| Privacy policy missing | Ensure URL is accessible |
| Misleading screenshots | Use actual app screenshots |

---

## Quick Reference: Required Information

| Item | Value |
|------|-------|
| **App Name** | Pinochle Scorekeeper |
| **Subtitle** | Score Pinochle Games with Ease |
| **Bundle ID** | com.yourname.pinochle |
| **Category** | Games → Card |
| **Age Rating** | 4+ |
| **Price** | Free |
| **Privacy Policy** | [Your hosted URL] |
| **Support URL** | [Your email or support page] |

---

## Files Reference

```
Your Replit Project
├── client/
│   ├── public/
│   │   ├── icon-192.png          ← App icon (PWA)
│   │   ├── icon-512.png          ← App icon (PWA)
│   │   ├── icon-1024.png         ← App Store icon source
│   │   ├── apple-touch-icon.png  ← iOS home screen icon
│   │   └── manifest.json         ← PWA configuration
│   ├── src/                      ← All app source code
│   └── index.html                ← iOS meta tags configured
├── ios-setup/
│   ├── AppDelegate.swift         ← UIScene lifecycle AppDelegate
│   ├── SceneDelegate.swift       ← UIScene lifecycle SceneDelegate
│   ├── Info.plist.patch          ← UISceneManifest XML to add
│   ├── generate-icons.sh         ← Icon generation script
│   ├── Assets.xcassets/          ← Complete iOS asset catalog
│   └── README.md                 ← Detailed setup instructions
├── capacitor.config.json         ← Capacitor configuration
├── APP_STORE_SUBMISSION_GUIDE.md ← This file
└── PRIVACY_POLICY.md             ← Privacy policy template
```

---

## Need Help?

**Capacitor Documentation:** https://capacitorjs.com/docs/ios

**App Store Connect Help:** https://developer.apple.com/help/app-store-connect/

**Apple Developer Program:** https://developer.apple.com/programs/

---

**Congratulations!** Your Pinochle Scorekeeper app is ready for the App Store. Follow these steps carefully, and you'll have your app live for the world to use.
