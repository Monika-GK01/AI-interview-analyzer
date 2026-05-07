# 🚀 Quick Deployment Guide - Vercel

## ⚡ Fast Track Deployment (5 Minutes)

### Step 1: Prepare Supabase (2 minutes)

1. **Go to Supabase**: https://supabase.com
2. **Create Project** or use existing one
3. **Run SQL Schema**:
   - Go to SQL Editor
   - Copy & paste `supabase/schema.sql`
   - Click Run
4. **Run Policies**:
   - Copy & paste `supabase/policies.sql`
   - Click Run
5. **Get API Keys**:
   - Settings → API
   - Copy: `Project URL` and `anon public` key

### Step 2: Push to GitHub (1 minute)

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel (2 minutes)

1. **Go to Vercel**: https://vercel.com
2. **Click**: "Add New..." → "Project"
3. **Import**: Your GitHub repository
4. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
5. **Click**: "Deploy"
6. **Wait**: ~2 minutes for build

### Step 4: Configure Supabase URLs

1. **Copy your Vercel URL** (e.g., `https://your-app.vercel.app`)
2. **Go to Supabase** → Authentication → URL Configuration
3. **Add**:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

### Step 5: Create Admin User

1. **Sign up** on your deployed app
2. **Go to Supabase** → SQL Editor
3. **Run this** (replace with your email):
   ```sql
   UPDATE profiles 
   SET is_admin = true 
   WHERE id = (
     SELECT id FROM auth.users WHERE email = 'your-email@example.com'
   );
   ```

## ✅ Verification Checklist

Test these features:

- [ ] Landing page loads
- [ ] Sign up works
- [ ] Login works
- [ ] Dashboard displays
- [ ] Can start new interview
- [ ] Settings page works
- [ ] Admin login at `/admin-login`
- [ ] Admin dashboard shows data

## 🔧 Quick Fixes

### Build Failed?
```bash
# Test locally first
npm install
npm run build
```

### Auth Not Working?
- Check Supabase redirect URLs
- Verify environment variables in Vercel
- Redeploy after changes

### Database Errors?
- Verify schema.sql ran successfully
- Check policies.sql ran successfully
- Verify RLS is enabled

## 📱 Your URLs

After deployment, you'll have:

- **Production**: `https://your-app.vercel.app`
- **Admin Login**: `https://your-app.vercel.app/admin-login`
- **Dashboard**: `https://your-app.vercel.app/dashboard`

## 🎯 Next Steps

1. **Test thoroughly** on production
2. **Create test interviews**
3. **Verify PDF export works**
4. **Check admin dashboard**
5. **Monitor Vercel logs** for errors

## 🆘 Need Help?

- **Vercel Logs**: Vercel Dashboard → Your Project → Logs
- **Supabase Logs**: Supabase Dashboard → Logs → API
- **Browser Console**: F12 → Console tab

## 🎉 Success!

Your AI Interview Analyzer is now live and ready to use!

---

**Pro Tips**:
- Use Vercel preview deployments for testing
- Monitor your Supabase database usage
- Set up custom domain in Vercel settings
- Enable Vercel Analytics for insights
