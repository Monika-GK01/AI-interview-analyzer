# Deployment Guide - AI Interview Emotion Analyzer

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- Node.js 18+ installed locally

## Step 1: Set Up Supabase

### 1.1 Create a New Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: ai-interview-analyzer
   - **Database Password**: (generate a strong password and save it)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (~2 minutes)

### 1.2 Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click "Run" or press Ctrl+Enter
6. Verify success (you should see "Success. No rows returned")

### 1.3 Set Up Row Level Security

1. In the SQL Editor, create another new query
2. Copy the entire contents of `supabase/policies.sql`
3. Paste and run
4. Verify success

### 1.4 Configure Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Optional: Configure email templates under **Email Templates**
4. Optional: Enable other providers (Google, GitHub, etc.)

### 1.5 Get Your API Keys

1. Go to **Settings** > **API**
2. Copy these values (you'll need them later):
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 2: Prepare Your Code

### 2.1 Initialize Git Repository

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit: AI Interview Analyzer"
```

### 2.2 Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Create a new repository:
   - **Name**: ai-interview-analyzer
   - **Visibility**: Public or Private
   - **Do NOT** initialize with README (we already have one)
3. Copy the repository URL

### 2.3 Push to GitHub

```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3.2 Configure Environment Variables

Before deploying, add these environment variables:

Click "Environment Variables" and add:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
NEXT_PUBLIC_APP_URL=<will-be-your-vercel-url>
```

**Note**: For `NEXT_PUBLIC_APP_URL`, you can:
- Leave it blank for now and add it after first deployment
- Or use the Vercel preview URL format: `https://your-project.vercel.app`

### 3.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete (~2-3 minutes)
3. Once deployed, you'll get a URL like `https://your-project.vercel.app`

### 3.4 Update App URL

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
4. Redeploy (Vercel > Deployments > click "..." > Redeploy)

## Step 4: Configure Supabase for Production

### 4.1 Add Vercel URL to Supabase

1. Go to your Supabase dashboard
2. Navigate to **Authentication** > **URL Configuration**
3. Add your Vercel URL to:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: Add `https://your-project.vercel.app/**`

### 4.2 Test Authentication

1. Visit your deployed site
2. Try signing up with a test email
3. Check your email for confirmation
4. Try logging in

## Step 5: Verify Deployment

### 5.1 Test Core Features

- [ ] Landing page loads
- [ ] Sign up works
- [ ] Email confirmation (check spam folder)
- [ ] Login works
- [ ] Dashboard loads
- [ ] Can create new interview
- [ ] Database queries work

### 5.2 Check Logs

If something doesn't work:

1. **Vercel Logs**:
   - Go to your project in Vercel
   - Click "Logs" tab
   - Check for errors

2. **Supabase Logs**:
   - Go to Supabase dashboard
   - Navigate to "Logs" > "API"
   - Check for failed requests

3. **Browser Console**:
   - Open browser DevTools (F12)
   - Check Console for errors
   - Check Network tab for failed requests

## Step 6: Custom Domain (Optional)

### 6.1 Add Domain in Vercel

1. Go to your Vercel project
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 6.2 Update Environment Variables

1. Update `NEXT_PUBLIC_APP_URL` to your custom domain
2. Redeploy

### 6.3 Update Supabase URLs

1. Add custom domain to Supabase redirect URLs
2. Update Site URL if needed

## Step 7: Monitoring & Maintenance

### 7.1 Set Up Monitoring

1. **Vercel Analytics** (included):
   - Automatically tracks performance
   - View in Vercel dashboard

2. **Supabase Monitoring**:
   - Check database usage
   - Monitor API requests
   - Set up alerts for quota limits

### 7.2 Regular Maintenance

- Monitor error logs weekly
- Check database size (free tier: 500MB)
- Review authentication logs
- Update dependencies monthly

## Troubleshooting

### Issue: "Invalid API Key"

**Solution**: 
- Verify environment variables in Vercel
- Make sure you copied the correct keys from Supabase
- Redeploy after updating variables

### Issue: "Authentication not working"

**Solution**:
- Check Supabase redirect URLs include your Vercel domain
- Verify email provider is enabled in Supabase
- Check browser console for CORS errors

### Issue: "Database queries failing"

**Solution**:
- Verify RLS policies are set up correctly
- Check Supabase logs for specific errors
- Ensure user is authenticated before queries

### Issue: "Build failing on Vercel"

**Solution**:
- Check build logs for specific error
- Verify all dependencies are in package.json
- Try building locally: `npm run build`
- Check TypeScript errors: `npm run type-check`

### Issue: "Slow performance"

**Solution**:
- Enable Vercel Edge Functions (automatic)
- Optimize images with Next.js Image component
- Check database query performance in Supabase
- Add database indexes if needed

## Security Checklist

Before going live:

- [ ] All environment variables are set correctly
- [ ] Service role key is kept secret (not in client code)
- [ ] RLS policies are enabled on all tables
- [ ] HTTPS is enforced (automatic with Vercel)
- [ ] Email confirmation is enabled
- [ ] Rate limiting is considered (Supabase has built-in limits)
- [ ] Input validation is in place
- [ ] Error messages don't leak sensitive info

## Scaling Considerations

### Free Tier Limits

**Vercel Free Tier**:
- 100GB bandwidth/month
- Unlimited deployments
- Automatic SSL

**Supabase Free Tier**:
- 500MB database
- 2GB bandwidth
- 50,000 monthly active users
- 500MB file storage

### When to Upgrade

Consider upgrading when:
- Database size > 400MB
- Monthly active users > 40,000
- Need custom domain on Supabase
- Need more bandwidth
- Need priority support

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# Vercel automatically deploys
```

### Preview Deployments

- Every pull request gets a preview URL
- Test changes before merging
- Share with team for review

### Production Deployments

- Merging to `main` branch deploys to production
- Can also manually deploy from Vercel dashboard

## Backup Strategy

### Database Backups

1. **Automatic** (Supabase Pro):
   - Daily backups included
   - Point-in-time recovery

2. **Manual** (Free tier):
   ```bash
   # Export data periodically
   # Use Supabase dashboard > Database > Backups
   ```

### Code Backups

- GitHub serves as code backup
- Tag releases for version control:
  ```bash
  git tag -a v1.0.0 -m "Initial release"
  git push origin v1.0.0
  ```

## Post-Deployment Tasks

1. **Test all features** in production
2. **Monitor logs** for first 24 hours
3. **Set up alerts** for errors
4. **Document** any production-specific configurations
5. **Share** the URL with test users
6. **Collect feedback** and iterate

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project Issues**: Create issues in your GitHub repo

## Success Metrics

Track these metrics post-deployment:

- User signups per day
- Interview completion rate
- Average session duration
- Error rate
- Page load time
- User retention

---

## Quick Reference

### Vercel Dashboard
```
https://vercel.com/dashboard
```

### Supabase Dashboard
```
https://app.supabase.com/project/<your-project-id>
```

### Your Production URL
```
https://your-project.vercel.app
```

---

**Congratulations!** 🎉 Your AI Interview Analyzer is now live!

For issues or questions, refer to the troubleshooting section or check the project documentation.
