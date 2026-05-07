# System Architecture Diagrams

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Webcam     │  │  Microphone  │  │ Web Speech   │          │
│  │   Stream     │  │    Input     │  │     API      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                  │
│                            │                                      │
│  ┌─────────────────────────▼──────────────────────────┐         │
│  │         Next.js 15 React Application                │         │
│  │  ┌──────────────────────────────────────────────┐  │         │
│  │  │  Pages (App Router)                          │  │         │
│  │  │  - Landing, Auth, Dashboard, Interview      │  │         │
│  │  └──────────────────────────────────────────────┘  │         │
│  │  ┌──────────────────────────────────────────────┐  │         │
│  │  │  Components                                   │  │         │
│  │  │  - UI, Layout, Interview, Analysis           │  │         │
│  │  └──────────────────────────────────────────────┘  │         │
│  │  ┌──────────────────────────────────────────────┐  │         │
│  │  │  Hooks & State Management                    │  │         │
│  │  │  - useInterview, useSpeechRecognition        │  │         │
│  │  └──────────────────────────────────────────────┘  │         │
│  └─────────────────────────┬──────────────────────────┘         │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                    HTTPS/REST API
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           Next.js API Routes (Serverless)               │    │
│  │                                                           │    │
│  │  /api/auth/*          - Authentication                   │    │
│  │  /api/interviews/*    - Interview CRUD                   │    │
│  │  /api/analysis/*      - Analysis Processing              │    │
│  │  /api/reports/*       - Report Generation                │    │
│  │                                                           │    │
│  └───────────────────────┬─────────────────────────────────┘    │
│                          │                                        │
└──────────────────────────┼────────────────────────────────────────┘
                           │
                  PostgreSQL Protocol
                           │
┌──────────────────────────▼────────────────────────────────────────┐
│                      SUPABASE                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              PostgreSQL Database                         │    │
│  │                                                           │    │
│  │  Tables:                                                  │    │
│  │  - profiles                                               │    │
│  │  - interviews                                             │    │
│  │  - interview_transcripts                                  │    │
│  │  - interview_analysis                                     │    │
│  │  - filler_words                                           │    │
│  │                                                           │    │
│  │  Security: Row Level Security (RLS)                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Authentication Service                       │    │
│  │  - JWT Token Management                                   │    │
│  │  - Email/Password Auth                                    │    │
│  │  - OAuth Providers (Optional)                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Storage (Optional)                           │    │
│  │  - Video Recordings                                       │    │
│  │  - User Avatars                                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Interview Session Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTERVIEW SESSION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. USER STARTS INTERVIEW
   │
   ├─► Request Camera/Mic Permissions
   │   └─► getUserMedia() API
   │
   ├─► Initialize Speech Recognition
   │   └─► Web Speech API
   │
   └─► Update Interview Status
       └─► POST /api/interviews/{id}/start

2. RECORDING IN PROGRESS
   │
   ├─► Video Stream Display
   │   └─► <video> element with srcObject
   │
   ├─► Audio Capture
   │   └─► MediaStream audio track
   │
   ├─► Real-time Transcription
   │   ├─► Speech Recognition onresult
   │   ├─► Accumulate transcript
   │   └─► POST /api/analysis/transcript (chunks)
   │
   └─► Live Analysis (Optional)
       ├─► Count filler words
       ├─► Calculate WPM
       └─► Display metrics

3. USER STOPS INTERVIEW
   │
   ├─► Stop Recognition
   │   └─► recognition.stop()
   │
   ├─► Stop Media Streams
   │   └─► stream.getTracks().forEach(track => track.stop())
   │
   ├─► Update Interview
   │   └─► PATCH /api/interviews/{id}
   │       └─► status: 'completed'
   │       └─► duration_seconds
   │
   └─► Trigger Analysis
       └─► POST /api/analysis/process
           └─► Process all transcripts
           └─► Calculate metrics
           └─► Save to database

4. REDIRECT TO REPORT
   │
   └─► Navigate to /reports/{id}
       └─► Display full analysis
       └─► Show charts
       └─► Provide recommendations
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                │
└─────────────────────────────────────────────────────────────────┘

USER SPEECH
    │
    ▼
┌─────────────────┐
│  Web Speech API │
│  (Browser)      │
└────────┬────────┘
         │ Real-time transcription
         ▼
┌─────────────────┐
│  Transcript     │
│  Chunks         │
└────────┬────────┘
         │ Save to DB
         ▼
┌─────────────────────────────────────┐
│  interview_transcripts table        │
│  - id                                │
│  - interview_id                      │
│  - text                              │
│  - timestamp_ms                      │
└────────┬────────────────────────────┘
         │ On interview complete
         ▼
┌─────────────────────────────────────┐
│  Analysis Processor                 │
│  (lib/analysis/processor.ts)        │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 1. Combine all transcripts     │ │
│  │ 2. Detect filler words         │ │
│  │ 3. Calculate speaking pace     │ │
│  │ 4. Analyze pauses              │ │
│  │ 5. Calculate confidence        │ │
│  │ 6. Calculate nervousness       │ │
│  │ 7. Calculate engagement        │ │
│  └────────────────────────────────┘ │
└────────┬────────────────────────────┘
         │ Save results
         ▼
┌─────────────────────────────────────┐
│  interview_analysis table           │
│  - confidence_score                 │
│  - speaking_pace_wpm                │
│  - filler_word_count                │
│  - nervousness_score                │
│  - emotional_engagement_score       │
│  - analysis_data (JSONB)            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  filler_words table                 │
│  - word                              │
│  - count                             │
│  - timestamps                        │
└────────┬────────────────────────────┘
         │ Display to user
         ▼
┌─────────────────────────────────────┐
│  Report Page                        │
│  - Metrics overview                 │
│  - Charts and visualizations        │
│  - Recommendations                  │
└─────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

SIGNUP
  │
  ├─► User enters email/password
  │   └─► /signup page
  │
  ├─► Submit to Supabase
  │   └─► supabase.auth.signUp()
  │
  ├─► Supabase creates user
  │   ├─► auth.users table
  │   └─► Trigger: create profile
  │       └─► profiles table
  │
  ├─► Send confirmation email
  │   └─► User clicks link
  │
  └─► User confirmed
      └─► Can now log in

LOGIN
  │
  ├─► User enters credentials
  │   └─► /login page
  │
  ├─► Submit to Supabase
  │   └─► supabase.auth.signInWithPassword()
  │
  ├─► Supabase validates
  │   └─► Returns JWT token
  │
  ├─► Token stored in cookie
  │   └─► Secure, HttpOnly
  │
  └─► Redirect to dashboard
      └─► /dashboard

PROTECTED ROUTE ACCESS
  │
  ├─► User navigates to /dashboard
  │
  ├─► Middleware intercepts
  │   └─► middleware.ts
  │
  ├─► Check for valid session
  │   └─► supabase.auth.getUser()
  │
  ├─► If valid: Allow access
  │   └─► Render page
  │
  └─► If invalid: Redirect
      └─► /login?redirect=/dashboard

API REQUEST
  │
  ├─► Client makes request
  │   └─► fetch('/api/interviews')
  │
  ├─► API route checks auth
  │   └─► supabase.auth.getUser()
  │
  ├─► If authenticated
  │   ├─► Process request
  │   └─► Return data
  │
  └─► If not authenticated
      └─► Return 401 Unauthorized

LOGOUT
  │
  ├─► User clicks logout
  │
  ├─► Call Supabase
  │   └─► supabase.auth.signOut()
  │
  ├─► Clear session
  │   └─► Remove cookies
  │
  └─► Redirect to login
      └─► /login
```

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT HIERARCHY                           │
└─────────────────────────────────────────────────────────────────┘

RootLayout
│
├─► Landing Page (/)
│   ├─► Hero Section
│   ├─► Features Section
│   ├─► How It Works
│   └─► CTA Section
│
├─► Auth Pages
│   ├─► Login (/login)
│   │   ├─► Input (email)
│   │   ├─► Input (password)
│   │   └─► Button (submit)
│   │
│   └─► Signup (/signup)
│       ├─► Input (name)
│       ├─► Input (email)
│       ├─► Input (password)
│       └─► Button (submit)
│
└─► Dashboard Layout (/dashboard/*)
    ├─► Sidebar
    │   └─► Navigation Links
    │
    ├─► Header
    │   └─► User Menu
    │
    └─► Main Content
        │
        ├─► Dashboard (/dashboard)
        │   ├─► StatCard (x3)
        │   └─► InterviewCard (list)
        │
        ├─► Interview Session (/interview/[id])
        │   ├─► WebcamCapture
        │   │   └─► <video> element
        │   │
        │   ├─► AudioRecorder
        │   │   └─► Audio level indicator
        │   │
        │   ├─► SpeechRecognition
        │   │   └─► Transcript accumulator
        │   │
        │   ├─► TranscriptDisplay
        │   │   └─► Live text display
        │   │
        │   ├─► LiveAnalysis
        │   │   ├─► Filler word counter
        │   │   ├─► WPM display
        │   │   └─► Timer
        │   │
        │   └─► InterviewControls
        │       ├─► Start button
        │       ├─► Pause button
        │       └─► Stop button
        │
        ├─► Report (/reports/[id])
        │   ├─► MetricsOverview
        │   │   ├─► ScoreCard (confidence)
        │   │   ├─► ScoreCard (pace)
        │   │   ├─► ScoreCard (nervousness)
        │   │   └─► ScoreCard (engagement)
        │   │
        │   ├─► ConfidenceChart
        │   │   └─► Radar chart (Recharts)
        │   │
        │   ├─► SpeakingPaceChart
        │   │   └─► Line chart (Recharts)
        │   │
        │   ├─► FillerWordsBreakdown
        │   │   └─► Bar chart (Recharts)
        │   │
        │   └─► RecommendationsList
        │       └─► Improvement tips
        │
        └─► History (/history)
            ├─► InterviewFilters
            │   ├─► Status filter
            │   ├─► Date range
            │   └─► Sort options
            │
            └─► InterviewCard (list)
                └─► Click → Report
```

## Database Schema Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE RELATIONSHIPS                        │
└─────────────────────────────────────────────────────────────────┘

auth.users (Supabase managed)
    │
    │ 1:1
    ▼
profiles
    │ id (PK, FK to auth.users)
    │ full_name
    │ avatar_url
    │
    │ 1:N
    ▼
interviews
    │ id (PK)
    │ user_id (FK to profiles)
    │ title
    │ status
    │ started_at
    │ completed_at
    │ duration_seconds
    │
    ├─────────────┬─────────────┬─────────────┐
    │ 1:N         │ 1:1         │ 1:N         │
    ▼             ▼             ▼             
interview_    interview_    filler_words
transcripts   analysis      
│ id (PK)      │ id (PK)      │ id (PK)
│ interview_id │ interview_id │ interview_id
│ text         │ confidence   │ word
│ timestamp_ms │ pace_wpm     │ count
               │ filler_count │ timestamps
               │ nervousness  │
               │ engagement   │
               │ analysis_data│
```

## Analysis Algorithm Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANALYSIS ALGORITHM FLOW                       │
└─────────────────────────────────────────────────────────────────┘

Input: Array of Transcripts + Duration
    │
    ▼
┌─────────────────────────────────────┐
│  1. Text Processing                 │
│  - Combine all transcripts          │
│  - Count total words                │
│  - Count unique words               │
│  - Calculate vocabulary ratio       │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  2. Filler Word Detection           │
│  - Match against filler word list   │
│  - Count occurrences                │
│  - Calculate percentage             │
│  - Track positions                  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  3. Speaking Pace Analysis          │
│  - Calculate overall WPM            │
│  - Segment into time windows        │
│  - Calculate WPM per segment        │
│  - Calculate variance               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  4. Pause Analysis                  │
│  - Detect gaps in transcripts       │
│  - Calculate pause durations        │
│  - Find average pause               │
│  - Find longest pause               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  5. Confidence Calculation          │
│  Factors:                            │
│  - Pace consistency (30%)           │
│  - Filler word frequency (25%)      │
│  - Pause patterns (20%)             │
│  - Vocabulary richness (15%)        │
│  - Response length (10%)            │
│  → Weighted average → Score 0-100   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  6. Nervousness Calculation         │
│  Factors:                            │
│  - Filler word impact (40%)         │
│  - Pause frequency (30%)            │
│  - Pace variance (20%)              │
│  - Repetition rate (10%)            │
│  → Weighted average → Score 0-100   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  7. Engagement Calculation          │
│  Factors:                            │
│  - Vocabulary richness (30%)        │
│  - Sentence complexity (25%)        │
│  - Positive sentiment (25%)         │
│  - Energy level (20%)               │
│  → Weighted average → Score 0-100   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  8. Generate Analysis Object        │
│  - All scores                        │
│  - Detailed breakdown               │
│  - Factor contributions             │
│  - Recommendations                  │
└────────┬────────────────────────────┘
         │
         ▼
    Save to Database
```

---

These diagrams provide a visual understanding of how the system works. Refer to them when implementing features or debugging issues.
