# Pinochle Scorekeeper

## Overview

Pinochle Scorekeeper is a Progressive Web App (PWA) for tracking scores in Pinochle card games. It supports 2-handed, 3-handed, and 4-handed (partnership) gameplay with a visual meld calculator, game history tracking, and analytics dashboard. The app is designed as an offline-first, privacy-focused mobile experience optimized for iOS/iPhone, with all data stored locally on the device.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Routing**: Wouter (lightweight client-side router) with routes defined in `client/src/App.tsx`
- **State Management**: Zustand with localStorage persistence (`client/src/lib/store.ts`) - all game state, player data, and history stored client-side
- **UI Components**: Radix UI primitives with shadcn/ui component library (`client/src/components/ui/`)
- **Styling**: Tailwind CSS v4 with custom theme (green felt card table aesthetic)
- **Charts**: Recharts for analytics visualization in game stats page
- **Animations**: Framer Motion for page transitions and UI effects

### Backend Architecture
- **Server**: Express.js with minimal API surface (`server/routes.ts`)
- **Purpose**: Primarily serves the static frontend; the app is designed to work entirely offline
- **Database Schema**: Drizzle ORM with PostgreSQL schema defined in `shared/schema.ts` (currently only a users table, but the app stores game data in localStorage, not the database)
- **Storage Pattern**: In-memory storage implementation (`server/storage.ts`) with interface for future database integration

### Data Storage
- **Primary Storage**: Browser localStorage via Zustand persist middleware
- **Data Types**: Players, active game state, saved games history
- **Offline-First**: All game functionality works without network connection
- **No Server Sync**: Game data never leaves the device

### Build System
- **Bundler**: Vite for development and production builds
- **Build Script**: Custom `script/build.ts` using esbuild for server bundling
- **Output**: Client builds to `dist/public`, server bundles to `dist/index.cjs`

### Key Design Patterns
- **Component Structure**: Layout components (`Layout`, `SafeAreaTop`, `Header`) provide consistent page structure with iOS safe area handling
- **Error Handling**: Global ErrorBoundary component catches and displays errors gracefully
- **Game Logic**: Centralized in `client/src/lib/game-logic.ts` with types for games, rounds, melds, and scoring calculations
- **PWA Configuration**: Manifest and iOS meta tags configured for standalone app experience

## External Dependencies

### Third-Party Services
- None - the app is fully self-contained with no external API calls

### Database
- **Drizzle ORM**: Configured for PostgreSQL (`drizzle.config.ts`), though the app currently uses localStorage for all game data
- **Schema Location**: `shared/schema.ts`

### UI Libraries
- **Radix UI**: Full suite of accessible primitives (dialog, dropdown, tabs, etc.)
- **Recharts**: Charting library for game analytics
- **Framer Motion**: Animation library
- **date-fns**: Date formatting utilities

### Development Tools
- **Vite Plugins**: React, Tailwind CSS, runtime error overlay, meta images plugin
- **TypeScript**: Strict mode enabled with path aliases (`@/` for client src, `@shared/` for shared)