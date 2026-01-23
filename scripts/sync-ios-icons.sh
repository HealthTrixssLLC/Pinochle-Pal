#!/bin/bash
# sync-ios-icons.sh
# Run this AFTER `npx cap sync ios` to restore the correct app icons
# This prevents Capacitor sync from overwriting the AppIcon set

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

SOURCE_ICONS="$PROJECT_ROOT/ios-setup/Assets.xcassets/AppIcon.appiconset"
TARGET_ICONS="$PROJECT_ROOT/ios/App/App/Assets.xcassets/AppIcon.appiconset"

if [ ! -d "$SOURCE_ICONS" ]; then
    echo "Error: Source icons not found at $SOURCE_ICONS"
    exit 1
fi

if [ ! -d "$PROJECT_ROOT/ios/App/App/Assets.xcassets" ]; then
    echo "Error: iOS Assets.xcassets not found. Run 'npx cap add ios' first."
    exit 1
fi

echo "Syncing app icons to iOS project..."

# Remove existing AppIcon set and copy fresh
rm -rf "$TARGET_ICONS"
cp -R "$SOURCE_ICONS" "$TARGET_ICONS"

echo "Done! AppIcon set updated at:"
echo "  $TARGET_ICONS"
echo ""
echo "Icon files:"
ls "$TARGET_ICONS"/*.png 2>/dev/null | wc -l | xargs echo "  Total PNG files:"
echo ""
echo "Next steps:"
echo "  1. Open Xcode: npx cap open ios"
echo "  2. Clean Build Folder: Product → Clean Build Folder (Cmd+Shift+K)"
echo "  3. Delete app from device"
echo "  4. Build and run"
