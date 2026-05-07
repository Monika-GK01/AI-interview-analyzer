# 🚀 Vercel Deployment - Step by Step

## ✅ Pre-Deployment Checklist

- [x] Code pushed to GitHub ✓
- [x] Git repository: https://github.com/Monika-GK01/AI-interview-analyzer
- [x] vercel.json configuration created ✓
- [x] .gitignore properly configured ✓
- [ ] Supabase project ready
- [ ] Supabase schema deployed
- [ ] Environment variables ready

---

## 📋 Step-by-Step Deployment

### Step 1: Prepare Supabase (If Not Done)

#### 1.1 Create/Access Supabase Project
1. Go to: https://supabase.com
2. Sign in or create account
3. Click "New Project" or select existing project
4. Note down:
   - Project URL: `https://xxxxx.supabase.co`
   - Project ID: `xxxxx`

#### 1.2 Deploy Database Schema
1. In Supabase Dashboard → **SQL Editor**
2. Click "New Query"
3. Open file: `supabase/schema.sql`
4. Copy entire content
5. Paste in SQL Editor
6. Click **Run** (or Ctrl+Enter)
7. Wait for "Success. No rows returned"

#### 1.3 Deploy Security Policies
1. In SQL Editor, click "New Query"
2. Open file: `supabase/policies.sql`
3. Copy entire content
4. Paste in SQL Editor
5. Click **Run**
6. Verify success

#### 1.4 Get API Keys
1. Go to: **Settings** → **API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (KEEP SECRET!)
   ```

---

### Step 2: Deploy to Vercel

#### 2.1 Access Vercel
1. Go to: https://vercel.com
2. Sign in with GitHub (recommended)
3. Click "Add New..." → "Project"

#### 2.2 Import Repository
1. Find: `Monika-GK01/AI-interview-analyzer`
2. Click "Import"
3. Vercel will auto-detect Next.js ✓

#### 2.3 Configure Project
**Framework Preset**: Next.js (auto-detected)
**Root Directory**: `./` (leave as is)
**Build Command**: `npm run build` (auto-filled)
**Output Directory**: `.next` (auto-filled)

#### 2.4 Add Environment Variables

Click "Environment Variables" and add these:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |

**Example**:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAwMDAwMDAsImV4cCI6MTk5NTU3NjAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 2.5 Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Watch the build logs
4. Success! 🎉

#### 2.6 Get Your Vercel URL
After deployment completes:
- Production URL: `https://your-project-name.vercel.app`
- Copy this URL for next step

---

### Step 3: Configure Supabase for Production

#### 3.1 Add Vercel URL to Supabase
1. Go back to Supabase Dashboard
2. Navigate to: **Authentication** → **URL Configuration**
3. Update these fields:

**Site URL**:
```
https://your-project-name.vercel.app
```

**Redirect URLs** (add these):
```
https://your-project-name.vercel.app/**
https://your-project-name.vercel.app/auth/callback
http://localhost:3000/**
```

4. Click **Save**

#### 3.2 Configure Email Templates (Optional)
1. Go to: **Authentication** → **Email Templates**
2. Customize:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

---

### Step 4: Create Admin User

#### 4.1 Sign Up on Your App
1. Visit: `https://your-project-name.vercel.app`
2. Click "Sign Up"
3. Enter your email and password
4. Check email for confirmation link
5. Confirm your email

#### 4.2 Make Yourself Admin
1. Go to Supabase Dashboard
2. Navigate to: **SQL Editor**
3. Run this query (replace with YOUR email):

```sql
UPDATE profiles 
SET is_admin = true 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

4. Verify:
```sql
SELECT id, full_name, is_admin 
FROM profiles 
WHERE is_admin = true;
```

---

### Step 5: Test Your Deployment

#### 5.1 Test Regular User Flow
- [ ] Visit homepage: `https://your-project-name.vercel.app`
- [ ] Sign up with test email
- [ ] Confirm email
- [ ] Log in
- [ ] Access dashboard: `/dashboard`
- [ ] Create new interview: `/interview/new`
- [ ] View history: `/history`
- [ ] Access settings: `/settings`
- [ ] Update profile
- [ ] Change password

