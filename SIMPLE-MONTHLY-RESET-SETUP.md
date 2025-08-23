# 🔄 Simple Automated Monthly Reset Setup

**Perfect for climbing clubs that want fresh monthly challenges without keeping history!**

This system automatically deletes ALL user progress on the 1st day of each month, giving everyone a clean slate for new challenges.

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Set Up Database Function
1. **Open Supabase SQL Editor** (your project dashboard)
2. **Copy & paste** `supabase-simple-reset-automation.sql`
3. **Execute** to create the reset functions ✅

### Step 2: Deploy Edge Function
```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login and link to your project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the reset function
supabase functions deploy simple-monthly-reset
```

### Step 3: Set Environment Variables
**In Supabase Dashboard** → **Edge Functions** → **Settings**:
```env
SIMPLE_RESET_SECRET=your_super_secret_reset_key_123
```

### Step 4: Set GitHub Secrets
**In your GitHub repository** → **Settings** → **Secrets and variables** → **Actions**:
```env
SIMPLE_RESET_SECRET=your_super_secret_reset_key_123
SUPABASE_URL=https://your-project.supabase.co
```

### Step 5: Enable GitHub Actions
- The workflow file is already in your repository
- GitHub Actions will automatically run monthly
- **First run**: 6:00 AM Mexico City time on the 1st of next month

---

## ✅ That's It! Your Monthly Reset is Now Automated!

### 🎯 What Happens Each Month?
- **Automatically on the 1st** at 6:00 AM Mexico City time
- **Deletes ALL progress data** from the database
- **No history kept** - complete fresh start
- **All users start with 0 points** and empty grids
- **Ready for new monthly challenges!**

---

## 🔧 Manual Testing & Control

### Test the System Now
1. **Go to GitHub** → **Your Repository** → **Actions** tab
2. **Find** "Simple Monthly Progress Reset" workflow
3. **Click** "Run workflow" → Type `RESET` → **Run**
4. **Watch** it execute and see the results!

### Manual Reset Anytime
- **Go to Actions tab** → **Run workflow**
- **Type `RESET`** to confirm (safety measure)
- **Perfect for testing** or mid-month resets

---

## 📊 What Gets Deleted?

### ❌ Deleted (Fresh Start):
- All boulder completion records
- All user points and statistics  
- All progress tracking data

### ✅ Preserved (Club Data):
- User accounts and profiles
- Boulder route definitions  
- App functionality and settings

---

## 🔍 Monitoring & Logs

### Check Reset Status
- **GitHub Actions**: See workflow execution logs
- **Supabase**: Edge Function logs in dashboard
- **Automatic**: Email notifications if workflow fails

### Verify Reset Worked
After each reset, users will see:
- **0 total points** in statistics
- **Empty boulder grid** with no completed boulders
- **Fresh "Escalador Principiante"** level
- **Ready for new month** progress

---

## ⚠️ Important Safety Features

### Confirmation Required
- **Manual resets** require typing "RESET" 
- **Prevents accidental** data deletion
- **Double-check** before confirming

### Automatic Backup Preview
- Function logs what will be deleted before deleting
- Shows total users and points that will be reset
- Helps verify system is working correctly

---

## 🎯 Perfect For:

✅ **Monthly Challenges** - Fresh competition every month  
✅ **Seasonal Goals** - New targets each month  
✅ **Fair Competition** - Everyone starts equal  
✅ **Simple Management** - No data to manage or clean up  
✅ **Engagement** - Users return monthly for fresh start  

---

## 🐛 Troubleshooting

### Reset Didn't Work?
1. **Check GitHub Actions** logs for errors
2. **Verify Supabase** Edge Function is deployed
3. **Confirm secrets** are set correctly in both GitHub and Supabase
4. **Test manually** using the GitHub Actions "Run workflow" button

### Need to Stop Automatic Resets?
1. **GitHub Repository** → **Settings** → **Actions** → **Disable**
2. Or delete the `.github/workflows/simple-monthly-reset.yml` file

### Want to Change Schedule?
Edit the cron expression in `.github/workflows/simple-monthly-reset.yml`:
```yaml
# Current: 6 AM Mexico City on 1st of month
- cron: '0 11 1 * *'

# Examples:
- cron: '0 12 1 * *'  # 7 AM Mexico City  
- cron: '0 6 15 * *'  # 15th of month instead of 1st
```

---

## 🎉 Your Climbing Club's Future

**Every month your members will:**
1. **Receive fresh challenges** with clean progress
2. **Compete on equal footing** regardless of when they joined  
3. **Stay motivated** with achievable monthly goals
4. **Experience renewed excitement** with each reset

**No maintenance required - just pure climbing fun! 🧗‍♂️🎯**
