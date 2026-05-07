# Complete Folder Structure

```
ai-interview-analyzer/
├── app/                                    # Next.js 15 App Router
│   ├── (auth)/                            # Auth route group (no dashboard layout)
│   │   ├── login/
│   │   │   └── page.tsx                   # Login page ✅
│   │   └── signup/
│   │       └── page.tsx                   # Signup page ✅
│   │
│   ├── (dashboard)/                       # Dashboard route group (with sidebar)
│   │   ├── layout.tsx                     # Dashboard layout with sidebar ✅
│   │   ├── dashboard/
│   │   │   └── page.tsx                   # Main dashboard ✅
│   │   ├── interview/
│   │   │   ├── new/
│   │   │   │   └── page.tsx               # Create new interview (TODO)
│   │   │   └── [id]/
│   │   │       └── page.tsx               # Interview session (TODO)
│   │   ├── history/
│   │   │   └── page.tsx                   # Interview history (TODO)
│   │   ├── reports/
│   │   │   └── [id]/
│   │   │       └── page.tsx               # Detailed report (TODO)
│   │   ├── analytics/
│   │   │   └── page.tsx                   # Analytics dashboard (TODO)
│   │   ├── profile/
│   │   │   └── page.tsx                   # User profile (TODO)
│   │   └── settings/
│   │       └── page.tsx                   # Settings (TODO)
│   │
│   ├── api/                               # API Routes
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts               # OAuth callback (TODO)
│   │   ├── interviews/
│   │   │   ├── route.ts                   # GET, POST interviews ✅
│   │   │   └── [id]/
│   │   │       ├── route.ts               # GET, PATCH, DELETE ✅
│   │   │       ├── start/
│   │   │       │   └── route.ts           # Start interview (TODO)
│   │   │       └── complete/
│   │   │           └── route.ts           # Complete interview (TODO)
│   │   └── analysis/
│   │       ├── transcript/
│   │       │   └── route.ts               # Save transcript (TODO)
│   │       ├── process/
│   │       │   └── route.ts               # Process analysis ✅
│   │       └── [interviewId]/
│   │           └── route.ts               # Get analysis (TODO)
│   │
│   ├── layout.tsx                         # Root layout ✅
│   ├── page.tsx                           # Landing page ✅
│   └── globals.css                        # Global styles ✅
│
├── components/                            # React Components
│   ├── ui/                                # Reusable UI components
│   │   ├── Button.tsx                     # Button component ✅
│   │   ├── Input.tsx                      # Input component ✅
│   │   ├── Card.tsx                       # Card component ✅
│   │   ├── LoadingSpinner.tsx             # Loading spinner ✅
│   │   ├── Modal.tsx                      # Modal dialog (TODO)
│   │   ├── Toast.tsx                      # Toast notifications (TODO)
│   │   └── Badge.tsx                      # Badge component (TODO)
│   │
│   ├── layout/                            # Layout components
│   │   ├── Sidebar.tsx                    # Navigation sidebar ✅
│   │   ├── Header.tsx                     # Dashboard header ✅
│   │   └── Footer.tsx                     # Footer (TODO)
│   │
│   ├── interview/                         # Interview-related components
│   │   ├── WebcamCapture.tsx              # Webcam component (TODO)
│   │   ├── AudioRecorder.tsx              # Audio recorder (TODO)
│   │   ├── SpeechRecognition.tsx          # Speech-to-text (TODO)
│   │   ├── TranscriptDisplay.tsx          # Live transcript (TODO)
│   │   ├── LiveAnalysis.tsx               # Real-time metrics (TODO)
│   │   ├── InterviewControls.tsx          # Start/stop controls (TODO)
│   │   ├── InterviewCard.tsx              # Interview list item (TODO)
│   │   └── InterviewFilters.tsx           # Filter controls (TODO)
│   │
│   └── analysis/                          # Analysis/report components
│       ├── MetricsOverview.tsx            # Score cards (TODO)
│       ├── ConfidenceChart.tsx            # Confidence radar chart (TODO)
│       ├── SpeakingPaceChart.tsx          # Pace line chart (TODO)
│       ├── FillerWordsBreakdown.tsx       # Filler words bar chart (TODO)
│       ├── EmotionalEngagementChart.tsx   # Engagement chart (TODO)
│       └── RecommendationsList.tsx        # Improvement tips (TODO)
│
├── lib/                                   # Utility libraries
│   ├── supabase/                          # Supabase clients
│   │   ├── client.ts                      # Browser client ✅
│   │   ├── server.ts                      # Server client ✅
│   │   └── middleware.ts                  # Auth middleware ✅
│   │
│   ├── analysis/                          # Analysis algorithms
│   │   ├── filler-words.ts                # Filler word detection ✅
│   │   ├── speaking-pace.ts               # Pace calculation ✅
│   │   ├── confidence.ts                  # Confidence scoring ✅
│   │   ├── nervousness.ts                 # Nervousness detection ✅
│   │   ├── emotional-engagement.ts        # Engagement analysis ✅
│   │   └── processor.ts                   # Main processor ✅
│   │
│   └── utils/                             # General utilities
│       ├── cn.ts                          # Class name utility ✅
│       ├── format.ts                      # Formatting functions ✅
│       └── validation.ts                  # Input validation (TODO)
│
├── hooks/                                 # Custom React hooks
│   ├── useInterview.ts                    # Interview state (TODO)
│   ├── useSpeechRecognition.ts            # Speech recognition (TODO)
│   ├── useMediaDevices.ts                 # Webcam/mic access (TODO)
│   └── useAnalysis.ts                     # Analysis data (TODO)
│
├── types/                                 # TypeScript types
│   ├── database.ts                        # Database types ✅
│   ├── interview.ts                       # Interview types ✅
│   └── analysis.ts                        # Analysis types (TODO)
│
├── supabase/                              # Database files
│   ├── schema.sql                         # Database schema ✅
│   └── policies.sql                       # RLS policies ✅
│
├── public/                                # Static assets
│   ├── images/                            # Images (TODO)
│   └── icons/                             # Icons (TODO)
│
├── .github/                               # GitHub configuration
│   └── workflows/                         # CI/CD workflows (TODO)
│       └── ci.yml                         # GitHub Actions (TODO)
│
├── docs/                                  # Additional documentation
│   ├── API.md                             # API documentation (TODO)
│   └── CONTRIBUTING.md                    # Contribution guide (TODO)
│
├── tests/                                 # Test files (TODO)
│   ├── unit/                              # Unit tests
│   └── integration/                       # Integration tests
│
├── .env.example                           # Environment template ✅
├── .gitignore                             # Git ignore ✅
├── middleware.ts                          # Next.js middleware ✅
├── next.config.ts                         # Next.js config ✅
├── package.json                           # Dependencies ✅
├── postcss.config.mjs                     # PostCSS config ✅
├── tailwind.config.ts                     # Tailwind config ✅
├── tsconfig.json                          # TypeScript config ✅
├── README.md                              # Main documentation ✅
├── PROJECT_ARCHITECTURE.md                # Architecture doc ✅
├── IMPLEMENTATION_ROADMAP.md              # Implementation guide ✅
├── DEPLOYMENT_GUIDE.md                    # Deployment guide ✅
└── FOLDER_STRUCTURE.md                    # This file ✅
```