#### 5.2 Test Admin Flow
- [ ] Log out
- [ ] Visit admin login: `/admin-login`
- [ ] Log in with admin credentials
- [ ] Access admin dashboard: `/admin`
- [ ] View all users
- [ ] View user interview data
- [ ] Check statistics

#### 5.3 Test Interview Features
- [ ] Start new interview
- [ ] Enable webcam
- [ ] Enable microphone
- [ ] Record audio
- [ ] Speech-to-text transcription
- [ ] Complete interview
- [ ] View analysis report
- [ ] Export PDF
- [ ] Check all metrics display

---

## 🔍 Verification & Monitoring

### Check Vercel Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click "Logs" tab
4. Monitor for errors

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Click "Logs" → "API"
3. Check for failed requests
4. Monitor authentication logs

### Browser Console
1. Open your deployed app
2. Press F12 (DevTools)
3. Check Console tab for errors
4. Check Network tab for failed requests

---

## 🎯 Post-Deployment Tasks

### Immediate (Next 1 hour)
- [ ] Test all features thoroughly
- [ ] Create 2-3 test interviews
- [ ] Verify PDF export works
- [ ] Check admin dashboard data
- [ ] Monitor error logs

### Within 24 Hours
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Share with beta testers
- [ ] Collect initial feedback
- [ ] Monitor performance metrics

### Within 1 Week
- [ ] Set up custom domain (optional)
- [ ] Configure email templates
- [ ] Add analytics tracking
- [ ] Create user documentation
- [ ] Plan feature updates

---

## 🆘 Troubleshooting

### Build Failed on Vercel?

**Check build logs**:
```bash
# Test locally first
npm install
npm run build
npm run type-check
```

**Common issues**:
- TypeScript errors → Fix in code
- Missing dependencies → Check package.json
- Environment variables → Verify in Vercel settings

### Authentication Not Working?

**Checklist**:
- [ ] Supabase redirect URLs include Vercel domain
- [ ] Environment variables are correct
- [ ] Email provider enabled in Supabase
- [ ] Check browser console for CORS errors

**Fix**:
1. Verify Supabase URL Configuration
2. Redeploy from Vercel
3. Clear browser cache
4. Try incognito mode

### Database Queries Failing?

**Checklist**:
- [ ] Schema deployed successfully
- [ ] Policies deployed successfully
- [ ] RLS enabled on tables
- [ ] User authenticated before queries

**Debug**:
1. Check Supabase logs
2. Test queries in SQL Editor
3. Verify RLS policies
4. Check user permissions

### Admin Panel Not Accessible?

**Checklist**:
- [ ] User has `is_admin = true` in database
- [ ] Logged in with correct credentials
- [ ] Accessing `/admin-login` (not `/login`)
- [ ] Middleware protecting `/admin` route

**Fix**:
```sql
-- Verify admin status
SELECT id, email, is_admin 
FROM profiles 
JOIN auth.users ON profiles.id = auth.users.id
WHERE is_admin = true;

-- Make user admin
UPDATE profiles SET is_admin = true WHERE id = 'user-id-here';
```

---

## 📊 Success Metrics

After deployment, monitor:

| Metric | Target | Check |
|--------|--------|-------|
| Page Load Time | < 3s | Vercel Analytics |
| Build Time | < 3min | Vercel Dashboard |
| Error Rate | < 1% | Vercel Logs |
| Auth Success | > 95% | Supabase Logs |
| User Signups | Track | Supabase Dashboard |

---

## 🎉 Deployment Complete!

Your AI Interview Analyzer is now live at:

**Production URL**: `https://your-project-name.vercel.app`

**Key URLs**:
- Homepage: `/`
- Sign Up: `/signup`
- Login: `/login`
- Admin Login: `/admin-login`
- Dashboard: `/dashboard`
- New Interview: `/interview/new`
- History: `/history`
- Settings: `/settings`
- Admin Panel: `/admin`

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Repo**: https://github.com/Monika-GK01/AI-interview-analyzer

---

## 🚀 Next Steps

1. **Share with users** and collect feedback
2. **Monitor logs** for first 48 hours
3. **Iterate** based on user feedback
4. **Add features** from roadmap
5. **Scale** as user base grows

**Congratulations on your deployment!** 🎊
