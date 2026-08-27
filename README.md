# HTML Viewer & Editor

A powerful, offline-first HTML viewer and editor for Android. Write, preview, and manage your HTML files directly on your device — no internet connection required, no data collection, no accounts needed.

## Features

- **Code Editor** — Full HTML editor with monospace font, line numbers, and word wrap toggle
- **Live Preview** — Instantly render your HTML in an in-app browser
- **File Management** — Create, rename, delete, and organize HTML files
- **Responsive Testing** — Preview in mobile, tablet, and desktop viewport sizes
- **Templates** — Start from pre-built templates (Landing Page, Portfolio, Blog Article, Blank)
- **Local Storage** — All files saved on-device using the app's private storage
- **Share** — Export HTML files via Android's native share sheet
- **No Tracking** — Zero analytics, zero ads, zero data collection

## Privacy

This app does NOT:
- Collect any personal data
- Use analytics or tracking SDKs
- Connect to any server or cloud service
- Require any permissions
- Access the internet

All your HTML files are stored locally in the app's private directory on your device.

## Tech Stack

- React Native (Expo SDK 54)
- TypeScript
- Expo Router (tab navigation)
- expo-file-system (local storage)
- react-native-webview (HTML preview)
- JetBrains Mono / Inter fonts

## Building

### Prerequisites

- Node.js 20+
- Expo account
- EAS CLI

### Install Dependencies

```bash
npm install
```

### Build APK (for testing)

```bash
eas build --platform android --profile preview
```

### Build AAB (for Play Store)

```bash
eas build --platform android --profile production
```

### GitHub Actions

This repo includes a GitHub Actions workflow that builds both APK and AAB on every push to `main` or when a tag is created. You need to set these secrets in your repo:

- `EXPO_TOKEN` — Your Expo access token (get it from https://expo.dev/accounts/[account]/settings/access-tokens)
- `EAS_PROJECT_ID` — Your EAS project ID (shown when you run `eas init`)

## Play Console Compliance

- **Target SDK**: 35 (Android 15)
- **Minimum SDK**: 24 (Android 7.0)
- **Permissions**: None declared
- **Data Safety**: No data collected, shared, or transmitted
- **Content Rating**: Everyone
- **Ad-Free**: No advertisements
- **Offline**: No internet required

## License

MIT
