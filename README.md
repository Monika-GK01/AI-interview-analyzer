# AI Interview Emotion Analyzer

A production-ready full-stack web application that simulates mock interviews and analyzes user communication behavior including confidence, speaking pace, filler words, hesitation, and emotional engagement.

## Features

- 🎤 **Real-time Speech Analysis** - Live transcription and analysis during interviews
- 📊 **Comprehensive Metrics** - Confidence score, speaking pace, filler words, nervousness, emotional engagement
- 📈 **Visual Analytics** - Interactive charts and dashboards
- 🎥 **Webcam Integration** - Record video during interviews
- 📝 **Detailed Reports** - Post-interview analysis with actionable insights
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔐 **Secure Authentication** - Powered by Supabase Auth
- 📚 **Interview History** - Track progress over time

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Analysis**: Web Speech API, Custom algorithms

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-interview-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials.

4. Set up the database:
   - Go to your Supabase project
   - Run the SQL from `supabase/schema.sql` in the SQL editor
   - Enable Row Level Security policies from `supabase/policies.sql`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ai-interview-analyzer/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── analysis/            # Analysis-related components
│   ├── interview/           # Interview session components
│   ├── layout/              # Layout components
│   └── ui/                  # Reusable UI components
├── lib/                     # Utility functions and services
│   ├── analysis/            # Analysis algorithms
│   ├── supabase/            # Supabase client and helpers
│   └── utils/               # General utilities
├── types/                   # TypeScript type definitions
├── supabase/                # Database schema and migrations
└── public/                  # Static assets
```

## Database Schema

See `supabase/schema.sql` for the complete database schema including:
- User profiles
- Interviews
- Transcripts
- Analysis results
- Filler words tracking

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/interviews/*` - Interview CRUD operations
- `/api/analysis/*` - Analysis processing
- `/api/reports/*` - Report generation

## Analysis Metrics

### Confidence Score (0-100)
Calculated based on:
- Speaking pace consistency (30%)
- Filler word frequency (25%)
- Pause patterns (20%)
- Word variety (15%)
- Response length (10%)

### Speaking Pace
- Measured in words per minute (WPM)
- Ideal range: 120-150 WPM

### Filler Words
- Detects: um, uh, like, you know, actually, basically, literally
- Tracks count and percentage

### Nervousness Score (0-100)
Based on:
- Filler word frequency (40%)
- Pause frequency and duration (30%)
- Speaking pace variance (20%)
- Repetition patterns (10%)

### Emotional Engagement (0-100)
Factors:
- Vocabulary richness (30%)
- Sentence complexity (25%)
- Positive sentiment (25%)
- Energy level (20%)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

The app will be automatically deployed on every push to the main branch.

### Environment Variables for Production

Set these in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

## Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication
- Environment variables for sensitive data
- Input validation and sanitization
- HTTPS only in production

## Performance

- Server-side rendering for fast initial load
- Code splitting by route
- Image optimization
- Database indexing
- CDN delivery via Vercel Edge Network

## Browser Support

- Chrome/Edge (recommended for Web Speech API)
- Firefox
- Safari
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

## Roadmap

- [ ] AI-powered interview question generation
- [ ] Video emotion detection (facial analysis)
- [ ] Multi-language support
- [ ] Team/organization features
- [ ] Interview coaching recommendations
- [ ] Integration with job platforms
- [ ] Mobile app (React Native)

---

Built with ❤️ using Next.js and Supabase
