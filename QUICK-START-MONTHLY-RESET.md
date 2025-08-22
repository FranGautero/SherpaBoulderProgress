# 🚀 Quick Start: Monthly Reset Setup

## ⚡ 2-Minute Setup (Simple Manual Approach)

**Simple and effective monthly reset for your climbing club:**

### Step 1: Test Current Data (30 seconds)
1. Open **Supabase SQL Editor**
2. Copy and paste `test-monthly-reset.sql`
3. Execute to see what data you currently have

### Step 2: Simple Monthly Reset (2 minutes)
1. Copy `supabase-simple-monthly-reset.sql`
2. Paste into **Supabase SQL Editor**
3. **Uncomment the DELETE line** when ready to reset
4. Execute on the 1st of each month

**That's it!** Your manual reset is ready. 🎉

---

## 🤖 Automatic Setup (15-minute setup)

**Want full automation?** Follow these steps:

### Step 1: Set Up the Database Functions (5 minutes)
1. Copy `supabase-monthly-reset.sql`
2. Paste into **Supabase SQL Editor**
3. Execute to create archive tables and functions

### Step 2: Create the Edge Function (5 minutes)
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref YOUR_PROJECT_REF`
4. Deploy function: `supabase functions deploy monthly-reset`

### Step 3: Set Up GitHub Actions (5 minutes)
1. Add the `.github/workflows/monthly-reset.yml` file to your repository
2. In GitHub → Settings → Secrets, add:
   - `MONTHLY_RESET_SECRET`: `your_secret_key_123`
   - `SUPABASE_URL`: `https://yourproject.supabase.co`

**Done!** Your automatic monthly reset is live! 🚀

---

## 📅 What Happens Each Month?

### With Manual Reset:
- You run the SQL script on the 1st
- All boulder progress gets deleted
- Users start fresh for the new month

### With Automatic Reset:
- **6 AM on the 1st** of each month (Mexico City time)
- GitHub Actions triggers the reset
- User progress gets **archived** (saved) to `user_progress_archive`
- Current progress gets **cleared**
- Users start fresh, but **history is preserved**

---

## ✅ Testing Your Setup

### Test the Manual Reset:
```sql
-- See current data
SELECT COUNT(*) FROM user_progress;

-- Reset (when ready)
DELETE FROM user_progress;

-- Confirm reset
SELECT COUNT(*) FROM user_progress;  -- Should be 0
```

### Test the Automatic Reset:
1. Go to GitHub → Actions tab
2. Find "Monthly Boulder Progress Reset"
3. Click "Run workflow" → "Run workflow"
4. Watch it execute!

---

## 📊 What Each Approach Gives You

| Feature | Manual | Automatic |
|---------|--------|-----------|
| **Effort** | 2 min/month | 15 min setup once |
| **History** | ❌ Deleted | ✅ Preserved |
| **Reliability** | Manual | ✅ Automated |
| **Notifications** | None | ✅ GitHub logs |
| **Rollback** | ❌ No | ✅ Yes |
| **Statistics** | Basic | ✅ Advanced |

---

## 🆘 Need Help?

**Something not working?**
1. Check `MONTHLY-RESET-SETUP.md` for detailed instructions
2. Run `test-monthly-reset.sql` to diagnose issues
3. Look at GitHub Actions logs for automatic setup
4. Verify your Supabase permissions and environment variables

**Quick fixes:**
- **"Permission denied"**: Check your Supabase RLS policies
- **"Function not found"**: Redeploy the Edge Function  
- **"Unauthorized"**: Check your secret keys in GitHub

---

## 🎯 Recommendation

**For climbing clubs:** Use the **Automatic approach** with archival. Here's why:
- ✅ **No monthly work** - it just happens
- ✅ **Keep history** - see member progress over time  
- ✅ **Reliable** - never forget to reset
- ✅ **Professional** - automated club management

**For testing:** Start with **Manual approach**, then upgrade to Automatic later.

---

## 🧗‍♂️ Happy Climbing!

Your boulder progress will now reset automatically each month, giving your climbing club fresh challenges while preserving the history of everyone's achievements! 🏔️✨
