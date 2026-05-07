# 🚀 Complete Setup Guide - Step by Step

## For Complete Beginners - Follow Every Step!

This guide will walk you through setting up the AI Interview Emotion Analyzer from scratch.

---

## PHASE 1: Install Required Software

### Step 1.1: Install Node.js

1. Go to https://nodejs.org/
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. Click "Next" through all steps
5. Verify installation:
   ```cmd
   node --version
   npm --version
   ```
   You should see version numbers like `v18.17.0` and `9.6.7`

### Step 1.2: Install Git (Optional but Recommended)

1. Go to https://git-scm.com/
2. Download for Windows
3. Run installer with default settings
4. Verify:
   ```cmd
   git --version
   ```

### Step 1.3: Install VS Code (Recommended Editor)

1. Go to https://code.visualstudio.com/
2. Download and install
3. Open VS Code
4. Install recommended extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

---

## PHASE 2: Set Up Supabase (Your Database)

### Step 2.1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Verify your email

### Step 2.2: Create New Project

1. Click "New Project"
2. Fill in details:
   - **Name**: `ai-interview-analyzer`
   - **Database Password**: Click "Generate a password" and **SAVE IT**
   - **Region**: Choose closest to you (e.g., "US East")
   - **Pricing Plan**: Free
3. Click "Create new project"
4. Wait 2-3 minutes for setup

### Step 2.3: Set Up Database Schema

1. In your Supabase dashboard, click "SQL Editor" (left sidebar)
2. Click "New Query"
3. Open the file `supabase/schema.sql` from your project
4. Copy ALL the content
5. Paste into Supabase SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

### Step 2.4: Set Up Security Policies

1. Click "New Query" again
2. Open `supabase/policies.sql`
3. Copy ALL the content
4. Paste and click "Run"
5. Success!

### Step 2.5: Get Your API Keys

1. Click "Settings" (gear icon, bottom left)
2. Click "API"
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`
   - **service_role key**: Another long string (keep secret!)
4. **COPY THESE** - you'll need them next!

---

## PHASE 3: Set Up Your Project

### Step 3.1: Open Project in VS Code

1. Open VS Code
2. Click "File" > "Open Folder"
3. Navigate to `C:\Users\monig\OneDrive\Desktop\ETHARA_APP`
4. Click "Select Folder"

### Step 3.2: Install Dependencies

1. Open Terminal in VS Code:
   - Click "Terminal" > "New Terminal"
   - Or press `` Ctrl+` ``
2. Run:
   ```cmd
   npm install
   ```
3. Wait 2-5 minutes for installation
4. You should see "added XXX packages"

### Step 3.3: Create Environment File

1. In VS Code, create a new file: `.env.local`
2. Copy this template:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
3. Replace the values:
   - `your_project_url_here` → Your Supabase Project URL
   - `your_anon_key_here` → Your anon public key
   - `your_service_role_key_here` → Your service_role key
4. Save the file (Ctrl+S)

**IMPORTANT**: Never share your `.env.local` file or commit it to Git!

---

## PHASE 4: Run the Application

### Step 4.1: Start Development Server

1. In VS Code terminal, run:
   ```cmd
   npm run dev
   ```
2. Wait for "Ready in X seconds"
3. You should see:
   ```
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000
   ```

### Step 4.2: Open in Browser

1. Open Chrome or Edge (recommended)
2. Go to: http://localhost:3000
3. You should see the landing page!

---

## PHASE 5: Test the Application

### Step 5.1: Create an Account

1. Click "Get Started" or "Sign Up"
2. Fill in:
   - Full Name: Your name
   - Email: Your email
   - Password: At least 6 characters
   - Confirm Password: Same password
3. Check "I agree to Terms"
4. Click "Create Account"
5. Check your email for confirmation
6. Click the confirmation link
7. You'll be redirected to login

### Step 5.2: Log In

1. Enter your email and password
2. Click "Log In"
3. You should see the Dashboard!

### Step 5.3: Create Your First Interview

1. Click "Start New Interview" button
2. Enter a title: "My First Practice Interview"
3. Click "Create Interview"
4. You'll see the interview session page

### Step 5.4: Test Interview Recording

1. **Allow camera and microphone** when prompted
2. You should see your video feed
3. Click "Start Interview"
4. Speak for 30-60 seconds
5. Say something like:
   ```
   "Hello, my name is [Your Name]. I'm practicing for an interview.
   I want to improve my communication skills and reduce filler words
   like um and uh. This is a great tool for practice."
   ```
