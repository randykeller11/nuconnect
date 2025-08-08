# Modern Matrimoney - Architecture Documentation

## Project Overview

Modern Matrimoney is a Next.js application designed to help couples improve their financial communication and literacy. The application features a questionnaire system, professional signup functionality, and administrative dashboard for tracking engagement.

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Server state management
- **Lucide React** - Icon library

### Backend
- **Express.js** - Node.js web framework
- **PostgreSQL** - Primary database
- **Drizzle ORM** - Type-safe database operations
- **Zod** - Schema validation

### Development & Deployment
- **Vite** - Build tool and development server
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── globals.css              # Global styles and design system
│   ├── layout.tsx               # Root layout component
│   ├── admin-dashboard/         # Admin dashboard page
│   └── admin/                   # Alternative admin interface
├── components/                   # Reusable React components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   ├── landing/                 # Landing page specific components
│   ├── questionnaire.tsx        # Main questionnaire component
│   └── demo-selection.tsx       # Demo selection interface
├── lib/                         # Utility libraries
│   ├── hooks/                   # Custom React hooks
│   └── query-provider.tsx       # TanStack Query setup
├── server/                      # Backend server code
│   ├── routes.ts               # API route definitions
│   └── storage.ts              # Database operations
├── shared/                      # Shared code between client/server
│   └── schema.ts               # Database schema and validation
└── tailwind.config.js          # Tailwind CSS configuration
```

## Core Features

### 1. Questionnaire System
- **Location**: `components/questionnaire.tsx`
- **Purpose**: Interactive 10-question assessment for couples
- **Features**:
  - Multi-step form with progress tracking
  - Various question types (radio, textarea, email, info)
  - Real-time validation
  - Responsive design
  - Data persistence to PostgreSQL

### 2. Professional Signup
- **Location**: Professional signup forms and API endpoints
- **Purpose**: Allow financial professionals to join pilot program
- **Features**:
  - Contact information collection
  - Specialty and firm tracking
  - Email validation
  - Admin dashboard integration

### 3. Admin Dashboard
- **Location**: `app/admin-dashboard/page.tsx` and `app/admin/page.tsx`
- **Purpose**: Monitor user engagement and responses
- **Features**:
  - Real-time statistics
  - Response viewing and analysis
  - Professional signup tracking
  - Contact message management
  - Tabbed interface for different data types

### 4. Contact System
- **Location**: `components/landing/contact-form.tsx`
- **Purpose**: General contact and consultation requests
- **Features**:
  - Multi-field contact form
  - Relationship status tracking
  - Message collection
  - Toast notifications

## Database Schema

### Tables

#### questionnaire_responses
- `id` (serial, primary key)
- `userId` (text, not null)
- `answers` (jsonb, not null) - Flexible answer storage
- `submittedAt` (timestamp, default now)

#### professional_signups
- `id` (serial, primary key)
- `name` (text, not null)
- `firm` (text, not null)
- `email` (text, not null)
- `phone` (text, not null)
- `specialty` (text, not null)
- `submittedAt` (timestamp, default now)

#### contact_submissions (implied)
- Contact form submissions with personal details and messages

## API Endpoints

### Questionnaire Routes
- `POST /api/questionnaire/submit` - Submit questionnaire responses
- `GET /api/questionnaire/responses` - Retrieve all responses (admin)

### Professional Routes
- `POST /api/professionals` - Create professional signup
- `GET /api/professionals` - Retrieve all signups (admin)

### Contact Routes
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Retrieve contact submissions (admin)

## Design System

### Color Palette
- **Brand Teal**: `#00A99D` - Primary brand color
- **Gold Light**: `#E6B800` - Accent color for CTAs
- **Gold Dark**: `#CC9A00` - Darker accent variant
- **Brand Coral**: `#FF6B6B` - Secondary accent
- **Earth Gray**: `#F2F2F2` - Background color
- **Neutral Dark**: `#2E2E2E` - Text color

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Accent**: Roboto Mono (monospace)

### Component Classes
- `.btn-primary` - Gold gradient buttons
- `.btn-secondary` - Teal outline buttons
- `.btn-white` - White glassmorphic buttons
- `.section-title` - Gradient text headings
- `.elevated-card` - Floating card design
- `.glassmorphic` - Backdrop blur effects

## State Management

### Client State
- **TanStack Query**: Server state caching and synchronization
- **React useState**: Local component state
- **Form State**: Managed within individual components

### Server State
- **PostgreSQL**: Persistent data storage
- **Drizzle ORM**: Type-safe database queries
- **Zod Validation**: Runtime type checking

## User Experience Flow

### Primary User Journey
1. **Landing Page** - Introduction to Modern Matrimoney
2. **Demo Selection** - Choose between user experience or admin view
3. **Questionnaire** - Complete 10-question assessment
4. **Results** - Receive personalized conversation prompt
5. **Follow-up** - Optional email signup for continued engagement

### Admin Journey
1. **Admin Dashboard** - Overview of all submissions
2. **Response Analysis** - Detailed view of questionnaire responses
3. **Professional Tracking** - Monitor pilot program signups
4. **Contact Management** - Review consultation requests

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js built-in image optimization
- **CSS Optimization**: Tailwind CSS purging unused styles
- **Bundle Analysis**: Vite build optimization

### Backend Optimization
- **Database Indexing**: Proper indexing on frequently queried fields
- **Query Optimization**: Efficient Drizzle ORM queries
- **Caching Strategy**: TanStack Query client-side caching

## Security Measures

### Data Protection
- **Input Validation**: Zod schema validation on all inputs
- **SQL Injection Prevention**: Drizzle ORM parameterized queries
- **XSS Protection**: React's built-in XSS protection
- **CORS Configuration**: Proper cross-origin request handling

### Privacy Considerations
- **Anonymous Data**: User IDs are generated, not collected
- **Consent Management**: Story sharing consent explicitly requested
- **Data Minimization**: Only collect necessary information

## Deployment Architecture

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Database**: Local PostgreSQL instance
- **Environment Variables**: `.env.local` for configuration

### Production Considerations
- **Static Generation**: Next.js static optimization where possible
- **Database Connection**: Connection pooling for PostgreSQL
- **Environment Configuration**: Production environment variables
- **Error Handling**: Comprehensive error boundaries and logging

## Future Enhancements

### Planned Features
1. **User Authentication**: Secure user accounts and data persistence
2. **Advanced Analytics**: Deeper insights into response patterns
3. **Email Integration**: Automated follow-up sequences
4. **Mobile App**: React Native companion application
5. **Professional Portal**: Dedicated interface for financial advisors

### Technical Improvements
1. **Real-time Updates**: WebSocket integration for live admin updates
2. **Advanced Caching**: Redis integration for improved performance
3. **Monitoring**: Application performance monitoring and logging
4. **Testing**: Comprehensive test suite with Jest and Cypress
5. **CI/CD Pipeline**: Automated testing and deployment

## Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Consistent code style enforcement
- **Component Structure**: Functional components with hooks
- **File Organization**: Feature-based folder structure

### Best Practices
- **Accessibility**: WCAG 2.1 compliance with Radix UI
- **Performance**: Lazy loading and code splitting
- **SEO**: Proper meta tags and semantic HTML
- **Responsive Design**: Mobile-first approach with Tailwind

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Critical user journey testing
- **Accessibility Tests**: Automated accessibility checking

This architecture provides a solid foundation for Modern Matrimoney's current needs while maintaining flexibility for future growth and feature additions.
