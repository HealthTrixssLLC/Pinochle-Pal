# CR Verification Checklist - iPhone 17 Pro / iOS 26.x

## Artifacts from Replit Engineering

### CR 1: UIScene Lifecycle Fix

**Files Provided:**
- [x] `ios-setup/AppDelegate.swift` - Scene-based AppDelegate
- [x] `ios-setup/SceneDelegate.swift` - UIScene delegate implementation
- [x] `ios-setup/Info.plist.patch` - UIApplicationSceneManifest XML

**Capacitor Versions (verify with `npm ls`):**
```bash
npm ls @capacitor/core @capacitor/ios @capacitor/cli
```

**Xcode Configuration:**
- iOS Deployment Target: 15.0+ recommended
- webDir in capacitor.config.json: `dist/public`

### CR 2: App Icon Fix

**Files Provided:**
- [x] `client/public/icon-1024.png` - Source icon (1024x1024)
- [x] `ios-setup/generate-icons.sh` - Icon size generator script
- [x] `ios-setup/Assets.xcassets/` - Complete asset catalog with Contents.json

**Icon Properties (verified):**
- Square aspect ratio: ✅
- No transparency: ✅ (solid green background)
- Resolution: 1024x1024 for marketing icon
- All 18 required sizes defined in Contents.json

---

## Pre-Verification Steps (Run on Mac)

```bash
# 1. Clone and build
git clone https://github.com/HealthTrixssLLC/Pinochle-Pal.git
cd Pinochle-Pal
npm install
npm run build

# 2. Add Capacitor iOS
npm install @capacitor/core @capacitor/ios @capacitor/cli
npx cap add ios
npx cap sync ios

# 3. Apply CR1 fixes
cp ios-setup/AppDelegate.swift ios/App/App/AppDelegate.swift
cp ios-setup/SceneDelegate.swift ios/App/App/SceneDelegate.swift
# Then manually add Info.plist.patch content to ios/App/App/Info.plist

# 4. Apply CR2 fixes
cd ios-setup && ./generate-icons.sh && cd ..
cp -R ios-setup/Assets.xcassets ios/App/App/

# 5. Final sync and open
npx cap sync ios
npx cap open ios
```

---

## CR 1 Verification - UIScene Lifecycle

### Device: iPhone 17 Pro, iOS 26.x

| Test | Expected | Actual | Pass |
|------|----------|--------|------|
| Console on launch | No UIScene lifecycle warning | | |
| Console on launch | No sandbox extension failure | | |
| App loads | WebView loaded message appears | | |
| Cold start | App launches without crash | | |
| Background | App suspends gracefully | | |
| Foreground resume | App resumes correctly | | |
| Device rotation | Handled gracefully (if supported) | | |

### Console Analysis

**Expected to NOT see:**
- `UIScene lifecycle will soon be required`

**Still may see (benign):**
- `CARenderServer failed bootstrap` - Simulator/debug only
- `Failed to load device context` - Simulator/debug only
- `Could not register system wide server` - Sandboxing, harmless

---

## CR 2 Verification - App Icon

### Device: iPhone 17 Pro, iOS 26.x

| Location | Expected | Actual | Pass |
|----------|----------|--------|------|
| Home Screen | Green spade icon visible | | |
| App Library | Green spade icon visible | | |
| Spotlight search | Green spade icon visible | | |
| Settings → iPhone Storage | Green spade icon visible | | |
| After device reboot | Icon still visible | | |
| After uninstall/reinstall | Icon still visible | | |

### Build Types

| Build | Icon Correct | Notes |
|-------|--------------|-------|
| Debug via Xcode | | |
| Release Archive | | |
| TestFlight | | |

---

## QA Sign-Off

| Criteria | Status |
|----------|--------|
| CR1: No UIScene warning on iOS 26.x | ☐ |
| CR1: App lifecycle functions correctly | ☐ |
| CR2: Icon renders in all iOS surfaces | ☐ |
| CR2: Icon persists across reinstalls | ☐ |
| No regression on earlier iOS versions | ☐ |
| Release build passes all checks | ☐ |

**Tested By:** _________________________

**Date:** _________________________

**Device:** iPhone 17 Pro, iOS 26.x

**Xcode Version:** _________________________

---

## Notes

Document any issues or observations here:

```




```