## File Status Legend

- ✅ **Complete**: File is fully implemented
- 🚧 **In Progress**: File is partially implemented
- TODO **To Do**: File needs to be created

## Priority Implementation Order

### Phase 1: Critical (Must Have for MVP)
1. Interview session page (`app/(dashboard)/interview/[id]/page.tsx`)
2. Webcam/Audio components (`components/interview/`)
3. Speech recognition hook (`hooks/useSpeechRecognition.ts`)
4. Interview API routes (`app/api/interviews/[id]/start/route.ts`, etc.)
5. Report page (`app/(dashboard)/reports/[id]/page.tsx`)

### Phase 2: Important (Core Features)
1. History page (`app/(dashboard)/history/page.tsx`)
2. Analysis charts (`components/analysis/`)
3. Interview filters and search
4. Profile and settings pages

### Phase 3: Nice to Have (Enhancements)
1. Analytics dashboard
2. Advanced charts
3. Export functionality
4. Email notifications
5. Social authentication

## Component Dependencies

### Interview Session Flow
```
page.tsx (Interview Session)
  ├── WebcamCapture
  ├── AudioRecorder
  ├── SpeechRecognition
  ├── TranscriptDisplay
  ├── LiveAnalysis
  └── InterviewControls
```

### Report Page Flow
```
page.tsx (Report)
  ├── MetricsOverview
  ├── ConfidenceChart
  ├── SpeakingPaceChart
  ├── FillerWordsBreakdown
  ├── EmotionalEngagementChart
  └── RecommendationsList
```

