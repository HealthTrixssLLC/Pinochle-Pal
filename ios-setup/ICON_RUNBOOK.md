# iOS App Icon Generation Runbook

## Quick Fix (Copy Pre-Generated Icons)

The `ios-setup/Assets.xcassets/AppIcon.appiconset/` folder contains a complete set of 18 pre-generated icons ready to use.

### On your Mac, after downloading from Replit:

```bash
# Step 1: Remove the incomplete/stale AppIcon set
rm -rf ios/App/App/Assets.xcassets/AppIcon.appiconset

# Step 2: Copy the complete icon set
cp -R ios-setup/Assets.xcassets/AppIcon.appiconset ios/App/App/Assets.xcassets/

# Step 3: Verify all 18 icons are present
ls ios/App/App/Assets.xcassets/AppIcon.appiconset/*.png | wc -l
# Should output: 18
```

### Clear iOS icon cache and rebuild:

```bash
# Delete derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/*Pinochle*

# Open Xcode
npx cap open ios
```

In Xcode:
1. **Product → Clean Build Folder** (Cmd+Shift+K)
2. **Delete app from device** (hold icon → Remove App → Delete App)
3. **Build and run** (Cmd+R)

---

## Icon Files Reference

The AppIcon set contains these 18 required sizes:

| Filename | Size | Purpose |
|----------|------|---------|
| AppIcon-20.png | 20x20 | iPad Notifications @1x |
| AppIcon-20@2x.png | 40x40 | iPhone Notifications @2x |
| AppIcon-20@3x.png | 60x60 | iPhone Notifications @3x |
| AppIcon-20@2x~ipad.png | 40x40 | iPad Notifications @2x |
| AppIcon-29.png | 29x29 | iPad Settings @1x |
| AppIcon-29@2x.png | 58x58 | iPhone Settings @2x |
| AppIcon-29@3x.png | 87x87 | iPhone Settings @3x |
| AppIcon-29@2x~ipad.png | 58x58 | iPad Settings @2x |
| AppIcon-40.png | 40x40 | iPad Spotlight @1x |
| AppIcon-40@2x.png | 80x80 | iPhone Spotlight @2x |
| AppIcon-40@3x.png | 120x120 | iPhone Spotlight @3x |
| AppIcon-40@2x~ipad.png | 80x80 | iPad Spotlight @2x |
| AppIcon-60@2x.png | 120x120 | iPhone Home @2x |
| AppIcon-60@3x.png | 180x180 | iPhone Home @3x |
| AppIcon-76.png | 76x76 | iPad Home @1x |
| AppIcon-76@2x.png | 152x152 | iPad Home @2x |
| AppIcon-83.5@2x.png | 167x167 | iPad Pro Home @2x |
| AppIcon-1024.png | 1024x1024 | App Store |

---

## After Running `npx cap sync ios`

**Important:** `npx cap sync ios` may overwrite the AppIcon set. Always run the sync script after:

```bash
npx cap sync ios
./scripts/sync-ios-icons.sh
```

Or manually:
```bash
rm -rf ios/App/App/Assets.xcassets/AppIcon.appiconset
cp -R ios-setup/Assets.xcassets/AppIcon.appiconset ios/App/App/Assets.xcassets/
```

---

## Regenerating Icons from New Source

If you need to regenerate icons from a new 1024x1024 source:

1. Replace `client/public/icon-1024.png` with your new icon
2. Run the generation script:
   ```bash
   cd ios-setup
   ./generate-icons.sh
   ```
3. Copy to iOS project:
   ```bash
   ./scripts/sync-ios-icons.sh
   ```

---

## Verification Checklist

After copying icons and rebuilding:

- [ ] `ls ios/App/App/Assets.xcassets/AppIcon.appiconset/*.png | wc -l` returns 18
- [ ] In Xcode: Assets.xcassets → AppIcon shows all slots filled
- [ ] App icon visible on Home Screen
- [ ] App icon visible in App Library
- [ ] App icon visible in Spotlight search
- [ ] App icon visible in Settings → iPhone Storage
- [ ] Icon persists after device reboot

---

## Troubleshooting

### Icon still shows default Capacitor icon

1. Delete app completely from device (not just reinstall)
2. Delete DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData/*Pinochle*`
3. Clean build in Xcode
4. Verify icons copied: `ls ios/App/App/Assets.xcassets/AppIcon.appiconset/`
5. Rebuild and fresh install

### Xcode shows "No icon" warnings

1. Check Contents.json matches the PNG filenames exactly
2. Verify all 18 PNGs are present
3. Check no transparency/alpha channel in icons

### `@capacitor/assets generate` not working

Don't rely on it. Use the pre-generated icons in `ios-setup/Assets.xcassets/AppIcon.appiconset/` and copy them manually.
