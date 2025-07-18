# TradingLog Pro

## Overview

TradingLog Pro is a full-stack trading journal application built with React, TypeScript, Express, and PostgreSQL. It provides traders with a comprehensive platform to record, track, and analyze their trading activities, including trade management, trading plan creation, and performance statistics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and build processes

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with proper error handling
- **Development**: Hot reloading with Vite middleware integration

### Database Layer
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless connection
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage**: DatabaseStorage class replacing in-memory storage for persistent data

### Key Components

#### Data Models
- **Trades**: Core trading records with entry/exit prices, P&L calculation, and status tracking
- **Trading Plans**: Strategic planning documents with objectives, risk management, and performance targets

#### API Endpoints
- **Trade Management**: Full CRUD operations for trades (`/api/trades`)
- **Trading Plans**: Full CRUD operations for trading plans (`/api/trading-plans`)
- **Statistics**: Dashboard metrics and analytics (`/api/dashboard/stats`)

#### UI Components
- **Dashboard**: Overview with metrics cards, capital evolution chart, and recent trades
- **Trade Forms**: Create and edit trade entries with validation
- **History**: Comprehensive trade history with filtering and sorting
- **Statistics**: Advanced analytics with charts and performance metrics
- **Trading Plans**: Plan creation and management interface

### Data Flow

1. **User Interaction**: User interacts with React components
2. **State Management**: TanStack Query handles server state and caching
3. **API Communication**: HTTP requests to Express backend
4. **Business Logic**: Express routes process requests and validate data
5. **Database Operations**: Drizzle ORM executes type-safe database queries
6. **Response Handling**: Data flows back through the stack to update UI

### External Dependencies

#### Frontend Dependencies
- **UI Framework**: Radix UI components for accessible, unstyled primitives
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Utilities**: date-fns for date manipulation, clsx for conditional classes

#### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm and drizzle-zod for database operations and validation
- **Session**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution

### Deployment Strategy

#### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: Express server with Vite middleware integration
- **Database**: Neon Database serverless PostgreSQL
- **Development Tools**: Replit integration with cartographer plugin

#### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations handle schema updates
- **Environment**: NODE_ENV-based configuration

#### Key Architectural Decisions

1. **Monorepo Structure**: Organized as client/server/shared for code organization and type sharing
2. **Type Safety**: Full TypeScript implementation with shared schema definitions
3. **Database First**: Drizzle schema serves as single source of truth for data models
4. **Component Library**: shadcn/ui provides consistent, customizable UI components
5. **Real-time Updates**: TanStack Query provides optimistic updates and cache invalidation
6. **Responsive Design**: Tailwind CSS ensures mobile-first responsive design
7. **Development Experience**: Vite provides fast development with HMR and TypeScript support

The application uses a modern, type-safe stack optimized for developer experience while maintaining production-ready architecture with proper error handling, validation, and state management.

## Recent Changes

### Database Integration (July 2025)
- ✓ Added PostgreSQL database integration
- ✓ Created DatabaseStorage class to replace in-memory storage
- ✓ Implemented Drizzle ORM with Neon serverless connection
- ✓ Added comprehensive CRUD operations for trades and trading plans
- ✓ Fixed TypeScript errors and improved type safety
- ✓ Added editing and detail view functionality for trading plans
- ✓ Fixed sidebar navigation issues with nested anchor elements
- ✓ Implemented delete functionality with confirmation dialogs

The application now uses persistent PostgreSQL storage, ensuring data persistence between sessions while maintaining all existing functionality.