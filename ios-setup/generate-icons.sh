#!/bin/bash

# iOS App Icon Generator Script
# Generates all required icon sizes from the source 1024x1024 icon
# Requires: ImageMagick (brew install imagemagick) or sips (built into macOS)

SOURCE_ICON="../client/public/icon-1024.png"
OUTPUT_DIR="Assets.xcassets/AppIcon.appiconset"

# Check if source exists
if [ ! -f "$SOURCE_ICON" ]; then
    echo "Error: Source icon not found at $SOURCE_ICON"
    echo "Please ensure icon-1024.png exists in client/public/"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Copy the 1024 icon
cp "$SOURCE_ICON" "$OUTPUT_DIR/icon-1024.png"

echo "Generating iOS app icons from $SOURCE_ICON..."

# Function to resize using sips (macOS built-in)
resize_icon() {
    local size=$1
    local output=$2
    sips -z $size $size "$SOURCE_ICON" --out "$OUTPUT_DIR/$output" > /dev/null 2>&1
    echo "  Created: $output (${size}x${size})"
}

# iPhone icons
resize_icon 40 "icon-20@2x.png"      # 20pt @2x
resize_icon 60 "icon-20@3x.png"      # 20pt @3x
resize_icon 58 "icon-29@2x.png"      # 29pt @2x
resize_icon 87 "icon-29@3x.png"      # 29pt @3x
resize_icon 80 "icon-40@2x.png"      # 40pt @2x
resize_icon 120 "icon-40@3x.png"     # 40pt @3x
resize_icon 120 "icon-60@2x.png"     # 60pt @2x
resize_icon 180 "icon-60@3x.png"     # 60pt @3x

# iPad icons
resize_icon 20 "icon-20.png"         # 20pt @1x
resize_icon 40 "icon-20@2x-ipad.png" # 20pt @2x
resize_icon 29 "icon-29.png"         # 29pt @1x
resize_icon 58 "icon-29@2x-ipad.png" # 29pt @2x
resize_icon 40 "icon-40.png"         # 40pt @1x
resize_icon 80 "icon-40@2x-ipad.png" # 40pt @2x
resize_icon 76 "icon-76.png"         # 76pt @1x
resize_icon 152 "icon-76@2x.png"     # 76pt @2x
resize_icon 167 "icon-83.5@2x.png"   # 83.5pt @2x

echo ""
echo "Done! All icons generated in $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Copy the entire Assets.xcassets folder to ios/App/App/"
echo "2. In Xcode, verify the App target uses 'AppIcon' as App Icons Source"
echo "3. Clean build folder (Cmd+Shift+K) and rebuild"
