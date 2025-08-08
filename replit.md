# Modern Matrimoney - replit.md

## Overview

Modern Matrimoney is a React-based demo website designed to promote an e-book and workbook on financial literacy for couples. The application serves as a proof-of-concept for a future full-stack financial management platform, featuring questionnaire functionality, professional pilot program signup, and administrative capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: REST endpoints for data operations
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Configurable storage layer (currently in-memory for demo)

## Key Components

### Data Layer
- **Database Schema**: Defined using Drizzle ORM with PostgreSQL tables
  - `questionnaire_responses`: Stores user questionnaire submissions
  - `professional_signups`: Stores professional pilot program applications
- **Storage Interface**: Abstracted storage layer allowing easy switching between implementations
- **Data Validation**: Zod schemas for runtime type safety

### UI Components
- **Design System**: shadcn/ui components built on Radix UI primitives
- **Responsive Design**: Mobile-first approach with breakpoints at 480px and 1024px
- **Accessibility**: ARIA-compliant components with keyboard navigation support

### API Endpoints
- `POST /api/questionnaire/submit` - Submit questionnaire responses
- `GET /api/questionnaire/responses` - Retrieve all questionnaire submissions
- `POST /api/professionals` - Submit professional pilot signup
- `GET /api/professionals` - Retrieve all professional signups

## Data Flow

1. **User Journey**: Landing page → Demo selection → Questionnaire completion
2. **Professional Journey**: Landing page → Professional signup form
3. **Admin Journey**: Direct access to admin dashboard for data review
4. **Data Processing**: Form submissions → API validation → Storage → Admin dashboard display

## External Dependencies

### Production Dependencies
- **UI Framework**: React, React DOM, Radix UI components
- **Database**: Neon Database (PostgreSQL), Drizzle ORM
- **Validation**: Zod for schema validation
- **HTTP Client**: Native fetch API with TanStack Query
- **Styling**: Tailwind CSS, class-variance-authority

### Development Dependencies
- **Build Tools**: Vite, TypeScript, ESBuild
- **Development Server**: tsx for TypeScript execution
- **Database Tools**: Drizzle Kit for migrations

## Deployment Strategy

### Build Process
1. Frontend builds to `dist/public` using Vite
2. Backend bundles to `dist/index.js` using ESBuild
3. Database schema pushes using Drizzle Kit

### Environment Configuration
- **Development**: `npm run dev` - runs with hot reload
- **Production**: `npm run build && npm start` - builds and serves optimized bundle
- **Database**: Requires `DATABASE_URL` environment variable

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database connection
- Static file serving capability

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
- July 03, 2025. Added e-book download dialog popup on homepage
- July 03, 2025. Moved professional pilot to dedicated homepage section, removed from header navigation
- July 03, 2025. Complete homepage aesthetic upgrade with modern design, animations, gradients, and enhanced visual hierarchy
- July 03, 2025. Updated company name from "Financial Couples Hub" to "Modern Matrimoney"
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```