# iOS Setup Guide for Pinochle Pal

This folder contains all configuration files and fixes needed for iOS App Store submission on iPhone 17 Pro / iOS 26.x.

---

## CR 2: App Icon Fix (RECOMMENDED METHOD)

### The Problem
App icon not rendering correctly on Home Screen, App Library, or Settings.

### BEST FIX: Use @capacitor/assets (Official Tool)

This is the **recommended official method** that properly generates all icon sizes and handles the iOS asset catalog correctly.

#### Step 1: On Your Mac, After Running `npx cap add ios`

```bash
# Install the official asset generation tool
npm install @capacitor/assets --save-dev

# Generate all iOS icons from the resources/icon.png (1024x1024)
npx capacitor-assets generate --iconBackgroundColor '#1a2e26' --iconBackgroundColorDark '#1a2e26' --ios
```

This will:
- Generate all 18 required icon sizes automatically
- Place them in the correct `ios/App/App/Assets.xcassets/AppIcon.appiconset/` folder
- Update Contents.json correctly
- Handle light/dark mode icons

#### Step 2: Verify in Xcode

1. Open `ios/App/App.xcworkspace` in Xcode
2. Navigate to: **App > App > Assets.xcassets > AppIcon**
3. Verify all icon slots are filled with the green spade design
4. Check **Build Settings** → Search for **"Include all app icon assets"** → Set to **YES**

#### Step 3: Clean Build

```bash
# In Terminal
npx cap sync ios
```

Then in Xcode:
1. **Product → Clean Build Folder** (Cmd+Shift+K)
2. **Delete app from device/simulator** completely (hold icon → Remove App)
3. **Build and run** fresh install

### Alternative: Manual Icon Copy (If capacitor-assets Doesn't Work)

If the above doesn't work, try this manual approach:

```bash
# Delete existing assets and copy pre-generated ones
rm -rf ios/App/App/Assets.xcassets
cp -R ios-setup/Assets.xcassets ios/App/App/
```

Then verify in Xcode:
1. Select the "App" target → General tab
2. Under "App Icons and Launch Screen":
   - Set "App Icons Source" to `AppIcon`
   - Remove any "App Icon" override if present

### Important Xcode Build Settings

1. **Build Settings → Include all app icon assets** → **YES**
2. **Build Settings → Asset Catalog Other Flags** → Add: `--enable-icon-stack-fallback-generation=disabled` (for iOS 18+)

### Verify Info.plist Contains

```xml
<key>CFBundleIconName</key>
<string>AppIcon</string>
```

### Icon Verification Checklist
- [ ] All icon slots filled in Xcode Assets.xcassets
- [ ] Icon appears on Home Screen
- [ ] Icon appears in App Library
- [ ] Icon appears in Spotlight search
- [ ] Icon appears in Settings → General → iPhone Storage
- [ ] Icon persists after device reboot

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
```bash
cp ios-setup/AppDelegate.swift ios/App/App/AppDelegate.swift
```

#### Step 2: Add SceneDelegate.swift
```bash
cp ios-setup/SceneDelegate.swift ios/App/App/SceneDelegate.swift
```

Then in Xcode: Right-click on the `App` folder → "Add Files to App..." → Select `SceneDelegate.swift`

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

## Complete Setup Sequence (Copy-Paste Ready)

Run this on your Mac after downloading the project from Replit:

```bash
# 1. Install dependencies and build
npm install
npm run build

# 2. Add iOS platform
npm install @capacitor/core @capacitor/ios @capacitor/cli @capacitor/assets --save-dev
npx cap add ios
npx cap sync ios

# 3. Generate app icons (CRITICAL - use this method!)
npx capacitor-assets generate --iconBackgroundColor '#1a2e26' --iconBackgroundColorDark '#1a2e26' --ios

# 4. Apply UIScene lifecycle fix
cp ios-setup/AppDelegate.swift ios/App/App/AppDelegate.swift
cp ios-setup/SceneDelegate.swift ios/App/App/SceneDelegate.swift
# Then manually add Info.plist.patch content to ios/App/App/Info.plist

# 5. Final sync and open
npx cap sync ios
npx cap open ios
```

Then in Xcode:
1. **Build Settings → Include all app icon assets → YES**
2. **Product → Clean Build Folder** (Cmd+Shift+K)
3. **Delete app from device**
4. **Build and run**

---

## Troubleshooting Icon Issues

| Problem | Solution |
|---------|----------|
| Default Capacitor icon shows | Run `npx capacitor-assets generate --ios`, clean build, delete app, reinstall |
| Icon shows in app but not on home screen | Completely uninstall app (hold → Remove App), reinstall fresh |
| "Include all app icon assets" not found | Search for it in Build Settings (not Signing & Capabilities) |
| Icons won't update after cap copy | `cap copy` doesn't handle icons - use `capacitor-assets generate` |
| Xcode shows "No icon" warnings | Check Contents.json has all filenames matching actual PNG files |

---

## Other Console Warnings (Safe to Ignore)

These are iOS Simulator/debug-mode artifacts and do **not** appear on release builds or real devices:

| Warning | Explanation |
|---------|-------------|
| `Could not create a sandbox extension` | Simulator code signing limitation |
| `NSMapGet: map table argument is NULL` | Internal WebKit logging, benign |
| `CARenderServer failed bootstrap` | Simulator graphics context issue |
| `Failed to load a device context` | Simulator-only, no real device impact |

---

## Files in This Folder

| File | Purpose |
|------|---------|
| `AppDelegate.swift` | Replace existing AppDelegate with scene-based lifecycle |
| `SceneDelegate.swift` | New file to handle UIScene lifecycle events |
| `Info.plist.patch` | XML snippet to add to Info.plist |
| `generate-icons.sh` | Manual icon generation script (backup method) |
| `Assets.xcassets/` | Pre-generated asset catalog (backup method) |

---

## Acceptance Criteria

### CR 1 - UIScene Lifecycle
- [ ] Running on iPhone 17 Pro iOS 26.x produces no UIScene warning
- [ ] Cold start, background resume, and foreground transitions work correctly

### CR 2 - App Icon
- [ ] Custom icon renders correctly on Home Screen
- [ ] Icon renders correctly in App Library
- [ ] Icon renders correctly in Spotlight
- [ ] Icon correct after uninstall/reinstall cycle
