# iOS Setup Guide - UIScene Lifecycle Fix

This folder contains the files needed to fix the UIScene lifecycle warning in your Xcode project.

## The Warning
```
UIScene lifecycle will soon be required. Failure to adopt will result in an assert in the future.
```

## How to Fix

### Step 1: Build the Web App
```bash
npm run build
```

### Step 2: Add Capacitor iOS (if not already done)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap add ios
npx cap sync ios
```

### Step 3: Apply UIScene Lifecycle Files

1. **Replace AppDelegate.swift**
   - Copy `ios-setup/AppDelegate.swift` to `ios/App/App/AppDelegate.swift`
   - This replaces the old lifecycle with scene-based lifecycle

2. **Add SceneDelegate.swift**
   - Copy `ios-setup/SceneDelegate.swift` to `ios/App/App/SceneDelegate.swift`
   - In Xcode: Right-click on `App` folder → Add Files to "App" → Select `SceneDelegate.swift`

3. **Update Info.plist**
   - Open `ios/App/App/Info.plist`
   - Add the UIApplicationSceneManifest section from `ios-setup/Info.plist.patch`
   - Add it inside the main `<dict>` section, before the closing `</dict>`

### Step 4: Sync and Build
```bash
npx cap sync ios
npx cap open ios
```

Then in Xcode: Product → Clean Build Folder, then Build.

## Other Warnings (Safe to Ignore)

These are iOS Simulator-specific and don't appear on real devices:

- `Could not create a sandbox extension` - Signing issue in simulator
- `NSMapGet: map table argument is NULL` - Internal WebKit, harmless
- `CARenderServer failed bootstrap` - Simulator graphics context
- `Failed to load a device context` - Simulator-only rendering

## Testing on Real Device

To test on a real iPhone:
1. Connect your iPhone
2. Select it as the build target in Xcode
3. You'll need an Apple Developer account to sign the app
4. Build and run

The simulator warnings will not appear on a real device.
