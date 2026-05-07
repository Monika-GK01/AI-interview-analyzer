# AI Interview Emotion Analyzer - Architecture Document

## 1. System Overview

A full-stack web application that conducts mock interviews and provides real-time analysis of communication patterns, emotional engagement, and confidence levels.

## 2. Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Radix UI
- **Charts**: Recharts
- **State Management**: React Context + Hooks
- **Form Handling**: React Hook Form + Zod

### Backend
- **API**: Next.js API Routes
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for recordings)

### AI/ML Services
- **Speech-to-Text**: Web Speech API (browser-native) + fallback to external API
- **Text Analysis**: Custom algorithms for filler words, pace, confidence
- **Emotion Detection**: Sentiment analysis library

### DevOps
- **Hosting**: Vercel
- **CI/CD**: Vercel Git Integration
- **Environment**: Environment variables via Vercel

## 3. Architecture Patterns

### Frontend Architecture
```
┌─────────────────────────────────────────┐
│           Next.js App Router            │
├─────────────────────────────────────────┤
│  Pages (app/)                           │
│  ├── Landing Page                       │
│  ├── Auth Pages                         │
│  ├── Dashboard                          │
│  ├── Interview Session                  │
│  └── History & Reports                  │
├─────────────────────────────────────────┤
│  Components Layer                       │
│  ├── Layout Components                  │
│  ├── Feature Components                 │
│  ├── UI Components                      │
│  └── Chart Components                   │
├─────────────────────────────────────────┤
│  Business Logic Layer                   │
│  ├── Hooks (useInterview, useAnalysis)  │
│  ├── Context (Auth, Interview)          │
│  └── Utils (analyzers, calculators)     │
└─────────────────────────────────────────┘
```

### Backend Architecture
```
┌─────────────────────────────────────────┐
│         API Routes (app/api/)           │
├─────────────────────────────────────────┤
│  /auth/*        - Authentication        │
│  /interviews/*  - Interview CRUD        │
│  /analysis/*    - Analysis endpoints    │
│  /reports/*     - Report generation     │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│         Service Layer (lib/)            │
├─────────────────────────────────────────┤
│  - Supabase Client                      │
│  - Analysis Services                    │
│  - Validation Services                  │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│         Supabase Backend                │
├─────────────────────────────────────────┤
│  - PostgreSQL Database                  │
│  - Authentication                       │
│  - Storage                              │
│  - Row Level Security                   │
└─────────────────────────────────────────┘
```

## 4. Database Schema

### Tables

#### users (managed by Supabase Auth)
- id (uuid, PK)
- email (text)
- created_at (timestamp)

#### profiles
- id (uuid, PK, FK to auth.users)
- full_name (text)
- avatar_url (text)
- created_at (timestamp)
- updated_at (timestamp)

#### interviews
- id (uuid, PK)
- user_id (uuid, FK to profiles)
- title (text)
- status (enum: 'pending', 'in_progress', 'completed', 'cancelled')
- started_at (timestamp)
- completed_at (timestamp)
- duration_seconds (integer)
- created_at (timestamp)
- updated_at (timestamp)

#### interview_transcripts
- id (uuid, PK)
- interview_id (uuid, FK to interviews)
- text (text)
- timestamp_ms (integer)
- created_at (timestamp)

#### interview_analysis
- id (uuid, PK)
- interview_id (uuid, FK to interviews, unique)
- confidence_score (decimal)
- speaking_pace_wpm (decimal)
- filler_word_count (integer)
- filler_word_percentage (decimal)
- nervousness_score (decimal)
- emotional_engagement_score (decimal)
- total_words (integer)
- unique_words (integer)
- average_pause_duration_ms (integer)
- longest_pause_duration_ms (integer)
- analysis_data (jsonb) -- detailed breakdown
- created_at (timestamp)
- updated_at (timestamp)

#### filler_words
- id (uuid, PK)
- interview_id (uuid, FK to interviews)
- word (text)
- count (integer)
- timestamp_ms (integer)
- created_at (timestamp)

## 5. API Design

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Interviews
- `GET /api/interviews` - List user interviews
- `POST /api/interviews` - Create new interview
- `GET /api/interviews/[id]` - Get interview details
- `PATCH /api/interviews/[id]` - Update interview
- `DELETE /api/interviews/[id]` - Delete interview
- `POST /api/interviews/[id]/start` - Start interview
- `POST /api/interviews/[id]/complete` - Complete interview

### Analysis
- `POST /api/analysis/transcript` - Save transcript chunk
- `POST /api/analysis/process` - Process interview analysis
- `GET /api/analysis/[interviewId]` - Get analysis results
- `POST /api/analysis/real-time` - Real-time analysis during interview

### Reports
- `GET /api/reports/[interviewId]` - Get full report
- `GET /api/reports/[interviewId]/pdf` - Export as PDF

## 6. Component Structure

### Layout Components
- `RootLayout` - Main app layout
- `DashboardLayout` - Dashboard wrapper
- `AuthLayout` - Auth pages wrapper

### Feature Components
- `InterviewSession` - Main interview interface
- `WebcamCapture` - Video capture component
- `AudioRecorder` - Audio recording component
- `TranscriptDisplay` - Live transcript view
- `AnalysisDashboard` - Analytics overview
- `InterviewHistory` - Past interviews list
- `ReportViewer` - Detailed report display

### UI Components
- `Button`, `Input`, `Card`, `Modal`
- `Chart` (Line, Bar, Radar)
- `LoadingSpinner`, `ErrorBoundary`
- `Toast`, `Alert`

## 7. Analysis Algorithms

### Confidence Score (0-100)
```
Factors:
- Speaking pace consistency (30%)
- Filler word frequency (25%)
- Pause patterns (20%)
- Word variety (15%)
- Response length (10%)
```

### Speaking Pace (WPM)
```
Total words / (Duration in seconds / 60)
Ideal range: 120-150 WPM
```

### Filler Word Detection
```
Common fillers: um, uh, like, you know, actually, basically, literally
Count occurrences and calculate percentage
```

### Nervousness Score (0-100)
```
Factors:
- Filler word frequency (40%)
- Pause frequency and duration (30%)
- Speaking pace variance (20%)
- Repetition patterns (10%)
```

### Emotional Engagement (0-100)
```
Factors:
- Vocabulary richness (30%)
- Sentence complexity (25%)
- Positive sentiment (25%)
- Energy level (speaking pace) (20%)
```

## 8. Security Considerations

- Row Level Security (RLS) on all tables
- JWT-based authentication via Supabase
- HTTPS only in production
- Environment variables for secrets
- Input validation and sanitization
- Rate limiting on API routes
- CORS configuration

## 9. Performance Optimization

- Server-side rendering for initial load
- Client-side caching with React Query
- Lazy loading for heavy components
- Image optimization with Next.js Image
- Code splitting by route
- Database indexing on foreign keys
- CDN for static assets via Vercel

## 10. Deployment Strategy

### Environment Setup
- Development: Local with Supabase local dev
- Staging: Vercel preview deployments
- Production: Vercel production

### CI/CD Pipeline
1. Push to GitHub
2. Vercel auto-deploys
3. Run type checks
4. Run linting
5. Build Next.js app
6. Deploy to edge network

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
```

## 11. Monitoring & Analytics

- Vercel Analytics for performance
- Error tracking with error boundaries
- User analytics (privacy-compliant)
- API endpoint monitoring

## 12. Future Enhancements

- AI-powered interview questions
- Video emotion detection (facial analysis)
- Multi-language support
- Team/organization features
- Interview coaching recommendations
- Integration with job platforms
