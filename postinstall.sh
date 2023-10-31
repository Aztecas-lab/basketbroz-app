# For fixing the bug with Xcode 14.3 and later with older version of react-native: https://github.com/facebook/react-native/issues/36758
xcode_version="$(xcodebuild -version | grep 'Xcode' | cut -d ' ' -f2)"
minimum_version="14.3"

if [ "$(printf '%s\n' "$minimum_version" "$xcode_version" | sort -V | head -n 1)" == "$minimum_version" ]; then
    echo "Xcode version ($xcode_version) is greater than or equal to $minimum_version. Running the fix..."
    sed -i.bo 's/    node->getLayout()\.hadOverflow() |/    node->getLayout()\.hadOverflow() ||/' ../node_modules/react-native/ReactCommon/yoga/yoga/Yoga.cpp
else
    echo "Xcode version ($xcode_version) is less than $minimum_version. Skipping your script."
fi
