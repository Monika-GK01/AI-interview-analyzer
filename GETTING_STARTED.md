# Getting Started - AI Interview Emotion Analyzer

Welcome! This guide will help you get the application running locally in under 10 minutes.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** installed
- A **Supabase account** (free tier) - [Sign up](https://supabase.com)
- A code editor (VS Code recommended)

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, Tailwind CSS, Supabase, and analysis libraries.

### Step 2: Set Up Supabase

#### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: `ai-interview-analyzer`
   - **Database Password**: Generate and save securely
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait ~2 minutes for provisioning

#### 2.2 Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open `supabase/schema.sql` from this project
4. Copy all contents and paste into SQL editor
5. Click "Run" (or Ctrl+Enter)
6. You should see "Success. No rows returned"

#### 2.3 Set Up Security Policies

1. Create another new query in SQL Editor
2. Open `supabase/policies.sql`
3. Copy all contents and paste
4. Click "Run"
5. Verify success

#### 2.4 Get Your API Keys

1. Go to **Settings** > **API** in Supabase
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep secret!)

### Step 3: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values
```

Open `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run Development Server

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

### Step 5: Test the Application

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Get Started" or "Sign Up"
3. Create an account with your email
4. Check your email for confirmation (check spam folder)
5. Log in and explore the dashboard!

## 🎯 What You Can Do Now

### Current Features (Working)

✅ **Landing Page**
- Beautiful hero section
- Feature showcase
- Call-to-action sections

✅ **Authentication**
- Sign up with email
- Email confirmation
- Login/logout
- Protected routes

✅ **Dashboard**
- Overview statistics
- Recent interviews list
- Quick actions

✅ **Analysis Engine**
- Filler word detection
- Speaking pace calculation
- Confidence scoring
- Nervousness detection
- Emotional engagement analysis

✅ **API Routes**
- Interview CRUD operations
- Analysis processing
- User authentication

### Features To Implement

🚧 **Interview Session** (Priority: HIGH)
- Webcam capture
- Audio recording
- Real-time speech-to-text
- Live analysis display

🚧 **Reports** (Priority: HIGH)
- Detailed analysis reports
- Interactive charts
- Recommendations

🚧 **History** (Priority: MEDIUM)
- List all interviews
- Search and filter
- Delete interviews

See `IMPLEMENTATION_ROADMAP.md` for complete list and implementation guide.

## 📁 Project Structure

```
ai-interview-analyzer/
├── app/                    # Next.js pages and API routes
├── components/             # React components
├── lib/                    # Utilities and services
├── types/                  # TypeScript types
├── supabase/              # Database schema
└── public/                # Static assets
```

See `FOLDER_STRUCTURE.md` for detailed structure.

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## 🧪 Testing the Analysis Engine

You can test the analysis algorithms without the full UI:

```typescript
// In a test file or Node.js script
import { detectFillerWords } from './lib/analysis/filler-words'
import { calculateSpeakingPace } from './lib/analysis/speaking-pace'

const text = "Um, so like, I think that, you know, this is actually a good idea"
const fillers = detectFillerWords(text)
console.log(fillers) // Shows detected filler words

const pace = calculateSpeakingPace(100, 60) // 100 words in 60 seconds
console.log(pace) // Shows 100 WPM
```

## 🐛 Troubleshooting

### Issue: "Module not found"

**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Supabase connection failed"

**Solution**:
- Verify `.env.local` has correct values
- Check Supabase project is active
- Ensure no typos in environment variables
- Restart dev server after changing `.env.local`

### Issue: "Authentication not working"

**Solution**:
- Check email confirmation (spam folder)
- Verify Supabase Auth is enabled
- Check browser console for errors
- Ensure RLS policies are set up

### Issue: "Database queries failing"

**Solution**:
- Verify schema.sql was run successfully
- Check policies.sql was run
- Look at Supabase logs (Dashboard > Logs)
- Ensure user is authenticated

### Issue: "TypeScript errors"

**Solution**:
```bash
npm run type-check
```
Fix any type errors shown.

### Issue: "Port 3000 already in use"

**Solution**:
```bash
# Use a different port
PORT=3001 npm run dev
```

## 📚 Key Documentation Files

- **README.md** - Project overview and features
- **PROJECT_ARCHITECTURE.md** - System architecture and design decisions
- **IMPLEMENTATION_ROADMAP.md** - Step-by-step implementation guide
- **DEPLOYMENT_GUIDE.md** - How to deploy to production
- **FOLDER_STRUCTURE.md** - Complete file structure
- **GETTING_STARTED.md** - This file

## 🎓 Learning Resources

### Next.js 15
- [Official Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### Supabase
- [Official Docs](https://supabase.com/docs)
- [Auth Guide](https://supabase.com/docs/guides/auth)
- [Database Guide](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### TypeScript
- [Official Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Tailwind CSS
- [Official Docs](https://tailwindcss.com/docs)
- [Utility Classes](https://tailwindcss.com/docs/utility-first)

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Keep service role key secret** - Never expose in client code
3. **Use RLS policies** - Already set up in `policies.sql`
4. **Validate user input** - Add validation to forms
5. **Use HTTPS in production** - Automatic with Vercel

## 🚢 Ready to Deploy?

Once you've tested locally and everything works:

1. Push code to GitHub
2. Follow `DEPLOYMENT_GUIDE.md`
3. Deploy to Vercel (free tier)
4. Configure production environment variables
5. Test production deployment

## 💡 Development Tips

### Hot Reload
- Changes to files automatically reload the browser
- API route changes require manual refresh
- Environment variable changes require server restart

### Database Changes
- Always update `schema.sql` with new tables
- Add RLS policies in `policies.sql`
- Test policies thoroughly

### Component Development
- Build components in isolation first
- Use TypeScript for type safety
- Keep components small and focused
- Reuse UI components from `components/ui/`

### Debugging
- Use browser DevTools (F12)
- Check Network tab for API calls
- Use React DevTools extension
- Check Supabase logs for database issues

## 🤝 Contributing

Want to contribute? Great!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Getting Help

- **Documentation**: Check the docs folder
- **Issues**: Create a GitHub issue
- **Supabase**: Check their Discord or docs
- **Next.js**: Check their GitHub discussions

## ✅ Checklist for First Run

- [ ] Node.js 18+ installed
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] RLS policies set up
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Dev server running
- [ ] Can access localhost:3000
- [ ] Can sign up and log in
- [ ] Dashboard loads correctly

## 🎉 Next Steps

Once you have the app running:

1. **Explore the code** - Understand the structure
2. **Read the architecture doc** - Understand design decisions
3. **Follow the roadmap** - Implement remaining features
4. **Test thoroughly** - Ensure everything works
5. **Deploy** - Share with the world!

---

**Need help?** Check the troubleshooting section or create an issue on GitHub.

**Ready to build?** Head to `IMPLEMENTATION_ROADMAP.md` for the next steps!

Happy coding! 🚀
