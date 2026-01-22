# iOS Setup Guide for Pinochle Pal

This folder contains all configuration files and fixes needed for iOS App Store submission on iPhone 17 Pro / iOS 26.x.

---

## CR 1: UIScene Lifecycle Fix

### The Warning
```
UIScene lifecycle will soon be required. Failure to adopt will result in an assert in the future.
```

### Root Cause
Capacitor's default iOS template uses the legacy `UIApplicationDelegate` lifecycle. iOS 13+ introduced `UIScene` lifecycle which will become mandatory in future iOS versions.

### Fix Steps

#### Step 1: Replace AppDelegate.swift
Copy `ios-setup/AppDelegate.swift` to `ios/App/App/AppDelegate.swift`, replacing the existing file.

#### Step 2: Add SceneDelegate.swift
1. Copy `ios-setup/SceneDelegate.swift` to `ios/App/App/SceneDelegate.swift`
2. In Xcode: Right-click on the `App` folder → "Add Files to App..." → Select `SceneDelegate.swift`

#### Step 3: Update Info.plist
Open `ios/App/App/Info.plist` and add the following inside the main `<dict>` section (before the closing `</dict>`):

```xml
<key>UIApplicationSceneManifest</key>
<dict>
    <key>UIApplicationSupportsMultipleScenes</key>
    <false/>
    <key>UISceneConfigurations</key>
    <dict>
        <key>UIWindowSceneSessionRoleApplication</key>
        <array>
            <dict>
                <key>UISceneConfigurationName</key>
                <string>Default Configuration</string>
                <key>UISceneDelegateClassName</key>
                <string>$(PRODUCT_MODULE_NAME).SceneDelegate</string>
            </dict>
        </array>
    </dict>
</dict>
```

#### Step 4: Clean and Rebuild
```bash
npx cap sync ios
```
Then in Xcode: Product → Clean Build Folder (Cmd+Shift+K) → Build

### Verification
- [ ] No "UIScene lifecycle" warning in Xcode console
- [ ] App launches correctly on device
- [ ] Background/foreground transitions work
- [ ] App resumes correctly after being suspended

---

## CR 2: App Icon Fix

### The Problem
App icon not rendering correctly on Home Screen, App Library, or Settings.

### Root Cause Analysis Checklist
1. Asset catalog missing required icon sizes
2. Icon PNGs have transparency (not allowed for iOS app icons)
3. CFBundleIconName not set correctly
4. Multiple asset catalogs causing ambiguity
5. Capacitor sync overwriting icons

### Fix Steps

#### Step 1: Copy Pre-Generated Icons
All 18 icon sizes are **already generated** in this folder. Simply copy them:

```bash
rm -rf ios/App/App/Assets.xcassets
cp -R ios-setup/Assets.xcassets ios/App/App/
```

(Optional: If you want to regenerate from a different source icon, run `./generate-icons.sh`)

#### Step 2: Verify Asset Catalog
Copy the entire `ios-setup/Assets.xcassets` folder to replace `ios/App/App/Assets.xcassets`

```bash
cp -R ios-setup/Assets.xcassets ios/App/App/
```

#### Step 3: Verify Xcode Configuration
1. Open `ios/App/App.xcworkspace` in Xcode
2. Select the "App" target → General tab
3. Under "App Icons and Launch Screen":
   - Ensure "App Icons Source" is set to `AppIcon`
   - Remove any "App Icon" override if present

#### Step 4: Verify Info.plist
Ensure `ios/App/App/Info.plist` contains:
```xml
<key>CFBundleIconName</key>
<string>AppIcon</string>
```

#### Step 5: Clean and Rebuild
```bash
npx cap sync ios
```
Then in Xcode:
1. Product → Clean Build Folder (Cmd+Shift+K)
2. Delete app from device
3. Build and run fresh install

### Icon Verification Checklist
- [ ] Icon appears on Home Screen
- [ ] Icon appears in App Library
- [ ] Icon appears in Spotlight search
- [ ] Icon appears in Settings → General → iPhone Storage
- [ ] Icon persists after device reboot
- [ ] Icon correct in TestFlight/App Store Connect after archive upload

---

## Other Console Warnings (Safe to Ignore)

These are iOS Simulator/debug-mode artifacts and do **not** appear on release builds or real devices:

| Warning | Explanation |
|---------|-------------|
| `Could not create a sandbox extension` | Simulator code signing limitation |
| `NSMapGet: map table argument is NULL` | Internal WebKit logging, benign |
| `CARenderServer failed bootstrap` | Simulator graphics context issue |
| `Failed to load a device context` | Simulator-only, no real device impact |
| `Could not register system wide server: -25204` | Sandboxing limitation in debug |

**Evidence:** These messages are not present when running a Release archive on a physical device. They are development-time noise from the iOS simulator and debug environment.

---

## Quick Reference Commands

```bash
# Full rebuild sequence
npm run build
npx cap sync ios
npx cap open ios

# Generate icons (run from ios-setup folder)
./generate-icons.sh

# Check Capacitor versions
npm ls @capacitor/core @capacitor/ios @capacitor/cli
```

---

## Files in This Folder

| File | Purpose |
|------|---------|
| `AppDelegate.swift` | Replace existing AppDelegate with scene-based lifecycle |
| `SceneDelegate.swift` | New file to handle UIScene lifecycle events |
| `Info.plist.patch` | XML snippet to add to Info.plist |
| `generate-icons.sh` | Script to generate all icon sizes from source |
| `Assets.xcassets/` | Complete asset catalog with Contents.json |

---

## Acceptance Criteria Verification

### CR 1 - UIScene Lifecycle
- [ ] Running on iPhone 17 Pro iOS 26.x produces no UIScene warning
- [ ] App initializes reliably on physical device
- [ ] Cold start, background resume, and foreground transitions work correctly

### CR 2 - App Icon
- [ ] Icon renders correctly on Home Screen
- [ ] Icon renders correctly in App Library
- [ ] Icon renders correctly in Spotlight
- [ ] Icon renders correctly in Settings
- [ ] Icon correct after uninstall/reinstall cycle
- [ ] Icon correct in Release archive build
- [ ] Icon correct in TestFlight build

---

## Contact

Repository: HealthTrixssLLC/Pinochle-Pal
