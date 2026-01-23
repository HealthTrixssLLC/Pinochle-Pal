#!/bin/bash
# iOS App Icon Generator Script
# Generates all 18 required icon sizes from the source 1024x1024 icon
# Requires: ImageMagick (brew install imagemagick) or run on Replit

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_ICON="$SCRIPT_DIR/../client/public/icon-1024.png"
OUTPUT_DIR="$SCRIPT_DIR/Assets.xcassets/AppIcon.appiconset"

# Check if source exists
if [ ! -f "$SOURCE_ICON" ]; then
    echo "Error: Source icon not found at $SOURCE_ICON"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Generating iOS app icons from $SOURCE_ICON..."

# Check for convert command (ImageMagick)
if command -v convert &> /dev/null; then
    RESIZE_CMD="convert"
elif command -v sips &> /dev/null; then
    RESIZE_CMD="sips"
else
    echo "Error: Neither ImageMagick (convert) nor sips found"
    echo "Install ImageMagick: brew install imagemagick"
    exit 1
fi

resize_icon() {
    local size=$1
    local output=$2
    if [ "$RESIZE_CMD" = "convert" ]; then
        convert "$SOURCE_ICON" -resize ${size}x${size} "$OUTPUT_DIR/$output"
    else
        sips -z $size $size "$SOURCE_ICON" --out "$OUTPUT_DIR/$output" > /dev/null 2>&1
    fi
    echo "  Created: $output (${size}x${size})"
}

# iPhone icons
resize_icon 40 "AppIcon-20@2x.png"
resize_icon 60 "AppIcon-20@3x.png"
resize_icon 58 "AppIcon-29@2x.png"
resize_icon 87 "AppIcon-29@3x.png"
resize_icon 80 "AppIcon-40@2x.png"
resize_icon 120 "AppIcon-40@3x.png"
resize_icon 120 "AppIcon-60@2x.png"
resize_icon 180 "AppIcon-60@3x.png"

# iPad icons
resize_icon 20 "AppIcon-20.png"
resize_icon 40 "AppIcon-20@2x~ipad.png"
resize_icon 29 "AppIcon-29.png"
resize_icon 58 "AppIcon-29@2x~ipad.png"
resize_icon 40 "AppIcon-40.png"
resize_icon 80 "AppIcon-40@2x~ipad.png"
resize_icon 76 "AppIcon-76.png"
resize_icon 152 "AppIcon-76@2x.png"
resize_icon 167 "AppIcon-83.5@2x.png"

# App Store icon
resize_icon 1024 "AppIcon-1024.png"

echo ""
echo "Done! Generated $(ls "$OUTPUT_DIR"/*.png 2>/dev/null | wc -l | tr -d ' ') icons in:"
echo "  $OUTPUT_DIR"
echo ""
echo "Next: Copy to iOS project with:"
echo "  ./scripts/sync-ios-icons.sh"
