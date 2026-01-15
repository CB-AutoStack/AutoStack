# AutoStack Mobile App

React Native mobile application for the AutoStack vehicle marketplace.

## Features

- 📱 Cross-platform (iOS & Android)
- 🚗 Vehicle browsing and search
- 🎯 CloudBees Feature Management integration
- 💰 Pricing display variations (monthly vs total)
- 🔍 Search algorithm variations
- 📸 High-res images and 360° views (flag-gated)
- 💵 Trade-in valuation (flag-gated)
- 🏦 Financing calculator (flag-gated)

## Feature Flags

The app integrates CloudBees Feature Management (Rox) with the following flags:

### Display Flags
- `showMonthlyPaymentFirst` - Show monthly payment prominently vs total price
- `enableAdvancedFilters` - Enable advanced search filters
- `showAIRecommendations` - Show AI-powered vehicle recommendations

### Media Flags
- `enableHighResImages` - Load high-resolution images
- `enable360View` - Enable 360° vehicle views

### Financial Flags
- `showInstantTradeIn` - Enable instant trade-in valuation
- `showFinancingCalculator` - Enable financing calculator

### Variant Flags
- `searchAlgorithm` - Controls search ranking: `price-focused`, `feature-focused`, `ai-recommended`

## Setup

### Prerequisites
- Node.js 18+
- React Native development environment
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

### Install Dependencies
```bash
npm install
```

### iOS Setup (macOS only)
```bash
cd ios
pod install
cd ..
```

### Run on Android
```bash
npm run android
```

### Run on iOS
```bash
npm run ios
```

### Start Metro Bundler
```bash
npm start
```

## Project Structure

```
src/
├── App.tsx                 # Main app component with navigation
├── flags.ts                # Feature flag definitions and initialization
├── data/
│   └── mockData.ts         # Mock vehicle data
└── screens/
    ├── HomeScreen.tsx      # Vehicle list/search screen
    └── VehicleDetailScreen.tsx  # Vehicle detail screen
```

## Environment Variables

For production builds, set the CloudBees Feature Management key:

```bash
FM_KEY=your_cloudbees_fm_key
```

In local development, the app runs in "local mode" with default flag values.

## Building for Production

### Android APK
```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### iOS Archive (macOS only)
Open `ios/AutoStack.xcworkspace` in Xcode and create an archive.

## CloudBees CI/CD

The app is built in CloudBees workflows (see `.cloudbees/workflows/`).

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Demo Scenarios

1. **Pricing Strategy Test**
   - Toggle `showMonthlyPaymentFirst` to test which pricing display drives more engagement

2. **Search Algorithm Comparison**
   - Switch `searchAlgorithm` variant to test: price-focused, feature-focused, or AI-recommended

3. **Progressive Feature Rollout**
   - Enable `enable360View` for 10% of users, measure engagement, then roll out to 100%

4. **Premium Features**
   - Gate `showInstantTradeIn` behind user tier or A/B test

## License

MIT (demo purposes only)