6. Watch the transcript appear in real-time
7. Click "Stop & Analyze"
8. Wait for processing (10-20 seconds)
9. You'll see your analysis report!

---

## PHASE 6: Understanding Your Results

### What You'll See:

1. **Confidence Score** (0-100)
   - How confident you sounded
   - Based on pace, pauses, filler words

2. **Speaking Pace** (WPM)
   - Words per minute
   - Ideal: 120-150 WPM

3. **Calmness Score** (0-100)
   - How calm you appeared
   - Lower nervousness = higher calmness

4. **Engagement Score** (0-100)
   - How engaging your speech was
   - Based on vocabulary and energy

5. **Charts**
   - Speaking pace over time
   - Filler words breakdown

6. **Recommendations**
   - Personalized tips to improve

---

## PHASE 7: Troubleshooting Common Issues

### Issue: "npm install" fails

**Solution**:
```cmd
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: "Module not found" errors

**Solution**:
```cmd
# Delete node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Issue: Can't connect to Supabase

**Solution**:
1. Check `.env.local` file exists
2. Verify all three keys are correct
3. No extra spaces in keys
4. Restart dev server:
   ```cmd
   # Press Ctrl+C to stop
   npm run dev
   ```

### Issue: Camera/Microphone not working

**Solution**:
1. Use Chrome or Edge browser
2. Check browser permissions:
   - Click lock icon in address bar
   - Allow camera and microphone
3. Check Windows permissions:
   - Settings > Privacy > Camera
   - Settings > Privacy > Microphone
   - Allow for browsers

### Issue: Speech recognition not working

**Solution**:
1. **Must use Chrome or Edge** (Firefox/Safari not supported)
2. Check microphone is working
3. Speak clearly and loudly
4. Check browser console for errors (F12)

### Issue: Port 3000 already in use

**Solution**:
```cmd
# Use different port
set PORT=3001
npm run dev
```

---

## PHASE 8: Next Steps

### Explore Features:

1. **Dashboard**
   - View statistics
   - See recent interviews
   - Quick access to features

2. **History**
   - View all past interviews
   - Filter by status
   - Delete old interviews

3. **Reports**
   - Detailed analysis
   - Charts and graphs
   - Recommendations

### Practice Regularly:

1. Do 2-3 practice interviews per week
2. Track your progress over time
3. Focus on recommendations
4. Try different interview types

---

## PHASE 9: Deployment (Optional)

When you're ready to deploy online:

1. Follow `DEPLOYMENT_GUIDE.md`
2. Deploy to Vercel (free)
3. Share with friends!

---

## 📞 Getting Help

### If You're Stuck:

1. **Check the error message** - Read it carefully
2. **Check the console** - Press F12 in browser
3. **Check Supabase logs** - In Supabase dashboard
4. **Review documentation**:
   - README.md
   - GETTING_STARTED.md
   - TROUBLESHOOTING section above

### Common Questions:

**Q: Do I need to pay for anything?**
A: No! Everything is free:
- Supabase free tier
- Vercel free tier (for deployment)
- All code is open source

**Q: Can I use this for real interviews?**
A: This is for PRACTICE only. Use it to prepare for real interviews.

**Q: How is my data stored?**
A: Securely in Supabase (PostgreSQL database). Only you can access your data.

**Q: Can others see my interviews?**
A: No! Your data is private. Row Level Security ensures isolation.

**Q: What browsers work best?**
A: Chrome or Edge for full features (speech recognition).

---

## ✅ Success Checklist

You're all set up when you can:

- [ ] Open http://localhost:3000
- [ ] Sign up and log in
- [ ] See the dashboard
- [ ] Create a new interview
- [ ] See your camera feed
- [ ] Record and transcribe speech
- [ ] View analysis report
- [ ] See interview history

---

## 🎉 Congratulations!

You've successfully set up the AI Interview Emotion Analyzer!

**Next Steps**:
1. Practice regularly
2. Track your improvement
3. Share with friends
4. Consider deploying online

**Happy practicing!** 🚀

---

## 📚 Additional Resources

- **README.md** - Project overview
- **PROJECT_ARCHITECTURE.md** - How it works
- **IMPLEMENTATION_ROADMAP.md** - Development guide
- **DEPLOYMENT_GUIDE.md** - Deploy to production
- **TESTING_CHECKLIST.md** - Test before deploying

---

**Need more help?** Create an issue on GitHub or check the documentation files!
