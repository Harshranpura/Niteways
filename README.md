# 🌟 Niteways - Nightlife Discovery Platform

A comprehensive full-stack nightlife discovery platform featuring a React Native mobile app, NestJS backend, and React admin dashboard.

![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)
![Status](https://img.shields.io/badge/Status-POC%20Complete-success)
![Tech](https://img.shields.io/badge/Tech-React%20Native%20%7C%20NestJS-orange)

**Last Updated:** December 2025 | **Developer:** Harsh Ranpura

## 📋 Project Overview

Niteways is a modern nightlife discovery platform that connects users with nightclubs and events. The platform consists of three integrated components:

1. **Mobile App** - React Native application for iOS and Android
2. **Backend API** - NestJS REST API with PostgreSQL database
3. **Admin Dashboard** - React web application for content management

## ✨ Key Features

### Mobile App
- 🔐 User authentication with JWT
- 🏠 Browse nightclubs with smart filters
- 🎉 Event discovery and details
- 🎭 "Tonight's Vibe" AI mood matcher
- 👤 User profiles with preferences
- 🔔 Push notifications
- 📱 Modern, animated UI/UX

### Admin Dashboard
- 📊 Nightclub management (CRUD)
- 🎪 Event management
- 👥 User analytics
- 🔄 Real-time data synchronization
- 🌐 Web-based interface

### Backend
- 🚀 RESTful API architecture
- 🔒 JWT authentication
- 💾 PostgreSQL database
- 🔄 Real-time sync between components
- 📝 Complete CRUD operations

## 🛠️ Tech Stack

### Mobile App
- React Native
- TypeScript
- React Navigation
- AsyncStorage
- Axios

### Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT

### Admin Dashboard
- React
- Vite
- Axios
- CSS3

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+
- PostgreSQL
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

### Backend Setup

```bash
cd backend
npm install

# Configure database in .env
cp .env.example .env
# Edit .env with your database credentials

# Run migrations and start
npm run start:dev
```

### Mobile App Setup

```bash
cd mobile-app
npm install

# iOS (macOS only)
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

### Admin Dashboard Setup

```bash
cd admin-dashboard
npm install
npm run dev

# Access at http://localhost:3001
```

## 🎯 Demo Credentials

**Admin Dashboard:**
- Email: `admin@niteways.com`
- Password: `password123`

**Mobile App:**
- Sign up with any email/mobile
- Verification code: any 6 digits (POC mode)

## 📱 Screenshots

### Mobile App
- Welcome screen with onboarding
- Browse screen with filters
- Tonight's Vibe mood matcher
- Club details and events
- User profile management

### Admin Dashboard
- Nightclub management interface
- Event management
- User analytics

## 🗂️ Project Structure

```
night_club-main/
├── mobile-app/          # React Native application
│   ├── src/
│   │   ├── screens/     # Screen components
│   │   ├── services/    # API services
│   │   ├── theme.ts     # Style theme
│   │   └── types/       # TypeScript types
│   └── android/ios/     # Native platform code
│
├── backend/             # NestJS API
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   ├── entities/    # Database entities
│   │   └── main.ts      # Entry point
│   └── package.json
│
└── admin-dashboard/     # React admin panel
    ├── src/
    │   ├── App.jsx      # Main component
    │   ├── api.js       # API client
    │   └── styles/      # CSS files
    └── package.json
```

## 🚀 Deployment

### Admin Dashboard
Can be deployed to Vercel, Netlify, or any static hosting:

```bash
cd admin-dashboard
npm run build
# Deploy dist/ folder
```

### Backend
Can be deployed to Railway, Heroku, or AWS:

```bash
cd backend
npm run build
# Deploy with environment variables configured
```

### Mobile App
Build for distribution:

```bash
# Android
cd mobile-app/android
./gradlew assembleRelease

# iOS
# Use Xcode to archive and distribute
```

## 🧪 Testing

Sample data is included for demonstration:
- 3 nightclubs (Sky Garden, Velvet Rope, Neon Sanctum)
- 5 events across different venues
- 4 registered users

## 📝 API Documentation

Base URL: `http://localhost:3000/api`

### Endpoints

**Authentication:**
- POST `/auth/signup` - User registration
- POST `/auth/signin` - User login
- POST `/auth/verify` - Mobile verification

**Nightclubs:**
- GET `/nightclubs` - Get all nightclubs
- GET `/nightclubs/:id` - Get specific nightclub
- POST `/nightclubs` - Create nightclub (admin)
- PUT `/nightclubs/:id` - Update nightclub (admin)
- DELETE `/nightclubs/:id` - Delete nightclub (admin)

**Events:**
- GET `/events` - Get all events
- GET `/events/:id` - Get specific event
- POST `/events` - Create event (admin)
- PUT `/events/:id` - Update event (admin)
- DELETE `/events/:id` - Delete event (admin)

## 🔄 Data Synchronization

The platform demonstrates real-time synchronization:
1. Admin creates/updates content in dashboard
2. Changes saved to PostgreSQL database
3. Mobile app fetches updated data via API
4. Users see changes immediately

## 🎨 Design System

- **Primary Color:** `#00D9FF` (Vibrant Cyan)
- **Secondary Color:** `#0099FF` (Electric Blue)
- **Background:** `#0A0E27` (Deep Navy)
- **Typography:** System fonts with premium feel
- **Animations:** Smooth, professional transitions

## 🛣️ Roadmap

- [ ] Payment integration (Stripe/Klarna)
- [ ] Advanced AI recommendations
- [ ] Social features (friends, sharing)
- [ ] Loyalty program
- [ ] Analytics dashboard
- [ ] Push notification service
- [ ] App store deployment

## 👨‍💻 Development

Built as a Proof of Concept demonstrating:
- ✅ Full-stack development capabilities
- ✅ Mobile-first design approach
- ✅ Scalable architecture
- ✅ Professional UI/UX
- ✅ Production-ready code quality

## 📄 License

This is a proprietary project developed for demonstration purposes.

## 🤝 Contact

For questions or demo requests, please contact the development team.

---

**Note:** This is a POC/MVP. Production deployment would include additional security hardening, performance optimization, and comprehensive testing.
