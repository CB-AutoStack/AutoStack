# 🚗 AutoStack

**Mobile-first vehicle marketplace platform**

AutoStack is a consumer-facing automotive marketplace demo showcasing modern mobile app development with CloudBees CI/CD and Feature Management.

---

## ✨ Overview

AutoStack enables customers to:
- Browse vehicle inventory (new, used, certified pre-owned)
- Search and filter by make, model, price, features
- View detailed listings with photos
- Get instant trade-in valuations
- Calculate financing options
- Schedule test drives

Built with:
- **Mobile**: React Native (iOS & Android)
- **Backend**: Go microservices
- **CI/CD**: CloudBees workflows
- **Feature Management**: CloudBees Feature Management (Unify)
- **Deployment**: Kubernetes with Helm

---

## 📱 Applications

### Mobile App (`apps/mobile/`)
React Native mobile application for iOS and Android
- Vehicle browsing and search
- Detailed vehicle views
- Trade-in valuation
- Financing calculator
- Feature flag integration

### APIs
- **api-inventory** - Vehicle listings, search, details
- **api-valuations** - Trade-in pricing and market data (future)
- **api-financing** - Payment calculations and pre-approval (future)

---

## 🎯 Feature Management Examples

CloudBees Feature Management controls:
- **Search algorithm** - Price-focused vs feature-focused vs AI-recommended
- **Pricing display** - Monthly payment first vs total price first
- **Vehicle recommendations** - Different personalization strategies
- **Filter options** - Progressive rollout of advanced filters
- **Image quality** - Bandwidth optimization based on user network
- **Trade-in flow** - Instant valuation vs dealer contact

---

## 🏗️ Architecture

```
Mobile App (React Native)
    ↓
External Ingress
    ↓
API Services (Go)
    ↓
Database (PostgreSQL)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Go 1.21+
- Android Studio (for Android emulator)
- Docker (for local API development)

### Local Development

**Mobile App:**
```bash
cd apps/mobile
npm install
npm run android  # or npm run ios
```

**Backend APIs:**
```bash
cd apps/api-inventory
go run main.go
```

---

## 🔧 CI/CD

CloudBees workflows handle:
- Mobile app builds (APK for Android)
- API container builds
- Kubernetes deployments
- Feature Management integration

---

## 📊 Demo Scenarios

1. **Search Algorithm A/B Test** - Compare user engagement with different search rankings
2. **Pricing Strategy** - Test showing monthly payments vs total price first
3. **Progressive Rollout** - Deploy new features to 10% → 50% → 100% of users
4. **Personalization** - Show different vehicle recommendations based on user behavior

---

## 📄 License

MIT (demo purposes only)