### Dashboard Flow
```
page.tsx (Dashboard)
  ├── StatCard (inline)
  ├── InterviewCard
  └── QuickActions
```

## Key Files Explained

### Core Application Files

**`app/layout.tsx`**
- Root layout for entire app
- Loads global CSS
- Sets up fonts and metadata

**`middleware.ts`**
- Handles authentication checks
- Redirects unauthenticated users
- Refreshes auth tokens

**`lib/supabase/client.ts` & `server.ts`**
- Supabase client initialization
- Browser vs server-side clients
- Used throughout the app

### Analysis Engine

**`lib/analysis/processor.ts`**
- Main analysis orchestrator
- Calls all sub-analyzers
- Returns complete analysis object

**Individual Analyzers**
- Each handles one aspect of analysis
- Pure functions for testability
- Can be used independently

### API Routes

**RESTful Structure**
```
GET    /api/interviews          - List all
POST   /api/interviews          - Create new
GET    /api/interviews/[id]     - Get one
PATCH  /api/interviews/[id]     - Update
DELETE /api/interviews/[id]     - Delete
POST   /api/interviews/[id]/start    - Start session
POST   /api/interviews/[id]/complete - End session
```

### Database Schema

**Core Tables**
1. `profiles` - User information
2. `interviews` - Interview sessions
3. `interview_transcripts` - Speech transcripts
4. `interview_analysis` - Computed metrics
5. `filler_words` - Filler word tracking

## Development Workflow

### Adding a New Feature

1. **Create types** in `types/`
2. **Add database tables** (if needed) in `supabase/schema.sql`
3. **Create API routes** in `app/api/`
4. **Build components** in `components/`
5. **Create page** in `app/(dashboard)/`
6. **Add navigation** in `components/layout/Sidebar.tsx`
7. **Test** the feature
8. **Document** in README

### File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`)
- **Utilities**: camelCase (e.g., `format.ts`)
- **Pages**: lowercase (e.g., `page.tsx`)
- **API Routes**: lowercase (e.g., `route.ts`)
- **Types**: camelCase (e.g., `interview.ts`)

### Import Aliases

Use `@/` for absolute imports:
```typescript
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { Interview } from '@/types/interview'
```

## Code Organization Principles

1. **Separation of Concerns**: UI, logic, and data are separate
2. **Reusability**: Components are generic and reusable
3. **Type Safety**: Everything is typed with TypeScript
4. **Modularity**: Features are self-contained
5. **Testability**: Pure functions and isolated components

## Next Steps

Refer to `IMPLEMENTATION_ROADMAP.md` for detailed implementation steps for each TODO file.

---

**Total Files**: ~80 files
**Completed**: ~30 files (37%)
**Remaining**: ~50 files (63%)

Focus on Phase 1 (Critical) files first to get a working MVP!
