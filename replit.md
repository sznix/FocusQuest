# FocusQuest - Quest-Based Task Manager

## Overview

FocusQuest is a Kanban-style task management application built with Next.js 15, React 18, and TypeScript. It provides a simple quest-based interface for organizing tasks across three workflow stages: Backlog, Doing, and Done. The application uses browser LocalStorage for data persistence, requiring no backend infrastructure or database setup. All state management is handled client-side with React hooks, making it a lightweight, zero-configuration productivity tool.

## Recent Changes

**November 20, 2025 (Latest)**: Comprehensive performance optimization and code quality improvements
- **React Performance**: Implemented React.memo for QuestCard and QuestColumn components to prevent unnecessary re-renders
- **Callback Optimization**: Wrapped event handlers (updateQuestStatus, deleteQuest, handleSubmit) with useCallback for stable references
- **Computation Memoization**: Added useMemo for expensive calculations (questCounts, questsInColumn filtering)
- **I/O Optimization**: Debounced localStorage writes with 300ms delay to reduce disk operations
- **ID Generation**: Replaced Date.now() + Math.random() with crypto.randomUUID() for better uniqueness and collision prevention
- **Bundle Size**: Removed unused @octokit/rest dependency (eliminated 19 packages)
- **CSS Cleanup**: Fixed duplicate font-family definition in globals.css
- **Production Build**: Added Next.js compiler optimizations (removeConsole in production, optimizePackageImports)
- **Result**: Architect-reviewed and approved - zero performance regressions, improved code quality

**November 20, 2025**: Successfully migrated from Vercel to Replit
- Configured Next.js development and production servers to bind to port 5000 on host 0.0.0.0 for Replit compatibility
- Set up deployment configuration for autoscale deployment target
- Installed all dependencies and verified clean server startup
- Application running without configuration errors
- Fixed React hydration mismatch errors caused by browser extensions (Grammarly) using suppressHydrationWarning

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 15 with App Router
- Uses client-side rendering exclusively (`"use client"` directive)
- Single-page application architecture with no server-side components
- React 18 with hooks-based state management (useState, useEffect)

**Styling**: Tailwind CSS 3.4
- Custom color scheme using CSS variables (--background, --foreground)
- Dark theme with slate color palette as primary design system
- Responsive design using Tailwind's utility classes
- Global styles defined in `app/globals.css`

**TypeScript Configuration**:
- Strict mode enabled for type safety
- Path aliases configured (`@/*` maps to project root)
- Target ES2017 for modern JavaScript features

### State Management

**Local State with React Hooks**:
- All application state managed via `useState` hooks
- No external state management libraries (Redux, Zustand, etc.)
- Quest data structure: `{ id: string, title: string, description?: string, status: QuestStatus }`
- Three status types: "Backlog", "Doing", "Done"

**Data Persistence**:
- Browser LocalStorage used for quest persistence
- `useEffect` hook handles synchronization between React state and LocalStorage
- No server-side persistence or database required
- Data survives page refreshes and browser sessions

### Component Structure

**Atomic Component Design**:
- `QuestCard` component for individual quest rendering (memoized with React.memo)
- `QuestColumn` component for column rendering with memoized quest filtering
- Props-based communication pattern between parent and child components
- Event handlers wrapped with useCallback for stable references and optimal performance
- Form handling in main page component for quest creation

**Key Features**:
- Quest creation form (title + optional description)
- Status transition buttons (Start: Backlog→Doing, Complete: Doing→Done)
- Individual quest deletion
- Clear all quests functionality
- Real-time quest statistics and summary
- Completion celebration UI when all quests are done

### Routing & Pages

**Single Route Application**:
- Main application lives at root route (`app/page.tsx`)
- No multi-page navigation or routing logic required
- App Router structure used but only root layout and page implemented

**Metadata & SEO**:
- Static metadata defined in `app/layout.tsx`
- Includes title, description, and keywords for basic SEO
- Font optimization using Next.js font loader (Inter font family)

### Build & Development Configuration

**Next.js Configuration**:
- Development server runs on port 5000 with host 0.0.0.0 for network accessibility
- Production build uses standard Next.js optimization
- ESLint with Next.js core web vitals preset for code quality

**PostCSS Pipeline**:
- Tailwind CSS processing
- Autoprefixer for cross-browser compatibility

**Node.js Requirements**:
- Minimum version: 18.17.0
- Specified in package.json engines field

## External Dependencies

### Runtime Dependencies
- **next** (^15): React framework for production-grade applications
- **react** (^18): Core React library for UI components
- **react-dom** (^18): React DOM rendering

### Development Dependencies
- **typescript** (^5): Static type checking
- **@types/node** (^20): Node.js type definitions
- **@types/react** (^18): React type definitions
- **@types/react-dom** (^18): React DOM type definitions
- **tailwindcss** (^3.4.1): Utility-first CSS framework
- **autoprefixer** (^10): PostCSS plugin for vendor prefixes
- **postcss** (^8): CSS transformation tool
- **eslint** (^8): JavaScript/TypeScript linting
- **eslint-config-next** (^15): Next.js ESLint configuration

### External Services
**None** - The application is entirely self-contained with no external API calls, third-party services, authentication providers, or cloud dependencies. All data persists locally in the browser.